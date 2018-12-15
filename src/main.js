const {
  app,
  BrowserWindow,
  Menu
} = require('electron');

const path = require('path');
const url = require('url');
const {
  is
} = require('electron-util');

const Mainmenu = require('./main/menus');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, splash;

const startUrl = process.env.ELECTRON_START_URL || url.format({
  pathname: path.join(__dirname, '/../build/index.html'),
  protocol: 'file:',
  slashes: true
});
// const startUrl = url.format({
//     pathname: path.join(__dirname, '/../main.html'),
//     protocol: 'file:',
//     slashes: true
// });

const splashUrl = url.format({
  pathname: path.join(__dirname, '../public/splash.html'),
  protocol: 'file:',
  slashes: true
});

function createLoadingScreen() {
  splash = new BrowserWindow({
    height: 300,
    width: 500,
    transparent: true,
    frame: false,
  })

  splash.loadURL(splashUrl);

  splash.on('closed', () => {
    splash = null
  })

  splash.webContents.on('did-finish-load', () => {
    splash.show();
    splash.setProgressBar(2);
    mainWindow.setProgressBar(2);
  })
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      webSecurity: !is.development
    },
    backgroundColor: '#272729',
    title: 'Y-LAB',
    show: false,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(startUrl);

  mainWindow.maximize();

  mainWindow.hide();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });

  mainWindow.once('ready-to-show', () => {
    splash.setProgressBar(-1);
    mainWindow.setProgressBar(-1);
    mainWindow.maximize();
  });

  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.show();

    if (splash) {
      splash.close();
    }
  });

  let mainMenu = new Mainmenu(mainWindow);

  const menu = Menu.buildFromTemplate(mainMenu.getTemplate());
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createLoadingScreen();
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})