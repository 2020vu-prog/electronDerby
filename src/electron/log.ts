const fs = require('fs');
const path = require('path');
const { app } = require('electron');

function getLogFile(): string {
    const dir = app.getPath('logs');
    fs.mkdirSync(dir, { recursive: true });
    return path.join(dir, 'main.log');
}

export function log(...args: unknown[]): void {
    const line = `[${new Date().toISOString()}] ${args.map(String).join(' ')}`;
    console.log(line);
    try {
        fs.appendFileSync(getLogFile(), line + '\n');
    } catch (err) {
        console.log('log() failed to write file:', err);
    }
}
