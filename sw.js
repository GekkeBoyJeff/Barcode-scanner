// Service worker — offline shell + runtime cache for product media.
// Uses stable cache names so no URL versioning is needed.

const SHELL_CACHE = 'barcode-shell'
const MEDIA_CACHE = 'barcode-media'

const SHELL_ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './manifest.webmanifest',
    './js/main.js',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/favicon.svg'
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS))
    )
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const names = await caches.keys()
        await Promise.all(names
            .filter((name) => name !== SHELL_CACHE && name !== MEDIA_CACHE)
            .map((name) => caches.delete(name)))
        await self.clients.claim()
    })())
})

self.addEventListener('fetch', (event) => {
    const req = event.request
    if (req.method !== 'GET') return

    const url = new URL(req.url)

    if (url.origin === self.location.origin) {
        if (req.mode === 'navigate') {
            event.respondWith(networkFirst(SHELL_CACHE, req, './index.html'))
            return
        }

        event.respondWith(networkFirst(SHELL_CACHE, req))
        return
    }

    if (url.hostname === 'images.openfoodfacts.org') {
        event.respondWith(staleWhileRevalidate(MEDIA_CACHE, req))
    }
})

const networkFirst = async (cacheName, req, fallbackKey) => {
    const cache = await caches.open(cacheName)
    try {
        const res = await fetch(req)
        if (res.ok) cache.put(req, res.clone())
        return res
    } catch {
        const hit = await cache.match(req)
        if (hit) return hit
        return (await cache.match(fallbackKey)) || Response.error()
    }
}

const staleWhileRevalidate = async (cacheName, req) => {
    const cache = await caches.open(cacheName)
    const hit = await cache.match(req)
    const fetchAndStore = fetch(req).then((res) => {
        if (res.ok) cache.put(req, res.clone())
        return res
    }).catch(() => hit)
    return hit || fetchAndStore
}