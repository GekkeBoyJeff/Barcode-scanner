// https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API 

import { router } from './modules/router.js'
import { enableCamera, disableCamera } from './modules/handleCamera.js'
import { handleSearch } from './modules/handleSearch.js'
// import { incrementPage, decrementPage } from './modules/handleSearch.js'

router() /* voer de router functie uit */
window.addEventListener('hashchange', router, false); /* als de hash verandert, voer dan de router functie uit */

var startCamera = document.querySelector('section:nth-of-type(2) > button:first-of-type')
var stopCamera = document.querySelector('section:nth-of-type(2) > button:nth-of-type(2)')

document.querySelector('#searchButton').addEventListener('click', (e) => { e.preventDefault(); handleSearch() })

startCamera.addEventListener('click', enableCamera)
stopCamera.addEventListener('click', disableCamera)

// document.querySelector('section:nth-of-type(4) > button:first-of-type').addEventListener('click', incrementPage())
// document.querySelector('section:nth-of-type(4) > button:nth-of-type(2)').addEventListener('click', decrementPage())
