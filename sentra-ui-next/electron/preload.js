const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openApp: (appName) => ipcRenderer.invoke('open-app', appName),
  openWebsite: (url) => ipcRenderer.invoke('open-website', url),
  sendWhatsApp: (phone, message) => ipcRenderer.invoke('send-whatsapp', phone, message),
  playSong: (songName) => ipcRenderer.invoke('play-song', songName),
  isElectron: true,
});
