import { h, replace } from '../dom.js'
import { t } from '../../lib/i18n.js'

const NUTRI_TO_LEVEL = { A: 'great', B: 'good', C: 'okay', D: 'poor', E: 'bad' }

const ICONS = {
    great: '✓',
    good: '✓',
    okay: '~',
    poor: '!',
    bad: '✕',
    unknown: '?'
}

const KIND_BY_LEVEL = {
    great: 'good',
    good: 'good',
    okay: 'warn',
    poor: 'warn',
    bad: 'bad',
    unknown: 'mute'
}

export const compute = (product) => {
    const concerns = []
    const benefits = []
    const levels = product.nutrientLevels || {}

    let level = product.nutriscore ? NUTRI_TO_LEVEL[product.nutriscore] : null

    if (product.nova === 4) concerns.push(t('verdict.reasons.ultraProcessed'))
    if (product.nova === 4 && (level === 'great' || level === 'good')) level = 'okay'

    if (levels.sugars === 'high') concerns.push(t('verdict.reasons.highSugar'))
    if (levels.fat === 'high') concerns.push(t('verdict.reasons.highFat'))
    if (levels['saturated-fat'] === 'high') concerns.push(t('verdict.reasons.highSatFat'))
    if (levels.salt === 'high') concerns.push(t('verdict.reasons.highSalt'))

    if (product.analysis.includes('palm oil')) concerns.push(t('verdict.reasons.palmOil'))
    if (product.allergens.length) {
        concerns.push(t('verdict.reasons.allergens', {
            list: product.allergens.slice(0, 2).map(capitalize).join(', ')
        }))
    }

    if (product.analysis.includes('vegan')) benefits.push(t('verdict.reasons.vegan'))
    else if (product.analysis.includes('vegetarian')) benefits.push(t('verdict.reasons.vegetarian'))
    if (product.analysis.includes('palm oil free')) benefits.push(t('verdict.reasons.palmOilFree'))
    if (levels.sugars === 'low') benefits.push(t('verdict.reasons.lowSugar'))
    if (levels.fat === 'low') benefits.push(t('verdict.reasons.lowFat'))
    if (levels.salt === 'low') benefits.push(t('verdict.reasons.lowSalt'))
    if (product.labels.some((l) => /bio|organic/i.test(l))) benefits.push(t('verdict.reasons.organic'))
    if (product.labels.some((l) => /gluten.?free|no gluten/i.test(l))) benefits.push(t('verdict.reasons.glutenFree'))

    if (!level) level = 'unknown'

    let reasons
    if (level === 'unknown') {
        reasons = [t('verdict.reasons.default.missing')]
    } else if (level === 'great' || level === 'good') {
        reasons = benefits.length ? benefits.slice(0, 3) : [t('verdict.reasons.default.good')]
        if (concerns.length) reasons.push(concerns[0].toLowerCase())
    } else {
        reasons = concerns.length ? concerns.slice(0, 3) : [t('verdict.reasons.default.okay')]
    }

    return { level, reasons }
}

export const render = (host, product) => {
    const { level, reasons } = compute(product)
    host.dataset.kind = KIND_BY_LEVEL[level]
    host.hidden = false

    replace(host,
        h('div', { class: 'verdict-icon', 'aria-hidden': 'true' }, ICONS[level]),
        h('div', { class: 'verdict-body' },
            h('p', { class: 'verdict-title' }, t(`verdict.${level}.label`)),
            h('p', { class: 'verdict-reasons' }, reasons.join(' · '))
        )
    )
}

const capitalize = (s) => {
    return s ? s[0].toUpperCase() + s.slice(1) : s
}