
// Safe localStorage wrapper. Browsers can block/quota storage unpredictably.
export const read = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key)
        return raw == null ? fallback : JSON.parse(raw)
    } catch {
        return fallback
    }
}

export const write = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch {
        // Non-critical persistence failures are intentionally ignored.
    }
}

export const remove = (key) => {
    try {
        localStorage.removeItem(key)
    } catch {
    }
}