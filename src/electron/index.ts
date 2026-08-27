const { app } = require('electron');
import { createMainWindow } from './createMainWindow';

app.on('ready', () => {
  // once electron has started up, create a window.

  // load a website to display
  //createMainWindow({ url: 'https://www.google.com' });
  //createMainWindow({ url: `file://${__dirname}/../public/index.html` });

  //createMainWindow({ url: 'https://cf.derby.rr1.us' });
  const eWindow = createMainWindow({ url: 'https://go.rr1.us' });
  //createMainWindow({ url: 'http://0.0.0.0:8080' });
  //eWindow.webContents.openDevTools()
});
