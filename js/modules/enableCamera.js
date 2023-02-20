import { detectCode } from './detectBarcode.js';

export function enableCamera() {
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
}