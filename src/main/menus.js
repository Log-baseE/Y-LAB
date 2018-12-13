const {
  dialog,
  Menu,
  BrowserWindow,
  shell,
} = require('electron');

const fs = require('fs');

class Mainmenu {
  /**
   * 
   * @param {BrowserWindow} window 
   */
  constructor(window) {
    this.window = window;
    this.template = [
      {
        label: 'File',
        submenu: [
          { label: 'Open video', click: this.onMenuClickOpenVideo.bind(this), accelerator: 'CmdOrCtrl+O' },
          { type: 'separator' },
          { role: 'quit' },
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'zoomIn', accelerator: 'CmdOrCtrl+='},
          { role: 'zoomOut', accelerator: 'CmdOrCtrl+-' },
        ]
      },
      {
        role: 'help',
        submenu: [
          { label: 'Quick manual', click: this.onMenuClickQuickManual.bind(this) },
          { label: 'Documentation', click: this.onMenuClickDocumentation.bind(this) },
          { label: 'Replay tutorial', click: this.onMenuClickReplayTutorial.bind(this) },
          { type: 'separator' },
          { role: 'toggleDevTools', accelerator: '' },
          { label: 'Report errors', click: this.onMenuClickReportErrors.bind(this) },
          { type: 'separator' },
          { label: 'About', click: this.onMenuClickAbout.bind(this) },
        ]
      }
    ];
  }
  

  getTemplate() {
    return this.template;
  }

  onMenuClickOpenVideo() {
    dialog.showOpenDialog(
      {
        filters: [{ name: "MP4 video", extensions: ["mp4"] }]
      },
      fileNames => {
        if(fileNames === undefined)
          return;
        
        let filepath = fileNames[0];
        this.window.webContents.send('open-video', {
          path: filepath,
          size: fs.statSync(filepath).size
        });
      }
    );
  }
  
  onMenuClickQuickManual() {
    
  }
  
  onMenuClickDocumentation() {
    shell.openExternal('https://github.com/Log-baseE/Y-LAB/');
  }
  
  onMenuClickReplayTutorial() {
    this.window.webContents.send('replay-tutorial');
  }
  
  onMenuClickReportErrors() {
    shell.openExternal('https://github.com/Log-baseE/Y-LAB/issues/new')
  }
  
  onMenuClickAbout() {
    dialog.showMessageBox({
      type: 'info',
      title: 'About',
      message: 'About message',
    })
  }
}

module.exports = Mainmenu;