import { read, write } from '../lib/storage.js'

// Compact local history for quick re-open actions on the empty screen.

const KEY = 'barcode-scanner:history/v1'
const LIMIT = 12


export const list = () => {
    return read(KEY, [])
}

export const remember = (product) => {
    if (!product?.code) return
    const entry = {
        code: product.code,
        name: product.name,
        brand: product.brand,
        image: product.images[0]?.url || ''
    }
    // Deduplicate by barcode and keep most-recent-first ordering.
    const next = [entry, ...list().filter((p) => p.code !== product.code)].slice(0, LIMIT)
    write(KEY, next)
}

export const clear = () => {
    write(KEY, [])
}