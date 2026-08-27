import { startUdpTimerListener } from './udpTimerListener';

function udpInit() {
    startUdpTimerListener({
        onReading: (reading) => {
            const udpTimerSpan = document.getElementById('udpTimerSpan');
            if (!udpTimerSpan) {
                console.log('cannot find transport element!');
                return;
            }
            console.log(`server sending ${JSON.stringify(reading)} via ${udpTimerSpan}`);
            const event = new CustomEvent('udpTimer', { detail: JSON.stringify(reading) });
            udpTimerSpan.dispatchEvent(event);

            //eWindow.webContents.send('targetPriceVal', msg)
        },
    });
}
udpInit();
