// CommonJS modules
const { app, BrowserWindow, Tray } = require('electron');
const path = require('path')

// createWindow loads index.html
const createWindow = () => {
    const win = new BrowserWindow({
      width: 1200,
      height: 900,
      frame: 'false',
      titleBarStyle: 'hidden',
      resizable: 'false',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false
      }
    })
    win.loadFile('index.html')
  }
// Needs ready event; This resolves promise
  app.whenReady().then(() => {
    createWindow()
  })
// windows/linux quit when window closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
