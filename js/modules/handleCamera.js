import { detectCode } from './detectBarcode.js';

export async function enableCamera() {
    const video = document.querySelector('section:nth-of-type(2) div video');
    const input = document.querySelector('input[type="range"]');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'environment' } });
        video.srcObject = stream;
        video.play();

        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        if (!capabilities.focusMode) return;

        input.min = capabilities.focusDistance.min;
        input.max = capabilities.focusDistance.max;
        input.step = capabilities.focusDistance.step;
        input.value = track.getSettings().focusDistance;

        if (!input.classList.contains('hidden')) {
            input.oninput = event => track.applyConstraints({ advanced: [{ focusMode: 'manual', focusDistance: event.target.value }] });
        }

        setInterval(detectCode, 1000);
    } catch (error) { console.log(error); }
    finally { video.classList.remove('skeleton'); }
}

export async function disableCamera() {
    try {
        const mediaStream = document.querySelector('section:nth-of-type(2) div video').srcObject;
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop());
        console.log('camera disabled');
    } catch (error) { }
}

document.querySelector('section:nth-of-type(2) > button:last-of-type').addEventListener('click', () => {
    document.querySelector('section:nth-of-type(2) > input:last-of-type').classList.toggle('hidden');
    disableCamera();
    enableCamera();
});
