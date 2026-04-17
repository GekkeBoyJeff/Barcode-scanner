import { h, replace } from '../dom.js'
import { t } from '../../lib/i18n.js'
import { getState, setState } from '../../app/store.js'

export const render = (host, product) => {
    if (!product.nutriments.length) return false

    const state = getState()
    const scope = product.servingQuantity && product.servingQuantity > 0
        ? state.nutritionScope
        : '100g'
    const scale = scope === 'serving' ? product.servingQuantity / 100 : 1

    const rows = product.nutriments.map((n, i) => renderRow(n, product.nutrientLevels, scale, i))

    const head = h('header', { class: 'nutrition-head' },
        h('span', { class: 'score-label' },
            scope === 'serving'
                ? t('nutrition.perServing', { size: product.servingSize })
                : t('nutrition.per100g')),
        product.servingQuantity && product.servingQuantity > 0
            ? renderToggle(scope)
            : null
    )

    const list = h('dl', { class: 'nutrients' }, ...rows)
    replace(host, head, list)
    return true
}

const renderToggle = (scope) => {
    const set = (next) => () => setState({ nutritionScope: next })
    return h('div', { class: 'nutrition-toggle', role: 'tablist' },
        h('button', {
            type: 'button',
            role: 'tab',
            'aria-pressed': String(scope === '100g'),
            onClick: set('100g')
        }, '100 g'),
        h('button', {
            type: 'button',
            role: 'tab',
            'aria-pressed': String(scope === 'serving'),
            onClick: set('serving')
        }, t('nutrition.perServingShort'))
    )
}

const renderRow = (nutriment, levels, scale, index) => {
    const level = levels[nutriment.key]
    const value = nutriment.value * scale
    return h('div', {
        class: 'nutrient',
        dataset: { level: level || '' },
        style: { animationDelay: `${index * 35}ms` }
    },
        h('dt', null, t(`nutrition.labels.${nutriment.key}`) || nutriment.key),
        h('dd', null,
            h('span', { class: 'nutrient-value' }, formatValue(value)),
            h('span', { class: 'nutrient-unit' }, nutriment.unit),
            level ? h('span', { class: 'nutrient-level', dataset: { level } }, t(`nutrition.levels.${level}`)) : null
        )
    )
}

const formatValue = (n) => {
    if (!Number.isFinite(n)) return '—'
    if (n < 0.1) return n.toFixed(3)
    if (n < 10) return n.toFixed(1)
    return Math.round(n).toString()
}