# SMETA Compliance Platform

A full-stack web application for managing SMETA (Sedex Members Ethical Trade Audit) compliance documentation and Corrective and Preventive Actions (CAPAs).

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

## Development Setup

### 1. Install Dependencies

```bash
# Install all workspace dependencies
npm install

# This will install dependencies for root, backend, and frontend
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
# Start both backend and frontend concurrently
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

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both backend and frontend in development mode |
| `npm run dev:backend` | Start backend server only on port 5001 |
| `npm run dev:frontend` | Start frontend dev server only on port 3000 |
| `npm run install:all` | Reinstall all dependencies for all workspaces |

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

## License

Proprietary - Internal use only
