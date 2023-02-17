// https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API 

// Get the video element
const video = document.querySelector('#video')

let formats; //wat voor barcode / qr code ze kunnen scannen
// Save all formats to formats var 
BarcodeDetector.getSupportedFormats().then(arr => formats = arr);
// Create new barcode detector with all supported formats
const barcodeDetector = new BarcodeDetector({ formats });

// Detect code function 
const detectCode = () => {
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

var startCamera = document.querySelector('section > button:first-of-type')
var stopCamera = document.querySelector('section > button:last-of-type').addEventListener('click', () => {
    const mediaStream = video.srcObject;
    const tracks = mediaStream.getTracks();
    tracks.forEach(track => track.stop())
    // https://dev.to/morinoko/stopping-a-webcam-with-javascript-4297
})


startCamera.addEventListener('click', () => {
    // Check if device has camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Use video without audio
        const constraints = {
            video: true, /* StudentAssistent: deze op false zetten als product is gevonden / op stop is gedrukt. */
            audio: false
        }

        // Start video stream
        navigator.mediaDevices.getUserMedia({
            audio: false, video: {
                facingMode: 'environment'
            }
        }).then(stream => video.srcObject = stream)
            .catch(console.error);

        setInterval(detectCode, 1000);
    }
})

function fetchBarcodeData(barcodeValue) {
    var testUrl = `https://world.openfoodfacts.org/api/v0/product/${barcodeValue}.json`
    console.log(testUrl)

    fetch(testUrl)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return res.json()
        })
        .then((data) => {
            console.log(data)
        })
}