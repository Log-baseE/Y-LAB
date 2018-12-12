const {
  dialog,
  Menu,
  BrowserWindow,
  shell,
} = require('electron');

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
          { label: 'Open video', click: this.onMenuClickOpenVideo, accelerator: 'CmdOrCtrl+O' },
          { type: 'separator' },
          { role: 'quit' },
        ]
      },
      {
        role: 'help',
        submenu: [
          { label: 'Quick manual', click: this.onMenuClickQuickManual.bind(this) },
          { label: 'Documentation', click: this.onMenuClickDocumentation.bind(this) },
          { label: 'Replay tutorial', click: this.onMenuClickReplayTutorial.bind(this) },
          { type: 'separator' },
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