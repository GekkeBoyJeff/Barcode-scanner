
let locale = 'en'

let dict = {}

// Browser locale detection is intentionally strict: only nl maps to Dutch.
export const detectLocale = () => {
    const raw = navigator.language || 'en'
    return raw.toLowerCase().startsWith('nl') ? 'nl' : 'en'
}

export const loadLocale = async (loc) => {
    locale = loc
    const mod = await import(`../i18n/${loc}.js`)
    dict = mod.default
    document.documentElement.lang = loc
}

export const currentLocale = () => {
    return locale
}

export const currentDictionary = () => {
    return dict
}

export const t = (path, vars) => {
    const raw = resolve(dict, path)
    if (typeof raw !== 'string') return path
    return interpolate(raw, vars)
}

const resolve = (obj, path) => {
    return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj)
}

const PLURAL_RE = /\{(\w+),\s*plural,\s*((?:\w+\s*\{[^{}]*\}\s*)+)\}/g
const SLOT_RE = /\{(\w+)\}/g

// Minimal ICU-like interpolation supporting plural/select and {placeholders}.
const interpolate = (tpl, vars = {}) => {
    const withPlurals = tpl.replace(PLURAL_RE, (_, key, cases) => {
        const count = Number(vars[key] ?? 0)
        const pluralKey = new Intl.PluralRules(locale).select(count)
        const selected = pickCase(cases, pluralKey) ?? pickCase(cases, 'other') ?? ''
        return selected.replace(/#/g, String(count))
    })
    return withPlurals.replace(SLOT_RE, (_, key) => String(vars[key] ?? ''))
}

const pickCase = (cases, key) => {
    const match = cases.match(new RegExp(`${key}\\s*\\{([^}]*)\\}`))
    return match ? match[1] : null
}

export const formatNumber = (n, options) => {
    return new Intl.NumberFormat(locale, options).format(n)
}

export const formatRelative = (date) => {
    const ms = Date.now() - date.getTime()
    const days = Math.floor(ms / 86_400_000)
    if (days < 1) return t('product.updatedToday')
    if (days < 30) return t('product.updatedDaysAgo', { n: days })
    const months = Math.floor(days / 30)
    if (months < 12) return t('product.updatedMonthsAgo', { n: months })
    return t('product.updatedYearsAgo', { n: Math.floor(months / 12) })
}

export const applyTranslations = (root) => {
    // Replace text nodes and selected attributes from data-i18n markers.
    root.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n')
        if (key) el.textContent = t(key)
    })
    root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
        const spec = el.getAttribute('data-i18n-attr')
        if (!spec) return
        for (const pair of spec.split(',')) {
            const [attr, key] = pair.split(':').map((s) => s.trim())
            if (attr && key) el.setAttribute(attr, t(key))
        }
    })
}