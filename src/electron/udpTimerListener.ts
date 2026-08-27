import * as dgram from 'dgram';
import { parseTimerMessage, TimerReading } from './parseTimerMessage';

export interface UdpTimerListenerOptions {
    port?: number;
    onReading: (reading: TimerReading) => void;
    onInvalidMessage?: (raw: string) => void;
}

export function startUdpTimerListener(options: UdpTimerListenerOptions): dgram.Socket {
    const { port = 41234, onReading, onInvalidMessage } = options;
    const server = dgram.createSocket('udp4');

    server.on('error', (err: any) => {
        console.log(`server error:\n${err.stack}`);
        server.close();
    });

    server.on('message', (msg: any, rinfo: any) => {
        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
        const msgString = msg.toString('utf8');
        const reading = parseTimerMessage(msgString);
        if (!reading) {
            console.log(`invalid timer msg: ${msgString}`);
            onInvalidMessage?.(msgString);
            return;
        }
        onReading(reading);
    });

    server.on('listening', () => {
        const address = server.address();
        console.log(`server listening ${address.address}:${address.port}`);
    });

    server.bind(port);
    return server;
}
