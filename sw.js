// Service worker — offline shell + runtime cache for product media.
// Three strategies:
//   1. Static shell (HTML/CSS/JS): cache-first so installed PWAs open instantly.
//   2. Product images (images.openfoodfacts.org): stale-while-revalidate so the
//      second visit is instant but content still refreshes in the background.
//   3. Everything else (API calls): network-only — we never want to serve stale
//      nutrition data from a cache.
//
// Bump CACHE_VERSION to force all clients to discard the old shell after a deploy.

const CACHE_VERSION = 'v1'
const SHELL_CACHE = `barcode-shell-${CACHE_VERSION}`
const MEDIA_CACHE = `barcode-media-${CACHE_VERSION}`

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
        event.respondWith(cacheFirst(SHELL_CACHE, req))
        return
    }

    if (url.hostname === 'images.openfoodfacts.org') {
        event.respondWith(staleWhileRevalidate(MEDIA_CACHE, req))
    }
})

const cacheFirst = async (cacheName, req) => {
    const cache = await caches.open(cacheName)
    const hit = await cache.match(req)
    if (hit) return hit
    try {
        const res = await fetch(req)
        if (res.ok) cache.put(req, res.clone())
        return res
    } catch {
        // Navigational requests without connectivity fall through to the cached shell.
        return (await cache.match('./index.html')) || Response.error()
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