/**
    * Instant Markup v0.1.1-beta
    *
    * Copyright (c) 2016 mkv27
    * MIT Licensed
 */

'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ApplyMenus = require('./main/menus-manager');

let mainWindow;

function createWindow () {
  
  mainWindow = new BrowserWindow({
    width: 600,
    height: 336,
    'titleBarStyle':'hidden-inset',
    resizable: false,
    y: 180,
    backgroundColor: '#E6F8F8F8'
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
    app.quit();
  });

  //
  ApplyMenus();

}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
