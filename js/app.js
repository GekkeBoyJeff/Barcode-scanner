// https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API 

import { router } from './modules/router.js'
import { enableCamera, disableCamera } from './modules/handleCamera.js'

window.onload = router(); /* als de pagina laadt, voer dan de router functie uit */
window.addEventListener('hashchange', function () {
    router()
}, false);

var homeBackButton = document.querySelector('header > button:first-of-type')
var startCamera = document.querySelector('section:nth-of-type(2) > button:first-of-type')
var stopCamera = document.querySelector('section:nth-of-type(2) > button:nth-of-type(2)')

homeBackButton.addEventListener('click', () => {
    window.location.hash = '#home';
})

startCamera.addEventListener('click', enableCamera)
stopCamera.addEventListener('click', disableCamera)
