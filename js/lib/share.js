import { t } from './i18n.js'

export const share = async (payload) => {
    if (navigator.share) {
        try {
            await navigator.share(payload)
            return 'shared'
        } catch (err) {
            if (err?.name === 'AbortError') return 'shared'
        }
    }

    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(payload.url)
            return 'copied'
        } catch {
            return 'unsupported'
        }
    }

    return 'unsupported'
}

export const productUrl = (code) => {
    const base = `${location.origin}${location.pathname}`
    return `${base}#product/${code}`
}

export { t as translate }