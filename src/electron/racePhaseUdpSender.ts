import * as dgram from 'dgram';
import { log } from './log';
import { getUdpDestination } from './udpDestinationConfig';

export function sendUdpMessage(message: string, destination: { host: string; port: number }): Promise<void> {
    return new Promise((resolve, reject) => {
        const client = dgram.createSocket('udp4');
        client.send(Buffer.from(message, 'utf8'), destination.port, destination.host, (err: Error | null) => {
            client.close();
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function sendRacePhaseEnteredUdp(payloadJson: string): void {
    const destination = getUdpDestination();
    if (!destination.host) {
        log('sendRacePhaseEnteredUdp: no UDP destination configured, skipping', payloadJson);
        return;
    }
    sendUdpMessage(payloadJson, destination).catch((err) => {
        log('sendRacePhaseEnteredUdp: send failed', err && err.stack ? err.stack : err);
    });
}
