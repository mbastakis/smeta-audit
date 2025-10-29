# GitHub Codespaces Setup Guide

This guide explains how to run the SMETA Compliance Platform in GitHub Codespaces.

## 🚀 Quick Start

### 1. Open in Codespaces

1. Go to your GitHub repository: `https://github.com/mbastakis/smeta-audit`
2. Click the green **Code** button
3. Select **Codespaces** tab
4. Click **Create codespace on master** (or open existing one)

### 2. Install Dependencies

Once your Codespace opens, run:

```bash
# Install all dependencies (root, frontend, backend)
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

Or use the shortcut:
```bash
npm run install:all
```

### 3. Start Development Servers

You need **two terminals** in Codespaces:

#### Terminal 1 - Backend Server
```bash
npm run dev:backend
```

Expected output:
```
✓ Database initialized
✓ Server running on http://localhost:5000
✓ Environment: development
✓ CORS enabled for development (localhost + Codespaces)
```

#### Terminal 2 - Frontend Server
```bash
npm run dev:frontend
```

Expected output:
```
VITE v5.x.x  ready in X ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### 4. Access the Application

When the frontend starts, Codespaces will show a notification:

> "Your application running on port 3000 is available"

Click **Open in Browser** or **Open in Preview**

The application will open at: `https://[your-codespace-name].app.github.dev`

---

## 🔧 How It Works

### Port Forwarding

Codespaces automatically forwards ports:
- **Port 5000** - Backend API (private by default)
- **Port 3000** - Frontend (public)

You can check forwarded ports in the **PORTS** tab at the bottom of VS Code.

### CORS Configuration

The backend is configured to accept requests from:
- ✅ `http://localhost:3000` - Local development
- ✅ `http://localhost:5173` - Vite default port
- ✅ `https://*.github.dev` - GitHub Codespaces
- ✅ `https://*.app.github.dev` - Codespaces app URLs
- ✅ `https://*.githubpreview.dev` - Codespaces preview

### API Proxy

The frontend uses Vite's proxy feature to forward API requests:

```
Frontend: https://[codespace].app.github.dev
↓
Request: https://[codespace].app.github.dev/api/documents
↓
Vite Proxy forwards to: http://localhost:5000/api/documents
↓
Backend: http://localhost:5000
```

This means:
- Frontend always uses **relative URLs** (`/api/...`)
- Vite proxy handles forwarding to backend
- No CORS issues!

---

## 🐛 Troubleshooting

### Issue: "Network Error" or "Connection Refused"

**Cause:** Backend server not running

**Solution:**
1. Check Terminal 1 - is the backend running?
2. Look for: `✓ Server running on http://localhost:5000`
3. If not running, restart: `npm run dev:backend`

---

### Issue: "CORS Error" despite fixes

**Cause:** Old frontend build cached or backend not restarted

**Solution:**
```bash
# Stop both servers (Ctrl+C in both terminals)

# Rebuild backend
cd backend
npm run build
cd ..

# Restart backend
npm run dev:backend

# In second terminal, restart frontend
npm run dev:frontend
```

---

### Issue: "Cannot find module 'react'"

**Cause:** Dependencies not installed properly

**Solution:**
```bash
# Clean install
rm -rf node_modules frontend/node_modules backend/node_modules
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

---

### Issue: Port 3000 or 5000 already in use

**Cause:** Previous server still running

**Solution:**
```bash
# Find and kill processes
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9

# Restart servers
npm run dev:backend   # Terminal 1
npm run dev:frontend  # Terminal 2
```

---

### Issue: Frontend shows but API calls fail

**Cause:** Ports not properly forwarded or backend crashed

**Solution:**

1. **Check PORTS tab** (bottom panel in VS Code)
   - Should show port 3000 (public) and 5000 (private)
   - Both should be green (running)

2. **Check backend logs** (Terminal 1)
   - Look for errors
   - Verify it says "Server running on http://localhost:5000"

3. **Test backend directly**:
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"healthy","timestamp":"...","uptime":...}`

4. **Check browser console** (F12)
   - Look for network errors
   - Check if requests are going to `/api/...` (good) or `http://localhost:5001` (bad)

---

## 📝 Environment Variables

Codespaces supports environment variables for customization:

### Option 1: Create `.env` file (local to Codespace)

```bash
# In root directory
cat > .env << EOF
PORT=5000
NODE_ENV=development
CORS_ORIGIN=https://your-codespace.app.github.dev
EOF
```

### Option 2: Set in Codespace settings

1. Go to GitHub repository Settings
2. Secrets and variables → Codespaces
3. Add variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `development`

---

## 🎯 Useful Commands

### Start Both Servers at Once
```bash
npm run dev
```
This runs backend and frontend in parallel (may be hard to read logs)

### Build for Production
```bash
npm run build
```
Builds both frontend and backend

### Run Tests
```bash
npm test
```
Runs frontend tests with Vitest

### Check TypeScript Compilation
```bash
npm run check
```
Type-checks both frontend and backend without building

---

## 🔒 Security Notes

### Data Persistence

Data stored in Codespaces is:
- ✅ Persistent during the Codespace lifetime
- ✅ Located in `data/` directory (gitignored)
- ⚠️ **Lost when Codespace is deleted**

**Recommendation:** For important data, periodically:
1. Download `data/smeta.db` (SQLite database)
2. Download `data/uploads/` directory (document files)

### Port Visibility

By default:
- **Port 3000** (frontend) - **Public** (anyone can access)
- **Port 5000** (backend) - **Private** (only you can access)

To change port visibility:
1. Go to **PORTS** tab
2. Right-click port
3. Select **Port Visibility**
4. Choose **Public** or **Private**

---

## 🎨 Development Tips

### Use Multiple Terminals

Codespaces supports multiple terminals:
1. Click **+** in terminal panel
2. Or use: `Ctrl+Shift+` ` (backtick)

### Hot Reload

Both servers support hot reload:
- **Frontend**: Changes reload instantly (Vite HMR)
- **Backend**: Restart required (or use `nodemon`)

### VS Code Extensions

Recommended extensions (auto-install via `.devcontainer`):
- ESLint - Linting
- Prettier - Code formatting
- Thunder Client - API testing

---

## 📚 Additional Resources

- [Vite Proxy Documentation](https://vitejs.dev/config/server-options.html#server-proxy)
- [GitHub Codespaces Docs](https://docs.github.com/en/codespaces)
- [Express CORS Configuration](https://expressjs.com/en/resources/middleware/cors.html)

---

## ✅ Success Checklist

You know everything is working when:

- [ ] Backend terminal shows: `✓ Server running on http://localhost:5000`
- [ ] Frontend terminal shows: `➜  Local:   http://localhost:3000/`
- [ ] Ports 3000 and 5000 show as **green** in PORTS tab
- [ ] Application opens in browser without errors
- [ ] Dashboard loads and shows document counts
- [ ] No CORS errors in browser console (F12)
- [ ] Can upload documents successfully

---

**Need help?** Check the troubleshooting section or open an issue on GitHub!
