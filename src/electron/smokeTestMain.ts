const { app } = require('electron');
import { createMainWindow } from './createMainWindow';

app.on('ready', () => {
    const eWindow = createMainWindow({ url: 'about:blank', show: false, startUdpListener: false });
    let failed = false;

    eWindow.webContents.on('preload-error', (_event: any, preloadPath: string, error: Error) => {
        failed = true;
        console.error(`SMOKE_TEST_PRELOAD_ERROR: ${preloadPath}: ${error && error.message}`);
        app.exit(1);
    });

    eWindow.webContents.on('did-finish-load', () => {
        if (!failed) {
            console.log('SMOKE_TEST_OK');
            app.exit(0);
        }
    });

    setTimeout(() => {
        if (!failed) {
            console.error('SMOKE_TEST_TIMEOUT');
            app.exit(1);
        }
    }, 5000);
});
