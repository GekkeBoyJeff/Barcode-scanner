import { $, h, replace } from '../dom.js'
import { t } from '../../lib/i18n.js'

export const render = (label) => {
    const view = $('#view-loading')
    if (!view) return
    replace(view,
        h('div', { class: 'spinner', role: 'status', 'aria-label': t('actions.loading') }),
        h('p', null, label || t('actions.loading'))
    )
}