// https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API 

import { router } from './modules/router.js'
import { enableCamera } from './modules/enableCamera.js'
import { disableCamera } from './modules/disableCamera.js'

var startCamera = document.querySelector('section > button:first-of-type')
var stopCamera = document.querySelector('section > button:last-of-type')

startCamera.addEventListener('click', () => {
    enableCamera();
})

stopCamera.addEventListener('click', () => {
    disableCamera();
})

window.onload = router(); /* als de pagina laadt, voer dan de router functie uit */

window.addEventListener('hashchange', function () {
    router()
}, false);

