import { createLogger } from '../lib/logger.js'

// Open Food Facts client.
// Barcode lookups hit OFF directly; text search goes through a Worker because
// the native search endpoint does not return permissive CORS headers.

const LOOKUP_URL = 'https://world.openfoodfacts.org/api/v2/product'
const SEARCH_PROXY = 'https://off-search.apexy.workers.dev/'

const log = createLogger('api')




const FIELDS = [
    'code', 'product_name', 'generic_name', 'brands', 'categories',
    'quantity', 'product_quantity', 'product_quantity_unit',
    'image_front_url', 'image_ingredients_url', 'image_nutrition_url',
    'image_packaging_url', 'image_url',
    'nutriscore_grade', 'nova_group', 'ecoscore_grade',
    'ingredients_analysis_tags', 'labels_tags',
    'nutriments', 'nutrient_levels', 'serving_size', 'serving_quantity',
    'allergens_tags', 'traces_tags', 'ingredients_text',
    'unique_scans_n', 'scans_n', 'completeness', 'last_modified_t'
].join(',')

const NUTRIMENT_KEYS = [
    ['energy-kcal', 'kcal'],
    ['fat', 'g'],
    ['saturated-fat', 'g'],
    ['carbohydrates', 'g'],
    ['sugars', 'g'],
    ['fiber', 'g'],
    ['proteins', 'g'],
    ['salt', 'g']
]

// Lookup a single product by barcode.
// 404 is treated as "not found", not as a transport failure.
export const lookupByCode = async (code) => {
    const url = `${LOOKUP_URL}/${encodeURIComponent(code)}.json?fields=${FIELDS}`
    log.log('lookup →', code)

    const res = await fetch(url, { headers: { Accept: 'application/json' } })

// Search by name with optional Nutri-Score filters.
// Multi-grade filters are merged client-side because OFF query syntax does not
// support a native OR across grade constraints.
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`Lookup failed (${res.status})`)

    const data = await res.json()
    if (data.status !== 1 || !data.product) return null

    const product = normalise(data.product)
    log.log('found:', product.name, `(${product.code})`)
    return product
}


export const searchByName = async (query, opts = {}) => {
    const { page = 1, grades = [], pageSize = 100 } = opts

    if (grades.length <= 1) {
        const q = grades[0] ? `${query} nutriscore_grade:${grades[0].toLowerCase()}` : query
        return fetchSearchPage(q, page, pageSize)
    }

    const pages = await Promise.all(grades.map((g) =>
        fetchSearchPage(`${query} nutriscore_grade:${g.toLowerCase()}`, page, pageSize)
    ))

    const seen = new Set()
    const items = []
    for (const p of pages) {
        for (const item of p.items) {
            if (seen.has(item.code)) continue
            seen.add(item.code)
            items.push(item)
        }
    }
    const total = pages.reduce((sum, p) => sum + p.total, 0)
    return { items, total, page }
}

// Lightweight liveness probe for startup status messaging.
export const checkHealth = async () => {
    try {
        const res = await fetch(`${LOOKUP_URL}/5449000000996.json?fields=code`, {
            headers: { Accept: 'application/json' }
        })
        return res.ok
    } catch {
        return false
    }
}


// Internal search page fetch, reused by single-grade and multi-grade flows.
const fetchSearchPage = async (q, page, pageSize) => {
    const params = new URLSearchParams({ q, page: String(page), page_size: String(pageSize) })
    const url = `${SEARCH_PROXY}?${params}`
    log.log(`search → "${q}" page ${page}`)

    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`Search failed (${res.status})`)

    const data = await res.json()
    const hits = data.hits || []
    const items = hits
        .map((h) => normalise({ ...h, image_front_url: h.image_front_url || h.image_url }))
        .filter((p) => p && p.code)

    return { items, total: Number(data.count) || items.length, page }
}

// Normalize OFF payload shape into a stable app-facing model.
const normalise = (raw) => {
    const code = raw.code || ''

    return {
        code,
        name: raw.product_name || raw.generic_name || 'Untitled product',
        brand: raw.brands || '',
        generic: raw.generic_name || '',
        category: pickCategory(raw),
        quantity: pickQuantity(raw),
        format: formatForCode(code),
        images: pickImages(raw),
        nutriscore: raw.nutriscore_grade ? String(raw.nutriscore_grade).toUpperCase() : '',
        nova: typeof raw.nova_group === 'number' ? raw.nova_group : null,
        ecoscore: usefulGrade(raw.ecoscore_grade),
        analysis: (raw.ingredients_analysis_tags || []).map(stripTag),
        labels: (raw.labels_tags || []).map(stripTag).slice(0, 6),
        nutriments: pickNutriments(raw.nutriments || {}),
        nutrientLevels: raw.nutrient_levels || {},
        servingSize: raw.serving_size || '',
        servingQuantity: Number(raw.serving_quantity) || null,
        allergens: (raw.allergens_tags || []).map(stripTag),
        traces: (raw.traces_tags || []).map(stripTag),
        ingredients: raw.ingredients_text || '',
        scans: raw.unique_scans_n || raw.scans_n || 0,
        completeness: typeof raw.completeness === 'number' ? raw.completeness : null,
        lastModified: raw.last_modified_t ? new Date(raw.last_modified_t * 1000) : null
    }
}

// OFF taxonomy tags often include locale prefixes and kebab casing.
const stripTag = (tag) => {
    return String(tag || '').replace(/^[a-z]{2,3}:/, '').replace(/-/g, ' ')
}

const usefulGrade = (raw) => {
    if (!raw || raw === 'unknown' || raw === 'not-applicable') return ''
    return String(raw).toUpperCase()
}

const formatForCode = (code) => {
    if (code.length === 13) return 'EAN-13'
    if (code.length === 12) return 'UPC-A'
    return 'GTIN'
}

// Categories are broad-to-specific; the trailing value is usually most useful.
const pickCategory = (raw) => {
    return (raw.categories || '')
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s && !/^[a-z]{2}:/.test(s))
        .pop() || ''
}

// Guard against noisy zero-value quantity records from crowdsourced entries.
const pickQuantity = (raw) => {
    const q = String(raw.quantity || '').trim()
    if (q && !/^0\s*(g|kg|ml|l|cl)?$/i.test(q)) return q

    const n = Number(raw.product_quantity)
    const unit = String(raw.product_quantity_unit || '').trim()
    if (n > 0 && unit) return `${n} ${unit}`
    return ''
}

const pickImages = (raw) => {
    const seen = new Set()
    const out = []

    // Preserve image role metadata so UI captions can remain semantic.
    const push = (url, role, label) => {
        if (!url || seen.has(url)) return
        seen.add(url)
        out.push({ url, role, label })
    }
    push(raw.image_front_url, 'front', 'product.imageFront')
    push(raw.image_ingredients_url, 'ingredients', 'product.imageIngredients')
    push(raw.image_nutrition_url, 'nutrition', 'product.imageNutrition')
    push(raw.image_packaging_url, 'packaging', 'product.imagePackaging')
    if (out.length === 0) push(raw.image_url, 'front', 'product.imageFront')
    return out
}

// Keep nutrition rows predictable and ordered for UI rendering.
const pickNutriments = (raw) => {
    const out = []
    for (const [key, unit] of NUTRIMENT_KEYS) {
        const value = raw[`${key}_100g`]
        if (value == null) continue
        out.push({ key, unit, value: Number(value) })
    }
    return out
}