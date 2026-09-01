const { app, Menu, dialog } = require('electron');
import { createMainWindow } from './createMainWindow';
import { log } from './log';
import { readGitBreadcrumb, formatGitBreadcrumb } from './gitBreadcrumb';
import { openUdpDestinationDialog, registerUdpDestinationIpc } from './udpDestinationDialog';
import { registerRacePhaseEnteredIpc } from './racePhaseUdpSender';

process.on('uncaughtException', (err) => log('uncaughtException', err && err.stack ? err.stack : err));
process.on('unhandledRejection', (reason) => log('unhandledRejection', reason));

log('app starting, version', app.getVersion(), 'electron', process.versions.electron, 'arch', process.arch);

function buildMenu(eWindow: any) {
    const isMac = process.platform === 'darwin';
    const template: any[] = [
        ...(isMac ? [{ role: 'appMenu' }] : []),
        {
            label: 'Info',
            submenu: [
                {
                    label: 'Show Git Breadcrumb',
                    click: () => {
                        dialog.showMessageBox({
                            type: 'info',
                            title: 'Git Breadcrumb',
                            message: formatGitBreadcrumb(readGitBreadcrumb()),
                        });
                    },
                },
            ],
        },
        {
            label: 'Settings',
            submenu: [
                {
                    label: 'Set UDP Destination…',
                    click: () => openUdpDestinationDialog(eWindow),
                },
            ],
        },
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.on('ready', () => {
  log('app ready');
  // once electron has started up, create a window.

  registerUdpDestinationIpc();
  registerRacePhaseEnteredIpc();

  // load a website to display
  //createMainWindow({ url: 'https://www.google.com' });
  //createMainWindow({ url: `file://${__dirname}/../public/index.html` });

  //createMainWindow({ url: 'https://cf.derby.rr1.us' });
  const eWindow = createMainWindow({ url: 'https://go.rr1.us' });
  //createMainWindow({ url: 'http://0.0.0.0:8080' });
  //eWindow.webContents.openDevTools()

  buildMenu(eWindow);
});
