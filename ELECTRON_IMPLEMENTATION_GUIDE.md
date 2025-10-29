# Electron Desktop App Implementation Guide

## Overview
This guide shows how to convert the SMETA Compliance Platform into an Electron desktop application in the separate worktree at `/Users/mbastakis/dev/personal/marvie-smeta-electron`.

## Benefits
- ✅ Single-click launch (no terminal, no browser)
- ✅ Native app experience on macOS, Windows, Linux
- ✅ Professional appearance with app icon
- ✅ Easy distribution (.dmg, .exe, .AppImage)
- ✅ Minimal code changes (existing app 90% compatible)

---

## Step 1: Install Electron Dependencies

```bash
cd /Users/mbastakis/dev/personal/marvie-smeta-electron
npm install --save-dev electron electron-builder
```

---

## Step 2: Create Electron Main Process

**File: `electron/main.js`**

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

// Start Express backend server
function startBackend() {
  return new Promise((resolve, reject) => {
    const serverPath = path.join(__dirname, '../backend/dist/server.js');
    
    serverProcess = spawn('node', [serverPath], {
      env: { ...process.env, NODE_ENV: 'production', PORT: '5001' },
      stdio: 'inherit'
    });

    serverProcess.on('error', (error) => {
      console.error('Failed to start server:', error);
      reject(error);
    });

    // Give server time to start
    setTimeout(() => {
      console.log('Backend server started on port 5001');
      resolve();
    }, 2000);
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
    autoHideMenuBar: true, // Hide menu for cleaner UI
  });

  // Load the React app
  mainWindow.loadURL('http://localhost:5001');

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(async () => {
  try {
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
    serverProcess.kill();
  }
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle app quit
app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
```

---

## Step 3: Create Preload Script

**File: `electron/preload.js`**

```javascript
// Preload script for security
// Currently minimal, can be extended for IPC if needed

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  isElectron: true
});
```

---

## Step 4: Update Package.json

**File: `package.json` (root)**

Add these sections:

```json
{
  "name": "smeta-compliance-platform",
  "version": "1.0.0",
  "description": "SMETA Compliance Documentation Platform",
  "main": "electron/main.js",
  "scripts": {
    "start": "electron .",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "dist": "npm run build && electron-builder",
    "dist:mac": "npm run build && electron-builder --mac",
    "dist:win": "npm run build && electron-builder --win",
    "dist:linux": "npm run build && electron-builder --linux"
  },
  "build": {
    "appId": "com.smeta.compliance",
    "productName": "SMETA Compliance Platform",
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "electron/**/*",
      "frontend/dist/**/*",
      "backend/dist/**/*",
      "backend/uploads/**/*",
      "data/**/*",
      "node_modules/**/*"
    ],
    "mac": {
      "category": "public.app-category.business",
      "icon": "electron/icons/icon.icns",
      "target": ["dmg", "zip"]
    },
    "win": {
      "icon": "electron/icons/icon.ico",
      "target": ["nsis", "portable"]
    },
    "linux": {
      "icon": "electron/icons/icon.png",
      "target": ["AppImage", "deb", "rpm"],
      "category": "Office"
    }
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.9.1"
  }
}
```

---

## Step 5: Create App Icons

Create icons directory: `electron/icons/`

You'll need three icon formats:
- **icon.png** (512x512) - Linux
- **icon.ico** - Windows (contains multiple sizes)
- **icon.icns** - macOS (contains multiple sizes)

Quick way to generate:
```bash
# Install icon converter tool
npm install -g electron-icon-maker

# Generate from single PNG
electron-icon-maker --input=path/to/icon.png --output=electron/icons
```

Or use online converters like:
- https://cloudconvert.com/png-to-ico
- https://cloudconvert.com/png-to-icns

---

## Step 6: Update Backend for Electron

**File: `backend/src/server.ts`**

Add Electron detection:

```typescript
// Detect if running in Electron
const isElectron = process.env.ELECTRON === 'true' || process.versions.electron;

// Disable CORS in Electron (not needed)
if (!isElectron) {
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }));
}

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production' || isElectron) {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));
  
  // SPA fallback - serve index.html for non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
}
```

---

## Step 7: Build and Test

```bash
cd /Users/mbastakis/dev/personal/marvie-smeta-electron

# Install dependencies
npm install

# Build frontend and backend
npm run build

# Test in development mode
npm start

# Build distributable (macOS)
npm run dist:mac
```

The distributable will be in `dist-electron/` folder.

---

## Step 8: Distribution

### macOS
- **File:** `dist-electron/SMETA Compliance Platform-1.0.0.dmg`
- **Install:** Drag to Applications folder
- **Run:** Double-click app icon

### Windows
- **File:** `dist-electron/SMETA Compliance Platform Setup 1.0.0.exe`
- **Install:** Run installer
- **Portable:** `dist-electron/SMETA Compliance Platform 1.0.0.exe` (no install)

### Linux
- **File:** `dist-electron/SMETA-Compliance-Platform-1.0.0.AppImage`
- **Run:** `chmod +x *.AppImage && ./SMETA-Compliance-Platform-1.0.0.AppImage`
- **Also available:** .deb, .rpm packages

---

## Testing Checklist

Before distributing:

- [ ] App launches successfully
- [ ] Backend server starts automatically
- [ ] Frontend loads without errors
- [ ] Document upload works
- [ ] PDF viewer works
- [ ] Search functionality works
- [ ] CAPA tracker works
- [ ] App closes cleanly (backend shuts down)
- [ ] Database persists between launches
- [ ] Uploaded files persist between launches

---

## File Size Expectations

- **Development:** App runs from source (~50MB)
- **Distributable:**
  - macOS .dmg: ~150-200MB
  - Windows .exe: ~150-200MB
  - Linux .AppImage: ~150-200MB

Size includes Electron runtime + Chromium + Node.js + your app.

---

## Advantages Over Shell Script

| Feature | Shell Script | Electron App |
|---------|-------------|--------------|
| User Experience | Terminal + Browser | Single app window |
| Startup | Multiple steps | Double-click icon |
| Professional Look | Basic | Native app |
| Distribution | Copy files | Installer/DMG |
| Cross-platform | Requires Node.js | Self-contained |
| Icon in Dock/Taskbar | Browser icon | Custom app icon |
| Menu/Shortcuts | Browser menus | Custom menus |
| Auto-updates | Manual | Can add auto-update |

---

## Next Steps

1. Follow steps 1-7 in the Electron worktree
2. Test thoroughly
3. If successful, merge electron-app branch to master
4. Build distributables for target platforms
5. Distribute via USB or cloud storage

---

## Rollback Plan

If Electron has issues:
1. Stay on master branch (shell script version)
2. Use shell script for audit
3. Polish Electron version later
4. Worktree keeps changes isolated

---

## Questions?

- **Q: Will this break the web version?**
  A: No, web version still works. Electron just adds another way to run it.

- **Q: Can I still use shell scripts?**
  A: Yes! Electron is additive. Backend can run standalone.

- **Q: What if I don't want Electron later?**
  A: Just delete the electron-app branch and worktree. No impact on master.

- **Q: How do I update the app later?**
  A: Rebuild with new code and redistribute. Can add auto-update feature.
