import { $ } from './dom.js'
import { subscribe, getState } from '../app/store.js'

export const init = () => {
    render(getState())
    subscribe((state, prev) => {
        if (state.statusKind !== prev.statusKind || state.statusLabel !== prev.statusLabel) {
            render(state)
        }
    })
}

const render = (state) => {
    const host = $('#status')
    const label = $('#status-text')
    if (!host || !label) return
    host.dataset.state = state.statusKind
    label.textContent = state.statusLabel
}