const { app, BrowserWindow } = require('electron');
const ipc = require('electron').ipcMain
const path = require('path');
import { startUdpTimerListener } from './udpTimerListener';

let eWindow:any=null;

app.on('ready', () => {
  // once electron has started up, create a window.
  eWindow = new BrowserWindow({ width: 800, height: 600 ,
    webPreferences: {
        preload: path.join(app.getAppPath(), 'preload.js')
    }

});

  // hide the default menu bar that comes with the browser window
  eWindow.setMenuBarVisibility(false);

  // Runs in the main process, which has unrestricted Node access regardless
  // of renderer/preload sandboxing; relayed to the page over IPC.
  startUdpTimerListener({
    onReading: (reading) => {
      eWindow.webContents.send('udpTimer', reading);
    },
  });

  // load a website to display
  //eWindow.loadURL(`https://www.google.com`);
  //eWindow.loadURL(`file://${__dirname}/../public/index.html`);

  //eWindow.loadURL('https://cf.derby.rr1.us');
  eWindow.loadURL('https://go.rr1.us');
  //eWindow.loadURL('http://0.0.0.0:8080');
  //eWindow.webContents.openDevTools()


});
