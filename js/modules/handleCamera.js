import { detectCode } from './detectBarcode.js';

export async function enableCamera() {
    // Check if device has camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Use video without audio
        const constraints = {
            audio: false,
            video: {
                facingMode: 'environment'
            }
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            video.play();

            // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/getSettings
            // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/getCapabilities
            const track = stream.getVideoTracks()[0];
            const capabilities = track.getCapabilities();

            if (!capabilities.focusMode) {
                return;
            }

            const input = document.querySelector('input[type="range"]');
            input.min = capabilities.focusDistance.min;
            input.max = capabilities.focusDistance.max;
            input.step = capabilities.focusDistance.step;
            input.value = track.getSettings().focusDistance;

            // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/onended
            input.oninput = function (event) {
                // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/applyConstraints
                track.applyConstraints({
                    advanced: [{
                        focusMode: 'manual',
                        focusDistance: event.target.value
                    }]
                });
            };

            setInterval(detectCode, 1000);
        }
        catch (error) {
            console.log(error);
        }
    }
}

export async function disableCamera() {
    const mediaStream = video.srcObject;
    const tracks = mediaStream.getTracks();
    tracks.forEach(track => track.stop())
    // https://dev.to/morinoko/stopping-a-webcam-with-javascript-4297
}

function cameraFocus() {
    video.srcObject = stream;



}