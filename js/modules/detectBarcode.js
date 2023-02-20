import { fetchBarcodeData } from "./fetchBarcodeData.js";

// Get the video element
const video = document.querySelector('#video')

let formats; //wat voor barcode / qr code ze kunnen scannen
// Save all formats to formats var 
BarcodeDetector.getSupportedFormats().then(arr => formats = arr);
// Create new barcode detector with all supported formats
const barcodeDetector = new BarcodeDetector({ formats });

// Detect code function 
export const detectCode = () => {
    // Start detecting codes on to the video element
    barcodeDetector.detect(video).then(codes => {
        // If no codes exit function
        if (codes.length === 0) return;

        for (const barcode of codes) {
            // Log the barcode to the console
            // console.log(barcode);
            console.log(barcode.rawValue)
            const barcodeValue = barcode.rawValue
            fetchBarcodeData(barcodeValue)
            return;
        }
    }).catch(err => {
        // Log an error if one happens
        console.error(err);
    })
}