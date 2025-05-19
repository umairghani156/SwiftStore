const { app, BrowserWindow, Tray, Menu, dialog, nativeImage, ipcMain } = require('electron');
const path = require('path');

let tray = null;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // ⚠️ for basic testing only; use preload in production
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  const base64Icon = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB7ElEQVRYR+2XPU8CQRCFz7sAQAGxAQ0BDYEDiQNAA8iAcAA1QA5gAzQA9kAzQA94F2ABMQWq6quTnvU3sZ+d8cWcva3S9umSXL0l9Nk4P5A9Ab2tgNuRETrgDJ4FGngl+k2XgJPhCvAf4F1WEmoB94AGeDMSVndKIgEdA5h8+YjsFXDU+8RO8MoGAzLZo+LfWyKfEqEvNHZCu2jsOZgkqVevAkcoDeIUzC3B9A23eRzAuqvAzAKnpr8GlQzZ3QaOvb0r2QC/AxVvYGYAK8Fw0FvRjYDEO0QJMjOBow3o5B7xHJMSHqge8GBfAE8iV9rLygUWAexAa7uDCMvwYcHfpDK5U0Vt1rH3gaHQJd2VTeLYQAKZGxQJNVcDnZZF0iATq2NBJS1Fv2+gyVYPzzDc2WZ5+3EnGc9UPIRzP9gjgMXoDW1V5CKAo3A37l/Wq5PgWXYDAuFb43mkkdApch+eyyOE+xX9wAAAABJRU5ErkJggg==';
  const icon = nativeImage.createFromDataURL(`data:image/png;base64,${base64Icon}`);

  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open App', click: () => { mainWindow.show(); } },
    { label: 'Select Video', click: selectVideoFile },
    { type: 'separator' },
    { label: 'Quit', click: () => { app.quit(); } }
  ]);

  tray.setToolTip('Subtitle Overlay Tool');
  tray.setContextMenu(contextMenu);

  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', (event) => {
    console.log('close');
  });
});

// IPC from renderer (index.html)
ipcMain.on('open-video-dialog', () => {
  selectVideoFile();
});

// Select video file
function selectVideoFile() {
  const files = dialog.showOpenDialogSync({
    properties: ['openFile'],
    filters: [{ name: 'Videos', extensions: ['mp4', 'mkv', 'avi', 'mov'] }]
  });

  if (files && files.length > 0) {
    console.log('Selected video file:', files[0]);
    // future: Whisper integration here
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
