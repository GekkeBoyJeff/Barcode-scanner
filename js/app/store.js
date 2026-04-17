

// Minimal observable store shared by controller and views.
const initial = {
    view: 'empty',
    statusKind: 'idle',
    statusLabel: '',
    scannerLive: false,
    product: null,
    search: {
        query: '',
        items: [],
        total: 0,
        page: 1,
        loading: false,
        grades: [],
        sort: 'relevance'
    },
    history: [],
    nutritionScope: '100g'
}

let state = structuredClone(initial)

// Subscriber set keeps updates cheap and framework-free.
const subscribers = new Set()

export const getState = () => {
    return state
}

export const setState = (patch) => {
    // Shallow merge by design; callers spread nested objects explicitly.
    const prev = state
    state = { ...state, ...patch }
    for (const fn of subscribers) fn(state, prev)
}

export const subscribe = (fn) => {
    subscribers.add(fn)
    return () => subscribers.delete(fn)
}

export const resetState = () => {
    state = structuredClone(initial)
    for (const fn of subscribers) fn(state, state)
}