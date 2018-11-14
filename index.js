const electron = require('electron');
const url = require('url');
const path = require('path');
//const sass = require('electron-middle-sass');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

function createWindow () {
    //create new window
    mainWindow = new BrowserWindow({
        icon: path.join(__dirname, 'res/icon/png/car.png'),
        show: false
    })
    mainWindow.maximize()
    mainWindow.setResizable(false)

    //Load HTML into window
    mainWindow.loadURL(url.format({
        pathname:path.join(__dirname, 'video.html'),
        protocol:'file',
        slashes: true
    }))

    // Show the mainwindow when it is loaded and ready to show
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    require('./res/js/menu/menu')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)