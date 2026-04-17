import { h, replace } from '../dom.js'
import { t, currentDictionary } from '../../lib/i18n.js'

const ANALYSIS_SPEC = {
    'palm oil':        { key: 'analysis.palmOil',        kind: 'warn'    },
    'palm oil free':   { key: 'analysis.palmOilFree',    kind: 'good'    },
    'vegan':           { key: 'analysis.vegan',          kind: 'good'    },
    'non vegan':       { key: 'analysis.nonVegan',       kind: 'neutral' },
    'vegetarian':      { key: 'analysis.vegetarian',     kind: 'good'    },
    'non vegetarian':  { key: 'analysis.nonVegetarian',  kind: 'neutral' }
}

export const render = (host, product) => {
    const chips = []

    for (const raw of product.analysis) {
        const spec = ANALYSIS_SPEC[raw]
        if (spec) chips.push({ label: t(spec.key), kind: spec.kind })
    }

    for (const raw of product.labels) {
        chips.push({ label: translateLabel(raw), kind: 'neutral' })
    }

    if (chips.length === 0) return false

    replace(host, ...chips.map((c, i) =>
        h('span', {
            class: `tag ${c.kind === 'good' ? 'is-good' : c.kind === 'warn' ? 'is-warn' : ''}`.trim(),
            style: { animationDelay: `${i * 40}ms` }
        }, c.label)
    ))
    return true
}

const translateLabel = (raw) => {
    const dict = currentDictionary()?.labels || {}
    const camel = raw.replace(/\s+(.)/g, (_, c) => c.toUpperCase())
    return dict[camel] || dict[raw] || capitalize(raw)
}

const capitalize = (s) => {
    return s ? s[0].toUpperCase() + s.slice(1) : s
}