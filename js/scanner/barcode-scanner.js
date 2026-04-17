import { createLogger } from '../lib/logger.js'

// Camera scanner wrapper with cooldown to avoid duplicate detections.

const log = createLogger('scanner')

const TICK_MS = 500
const COOLDOWN_MS = 2500

let stream = null
let detector = null
let timer = null
let lastCode = ''
let lastCodeAt = 0

let onDetect = () => {}

const el = (selector) => {
    return  (document.querySelector(selector))
}

const ensureDetector = async () => {
    if (detector) return detector

    try {
        const formats = await BarcodeDetector.getSupportedFormats()
        detector = new BarcodeDetector({ formats })
        log.log('detector ready, formats:', formats.join(', '))
    } catch {
        // Polyfill path may not expose format probing.
        detector = new BarcodeDetector()
        log.log('detector ready (default formats)')
    }
    return detector
}

const tick = async () => {
    const video = el('#video')
    if (!(video instanceof HTMLVideoElement) || video.readyState < 2) return

    try {
        const codes = await detector.detect(video)
        if (codes.length === 0) return

        const value = codes[0]?.rawValue
        if (!value) return

        const now = Date.now()
        if (value === lastCode && now - lastCodeAt < COOLDOWN_MS) return
        lastCode = value
        lastCodeAt = now

        log.log('detected →', value)
        navigator.vibrate?.(100)
        onDetect(value)
    } catch (err) {
        log.error('detect error', err)
    }
}

export const start = async () => {
    const viewfinder = el('#viewfinder')
    const video =  (el('#video'))
    if (!video || !viewfinder) return false

    try {
        log.log('requesting camera access…')
        stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        })
        video.srcObject = stream
        await video.play()

        const settings = stream.getVideoTracks()[0]?.getSettings() || {}
        log.log(`camera ready · ${settings.width}×${settings.height}`)

        viewfinder.dataset.state = 'live'
        await ensureDetector()
        timer = setInterval(tick, TICK_MS)
        return true
    } catch (err) {
        log.error('camera failed', err?.name, err?.message)
        return false
    }
}

export const stop = () => {
    if (!stream && !timer) return

    if (timer) {
        clearInterval(timer)
        timer = null
    }

    if (stream) {
        stream.getTracks().forEach((t) => t.stop())
        stream = null
    }

    lastCode = ''
    lastCodeAt = 0

    const video =  (el('#video'))
    if (video) video.srcObject = null

    const viewfinder = el('#viewfinder')
    if (viewfinder) viewfinder.dataset.state = 'idle'

    log.log('camera stopped')
}

export const onBarcodeDetected = (fn) => {
    onDetect = fn
}

export const isRunning = () => {
    return stream !== null
}

document.addEventListener('visibilitychange', () => {
    // Release the camera when the tab is hidden to save battery and resources.
    if (document.hidden && stream) stop()
})

window.addEventListener('beforeunload', stop)