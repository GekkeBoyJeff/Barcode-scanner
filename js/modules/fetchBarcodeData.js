import { renderProduct } from "./renderProduct.js"
import { disableCamera } from "./handleCamera.js"


export function fetchBarcodeData(barcodeValue) {
    let testUrl = `https://world.openfoodfacts.org/api/v0/product/${barcodeValue}.json`
    console.log(testUrl)

    const errorPopup = document.querySelector('header div:nth-of-type(2)')


    fetch(testUrl)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return res.json()
        })
        .then((data) => {
            if (data.status_verbose == "product not found" || data.status_verbose == "no code or invalid code") {
                console.log('product not found')
                window.location.hash = `#search`;
                errorPopup.classList.add('active')
                navigator.vibrate(1000);
                setTimeout(() => {
                    errorPopup.classList.remove('active');
                }, 2000);

                return;
            } else {
                errorPopup.classList.remove('active');
                console.log(data)
                disableCamera();
                window.location.hash = `#product/${barcodeValue}`;
                renderProduct(data)
            }
        })
}