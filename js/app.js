// https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API 

import { router } from './modules/router.js'
import { enableCamera } from './modules/enableCamera.js'
import { disableCamera } from './modules/disableCamera.js'

var homeBackButton = document.querySelector('header > button:first-of-type')
var startCamera = document.querySelector('section:nth-of-type(2) > button:first-of-type')
var stopCamera = document.querySelector('section:nth-of-type(2) > button:last-of-type')

document.querySelector('section:first-of-type > button:first-of-type').addEventListener('click', () => { /* Go to profile page */
    window.location.hash = '#profile';
})
document.querySelector('section:first-of-type > button:last-of-type').addEventListener('click', () => { /* Go to scan page */
    window.location.hash = '#scan';
})

homeBackButton.addEventListener('click', () => {
    window.location.hash = '#home';
})

startCamera.addEventListener('click', enableCamera)

stopCamera.addEventListener('click', disableCamera)

window.onload = router(); /* als de pagina laadt, voer dan de router functie uit */

window.addEventListener('hashchange', function () {
    router()
}, false);

