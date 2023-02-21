import { detectCode } from './detectBarcode.js';

export async function enableCamera() {

    // Flag to indicate if the function is currently loading
    let isLoading = true;
    document.querySelector('section:nth-of-type(2) > video').classList.toggle('skeleton')

    // Check if device has camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

        // Define constraints to use the camera without audio and with the back camera
        const constraints = {
            audio: false,
            video: {
                facingMode: 'environment'
            }
        }

        try {
            // Request access to the user's camera using the defined constraints
            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            // Play the camera stream
            video.srcObject = stream;
            video.play();

            // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/getSettings
            // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/getCapabilities
            // Get camera track and capabilities
            const track = stream.getVideoTracks()[0];
            const capabilities = track.getCapabilities();

            // Check if focus distance is supported or not
            if (!capabilities.focusMode) {
                return;
            }

            // Check if focus distance setting is supported or not
            // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackCapabilities/focusDistance
            const input = document.querySelector('input[type="range"]');
            input.min = capabilities.focusDistance.min;
            input.max = capabilities.focusDistance.max;
            input.step = capabilities.focusDistance.step;
            input.value = track.getSettings().focusDistance;

            // Add event listener to update focus distance
            if (!input.classList.contains('hidden')) {
                input.oninput = function (event) {
                    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/applyConstraints
                    track.applyConstraints({
                        advanced: [{
                            focusMode: 'manual',
                            focusDistance: event.target.value
                        }]
                    });
                };
            }

            setInterval(detectCode, 1000);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            // Set loading flag to false
            isLoading = false;
        }
    } else {
        console.log("getUserMedia is not supported");
    }
    if (!isLoading) {
        document.querySelector('section:nth-of-type(2) > video').classList.toggle('skeleton')
        console.log('stop loading')
    }
}

export async function disableCamera() {
    const mediaStream = video.srcObject;
    const tracks = mediaStream.getTracks();
    tracks.forEach(track => track.stop())
    // https://dev.to/morinoko/stopping-a-webcam-with-javascript-4297
}

const showSlider = document.querySelector('section:nth-of-type(2) > button:last-of-type').addEventListener('click', () => { /* Toggle slider */
    var slider = document.querySelector('section:nth-of-type(2) > input:last-of-type').classList.toggle('hidden')

    disableCamera()
    enableCamera();

    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/onended

})
