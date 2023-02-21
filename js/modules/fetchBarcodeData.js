import { renderProduct } from "./renderProduct.js"

export function fetchBarcodeData(barcodeValue) {
    var testUrl = `https://world.openfoodfacts.org/api/v0/product/${barcodeValue}.json`
    console.log(testUrl)

    var p = document.querySelector('p')
    fetch(testUrl)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return res.json()
        })
        .then((data) => {
            console.log(data)
            window.location.hash = `#product/${barcodeValue}`;
            renderProduct(data)
        })
}