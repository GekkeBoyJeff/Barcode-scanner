
// Tiny DOM helpers used across view modules.
export function $(selector, root = document) {
    return root.querySelector(selector)
}

export function $$(selector, root = document) {
    return Array.from(root.querySelectorAll(selector))
}

export const h = (tag, attrs, ...children) => {
    // Create element + attributes + children in one pass to keep render code compact.
    const el = document.createElement(tag)

    if (attrs) {
        for (const [key, value] of Object.entries(attrs)) {
            if (value == null || value === false) continue

            if (key === 'class') {
                el.className = String(value)
            } else if (key === 'dataset' && typeof value === 'object') {
                Object.assign(el.dataset, value)
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(el.style, value)
            } else if (key.startsWith('on') && typeof value === 'function') {
                el.addEventListener(key.slice(2).toLowerCase(), value)
            } else {
                el.setAttribute(key, String(value))
            }
        }
    }

    append(el, children)
    return el
}

export const svg = (tag, attrs, ...children) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag)
    if (attrs) {
        for (const [key, value] of Object.entries(attrs)) {
            el.setAttribute(key, String(value))
        }
    }
    append(el, children)
    return el
}

const append = (el, nodes) => {
    for (const node of nodes.flat(Infinity)) {
        if (node == null || node === false) continue
        if (typeof node === 'string' || typeof node === 'number') {
            el.appendChild(document.createTextNode(String(node)))
        } else {
            el.appendChild(node)
        }
    }
}

export const replace = (el, ...children) => {
    // Always replace through DOM APIs, never via innerHTML.
    el.replaceChildren()
    append(el, children)
}

export const toggle = (el, visible) => {
    if (!el) return
    el.hidden = !visible
}