const { BrowserWindow } = require('electron');
const path = require('path');
import { startUdpTimerListener } from './udpTimerListener';

export interface CreateMainWindowOptions {
    url: string;
    show?: boolean;
    startUdpListener?: boolean;
}

export function createMainWindow(options: CreateMainWindowOptions): any {
    const { url, show = true, startUdpListener = true } = options;

    const eWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show,
        webPreferences: {
            // __dirname (not app.getAppPath()) - stays correct relative to this
            // compiled file whether running from out/electron/ in dev or from
            // inside a packaged app.asar, where getAppPath() is the asar root.
            preload: path.join(__dirname, 'preload.js'),
            sandbox: true,
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // hide the default menu bar that comes with the browser window
    eWindow.setMenuBarVisibility(false);

    if (startUdpListener) {
        // Runs in the main process, which has unrestricted Node access regardless
        // of renderer/preload sandboxing; relayed to the page over IPC.
        startUdpTimerListener({
            onReading: (reading) => {
                eWindow.webContents.send('udpTimer', reading);
            },
        });
    }

    eWindow.loadURL(url);

    return eWindow;
}
