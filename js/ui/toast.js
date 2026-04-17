import { $ } from './dom.js'

let timer = null

export const showToast = (message, { kind = 'error', duration = 2800 } = {}) => {
    const toast = $('#toast')
    const msg = $('#toast-msg')
    if (!toast || !msg) return

    toast.dataset.kind = kind
    msg.textContent = message
    toast.hidden = false
    requestAnimationFrame(() => { toast.dataset.visible = 'true' })

    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
        toast.dataset.visible = 'false'
        setTimeout(() => { toast.hidden = true }, 260)
    }, duration)
}