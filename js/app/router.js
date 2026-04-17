import { createLogger } from '../lib/logger.js'

// Hash router keeps deep links portable on static hosts like GitHub Pages.

const log = createLogger('router')


// Listener callbacks receive the parsed route object.
const listeners = []

export const parse = () => {
    const raw = (location.hash || '#home').slice(1)
    const [head, ...rest] = raw.split('/')
    switch (head) {
        case 'scan':    return { name: 'scan',    params: [] }
        case 'product': return { name: 'product', params: rest }
        case 'search':  return { name: 'search',  params: rest.map(decodeURIComponent) }
        default:        return { name: 'home',    params: [] }
    }
}

export const current = () => {
    return parse()
}

export const navigate = (hash, { replace = false } = {}) => {
    const target = `#${hash}`
    if (location.hash === target) {
        // Force refresh when navigating to the current hash.
        emit()
        return
    }
    if (replace) {
        history.replaceState(null, '', target)
        emit()
    } else {
        location.hash = target
    }
}

export const onChange = (fn) => {
    listeners.push(fn)
    return () => {
        const i = listeners.indexOf(fn)
        if (i >= 0) listeners.splice(i, 1)
    }
}

export const init = () => {
    window.addEventListener('hashchange', emit)
    log.log('routing initialised at', location.hash || '#home')
}

const emit = () => {
    const route = parse()
    for (const fn of listeners) fn(route)
}