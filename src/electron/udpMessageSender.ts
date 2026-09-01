import * as dgram from 'dgram';

// Deliberately has no dependency on 'electron' (directly or transitively) -
// merely importing this file must not trigger Electron's binary
// download/resolution, since test files import it standalone and Node runs
// test files concurrently: racing that resolution against the real Electron
// process electronBoot.test.js spawns corrupts the shared binary and makes
// that spawn silently return no output.
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
