import { h, replace, svg } from '../dom.js'
import { t } from '../../lib/i18n.js'

export const render = (host, product) => {
    if (product.allergens.length === 0 && product.traces.length === 0) return false

    const allergens = product.allergens.map(capitalize).join(' · ')
    const body = h('div', null,
        h('p', { class: 'allergens-title' }, t('allergens.title')),
        allergens ? h('p', { class: 'allergens-list' }, allergens) : null,
        product.traces.length
            ? h('p', { class: 'allergens-traces' }, t('allergens.traces', {
                list: product.traces.map(capitalize).join(', ')
            }))
            : null
    )

    replace(host, warningIcon(), body)
    return true
}

const warningIcon = () => {
    return svg('svg', { class: 'allergens-icon', viewBox: '0 0 24 24', width: 20, height: 20, 'aria-hidden': 'true' },
        svg('path', {
            d: 'M12 3l10 18H2L12 3z',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 1.5,
            'stroke-linejoin': 'round'
        }),
        svg('path', {
            d: 'M12 10v5M12 17.5v.1',
            stroke: 'currentColor',
            'stroke-width': 1.5,
            'stroke-linecap': 'round'
        })
    )
}

const capitalize = (s) => {
    return s ? s[0].toUpperCase() + s.slice(1) : s
}