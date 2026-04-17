// Cloudflare Worker — tiny CORS proxy for Open Food Facts' search endpoint.
// `search.openfoodfacts.org` returns valid JSON but does not send an
// `Access-Control-Allow-Origin` header, which makes it unreadable from a
// browser. This worker forwards the query string verbatim and adds the header.
//
// Deployment:
//   1. `npm install -g wrangler`
//   2. `wrangler login`
//   3. `cd worker && wrangler deploy`
//   4. Copy the resulting URL into js/api/off-client.js → `SEARCH_PROXY`.

const UPSTREAM = 'https://search.openfoodfacts.org/search'

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Accept, Content-Type'
}

export default {
    /** @param {Request} request */
    async fetch(request) {
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: CORS_HEADERS })
        }

        if (request.method !== 'GET') {
            return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS })
        }

        const url = new URL(request.url)
        const target = `${UPSTREAM}?${url.searchParams.toString()}`

        try {
            const upstream = await fetch(target, {
                headers: { Accept: 'application/json' },
                cf: { cacheTtl: 60, cacheEverything: true }
            })

            const body = await upstream.arrayBuffer()
            return new Response(body, {
                status: upstream.status,
                headers: {
                    ...CORS_HEADERS,
                    'Content-Type': upstream.headers.get('content-type') || 'application/json',
                    'Cache-Control': 'public, max-age=60'
                }
            })
        } catch (err) {
            return new Response(JSON.stringify({ error: 'upstream_failure', message: String(err) }), {
                status: 502,
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
            })
        }
    }
}