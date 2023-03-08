import { renderProduct, renderSearchList } from "./renderProduct.js"
import { disableCamera } from "./handleCamera.js"

export function fetchBarcodeData(barcodeValue) {
    let testUrl = `https://world.openfoodfacts.org/api/v0/product/${barcodeValue}.json`
    console.log(testUrl)

    const errorPopup = document.querySelector('header div')


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
                navigator.vibrate(1000);
                window.location.hash = `#search`;
                errorPopup.classList.add('active')
                setTimeout(() => {
                    errorPopup.classList.remove('active');
                }, 2000);

                return;
            } else {
                // errorPopup.classList.remove('active');
                console.log(data)
                disableCamera();
                window.location.hash = `#product/${barcodeValue}`;
                renderProduct(data)
            }
        })
}

export function searchByName(searchValue, page = 1) {
    let url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchValue}&search_simple=1&action=process&page=${page}&json=1`

    fetch(url)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }
            return res.json()
        })
        .then((data) => {
            console.log(data)
            window.location.hash = `#products/${searchValue}/page/${page}`;
            renderSearchList(data);
        })
}