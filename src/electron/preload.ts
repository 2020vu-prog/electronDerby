const { ipcRenderer } = require('electron');

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
