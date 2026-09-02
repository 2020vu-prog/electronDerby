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
// the blocks by dispatching a bubbling DOM event; relay it to the main
// process (which has the dgram access the sandboxed renderer lacks) so it
// can be sent out as a UDP message.
//
// Listens on `document` (always present, even before the page's own JS has
// run) rather than a specific element by id -- the page is a Svelte SPA, so
// any element it renders (including a hook element like udpTimerSpan above)
// doesn't exist until well after DOMContentLoaded, and waiting for that
// event to look it up once silently misses the mount.
document.addEventListener('racePhaseEntered', (event: any) => {
    ipcRenderer.send('racePhaseEntered', event.detail);
});
