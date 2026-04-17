# Barcode Scanner

A progressive web app that reads barcodes and surfaces the matching product from
[Open Food Facts](https://world.openfoodfacts.org): Nutri-Score, NOVA processing
group, Eco-Score, allergens, ingredients, and a per-100 g / per-serving
nutrition breakdown.

Vanilla JavaScript ES modules, SCSS compiled ahead of time, no client-side
build. Ships from GitHub Pages; search runs through a tiny Cloudflare Worker.

---

## Features

- Live barcode scanning via `BarcodeDetector` (polyfill fallback for older browsers)
- Manual entry (8–14 digit codes) or text search by product name
- Nutri-Score, NOVA and Eco-Score presented as one unified scores card
- At-a-glance verdict: "good choice" / "look closer" / "unhealthy" with reasons
- Multi-image carousel (front / ingredients / nutrition / packaging)
- Allergen and trace warnings pulled from the product record
- Server-side Nutri-Score filtering with client-side sort + pagination
- Recently viewed products persisted in `localStorage`
- Web Share API with clipboard fallback for copy-and-send
- Per-100 g ↔ per-serving nutrition toggle when OFF knows the portion size
- Offline-capable PWA with installable icon, manifest and service worker
- English default; Dutch surfaces automatically when the browser prefers it
- Respects `prefers-reduced-motion` and `prefers-color-scheme`

## Getting started

```bash
npm install
npm run watch:css       # compiles scss/ → css/style.css on save
npm run serve           # localhost:4173 static server
```

Open `http://localhost:4173` in a browser. The camera requires HTTPS on devices
other than `localhost`; easiest during development is
`npx localtunnel --port 4173` or `ngrok`.

## Build

```bash
npm run build:css
```

The compiled stylesheet at `css/style.css` **must be committed** — GitHub Pages
serves the repository as-is with no build step.

## Deployment

### GitHub Pages

1. Push to `main`.
2. Repo → Settings → Pages → Source: Deploy from branch `main`, folder `/`.
3. The app is live at `https://<user>.github.io/<repo>/`.

### Cloudflare Worker (text search)

OFF's search endpoint has no CORS headers, so browser fetches are blocked. A
first-party Worker forwards the request and adds the missing header.

```bash
npm install -g wrangler
wrangler login
cd worker
wrangler deploy
```

Copy the deployed URL (e.g. `https://off-search.<you>.workers.dev/`) into
[`js/api/off-client.js`](js/api/off-client.js) — update the `SEARCH_PROXY`
constant near the top of the file.

The Worker free tier is 100,000 requests per day, which is far more than this
app will ever need.

## Project layout

```
index.html              Shell (semantic HTML, meta, JSON-LD)
manifest.webmanifest    PWA manifest
sw.js                   Service worker (offline shell + media cache)
robots.txt              Crawlability

scss/                   SCSS source; @use-composed
  _tokens.scss            Spacing / type / radii scales (SCSS functions) and
                          runtime colour tokens (CSS custom properties)
  _mixins.scss            focus-ring, visually-hidden, skeleton
  _base.scss              Reset + typography + a11y primitives
  _layout.scss            App shell grid, responsive breakpoints
  components/             Buttons, fields, chips, status, toast, cards
  views/                  Empty, scanner, product, results
  main.scss               Entry — @uses everything above

css/style.css           Compiled (committed; rebuild after SCSS edits)

js/
  main.js                 Bootstrap
  app/
    store.js              Observable state
    router.js             Hash router
    controller.js         Async flows (lookup, search, filter)
    history.js            localStorage-backed scan history
  api/off-client.js       Open Food Facts client
  scanner/
    barcode-scanner.js    Camera + BarcodeDetector
  ui/
    dom.js                h()/svg()/$/$$/replace helpers
    toast.js              Toast overlay
    status.js             Top-bar status indicator
    views/                empty, loading, product, results, carousel
    widgets/              verdict, scores, nutrition, allergens, tags
  lib/
    i18n.js               Dictionary lookup + ICU-lite plurals
    logger.js             Namespaced console
    share.js              Web Share + clipboard fallback
    storage.js            Safe localStorage wrapper
  i18n/
    en.js, nl.js          Translation dictionaries

icons/                  PWA icons (SVG favicon + PNG 192 / 512 / maskable / apple)
worker/                 Cloudflare Worker (CORS proxy for OFF search)
```

## Browser support

Chrome / Edge 95+, Safari 16.4+, Firefox 115+. Older browsers see the scanner
fall back to the zbar-wasm polyfill; everything else is standard Web Platform.

## Credits

Product data courtesy of the [Open Food Facts](https://openfoodfacts.org)
community. Made by [Jeffrey Ullers](https://www.jeffreyullers.nl/).