import { $, h, replace, svg } from '../dom.js'
import { t, formatRelative, formatNumber } from '../../lib/i18n.js'
import { share, productUrl } from '../../lib/share.js'
import { showToast } from '../toast.js'
import * as carousel from './carousel.js'
import * as verdict from '../widgets/verdict.js'
import * as scores from '../widgets/scores.js'
import * as nutrition from '../widgets/nutrition.js'
import * as allergens from '../widgets/allergens.js'
import * as tags from '../widgets/tags.js'

// Product detail composition: each widget decides whether it can render.

export const render = (product) => {
    const view = $('#view-product')
    if (!view) return

    const blocks = []

    blocks.push(renderHead(product))
    blocks.push(renderMedia(product))

    const verdictHost = h('div', { class: 'verdict', 'data-kind': 'mute' })
    verdict.render(verdictHost, product)
    blocks.push(verdictHost)

    const scoresHost = h('section', { class: 'card scores', 'aria-label': t('scores.sectionLabel') })
    if (scores.render(scoresHost, product)) blocks.push(scoresHost)

    const tagsHost = h('div', { class: 'chips tags' })
    if (tags.render(tagsHost, product)) blocks.push(tagsHost)

    const nutritionHost = h('section', { class: 'card nutrition', 'aria-label': t('nutrition.per100g') })
    if (nutrition.render(nutritionHost, product)) blocks.push(nutritionHost)

    const allergensHost = h('aside', { class: 'allergens', role: 'note' })
    if (allergens.render(allergensHost, product)) blocks.push(allergensHost)

    if (product.ingredients) blocks.push(renderIngredients(product))

    const foot = renderFooter(product)
    if (foot) blocks.push(foot)

    replace(view, ...blocks)
}

const renderHead = (product) => {
    const meta = []
    meta.push(h('span', { class: 'kicker' }, product.code))
    meta.push(h('span', { class: 'kicker' }, '·'))
    meta.push(h('span', { class: 'kicker' }, product.format))

    const subParts = []
    if (product.brand) subParts.push(h('span', null, product.brand))
    if (product.quantity) {
        if (subParts.length) subParts.push(h('span', { class: 'product-sep' }, '·'))
        subParts.push(h('span', null, product.quantity))
    }
    if (product.category) {
        if (subParts.length) subParts.push(h('span', { class: 'product-sep' }, '·'))
        subParts.push(h('span', null, product.category))
    }

    return h('header', { class: 'product-head' },
        h('div', { class: 'product-meta' }, ...meta),
        h('h2', { class: 'product-name' }, product.name),
        subParts.length ? h('p', { class: 'product-sub' }, ...subParts) : null,
        product.generic && product.generic !== product.name
            ? h('p', { class: 'product-generic' }, product.generic)
            : null,
        h('div', { class: 'product-actions' }, renderShareButton(product))
    )
}

const renderMedia = (product) => {
    const media = h('figure', { class: 'product-media' })
    carousel.mount(media, product.images)
    return media
}

const renderShareButton = (product) => {
    return h('button', {
        type: 'button',
        class: 'btn btn-ghost',
        onClick: async () => {
            // Show user feedback only for non-native-share fallback paths.
            const result = await share({
                title: product.name,
                text: product.brand ? `${product.name} — ${product.brand}` : product.name,
                url: productUrl(product.code)
            })
            if (result === 'copied') showToast(t('actions.shareCopied'), { kind: 'ok' })
            else if (result === 'unsupported') showToast(t('errors.shareNotSupported'))
        }
    },
        shareIcon(),
        h('span', null, t('actions.share'))
    )
}

const shareIcon = () => {
    return svg('svg', { viewBox: '0 0 24 24', width: 16, height: 16, 'aria-hidden': 'true' },
        svg('path', {
            d: 'M12 4v12M8 8l4-4 4 4M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 1.5,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
        })
    )
}

const renderIngredients = (product) => {
    return h('details', { class: 'accordion' },
        h('summary', null,
            h('span', null, t('ingredients.title')),
            h('span', { class: 'accordion-icon', 'aria-hidden': 'true' }, '+')
        ),
        h('p', { class: 'accordion-body' }, product.ingredients)
    )
}

const renderFooter = (product) => {
    const parts = []
    if (product.scans > 0) {
        parts.push(h('span', null, t('product.scansN', { n: formatNumber(product.scans) })))
    }
    if (product.completeness != null) {
        parts.push(h('span', null, t('product.completenessN', { n: Math.round(product.completeness * 100) })))
    }
    if (product.lastModified) {
        parts.push(h('span', null, t('product.updatedAt', { when: formatRelative(product.lastModified) })))
    }
    if (parts.length === 0) return null

    return h('footer', { class: 'product-foot' }, ...parts)
}