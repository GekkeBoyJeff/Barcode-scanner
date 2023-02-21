import { hideSections } from './hideSections.js'
import { headerChange } from './changeHeader.js'
import { fetchBarcodeData } from './fetchBarcodeData.js'

let headerText;

export function router() {
    const hash = window.location.hash;
    const parts = hash.split('/');
    switch (parts[0]) {
        case '#home':
            console.log('home');
            hideSections();
            headerText = 'Dashboard';
            headerChange(headerText);
            document.querySelector('section:first-of-type').classList.remove('hidden');
            break;
        case '#scan':
            console.log('scan');
            hideSections();
            headerText = 'Scan your product';
            headerChange(headerText);
            document.querySelector('section:nth-of-type(2)').classList.remove('hidden');
            break;
        case '#product':
            console.log('product');
            hideSections();
            headerText = 'Product name';
            headerChange(headerText);
            document.querySelector('section:nth-of-type(3)').classList.remove('hidden');
            if (parts.length > 1) { // Check if there's an ID in the hash
                const barcodeValue = parts[1];
                fetchBarcodeData(barcodeValue);
            }
            break;
        case '#profile':
            console.log('profile');
            hideSections();
            headerText = 'Profile';
            headerChange(headerText);
            document.querySelector('section:nth-of-type(3)').classList.remove('hidden');
            break;
        default:
            console.log('default');
            hideSections();
            headerText = 'Dashboard';
            headerChange(headerText);
            document.querySelector('section:first-of-type').classList.remove('hidden');
            break;
    }
}