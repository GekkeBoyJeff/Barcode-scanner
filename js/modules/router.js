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
            document.querySelector('section:nth-of-type(2)').classList.remove('hidden')
            break;
        case '#product':
            console.log('product')
            hideSections()
            break;
        case '#profile':
            console.log('profile')
            hideSections()
            document.querySelector('section:last-of-type').classList.remove('hidden')
            break;
        default:
            console.log('default')
            hideSections()
            document.querySelector('section:first-of-type').classList.remove('hidden')
            break;
    }
}