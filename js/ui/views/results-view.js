import { $, $$, h, replace, svg } from '../dom.js'
import { t, formatNumber } from '../../lib/i18n.js'

// Results screen renderer: sorting/filter controls + list + pager.

const GRADE_RANK = { A: 1, B: 2, C: 3, D: 4, E: 5 }
const rankOf = (p) => GRADE_RANK[p.nutriscore] ?? 99

export const render = (state, callbacks) => {
    const view = $('#view-results')
    if (!view) return

    const filtered = applySort(state.items, state.sort)
    const hasFilters = state.grades.length > 0

    const blocks = [
        renderTitle(state, filtered.length),
        renderFilters(state, callbacks),
        renderList(filtered, callbacks.onPick),
        filtered.length === 0 && hasFilters
            ? h('p', { class: 'results-empty' }, t('results.emptyFiltered'))
            : null,
        renderPager(state, callbacks.onLoadMore)
    ]

    replace(view, ...blocks.filter(Boolean))
}

const renderTitle = ({ query, total, grades }, loaded) => {
    const totalStr = total >= 10000 ? '10.000+' : formatNumber(total)
    let title
    if (!loaded && total === 0) {
        title = grades.length
            ? t('results.noFilterMatches', { query })
            : t('results.noMatches', { query })
    } else {
        const noun = total === 1 ? t('results.resultSingular') : t('results.resultPlural')
        if (grades.length) {
            title = t('results.titleFilteredN', {
                total: totalStr,
                noun,
                query,
                grades: grades.slice().sort().join(', ')
            })
        } else {
            title = t('results.titleN', { total: totalStr, noun, query })
        }
    }

    return h('header', { class: 'results-head' },
        h('h2', { class: 'results-title' }, title)
    )
}

const renderFilters = ({ grades, sort }, { onGradesChange, onSortChange }) => {
    const gradeChips = ['A', 'B', 'C', 'D', 'E'].map((g) =>
        h('button', {
            type: 'button',
            class: 'chip-grade',
            dataset: { grade: g },
            'aria-pressed': String(grades.includes(g)),
            onClick: () => {
                // Toggle multi-select grade filters.
                const next = grades.includes(g)
                    ? grades.filter((x) => x !== g)
                    : [...grades, g]
                onGradesChange(next)
            }
        }, g)
    )

    const select = h('select', {
        id: 'sort-select',
        onChange: (e) => onSortChange( (e.target).value)
    },
        option('relevance', t('search.sortOptions.relevance'), sort),
        option('name-asc', t('search.sortOptions.nameAsc'), sort),
        option('name-desc', t('search.sortOptions.nameDesc'), sort),
        option('score-asc', t('search.sortOptions.scoreAsc'), sort),
        option('score-desc', t('search.sortOptions.scoreDesc'), sort)
    )

    const clearVisible = grades.length > 0 || sort !== 'relevance'

    return h('div', { class: 'filters', role: 'group', 'aria-label': t('search.sortBy') },
        h('div', { class: 'filters-group' },
            h('label', { class: 'filters-label', for: 'sort-select' }, t('search.sortBy')),
            h('div', { class: 'select' },
                select,
                chevron()
            )
        ),
        h('div', { class: 'filters-group' },
            h('span', { class: 'filters-label' }, t('search.nutriScore')),
            h('div', { class: 'filters-chips' }, ...gradeChips)
        ),
        clearVisible
            ? h('button', {
                type: 'button',
                class: 'btn btn-quiet filters-clear',
                onClick: () => {
                    onSortChange('relevance')
                    onGradesChange([])
                }
            }, t('actions.clearFilters'))
            : null
    )
}

const option = (value, label, current) => {
    return h('option', { value, selected: value === current ? 'selected' : null }, label)
}

const chevron = () => {
    return svg('svg', { class: 'select-chevron', viewBox: '0 0 12 8', width: 10, height: 7, 'aria-hidden': 'true' },
        svg('path', {
            d: 'M1 1.5l5 5 5-5',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 1.5,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
        })
    )
}

const renderList = (items, onPick) => {
    const list = h('ul', { class: 'results-list' })
    items.forEach((item, i) => list.appendChild(renderItem(item, onPick, i)))
    return list
}

const renderItem = (product, onPick, index) => {
    const media = product.images[0]
        ? h('div', { class: 'result-media' },
            h('img', {
                src: product.images[0].url,
                alt: '',
                loading: 'lazy',
                decoding: 'async'
            }))
        : h('div', { class: 'result-media', dataset: { empty: 'true' } }, '—')

    const meta = []
    if (product.brand) meta.push(product.brand)
    if (product.quantity) meta.push(product.quantity)

    const tags = buildTags(product)
    const score = product.nutriscore && 'ABCDE'.includes(product.nutriscore)
        ? h('span', { class: 'result-score', dataset: { grade: product.nutriscore } }, product.nutriscore)
        : null

    return h('li', null,
        h('button', {
            type: 'button',
            class: 'result',
            style: { animationDelay: `${Math.min(index, 12) * 30}ms` },
            onClick: () => onPick(product)
        },
            media,
            h('div', { class: 'result-body' },
                h('h3', { class: 'result-name' }, product.name),
                meta.length ? h('p', { class: 'result-brand' }, meta.join(' · ')) : null,
                tags.length ? h('div', { class: 'result-tags' }, ...tags) : null
            ),
            h('div', { class: 'result-end' },
                score,
                h('span', { class: 'result-chevron', 'aria-hidden': 'true' }, '›')
            )
        )
    )
}

const buildTags = (product) => {
    const out = []
    if (product.nova === 4) out.push(h('span', { class: 'tag is-warn' }, t('verdict.reasons.ultraProcessed')))
    if (product.analysis?.includes('palm oil')) out.push(h('span', { class: 'tag is-warn' }, t('analysis.palmOil')))
    if (product.analysis?.includes('vegan')) out.push(h('span', { class: 'tag is-good' }, t('analysis.vegan')))
    else if (product.analysis?.includes('vegetarian')) out.push(h('span', { class: 'tag is-good' }, t('analysis.vegetarian')))
    return out
}

const renderPager = ({ items, total, loading }, onLoadMore) => {
    if (items.length === 0) return null
    const hasMore = items.length < total
    if (!hasMore && !loading) return null

    const totalStr = total >= 10000 ? '10.000+' : formatNumber(total)
    const meta = hasMore
        ? t('results.loadedOfTotal', { loaded: formatNumber(items.length), total: totalStr })
        : t('results.allLoaded', { loaded: formatNumber(items.length) })

    return h('div', { class: 'pager' },
        h('p', { class: 'pager-meta' }, meta),
        hasMore
            ? h('button', {
                type: 'button',
                class: 'btn btn-ghost',
                disabled: loading ? 'disabled' : null,
                onClick: () => onLoadMore()
            }, loading ? t('actions.loading') : t('actions.showMore'))
            : null
    )
}

const applySort = (items, sort) => {
    if (sort === 'relevance') return items.slice()
    const copy = items.slice()

    // Keep sorting stable by falling back to name ties.
    switch (sort) {
        case 'name-asc':  copy.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })); break
        case 'name-desc': copy.sort((a, b) => b.name.localeCompare(a.name, undefined, { sensitivity: 'base' })); break
        case 'score-asc':  copy.sort((a, b) => rankOf(a) - rankOf(b) || a.name.localeCompare(b.name)); break
        case 'score-desc': copy.sort((a, b) => rankOf(b) - rankOf(a) || a.name.localeCompare(b.name)); break
    }
    return copy
}