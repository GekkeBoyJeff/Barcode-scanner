import { headerChange } from './changeHeader.js'
import { fetchBarcodeData } from './fetchBarcodeData.js'
import { disableCamera } from './handleCamera.js'

let headerText;

export function router() {
    const hash = window.location.hash; // Get the hash from the URL
    const parts = hash.split('/'); // Split the hash into an array of parts

    disableCamera();

    if (parts[0] == '#product') {
        document.querySelector('section:nth-of-type(3)').style.display = 'flex';
    } else {
        document.querySelector('section:nth-of-type(3)').style.display = 'none';
    }

    switch (parts[0]) { // Check which part of the hash we're dealing with
        case '#home':
            console.log('home');
            headerText = 'Dashboard';
            headerChange(headerText);
            break;
        case '#search':
            console.log('scan');
            headerText = 'Scan your product';
            headerChange(headerText);
            break;
        case '#product':
            console.log('product');
            headerText = 'Product name';
            document.querySelector('section:nth-of-type(3)').style.display = 'flex';
            headerChange(headerText);
            if (parts.length > 1) { // Check if there's an ID in the hash
                const barcodeValue = parts[1]; // Get the ID from the hash
                fetchBarcodeData(barcodeValue);
            }
            break;
        case '#profile':
            console.log('profile');
            headerText = 'Profile';
            headerChange(headerText);
            break;
        default:
            console.log('default');
            console.log('back to home')
            window.location.hash = '#home';
            break;
    }
}