import { hideSections } from './hideSections.js'
import { headerChange } from './changeHeader.js'

let headerText;

export function router() {
    switch (window.location.hash) {
        case '#home':
            console.log('home')
            hideSections()
            headerText = 'Dashboard'
            headerChange(headerText)
            document.querySelector('section:first-of-type').classList.remove('hidden')
            break;
        case '#scan':
            console.log('scan')
            hideSections()
            headerText = 'Scan your product'
            headerChange(headerText)
            document.querySelector('section:nth-of-type(2)').classList.remove('hidden')
            break;
        case '#product':
            console.log('product')
            hideSections()
            headerText = 'Product name'
            headerChange(headerText)
            break;
        case '#profile':
            console.log('profile')
            hideSections()
            headerText = 'Profile'
            headerChange(headerText)
            document.querySelector('section:last-of-type').classList.remove('hidden')
            break;
        default:
            console.log('default')
            hideSections()
            headerText = 'Dashboard'
            headerChange(headerText)
            document.querySelector('section:first-of-type').classList.remove('hidden')
            break;
    }
}