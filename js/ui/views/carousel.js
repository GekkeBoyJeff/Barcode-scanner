import { h, svg, replace } from '../dom.js'
import { t } from '../../lib/i18n.js'

export const mount = (host, images) => {
    if (!images.length) {
        replace(host, h('span', { class: 'product-media-empty' }, t('product.noImage')))
        return
    }

    const track = h('div', { class: 'carousel' })
    const multi = images.length > 1

    for (let i = 0; i < images.length; i++) {
        track.appendChild(buildSlide(images[i], i))
    }

    const children = [track]

    if (multi) {
        children.push(
            arrow('prev', '‹', 'Vorige'),
            arrow('next', '›', 'Volgende'),
            buildDots(images)
        )
    }

    replace(host, ...children)

    if (multi) {
        wireControls(host, track, images.length)
    }

    enableDragScroll(track)
}

const buildSlide = (image, index) => {
    const img = new Image()
    img.loading = index === 0 ? 'eager' : 'lazy'
    img.decoding = 'async'
    img.src = image.url
    img.alt = t(image.label)
    img.addEventListener('error', () => {
        img.closest('.carousel-slide')?.remove()
    }, { once: true })

    return h('figure', { class: 'carousel-slide' },
        img,
        h('figcaption', { class: 'carousel-caption' }, t(image.label))
    )
}

const arrow = (side, glyph, label) => {
    return h('button', {
        type: 'button',
        class: 'carousel-arrow',
        dataset: { side },
        'aria-label': label
    }, glyph)
}

const buildDots = (images) => {
    const row = h('div', { class: 'carousel-dots' })
    images.forEach((image, i) => {
        row.appendChild(h('button', {
            type: 'button',
            class: 'carousel-dot',
            dataset: { index: String(i) },
            'aria-label': t(image.label)
        }))
    })
    return row
}

const wireControls = (host, track, count) => {
    const goTo = (i) => {
        const target = Math.max(0, Math.min(i, count - 1))
        track.scrollTo({ left: target * track.clientWidth, behavior: 'smooth' })
    }
    const current = () => Math.round(track.scrollLeft / track.clientWidth)

    host.querySelector('[data-side="prev"]')?.addEventListener('click', () => goTo(current() - 1))
    host.querySelector('[data-side="next"]')?.addEventListener('click', () => goTo(current() + 1))

    host.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.addEventListener('click', () => goTo(i))
    })

    const sync = () => {
        const i = Math.min(current(), count - 1)
        host.querySelectorAll('.carousel-dot').forEach((dot, k) => {
            dot.dataset.active = String(k === i)
        })
        host.querySelector('[data-side="prev"]')?.setAttribute('data-disabled', String(i === 0))
        host.querySelector('[data-side="next"]')?.setAttribute('data-disabled', String(i >= count - 1))
    }
    track.addEventListener('scroll', sync, { passive: true })
    requestAnimationFrame(sync)
}

const enableDragScroll = (track) => {
    let dragging = false
    let startX = 0
    let startScroll = 0
    let moved = false

    track.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') return
        dragging = true
        moved = false
        startX = e.clientX
        startScroll = track.scrollLeft
        track.setPointerCapture(e.pointerId)
        track.style.scrollSnapType = 'none'
    })

    track.addEventListener('pointermove', (e) => {
        if (!dragging) return
        const dx = e.clientX - startX
        if (Math.abs(dx) > 3) moved = true
        track.scrollLeft = startScroll - dx
    })

    const end = () => {
        if (!dragging) return
        dragging = false
        track.style.scrollSnapType = ''
        const i = Math.round(track.scrollLeft / track.clientWidth)
        track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' })
    }
    track.addEventListener('pointerup', end)
    track.addEventListener('pointercancel', end)
    track.addEventListener('pointerleave', end)

    track.addEventListener('click', (e) => {
        if (moved) {
            e.preventDefault()
            e.stopPropagation()
        }
    }, true)
}