const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;
let serverReady = false;

// Start Express backend server
function startBackend() {
  return new Promise((resolve, reject) => {
    const serverPath = path.join(__dirname, '../backend/dist/server.js');
    
    console.log('Starting backend server from:', serverPath);
    
    serverProcess = spawn('node', [serverPath], {
      env: { 
        ...process.env, 
        NODE_ENV: 'production', 
        PORT: '5001',
        ELECTRON: 'true' 
      },
      stdio: 'inherit'
    });

    serverProcess.on('error', (error) => {
      console.error('Failed to start server:', error);
      reject(error);
    });

    serverProcess.on('exit', (code, signal) => {
      console.log(`Server process exited with code ${code} and signal ${signal}`);
    });

    // Give server time to start
    setTimeout(() => {
      console.log('Backend server started on port 5001');
      serverReady = true;
      resolve();
    }, 3000);
  });
}

// Create the main application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    title: 'SMETA Compliance Platform',
    icon: path.join(__dirname, 'icons/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true,
    show: false, // Don't show until ready
  });

  // Show window when ready to avoid flickering
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the React app
  mainWindow.loadURL('http://localhost:5001');

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Handle navigation errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
    if (!serverReady) {
      console.log('Server not ready yet, retrying in 2 seconds...');
      setTimeout(() => {
        mainWindow.reload();
      }, 2000);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(async () => {
  try {
    console.log('Starting SMETA Compliance Platform...');
    await startBackend();
    createWindow();
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  // Kill backend server when app closes
  if (serverProcess) {
    console.log('Shutting down backend server...');
    serverProcess.kill('SIGTERM');
    
    // Force kill after 3 seconds if still running
    setTimeout(() => {
      if (serverProcess) {
        serverProcess.kill('SIGKILL');
      }
    }, 3000);
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null && serverReady) {
    createWindow();
  }
});

// Handle app quit
app.on('before-quit', (event) => {
  if (serverProcess && !serverProcess.killed) {
    event.preventDefault();
    console.log('Cleaning up before quit...');
    serverProcess.kill('SIGTERM');
    
    setTimeout(() => {
      app.exit(0);
    }, 1000);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

console.log('Electron main process started');
