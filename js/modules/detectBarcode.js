import { fetchBarcodeData } from "./fetchBarcodeData.js";

let formats;

const video = document.querySelector('#video');
const barcodeDetector = new BarcodeDetector({ formats });

// Get supported formats
BarcodeDetector.getSupportedFormats()
    .then(arr => barcodeDetector.formats = arr)
    .catch(error => console.error(error));

export const detectCode = () => {
    barcodeDetector.detect(video)
        .then(codes => {
            if (codes.length === 0) return;

            codes.forEach(code => {
                const barcodeValue = code?.rawValue;
                // optional chaining (?.) to check if barcode exists before accessing its properties. This can prevent errors if barcode is null or undefined.
                if (barcodeValue) {
                    console.log(barcodeValue);
                    fetchBarcodeData(barcodeValue);
                }
            });
        })
        .catch(error => console.error(error));
};