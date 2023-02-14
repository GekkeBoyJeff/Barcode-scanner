var testUrl = 'https://world.openfoodfacts.org/api/v0/product/90162909.json'

import * as fs from 'fs';

export function testFetch() {
    fetch(testUrl)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return res.json()
        })
        .then((data) => {
            console.log(data)
            const testJson = './assets/json/product.json'

            fs.writeFile("./assets/json/product.json", JSON.stringify(data), function (err) {
                if (err) throw err;
                console.log('complete');
            }
            );
        })

        .catch((error) => test.textContent = `Could not fetch verse: ${error}`);
}
