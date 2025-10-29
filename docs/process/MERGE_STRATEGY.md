# Merge Strategy: Electron-app → Master

## 📊 Current Status

### Branches
- **master**: Main development branch with latest features
- **electron-app**: Worktree branch at same commit (7e6f51f), but with Electron-specific modifications

### What's Different

#### ✅ Safe to Merge (Improvements to Master)

**1. backend/src/app.ts - Electron Compatibility**
```typescript
// Electron version adds:
- Environment detection (isElectron, isProduction)
- Conditional CORS (disabled in Electron/production)
- Static file serving for frontend (Electron mode)
- SPA fallback routing
```

**2. Missing kpiRoutes import**
- Master has: `import kpiRoutes from './routes/kpis.js';`
- Electron doesn't have this yet

**3. Both have PDF.js worker fix** ✅

#### ⚠️ Potential Issues if We Merge

**1. Web Development Mode**
- Electron version disables CORS in production
- Master always enables CORS
- **Impact**: Could break web dev mode if not careful

**2. Frontend serving**
- Electron serves static frontend files
- Master expects separate frontend dev server
- **Impact**: Need to preserve dev mode behavior

## 🎯 Recommended Approach: **UNIFIED CODE**

Instead of keeping separate branches, unify them with environment detection:

### Strategy: Merge Best of Both

```typescript
// Unified backend/src/app.ts
export function createApp(): Express {
  const app = express();

  // Environment detection
  const isElectron = process.env.ELECTRON === 'true' || !!process.versions?.electron;
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = !isProduction && !isElectron;

  // CORS - only in development web mode
  if (isDevelopment) {
    app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true
    }));
  }

  // ... middleware ...

  // PDF.js worker (both modes need this)
  const pdfjsDistPath = path.join(__dirname, '../../node_modules/pdfjs-dist/build');
  app.use('/pdfjs', express.static(pdfjsDistPath));

  // API routes (same for both)
  app.use('/api', healthRoutes);
  app.use('/api/documents', documentRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/capas', capaRoutes);
  app.use('/api/kpis', kpiRoutes);  // Don't forget this!

  // Static frontend serving (Electron/production only)
  if (isElectron || isProduction) {
    const frontendDistPath = path.join(__dirname, '../../frontend/dist');
    app.use(express.static(frontendDistPath));
    
    // SPA fallback
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
  } else {
    // Development 404 handler
    app.use((req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });
  }

  // Error handler
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: isDevelopment ? err.message : undefined
    });
  });

  return app;
}
```

## 🚀 Merge Steps

### Option 1: Manual Merge (Safest, Recommended)

1. **Update master backend/src/app.ts with unified code**
2. **Test web dev mode**: `cd backend && npm start` + `cd frontend && npm run dev`
3. **Test electron mode**: Rebuild and launch electron
4. **Commit to master**
5. **Delete electron-app branch** (no longer needed)
6. **Remove worktree**: `git worktree remove /Users/.../marvie-smeta-electron`

### Option 2: Git Merge

```bash
# Backup first!
git checkout master
git branch backup-master

# Merge electron-app
git merge electron-app

# Resolve conflicts manually
# - Keep environment detection from electron-app
# - Keep kpiRoutes from master
# - Combine both approaches

git commit -m "feat: merge Electron compatibility into master"
```

## ✅ Testing Checklist After Merge

- [ ] **Web Dev Mode**: Backend + Frontend dev servers work
- [ ] **Web Production**: `npm run build` works
- [ ] **Electron Dev**: Launches and works
- [ ] **Electron Build**: Creates distributable
- [ ] **PDF Viewer**: Works in both web and Electron
- [ ] **CORS**: Enabled in web dev, disabled in Electron
- [ ] **API routes**: All endpoints accessible
- [ ] **KPI routes**: Don't get lost in merge

## 💡 My Recommendation

**Don't merge branches - UPDATE MASTER directly** with the unified code approach:

1. Copy the unified `app.ts` code to master
2. Test thoroughly
3. Delete the electron-app branch once confirmed working
4. Keep one codebase that works for both web and Electron

This way you:
- ✅ Avoid merge conflicts
- ✅ Keep git history clean
- ✅ Have one source of truth
- ✅ Environment-based behavior is explicit

## 🎯 Want me to do this now?

I can:
1. Update master's `backend/src/app.ts` with unified code
2. Test it works
3. Provide commands to clean up the worktree

**Would you like me to proceed with the unified approach?**
