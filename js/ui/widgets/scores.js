import { h, replace } from '../dom.js'
import { t } from '../../lib/i18n.js'

export const render = (host, product) => {
    const rows = []

    if (product.nutriscore && 'ABCDE'.includes(product.nutriscore)) {
        rows.push(renderNutriScore(product.nutriscore))
    } else {
        rows.push(renderNutriUnavailable())
    }

    if (product.nova && product.nova >= 1 && product.nova <= 4) {
        rows.push(renderNova(product.nova))
    }

    if (product.ecoscore && 'ABCDE'.includes(product.ecoscore)) {
        rows.push(renderEco(product.ecoscore))
    }

    if (rows.length === 0) return false

    replace(host, ...rows)
    return true
}

const renderNutriScore = (grade) => {
    const segments = ['A', 'B', 'C', 'D', 'E'].map((g) =>
        h('span', { class: 'nutriscore-seg', dataset: { grade: g } }, g)
    )

    return h('div', { class: 'score-row score-row-nutri' },
        h('span', { class: 'score-label' }, t('scores.nutriScore')),
        h('div', {
            class: 'nutriscore',
            role: 'img',
            'aria-label': `${t('scores.nutriScore')} ${grade}`,
            dataset: { grade }
        }, ...segments),
        h('p', { class: 'score-verdict' }, t(`scores.nutriVerdicts.${grade}`))
    )
}

const renderNutriUnavailable = () => {
    return h('div', { class: 'score-row score-row-nutri score-row-muted' },
        h('span', { class: 'score-label' }, t('scores.nutriScore')),
        h('p', { class: 'score-verdict' }, t('scores.nutriUnavailable'))
    )
}

const renderNova = (group) => {
    return h('div', {
        class: 'score-row score-row-nova',
        dataset: { grade: String(group) }
    },
        h('span', { class: 'score-label' }, t('scores.nova')),
        h('div', { class: 'nova' },
            h('span', { class: 'nova-num' }, String(group)),
            h('span', { class: 'nova-note' }, t(`scores.novaNotes.${group}`))
        )
    )
}

const renderEco = (grade) => {
    return h('div', { class: 'score-row score-row-eco' },
        h('span', { class: 'score-label' }, t('scores.ecoScore')),
        h('span', { class: 'eco-grade', dataset: { grade } }, grade)
    )
}