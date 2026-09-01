const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
import { getUdpDestination, setUdpDestination, UdpDestination } from './udpDestinationConfig';
import { log } from './log';

let dialogWindow: any = null;
let ipcRegistered = false;

function buildHtml(): string {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>UDP Destination</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 16px; margin: 0; }
  label { display: block; margin-top: 10px; font-size: 13px; }
  input { width: 100%; box-sizing: border-box; padding: 5px; margin-top: 4px; font-size: 13px; }
  .buttons { margin-top: 18px; text-align: right; }
  button { margin-left: 8px; padding: 4px 12px; }
</style>
</head>
<body>
  <label>Host / IP
    <input id="host" type="text" placeholder="192.168.1.50">
  </label>
  <label>Port
    <input id="port" type="number" min="1" max="65535" placeholder="41234">
  </label>
  <div class="buttons">
    <button id="cancel">Cancel</button>
    <button id="save">Save</button>
  </div>
  <script>
    window.udpDestinationApi.getCurrent().then((dest) => {
      document.getElementById('host').value = dest.host || '';
      document.getElementById('port').value = dest.port || '';
    });
    document.getElementById('cancel').addEventListener('click', () => window.udpDestinationApi.cancel());
    document.getElementById('save').addEventListener('click', () => {
      const host = document.getElementById('host').value.trim();
      const port = parseInt(document.getElementById('port').value, 10);
      window.udpDestinationApi.save(host, port);
    });
  </script>
</body>
</html>`;
}

export function registerUdpDestinationIpc(): void {
    if (ipcRegistered) {
        return;
    }
    ipcRegistered = true;

    ipcMain.handle('udpDestination:get', () => getUdpDestination());

    ipcMain.on('udpDestination:save', (_event: any, destination: UdpDestination) => {
        const port = Number(destination && destination.port);
        const host = destination && typeof destination.host === 'string' ? destination.host.trim() : '';
        if (!host || !Number.isFinite(port) || port <= 0 || port > 65535) {
            log('udpDestination:save rejected invalid destination', JSON.stringify(destination));
            return;
        }
        setUdpDestination({ host, port });
        if (dialogWindow) {
            dialogWindow.close();
        }
    });

    ipcMain.on('udpDestination:cancel', () => {
        if (dialogWindow) {
            dialogWindow.close();
        }
    });
}

export function openUdpDestinationDialog(parent: any): void {
    if (dialogWindow) {
        dialogWindow.focus();
        return;
    }

    dialogWindow = new BrowserWindow({
        width: 360,
        height: 230,
        parent,
        modal: true,
        show: false,
        resizable: false,
        minimizable: false,
        maximizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'udpDestinationDialogPreload.js'),
            sandbox: true,
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    dialogWindow.setMenuBarVisibility(false);
    dialogWindow.once('ready-to-show', () => dialogWindow.show());
    dialogWindow.on('closed', () => {
        dialogWindow = null;
    });
    dialogWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(buildHtml()));
}
