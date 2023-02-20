import { hideSections } from './hideSections.js'

export function router() {
    switch (window.location.hash) {
        case '#home':
            console.log('home')
            hideSections()
            document.querySelector('section:first-of-type').classList.remove('hidden')
            break;
        case '#scan':
            console.log('scan')
            hideSections()
            break;
        case '#product':
            console.log('product')
            hideSections()
            break;
        default:
            console.log('default')
            hideSections()
            break;
    }
}