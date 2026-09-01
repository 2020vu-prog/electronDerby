const fs = require('fs');
const path = require('path');
const { app } = require('electron');
import { log } from './log';

export interface UdpDestination {
    host: string;
    port: number;
}

const DEFAULT_DESTINATION: UdpDestination = { host: '', port: 41234 };

function getConfigFile(): string {
    return path.join(app.getPath('userData'), 'udpDestination.json');
}

export function getUdpDestination(): UdpDestination {
    try {
        const raw = fs.readFileSync(getConfigFile(), 'utf8');
        const parsed = JSON.parse(raw);
        if (typeof parsed.host === 'string' && typeof parsed.port === 'number') {
            return parsed;
        }
    } catch (err) {
        // no config saved yet, or file unreadable/corrupt - use the default.
    }
    return { ...DEFAULT_DESTINATION };
}

export function setUdpDestination(destination: UdpDestination): void {
    fs.writeFileSync(getConfigFile(), JSON.stringify(destination), 'utf8');
    log('udpDestination set to', JSON.stringify(destination));
}
