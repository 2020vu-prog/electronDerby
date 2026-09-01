const { ipcRenderer } = require('electron');
export {}; // force module scope so `ipcRenderer` doesn't collide with other preload scripts

ipcRenderer.on('udpTimer', (_event: any, reading: { lane: string; ms: string }) => {
    const udpTimerSpan = document.getElementById('udpTimerSpan');
    if (!udpTimerSpan) {
        console.log('cannot find transport element!');
        return;
    }
    console.log(`server sending ${JSON.stringify(reading)} via ${udpTimerSpan}`);
    const event = new CustomEvent('udpTimer', { detail: JSON.stringify(reading) });
    udpTimerSpan.dispatchEvent(event);
});

// Reverse direction: the page tells us a new racephase has been loaded onto
// the blocks by dispatching a DOM event on this element; relay it to the
// main process (which has the dgram access the sandboxed renderer lacks) so
// it can be sent out as a UDP message.
window.addEventListener('DOMContentLoaded', () => {
    const racePhaseSpan = document.getElementById('udpRacePhaseSpan');
    if (!racePhaseSpan) {
        return;
    }
    racePhaseSpan.addEventListener('racePhaseEntered', (event: any) => {
        ipcRenderer.send('racePhaseEntered', event.detail);
    });
});
