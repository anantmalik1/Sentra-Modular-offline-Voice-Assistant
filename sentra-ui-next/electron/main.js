const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec, spawn } = require('child_process');

let mainWindow = null;
let pyProcess = null;

// App name mapping for Windows commands/protocols
const APP_LAUNCH_MAP = {
  whatsapp: 'start whatsapp:',
  spotify: 'start spotify:',
  chrome: 'start chrome',
  googlechrome: 'start chrome',
  notepad: 'notepad',
  calculator: 'calc',
  calc: 'calc',
  vscode: 'code',
  code: 'code',
  terminal: 'wt',
  powershell: 'powershell',
  cmd: 'cmd',
  explorer: 'explorer',
  settings: 'start ms-settings:',
  paint: 'mspaint',
};

function startPythonSidecar() {
  const pyScript = path.join(__dirname, '..', 'python', 'app.py');
  try {
    console.log('[SENTRA Electron] Spawning Python WhatsApp sidecar:', pyScript);
    pyProcess = spawn('python', [pyScript], {
      detached: false,
      stdio: 'pipe',
    });

    if (pyProcess.stdout) {
      pyProcess.stdout.on('data', (data) => {
        console.log(`[Python Sidecar]: ${data.toString().trim()}`);
      });
    }

    if (pyProcess.stderr) {
      pyProcess.stderr.on('data', (data) => {
        console.warn(`[Python Sidecar ERR]: ${data.toString().trim()}`);
      });
    }

    pyProcess.on('error', (err) => {
      console.error('[SENTRA Electron] Failed to spawn Python sidecar process:', err.message);
    });

    pyProcess.on('exit', (code, signal) => {
      console.log(`[SENTRA Electron] Python sidecar exited with code ${code}, signal ${signal}`);
    });
  } catch (err) {
    console.error('[SENTRA Electron] Error launching Python sidecar:', err);
  }
}

function stopPythonSidecar() {
  if (pyProcess) {
    console.log('[SENTRA Electron] Terminating Python sidecar process...');
    try {
      if (process.platform === 'win32') {
        exec(`taskkill /pid ${pyProcess.pid} /T /F`, () => {});
      } else {
        pyProcess.kill('SIGTERM');
      }
    } catch (e) {
      console.error('[SENTRA Electron] Error terminating Python sidecar:', e);
    }
    pyProcess = null;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#070b14',
    title: 'SENTRA // Autonomous Strategic Operations HUD',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  });

  const devUrl = 'http://localhost:3000';
  mainWindow.loadURL(devUrl).catch(() => {
    // If not immediately available, retry once after short delay
    setTimeout(() => {
      mainWindow.loadURL(devUrl).catch((err) => {
        console.error('[SENTRA Electron] Failed to load dashboard URL:', err);
      });
    }, 2000);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ---------------- IPC HANDLERS ----------------

// 1. open-app handler
ipcMain.handle('open-app', async (event, rawAppName) => {
  if (!rawAppName || typeof rawAppName !== 'string') {
    return { success: false, error: 'Invalid application identifier' };
  }

  const appKey = rawAppName.trim().toLowerCase().replace(/\s+/g, '');
  const cmd = APP_LAUNCH_MAP[appKey] || `start "" "${rawAppName.trim()}"`;

  console.log(`[SENTRA Electron IPC] open-app: key='${appKey}' -> command='${cmd}'`);

  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(`[SENTRA Electron IPC] Command failed: ${error.message}`);
        resolve({
          success: false,
          error: error.message,
          message: `Unable to open '${rawAppName}'. Verify the application is installed on your Windows system.`,
        });
      } else {
        resolve({
          success: true,
          message: `Launched ${rawAppName}`,
        });
      }
    });
  });
});

// 2. open-website handler
ipcMain.handle('open-website', async (event, url) => {
  if (!url || typeof url !== 'string') {
    return { success: false, error: 'Invalid URL provided' };
  }
  let targetUrl = url.trim();
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = `https://${targetUrl}`;
  }

  try {
    console.log(`[SENTRA Electron IPC] open-website: ${targetUrl}`);
    await shell.openExternal(targetUrl);
    return { success: true, message: `Opened ${targetUrl} in external browser` };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// 3. play-song handler
ipcMain.handle('play-song', async (event, songName) => {
  if (!songName || typeof songName !== 'string') {
    return { success: false, error: 'Missing song query' };
  }

  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(songName.trim())}`;
  try {
    console.log(`[SENTRA Electron IPC] play-song: ${ytUrl}`);
    await shell.openExternal(ytUrl);
    return { success: true, message: `Playing '${songName}' on YouTube in default browser` };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// 4. send-whatsapp handler (makes HTTP POST request to Python sidecar)
ipcMain.handle('send-whatsapp', async (event, phone, message) => {
  if (!phone || !message) {
    return { success: false, error: 'Missing required parameters: phone, message' };
  }

  console.log(`[SENTRA Electron IPC] send-whatsapp to ${phone}: ${message}`);

  try {
    const response = await fetch('http://127.0.0.1:5001/send-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, message }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return { success: false, error: `Sidecar error: ${errText}` };
    }

    const resJson = await response.json();
    return { success: true, message: resJson.message || `Dispatched WhatsApp directive to ${phone}` };
  } catch (fetchErr) {
    console.warn(`[SENTRA Electron IPC] WhatsApp sidecar unreachable: ${fetchErr.message}`);
    // Fallback: If Python sidecar is not running, open wa.me URL directly in browser
    const fallbackUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    await shell.openExternal(fallbackUrl);
    return {
      success: true,
      message: `Python sidecar offline; opened WhatsApp Web URL for ${phone} directly`,
      fallback: true,
    };
  }
});

// ---------------- APP LIFECYCLE ----------------

app.whenReady().then(() => {
  startPythonSidecar();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopPythonSidecar();
});
