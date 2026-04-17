
const palette = {
    app: '#f7b955',
    api: '#c9f26f',
    scanner: '#80d8ff',
    ui: '#7fd0ff',
    router: '#d4a3ff'
}

export const createLogger = (ns) => {
    const color = palette[ns] || '#9aa0a6'
    const prefix = `%c[${ns}]`
    const style = `color:${color};font-weight:600`

    return {
        log: (...args) => console.log(prefix, style, ...args),
        warn: (...args) => console.warn(prefix, style, ...args),
        error: (...args) => console.error(prefix, style, ...args)
    }
}