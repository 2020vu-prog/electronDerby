const { BrowserWindow } = require('electron');
const path = require('path');
import { startUdpTimerListener } from './udpTimerListener';
import { log } from './log';

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

    log('createMainWindow: created, loading', url);
    eWindow.once('ready-to-show', () => log('ready-to-show'));
    eWindow.on('show', () =>
        log('window shown: visible=', eWindow.isVisible(), 'bounds=', JSON.stringify(eWindow.getBounds()))
    );
    eWindow.on('closed', () => log('window closed'));
    eWindow.webContents.on('did-finish-load', () => log('did-finish-load'));
    eWindow.webContents.on('did-fail-load', (_e: any, code: number, desc: string, failedUrl: string) =>
        log('did-fail-load', code, desc, failedUrl)
    );
    eWindow.webContents.on('render-process-gone', (_e: any, details: unknown) =>
        log('render-process-gone', JSON.stringify(details))
    );
    eWindow.webContents.on('unresponsive', () => log('renderer unresponsive'));
    eWindow.webContents.on('preload-error', (_e: any, preloadPath: string, error: Error) =>
        log('preload-error', preloadPath, error && error.message)
    );

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
