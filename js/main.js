import { $, toggle } from './ui/dom.js'
import * as i18n from './lib/i18n.js'
import { createLogger } from './lib/logger.js'
import { subscribe, getState, setState } from './app/store.js'
import * as router from './app/router.js'
import * as controller from './app/controller.js'
import * as scanner from './scanner/barcode-scanner.js'
import * as status from './ui/status.js'
import * as emptyView from './ui/views/empty-view.js'
import * as loadingView from './ui/views/loading-view.js'
import * as productView from './ui/views/product-view.js'
import * as resultsView from './ui/views/results-view.js'
import { showToast } from './ui/toast.js'
import { t } from './lib/i18n.js'

// App bootstrap sequence: locale, subscriptions, router sync, scanner hooks.

const log = createLogger('app')


const bindDom = () => {
    $('#search-form')?.addEventListener('submit', (e) => {
        e.preventDefault()
        const input =  ($('#search-input'))
        controller.submitQuery(input?.value)
        if (input) input.value = ''
        toggle($('#search-clear'), false)
    })

    const input =  ($('#search-input'))
    const clear = $('#search-clear')
    input?.addEventListener('input', () => toggle(clear, input.value.length > 0))
    clear?.addEventListener('click', () => {
        if (!input) return
        input.value = ''
        toggle(clear, false)
        input.focus()
    })

    $('#btn-start')?.addEventListener('click', async () => {
        setState({ statusKind: 'busy', statusLabel: t('status.cameraStarting') })
        const ok = await scanner.start()
        if (ok) {
            setState({ scannerLive: true, statusKind: 'live', statusLabel: t('status.cameraLive') })
        } else {
            showToast(t('errors.cameraBlocked'))
            setState({ statusKind: 'error', statusLabel: t('status.cameraError') })
        }
    })

    $('#btn-stop')?.addEventListener('click', () => {
        scanner.stop()
        setState({ scannerLive: false, statusKind: 'idle', statusLabel: t('status.cameraOff') })
    })

    $('#btn-close')?.addEventListener('click', () => router.navigate('home'))

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && getState().view !== 'empty') {
            router.navigate('home')
        }
    })
}

const subscribeViews = () => {
    let lastView = ''
    let lastProduct = null
    let lastSearchSig = ''
    let lastHistorySig = ''

    subscribe((state) => {
        const { view, product, search, history: hist } = state

        if (view !== lastView) {
            lastView = view
            reflectViewToDom(state)
        }

        if (view === 'product' && product && product !== lastProduct) {
            lastProduct = product
            productView.render(product)
        }

        if (view === 'results') {
            const sig = searchSig(search)
            if (sig !== lastSearchSig) {
                // Signature gate avoids unnecessary full-list rerenders.
                lastSearchSig = sig
                resultsView.render(search, {
                    onPick: (p) => router.navigate(`product/${p.code}`),
                    onLoadMore: controller.loadMore,
                    onGradesChange: controller.applyGrades,
                    onSortChange: controller.applySort
                })
            }
        }

        if (view === 'empty') {
            const sig = JSON.stringify(hist)
            if (sig !== lastHistorySig) {
                lastHistorySig = sig
                emptyView.render((code) => router.navigate(`product/${code}`))
            }
        }
    })
}

const searchSig = (s) => {
    return `${s.query}|${s.items.length}|${s.total}|${s.page}|${s.loading}|${s.grades.join(',')}|${s.sort}`
}

const reflectViewToDom = (state) => {
    const app = $('#app')
    if (app) app.dataset.mode = state.view === 'empty' ? 'empty' : state.view === 'loading' ? 'loading' : 'result'

    toggle($('#view-empty'),    state.view === 'empty')
    toggle($('#view-loading'),  state.view === 'loading')
    toggle($('#view-product'),  state.view === 'product')
    toggle($('#view-results'),  state.view === 'results')

    toggle($('#btn-close'),   state.view === 'product' || state.view === 'results')

    if (state.view === 'loading') loadingView.render(state.statusLabel)
    if (state.view === 'empty') emptyView.render((code) => router.navigate(`product/${code}`))
}

const reactToRoute = (route) => {
    switch (route.name) {
        case 'home':
            setState({
                view: 'empty',
                statusKind: 'idle',
                statusLabel: t('status.ready'),
                product: null
            })
            break

        case 'scan':
            setState({ view: 'empty' })
            $('#btn-start')?.click()
            break

        case 'product': {
            const code = route.params[0]
            if (!code) { router.navigate('home', { replace: true }); return }
            if (getState().product?.code !== code) controller.lookup(code)
            else setState({ view: 'product' })
            break
        }

        case 'search': {
            const query = route.params[0]
            if (!query) { router.navigate('home', { replace: true }); return }
            if (getState().search.query !== query) controller.search(query)
            else setState({ view: 'results' })
            break
        }
    }
}

const registerServiceWorker = () => {
    if (!('serviceWorker' in navigator)) return

    // Defer registration until load so startup UI remains responsive.
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch((err) => {
            log.warn('service worker registration failed', err)
        })
    })
}

const boot = async () => {
    await i18n.loadLocale(i18n.detectLocale())
    i18n.applyTranslations(document)

    status.init()
    router.init()
    bindDom()
    subscribeViews()
    reactToRoute(router.current())
    router.onChange(reactToRoute)

    scanner.onBarcodeDetected((code) => {
        // Stop immediately to prevent repeat detections from a stable camera frame.
        scanner.stop()
        setState({ scannerLive: false })
        router.navigate(`product/${code}`)
    })

    log.log('boot complete')
    controller.checkHealth()
    registerServiceWorker()
}

await boot()