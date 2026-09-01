const { ipcMain } = require('electron');
import { log } from './log';
import { getUdpDestination } from './udpDestinationConfig';
import { sendUdpMessage } from './udpMessageSender';

let ipcRegistered = false;

export function sendRacePhaseEnteredUdp(payloadJson: string): void {
    const destination = getUdpDestination();
    if (!destination.host) {
        log('sendRacePhaseEnteredUdp: no UDP destination configured, skipping', payloadJson);
        return;
    }
    log(`sendRacePhaseEnteredUdp: sent to ${destination.host}:${destination.port}`, payloadJson);
    sendUdpMessage(payloadJson, destination).catch((err) => {
        log('sendRacePhaseEnteredUdp: send failed', err && err.stack ? err.stack : err);
    });
}

// ipcMain is a process-global singleton, so this must run once per app
// lifetime, not once per window - createMainWindow() can run more than once
// (e.g. a macOS 'activate' recreating the window), and registering there
// would stack up duplicate listeners, each firing on every future event.
export function registerRacePhaseEnteredIpc(): void {
    if (ipcRegistered) {
        return;
    }
    ipcRegistered = true;

    ipcMain.on('racePhaseEntered', (_event: any, payloadJson: string) => {
        log('racePhaseEntered received', payloadJson);
        sendRacePhaseEnteredUdp(payloadJson);
    });
}
