import * as api from '../api/off-client.js'
import { setState, getState } from './store.js'
import * as history from './history.js'
import { navigate } from './router.js'
import { showToast } from '../ui/toast.js'
import { t } from '../lib/i18n.js'
import { createLogger } from '../lib/logger.js'

// Controller layer that owns async flows and state transitions.
// Views only dispatch actions; this module decides status and navigation.

const log = createLogger('app')

const BARCODE_RX = /^\d{8,14}$/

// Guards against stale async responses overwriting fresher state.
let requestGen = 0

export const submitQuery = (raw) => {
    const value = String(raw || '').trim()
    if (!value) return

    if (BARCODE_RX.test(value)) {
        navigate(`product/${value}`)
    } else {
        navigate(`search/${encodeURIComponent(value)}`)
    }
}

export const lookup = async (code) => {
    const gen = ++requestGen
    setState({
        view: 'loading',
        statusKind: 'busy',
        statusLabel: t('status.lookingUp', { code })
    })

    try {
        const product = await api.lookupByCode(code)
        if (gen !== requestGen) return
        if (!product) {
            showToast(`${t('status.notFound')}: ${code}`)
            setState({ view: 'empty', statusKind: 'error', statusLabel: t('status.notFound') })
            navigate('home', { replace: true })
            return
        }

        history.remember(product)
        setState({
            view: 'product',
            product,
            statusKind: 'found',
            statusLabel: t('status.found', { name: product.name })
        })
    } catch (err) {
        if (gen !== requestGen) return
        log.error('lookup failed', err)
        showToast(t('errors.lookupFailed'))
        setState({ view: 'empty', statusKind: 'error', statusLabel: t('status.lookupFailed') })
        navigate('home', { replace: true })
    }
}

export const search = async (query) => {
    const gen = ++requestGen
    setState({
        view: 'loading',
        statusKind: 'busy',
        statusLabel: t('status.searching', { query })
    })

    try {
        const { items, total } = await api.searchByName(query, { page: 1, grades: [] })
        if (gen !== requestGen) return
        setState({
            view: 'results',
            search: {
                query,
                items,
                total,
                page: 1,
                loading: false,
                grades: [],
                sort: 'relevance'
            },
            statusKind: 'found',
            statusLabel: t('status.results', { n: total })
        })
    } catch (err) {
        if (gen !== requestGen) return
        log.error('search failed', err)
        showToast(t('errors.searchFailed'))
        setState({ view: 'empty', statusKind: 'error', statusLabel: t('status.searchFailed') })
        navigate('home', { replace: true })
    }
}

export const applyGrades = async (grades) => {
    const state = getState()
    const { query } = state.search
    if (!query) return
    const gen = ++requestGen
    setState({ search: { ...state.search, grades, page: 1, loading: true } })

    try {
        const { items, total } = await api.searchByName(query, { page: 1, grades })
        if (gen !== requestGen) return
        setState({
            search: { ...getState().search, items, total, page: 1, loading: false, grades }
        })
    } catch (err) {
        if (gen !== requestGen) return
        log.error('filter refetch failed', err)
        showToast(t('errors.searchFailed'))
        setState({ search: { ...getState().search, loading: false } })
    }
}

export const applySort = (sort) => {
    const s = getState()
    setState({ search: { ...s.search, sort } })
}

export const loadMore = async () => {
    const state = getState()
    const s = state.search
    if (s.loading || s.items.length >= s.total) return
    const gen = ++requestGen
    setState({ search: { ...s, loading: true } })

    try {
        const next = await api.searchByName(s.query, { page: s.page + 1, grades: s.grades })
        if (gen !== requestGen) return

        const seen = new Set(s.items.map((p) => p.code))
        const added = next.items.filter((p) => !seen.has(p.code))
        setState({
            search: {
                ...getState().search,
                items: [...s.items, ...added],
                page: s.page + 1,
                total: next.total ?? s.total,
                loading: false
            }
        })
    } catch (err) {
        if (gen !== requestGen) return
        log.error('load more failed', err)
        showToast(t('errors.searchFailed'))
        setState({ search: { ...getState().search, loading: false } })
    }
}

export const checkHealth = async () => {
    const ok = await api.checkHealth()
    if (ok) {
        log.log('api reachable')
    } else {
        log.error('api unreachable')
        showToast(t('errors.apiUnreachable'))
        setState({ statusKind: 'error', statusLabel: t('status.apiOffline') })
    }
}