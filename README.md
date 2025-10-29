# SMETA Compliance Platform

![Build Status](https://github.com/mbastakis/marvie-smeta/actions/workflows/electron-build.yml/badge.svg)

A full-stack desktop application for managing SMETA (Sedex Members Ethical Trade Audit) compliance documentation and Corrective and Preventive Actions (CAPAs).

## Overview

The SMETA Compliance Platform helps organizations:
- Manage compliance documents across 4 pillars + KPIs and CAPAs
- Track and manage Corrective and Preventive Actions
- Search and retrieve compliance documentation
- Monitor compliance status and metrics

## Prerequisites

- **Node.js 18+** (recommended: 18 LTS or higher)
- **npm** (comes with Node.js)

## Technology Stack

### Backend
- **Node.js** with Express 4.18+
- **TypeScript** for type safety
- **SQLite** with better-sqlite3 for database
- **Multer** for file upload handling
- **CORS** enabled for frontend communication

### Frontend
- **React 18.2+** with TypeScript
- **Vite 5.0+** as build tool and dev server
- **Material-UI 5.14+** for UI components
- **React Router 6.20+** for navigation
- **Axios 1.6+** for API communication

## Project Structure

```
smeta-platform/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── routes/         # API route definitions
│   │   ├── controllers/    # Request handlers
│   │   ├── database/       # Database connection and schema
│   │   ├── middleware/     # Express middleware
│   │   ├── app.ts         # Express app configuration
│   │   └── server.ts      # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── services/      # API client services
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── data/                   # SQLite database (gitignored)
│   └── smeta.db
├── uploads/                # Uploaded files (gitignored)
├── docs/                   # Project documentation
├── package.json           # Workspace root
└── README.md             # This file
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development servers (backend + frontend)
npm run dev

# 3. Open browser to http://localhost:3000
```

## Development Setup

### 1. Install Dependencies

```bash
# Install all workspace dependencies
npm install

# This will install dependencies for root, backend, and frontend
# Postinstall hook will display helpful next steps
```

**Alternative:** Explicit install for all workspaces:
```bash
npm run install:all
```

### 2. Environment Configuration

The backend and frontend have `.env` files with sensible defaults. You can modify them if needed:

**Backend** (`backend/.env`):
```
NODE_ENV=development
PORT=5001
DB_PATH=../data/smeta.db
UPLOAD_DIR=./uploads
CORS_ORIGIN=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:5001/api
VITE_APP_NAME="SMETA Compliance Platform"
```

### 3. Start Development Servers

```bash
# Start both backend and frontend concurrently (recommended)
npm run dev
```

Or start them individually:

```bash
# Start backend only (port 5001)
npm run dev:backend

# Start frontend only (port 3000)
npm run dev:frontend
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **Health Check**: http://localhost:5001/api/health

## Development Commands

### Daily Development

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm run dev` | Start both backend & frontend | Daily development (recommended) |
| `npm run dev:backend` | Start backend only | Backend-focused work |
| `npm run dev:frontend` | Start frontend only | Frontend-focused work |
| `npm run check` | TypeScript type check | Pre-commit validation |
| `npm test` | Run tests once | Verify changes |
| `npm run test:watch` | Run tests in watch mode | Test-driven development |

### Production Build

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm run build` | Build both backend & frontend | Pre-deployment |
| `npm run build:backend` | Compile backend TypeScript | Backend build only |
| `npm run build:frontend` | Build frontend bundle | Frontend build only |
| `npm run start` | Run production builds | Test production mode locally |
| `npm run start:backend` | Run compiled backend | Backend production mode |
| `npm run start:frontend` | Serve built frontend | Frontend production mode |

### Maintenance & Troubleshooting

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm install` | Install all dependencies | Initial setup |
| `npm run install:all` | Explicit workspace install | Force reinstall |
| `npm run clean` | Remove node_modules & dist | Clean slate |
| `npm run reset` | Clean + reinstall all | Fix dependency issues |
| `npm run clean:backend` | Remove backend artifacts | Backend cleanup |
| `npm run clean:frontend` | Remove frontend artifacts | Frontend cleanup |

## Testing

### Running Tests

```bash
# Run all tests once (CI mode)
npm test

# Run tests in watch mode (development)
npm run test:watch
```

**Test Location:** `frontend/tests/`  
**Framework:** Vitest + Testing Library + jsdom

### Type Checking

```bash
# Check TypeScript types without building
npm run check

# Check backend only
npm run check:backend

# Check frontend only
npm run check:frontend
```

## Production Build

### Building for Production

```bash
# Build both backend and frontend
npm run build
```

This creates:
- `backend/dist/` - Compiled JavaScript from TypeScript
- `frontend/dist/` - Optimized static assets (HTML, JS, CSS)

### Running Production Build Locally

```bash
# Run production builds
npm run start
```

- Backend serves from compiled `dist/` folder on port 5001
- Frontend serves optimized build via Vite preview on port 3000

## Troubleshooting

### Port Conflicts

- **Backend**: Default port 5001
- **Frontend**: Default port 3000

If ports are in use, kill the processes or change ports in `.env` files.

### Dependency Issues

```bash
# Clean reinstall
npm run reset

# Or manually
npm run clean
npm install
```

### SQLite Native Module Issues

If `better-sqlite3` fails to install (platform-specific native module):

```bash
cd backend
npm rebuild better-sqlite3
```

### TypeScript Errors

```bash
# Validate TypeScript without building
npm run check

# Clear build cache
npm run clean
npm run build
```

### Database Issues

The SQLite database is created automatically on first backend startup at `data/smeta.db`. If corrupted:

```bash
rm data/smeta.db
npm run dev:backend  # Will recreate database
```

## Database Schema

The application uses SQLite with the following tables:

### Documents Table
Stores uploaded compliance documents with metadata including pillar classification, category, and file information.

### CAPAs Table
Tracks Corrective and Preventive Actions with status, severity, dates, and action details.

See [docs/architecture.md](docs/architecture.md) for detailed schema information.

## API Endpoints

### Health Check
- **GET** `/api/health` - Returns server status and uptime

More endpoints will be added as features are implemented.

## Contributing

This project uses npm workspaces for monorepo management. When adding dependencies:

```bash
# Add to backend
npm install <package> --workspace=backend

# Add to frontend
npm install <package> --workspace=frontend

# Add to root (dev tools)
npm install <package> -D
```

## Desktop Application

This application is built with Electron for cross-platform desktop distribution.

### Building Desktop App

```bash
# Build for current platform
npm run dist

# Build for macOS
npm run dist:mac

# Build for Windows
npm run dist:win

# Build for all platforms
npm run dist:all
```

### CI/CD Pipeline

Automated builds are configured via GitHub Actions. See [docs/CICD.md](docs/CICD.md) for details on:
- Automated builds for macOS and Windows
- Release creation and distribution
- Local pipeline testing

## License

Proprietary - Internal use only
