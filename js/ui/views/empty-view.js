import { $, h, replace } from '../dom.js'
import { t } from '../../lib/i18n.js'
import * as history from '../../app/history.js'

export const render = (onPick) => {
    const view = $('#view-empty')
    if (!view) return

    const items = history.list()
    const content = [
        h('h1', { class: 'empty-title' }, t('empty.title')),
        h('p', { class: 'empty-body' }, t('empty.body'))
    ]

    if (items.length) {
        content.push(renderHistory(items, onPick))
    }

    content.push(renderCredit())

    replace(view, ...content)
}

const renderHistory = (items, onPick) => {
    const list = h('div', { class: 'history-list' })
    for (const item of items) {
        list.appendChild(h('button', {
            type: 'button',
            class: 'history-item',
            onClick: () => onPick(item.code)
        },
            item.image
                ? h('img', { class: 'history-thumb', src: item.image, alt: '', loading: 'lazy' })
                : h('div', { class: 'history-thumb', 'aria-hidden': 'true' }),
            h('div', { class: 'history-meta' },
                h('p', { class: 'history-name' }, item.name),
                item.brand ? h('p', { class: 'history-brand' }, item.brand) : null
            )
        ))
    }

    return h('section', { class: 'history', 'aria-label': t('empty.recent') },
        h('p', { class: 'history-label' }, t('empty.recent')),
        list
    )
}

const renderCredit = () => {
    return h('footer', { class: 'credit' },
        `${t('empty.credit')} `,
        h('a', {
            href: 'https://www.jeffreyullers.nl/',
            target: '_blank',
            rel: 'noopener'
        }, 'Jeffrey Ullers')
    )
}