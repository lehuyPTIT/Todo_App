const electron = require('electron');
const { app, BrowserWindow,ipcMain } = require('electron');
let win;

ipcMain.on('send-email', (event, arg) => {
    console.log(arg) // prints "ping"
    if(arg){
        let child = new BrowserWindow({ parent: win, modal: true, show: false ,webPreferences:{nodeIntegration:true}})
        child.loadFile('sendEmail.html');
        child.once('ready-to-show', () => {
        child.show()
        // child.webContents.openDevTools();
})
    }
  })
function createWindow() {
    // Create the browser window.
        win = new BrowserWindow({
        width: 800,
        height: 600,
        maxWidth: 800,
        maxHeight:600,
        minHeight:600,
        minWidth:800,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    win.loadFile('index.html');

    // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})