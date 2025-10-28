# SMETA Compliance Documentation Platform - Product Requirements Document (PRD)

**Project Name:** SMETA Audit Presentation Platform  
**Document Version:** 1.0  
**Date:** October 28, 2025  
**Prepared By:** Mary, Business Analyst  
**Status:** APPROVED - Ready for Development

---

## Goals and Background Context

### Goals

- **Pass SMETA audit tomorrow** with professional, organized document presentation
- **Impress Sedex auditor** with sub-10-second document retrieval and systematic organization
- **Create reusable system** for future annual audits (2026+)
- **Enable easy document management** through drag-and-drop upload interface
- **Demonstrate compliance maturity** through CAPA tracking and KPI visibility
- **Ensure 100% offline operation** for audit day reliability
- **Manage 160-200 documents** across 4 SMETA pillars + KPIs + CAPA

### Background Context

The organization is preparing for a SMETA (Sedex Members Ethical Trade Audit) scheduled for October 29, 2025. Currently, compliance documentation exists but is disorganized, making it difficult to quickly retrieve evidence during audits. The Sedex auditor evaluates compliance across 4 pillars (Labour Standards, Health & Safety, Business Ethics, Environment) and expects fast, professional access to policies, procedures, forms, and evidence.

This platform addresses the critical need for systematic document organization optimized for audit presentation. Unlike general document management systems, it is purpose-built around SMETA's structure with local-first deployment (no internet dependency), enabling the HR/Compliance team to confidently demonstrate compliance maturity through speed, organization, and transparency.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| Oct 28, 2025 | 1.0 | Initial PRD created from Project Brief | Mary (Business Analyst) |

---

## Requirements

### Functional Requirements

**FR1:** System MUST organize documents hierarchically by Pillar → Category → File with support for 4 pillars (Labour Standards, Health & Safety, Business Ethics, Environment), 4 categories per pillar (Policies, Procedures, Forms, Evidence), plus KPIs and CAPA sections.

**FR2:** System MUST provide drag-and-drop document upload interface that accepts PDF, DOCX, XLSX, and image files (JPEG, PNG).

**FR3:** System MUST store uploaded files locally on the filesystem with metadata (filename, pillar, category, file type, size, upload date) persisted in SQLite database.

**FR4:** System MUST display documents in a visual dashboard with navigation cards for each pillar and category.

**FR5:** System MUST provide search functionality that queries across all document metadata and returns results within 3 seconds.

**FR6:** System MUST allow users to view PDF files in-browser using an embedded PDF viewer.

**FR7:** System MUST allow users to download DOCX and XLSX files to open in native applications.

**FR8:** System MUST display image files (JPEG, PNG) in-browser.

**FR9:** System MUST provide CAPA tracking with ability to create, view, update, and delete CAPA records including fields: CAPA ID, description, pillar, severity, status, dates (opened, due, closed), root cause, corrective action, preventive action.

**FR10:** System MUST display CAPA list with status indicators (Open/Closed) and filtering capabilities.

**FR11:** System MUST provide navigation from dashboard to any document in ≤3 clicks.

**FR12:** System MUST allow users to delete uploaded documents.

**FR13:** System MUST categorize documents by pillar and category during upload via dropdown selection.

**FR14:** System MUST display document count per pillar/category on navigation cards.

**FR15:** System MUST provide a KPIs section for uploading dashboard-related files (Excel, PDF charts).

### Non-Functional Requirements

**NFR1:** Application startup time MUST be ≤10 seconds from launching the start script.

**NFR2:** Document retrieval and viewing time MUST be ≤10 seconds (target: 2-5 seconds) from user click to document display.

**NFR3:** Search results MUST return within ≤3 seconds.

**NFR4:** System MUST function 100% offline after initial setup (no internet connection required during audit).

**NFR5:** System MUST run on Windows 10/11 with Chrome or Edge browser.

**NFR6:** UI MUST be professional, clean, and intuitive requiring ≤5 minutes training for non-technical users.

**NFR7:** System MUST be reliable with zero crashes during 8-hour audit period.

**NFR8:** File upload MUST support files up to 50MB with progress indicator for uploads >5MB.

**NFR9:** System MUST preserve data integrity with no file corruption during upload or storage.

**NFR10:** Application MUST be easily portable (entire folder can be copied to USB for backup).

**NFR11:** UI MUST be responsive and work on laptop screen resolutions (1366×768 minimum).

**NFR12:** System MUST handle up to 500 documents (future scalability beyond initial 200).

---

## User Interface Design Goals

### Overall UX Vision

The SMETA Compliance Platform must embody **professional simplicity** - a clean, confidence-inspiring interface that makes document access feel effortless. The auditor's first impression upon seeing the dashboard should be: "This organization has their compliance under control."

**Core UX Principles:**
- **Speed over features** - Every interaction optimized for fast document retrieval
- **Visual hierarchy** - Clear pillar cards guide navigation intuitively
- **Zero learning curve** - Self-explanatory interface requiring no training
- **Professional aesthetics** - Clean, corporate design that impresses without being flashy
- **Fault tolerance** - Forgiving UX with clear error messages and easy recovery

**User Mental Model:**
Users think: "Dashboard → Select Pillar → Select Category → View Documents" - the UI must mirror this exact flow with visual breadcrumbs at each step.

### Key Interaction Paradigms

**1. Card-Based Navigation**
- Dashboard displays 6 large cards (4 Pillars + KPIs + CAPA)
- Each card shows: Icon, Title, Document count
- Click card → Navigate to pillar view

**2. List-Based Document Browsing**
- Pillar view displays 4 category tabs (Policies, Procedures, Forms, Evidence)
- Each tab shows filterable/searchable document list
- Document row shows: Icon (file type), Name, Upload date, Size

**3. Drag-and-Drop Upload**
- Dedicated "Upload" button on every screen
- Opens modal with drag-drop zone
- User selects pillar/category via dropdown
- Progress bar for large files
- Success confirmation with "View" or "Upload More" options

**4. Global Search**
- Persistent search bar in top navigation
- Type-ahead suggestions as user types
- Results show: Document name, Pillar, Category, snippet
- Click result → Opens document viewer

**5. In-Context Document Viewing**
- PDF opens in modal overlay with embedded viewer
- DOCX/XLSX shows "Open in [App]" button
- Close modal returns to previous view (no navigation loss)

### Core Screens and Views

**1. Dashboard (Home)**
- Hero section: "SMETA Compliance Documentation Platform"
- 6 navigation cards (2 rows × 3 columns):
  - Pillar 1: Labour Standards
  - Pillar 2: Health & Safety
  - Pillar 3: Business Ethics
  - Pillar 4: Environment
  - KPIs Dashboard
  - CAPA Tracker
- Global search bar at top
- Upload button (top-right)

**2. Pillar View**
- Breadcrumb: Home > Pillar Name
- 4 category tabs (Policies, Procedures, Forms, Evidence)
- Document list with columns: Name, Date, Size, Actions (View, Delete)
- Filter/sort controls
- Upload button (scoped to current pillar)

**3. CAPA Tracker**
- Two-column layout:
  - Left: CAPA list (sortable, filterable by status/severity)
  - Right: Selected CAPA details panel
- "Add CAPA" button
- Status badges (color-coded: Red=Critical/Overdue, Orange=Major, Yellow=Minor, Green=Closed)

**4. Document Viewer Modal**
- Full-screen PDF viewer with:
  - Zoom controls (+, -, Fit)
  - Page navigation
  - Close button (X)
- For non-PDFs: Download prompt with file icon

**5. Upload Modal**
- Drag-drop zone (large, centered)
- Or "Browse Files" button
- Pillar dropdown (required)
- Category dropdown (required)
- Upload progress bar
- Success message with actions

**6. Search Results Page**
- Search query displayed at top
- Grouped results by Pillar
- Each result card: Icon, Name, Path (Pillar > Category), Snippet
- Click → Opens document

### Accessibility

**WCAG AA Compliance** (minimum standard):
- Keyboard navigation support (Tab, Enter, Esc)
- Focus indicators visible on all interactive elements
- Color contrast ratios meet WCAG AA standards (4.5:1 for text)
- Alt text for icons/images
- Screen reader support (ARIA labels)

**Given timeline constraints:**
- Focus on keyboard navigation and color contrast (high ROI)
- Skip advanced ARIA roles for MVP (can enhance post-audit)

### Branding

**Professional Corporate Aesthetic:**
- **Color Palette:**
  - Primary: Navy Blue (#1a365d) - Trust, professionalism
  - Secondary: Slate Gray (#2d3748) - Neutrality, seriousness
  - Accent: Green (#38a169) - Compliance, success
  - Error/Critical: Red (#e53e3e)
  - Warning/Major: Orange (#dd6b20)
  - Background: Light Gray (#f7fafc)
  
- **Typography:**
  - Headers: Sans-serif, bold (e.g., Inter, Roboto)
  - Body: Sans-serif, regular (e.g., Inter, Roboto)
  - Sizes: Clear hierarchy (32px → 24px → 18px → 16px)

- **Visual Style:**
  - Clean, minimal design (no gradients, shadows sparingly)
  - Generous white space
  - Clear visual separation between sections
  - Material Design or similar modern UI framework

**No Logo Required:** System is internal tool, SMETA branding not needed.

### Target Device and Platforms

**Web Responsive - Desktop Optimized:**
- Primary: Windows laptop (Chrome/Edge browser)
- Resolution: 1366×768 minimum, optimized for 1920×1080
- No mobile version required (audit conducted on laptop)
- Responsive layout adapts to different laptop screen sizes
- Print-friendly CSS (optional - for backup document index)

**Technical Stack Alignment:**
- React frontend (component-based UI)
- Material-UI or Ant Design (pre-built professional components)
- Responsive grid system

---

## Technical Assumptions

### Repository Structure

**Monorepo**

**Rationale:** Single repository containing both frontend and backend simplifies development coordination, especially critical given the overnight timeline. The developer can work on both simultaneously without managing multiple repos.

**Structure:**
```
smeta-platform/
├── frontend/     (React application)
├── backend/      (Node.js/Express API)
├── data/         (SQLite database)
├── package.json  (root workspace config)
└── README.md
```

### Service Architecture

**Monolith - Local Two-Tier Architecture**

**Architecture:**
- **Backend:** Single Node.js/Express server handling all API requests and serving static frontend
- **Frontend:** React SPA (Single Page Application) built and served by backend
- **Database:** SQLite file-based database (single .db file)
- **File Storage:** Local filesystem within backend/uploads/

**Deployment Model:**
- Development: Two separate servers (frontend dev server + backend)
- Production: Backend serves built frontend (single process, single port)

**Communication:**
- Frontend → Backend: RESTful API calls via Axios
- Backend → Database: SQLite3 library (direct file access)
- Backend → File System: Node.js fs module

**Rationale:**
- **Simplicity:** No microservices complexity, no container orchestration
- **Speed:** Fastest to build given timeline constraints
- **Offline:** Entire stack runs locally without external dependencies
- **Portability:** Single folder can be zipped and moved to any Windows machine

### Testing Requirements

**Minimal Testing - Manual QA Focus**

Given the 8-10 hour development timeline:

**IN SCOPE:**
- ✅ Manual testing by developer during development
- ✅ Manual end-to-end testing by HR manager before audit
- ✅ Basic error handling in code (try/catch blocks)
- ✅ Input validation on API endpoints

**OUT OF SCOPE (for MVP tonight):**
- ❌ Automated unit tests
- ❌ Integration tests
- ❌ End-to-end test automation
- ❌ Test coverage metrics
- ❌ CI/CD pipelines

**Testing Strategy:**
1. Developer tests each feature as it's built (inline testing)
2. Full manual walkthrough after integration
3. HR manager tests critical audit scenarios (upload, search, view documents)
4. Stress test with large files and many documents

### Additional Technical Assumptions and Requests

**Frontend Technology Stack:**
- **Framework:** React 18+ with Vite (fast builds, modern tooling)
- **UI Library:** Material-UI (MUI) v5 - chosen for speed and professional components
- **Alternative:** Ant Design - also acceptable, developer's preference
- **Routing:** React Router v6
- **State Management:** React Context API (avoid Redux complexity for this scope)
- **HTTP Client:** Axios
- **PDF Viewer:** react-pdf or @react-pdf-viewer/core
- **File Upload:** react-dropzone
- **Styling:** MUI's sx prop + theme system (avoid separate CSS files for speed)

**Backend Technology Stack:**
- **Runtime:** Node.js v18+ (LTS)
- **Framework:** Express.js v4
- **Database:** SQLite3 (better-sqlite3 npm package for performance)
- **File Uploads:** Multer middleware
- **CORS:** cors middleware (for development, removed in production build)
- **Body Parsing:** express.json() built-in middleware

**Database Schema (SQLite):**
```sql
-- Documents table
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  original_filename TEXT,
  pillar TEXT NOT NULL CHECK(pillar IN ('pillar-1', 'pillar-2', 'pillar-3', 'pillar-4', 'kpis', 'capa')),
  category TEXT CHECK(category IN ('policies', 'procedures', 'forms', 'evidence', NULL)),
  file_type TEXT NOT NULL,
  file_size INTEGER,
  upload_date TEXT DEFAULT (datetime('now')),
  file_path TEXT NOT NULL UNIQUE
);

-- CAPA table
CREATE TABLE capas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  capa_id TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  pillar TEXT CHECK(pillar IN ('pillar-1', 'pillar-2', 'pillar-3', 'pillar-4')),
  severity TEXT CHECK(severity IN ('critical', 'major', 'minor', 'observation')),
  status TEXT NOT NULL CHECK(status IN ('open', 'in-progress', 'closed')),
  date_opened TEXT DEFAULT (datetime('now')),
  date_due TEXT,
  date_closed TEXT,
  root_cause TEXT,
  corrective_action TEXT,
  preventive_action TEXT
);

-- Indexes for performance
CREATE INDEX idx_documents_pillar ON documents(pillar);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_capas_status ON capas(status);
```

**File Storage Structure:**
```
backend/uploads/
├── pillar-1/
│   ├── policies/
│   ├── procedures/
│   ├── forms/
│   └── evidence/
├── pillar-2/
├── pillar-3/
├── pillar-4/
├── kpis/
└── capa/
```

**API Endpoint Specification:**

**Documents:**
- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Get document metadata
- `GET /api/documents/pillar/:pillar` - List documents by pillar
- `GET /api/documents/pillar/:pillar/category/:category` - List by pillar + category
- `POST /api/documents/upload` - Upload document (multipart/form-data)
- `GET /api/documents/:id/download` - Download/view file
- `DELETE /api/documents/:id` - Delete document
- `GET /api/search?q=searchTerm` - Search documents
- `GET /api/documents/counts` - Get document counts by pillar/category

**CAPAs:**
- `GET /api/capas` - List all CAPAs
- `GET /api/capas/:id` - Get CAPA by ID
- `GET /api/capas/status/:status` - List CAPAs by status
- `POST /api/capas` - Create CAPA
- `PUT /api/capas/:id` - Update CAPA
- `DELETE /api/capas/:id` - Delete CAPA

**Health Check:**
- `GET /api/health` - Server health check

**Environment Variables:**
```
PORT=5000
NODE_ENV=development|production
DB_PATH=../data/smeta.db
UPLOAD_DIR=./uploads
```

**Build & Deployment:**
```bash
# Development mode (separate processes)
Terminal 1: cd backend && npm run dev
Terminal 2: cd frontend && npm run dev

# Production build
cd frontend && npm run build
# Output: frontend/dist/ folder

# Production run (single process)
cd backend && npm start
# Backend serves frontend/dist on http://localhost:5000
```

**Windows Startup Script (START_PLATFORM.bat):**
```batch
@echo off
echo ================================
echo SMETA Compliance Platform
echo ================================
echo.
echo Starting server...
cd /d "%~dp0backend"
start "SMETA Platform Server" cmd /k "node server.js"
timeout /t 3 /nobreak >nul
echo.
echo Opening application in browser...
start http://localhost:5000
echo.
echo Platform is running!
echo Close the server window to stop the application.
echo.
pause
```

**Critical Dependencies (package.json):**

**Backend:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "better-sqlite3": "^9.0.0",
    "multer": "^1.4.5-lts.1",
    "cors": "^2.8.5"
  }
}
```

**Frontend:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@mui/material": "^5.14.0",
    "@mui/icons-material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "axios": "^1.6.0",
    "react-dropzone": "^14.2.3",
    "react-pdf": "^7.5.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

---

## Epic List

### Epic 1: Foundation & Core Document Management
*Goal: Establish project infrastructure and enable complete document upload, storage, and viewing workflow*

Delivers end-to-end value: User can upload documents, organize them by pillar/category, and view them - the core audit use case.

**Estimated Time:** 5-6 hours

---

### Epic 2: Search, CAPA Tracking & Polish
*Goal: Add search functionality, CAPA management, and final UX polish for audit readiness*

Delivers enhanced value: Fast document search and CAPA tracking demonstrate compliance maturity to auditor.

**Estimated Time:** 3-4 hours

---

## Epic 1: Foundation & Core Document Management

**Epic Goal:** Establish complete project infrastructure (backend API, frontend UI, database) and deliver the core document management workflow: users can upload documents via drag-and-drop, organize them by pillar and category, browse them in a visual dashboard, and view PDFs in-browser. This epic delivers the fundamental audit use case: presenting organized documents to the inspector.

**Estimated Time:** 5-6 hours

---

### Story 1.1: Project Setup & Hello World

**As a** developer,  
**I want** a functioning full-stack project structure with backend API and frontend React app,  
**so that** I can begin building features with proper foundation.

#### Acceptance Criteria

1. Backend Node.js/Express project initialized with package.json and folder structure (routes/, controllers/, database/)
2. Frontend React + Vite project initialized with package.json and folder structure (src/components/, src/services/)
3. Backend health check endpoint (`GET /api/health`) returns `{ status: 'ok' }` and responds within 100ms
4. Frontend displays "SMETA Platform" heading and makes successful API call to health endpoint, displaying connection status
5. SQLite database file created at `data/smeta.db` with connection verified
6. Database schema created: `documents` and `capas` tables with all fields per Technical Assumptions
7. Backend runs on `http://localhost:5000` and frontend dev server runs on `http://localhost:3000` with CORS configured
8. Git repository initialized with `.gitignore` (node_modules, data/*.db, uploads/)
9. README.md contains startup instructions for development mode

---

### Story 1.2: File Upload Backend API

**As a** backend developer,  
**I want** an API endpoint that accepts file uploads and stores them with metadata,  
**so that** the frontend can upload documents to the system.

#### Acceptance Criteria

1. `POST /api/documents/upload` endpoint accepts multipart/form-data with fields: `file`, `pillar`, `category`, `original_filename`
2. Endpoint validates required fields (file, pillar) and returns 400 error with message if missing
3. Endpoint validates file type (PDF, DOCX, XLSX, JPG, PNG) and rejects unsupported types with 415 error
4. Endpoint validates file size ≤50MB and rejects larger files with 413 error
5. File saved to `uploads/{pillar}/{category}/` with unique filename (timestamp + random + original extension)
6. Document metadata inserted into `documents` table: filename, original_filename, pillar, category, file_type, file_size, upload_date, file_path
7. Endpoint returns 201 status with JSON response: `{ id, filename, pillar, category, upload_date }`
8. Upload folders automatically created if they don't exist (recursive mkdir)
9. Error handling: Returns 500 with message if file write or database insert fails

---

### Story 1.3: Document Retrieval API Endpoints

**As a** backend developer,  
**I want** API endpoints to retrieve document lists and individual files,  
**so that** the frontend can display and access documents.

#### Acceptance Criteria

1. `GET /api/documents` returns array of all documents with fields: id, filename, original_filename, pillar, category, file_type, file_size, upload_date
2. `GET /api/documents/pillar/:pillar` returns filtered array of documents for specified pillar
3. `GET /api/documents/pillar/:pillar/category/:category` returns filtered array for pillar + category combination
4. `GET /api/documents/:id` returns single document metadata or 404 if not found
5. `GET /api/documents/:id/download` serves the actual file with correct Content-Type header and Content-Disposition for inline viewing (PDFs) or download (DOCX, XLSX)
6. `DELETE /api/documents/:id` deletes document record from database, deletes file from filesystem, and returns 204 status
7. All list endpoints return results ordered by upload_date DESC (newest first)
8. All endpoints handle database/filesystem errors with 500 status and descriptive error messages
9. Document counts endpoint: `GET /api/documents/counts` returns object with count per pillar and category

---

### Story 1.4: React Dashboard UI with Navigation Cards

**As an** HR manager,  
**I want** a visual dashboard with cards for each pillar, KPIs, and CAPA,  
**so that** I can quickly navigate to different sections during the audit.

#### Acceptance Criteria

1. Dashboard component renders with header "SMETA Compliance Documentation Platform" and subtitle "Organized Evidence for Audit Excellence"
2. Six navigation cards displayed in 2 rows × 3 columns grid layout using Material-UI Grid and Card components
3. Each card displays: Icon (unique per section), Title (e.g., "Pillar 1: Labour Standards"), Document count badge (fetched from `/api/documents/counts`)
4. Cards have hover effect (slight elevation increase) and click handler that navigates to pillar view using React Router
5. Global search bar rendered in top AppBar (functional in Epic 2, placeholder for now with "Search..." text)
6. Upload button rendered in top-right corner with "Upload Document" label and upload icon
7. Layout is responsive: cards stack vertically on smaller screens (< 960px width)
8. Material-UI theme configured with navy primary color (#1a365d) and green accent color (#38a169)
9. Loading state: Shows skeleton cards while fetching document counts from API

---

### Story 1.5: Drag-and-Drop File Upload UI

**As an** HR manager,  
**I want** a drag-and-drop upload interface,  
**so that** I can quickly upload documents to the correct pillar and category.

#### Acceptance Criteria

1. Upload button in dashboard opens Material-UI Dialog modal with "Upload Document" title
2. Modal contains react-dropzone area (large, centered, dashed border) with text "Drag and drop file here, or click to browse"
3. File selection triggers: Pillar dropdown (required, options: Pillar 1-4, KPIs, CAPA) and Category dropdown (conditionally shown, options: Policies, Procedures, Forms, Evidence, disabled for KPIs/CAPA)
4. Upload button (disabled until file + pillar selected) triggers POST to `/api/documents/upload` with FormData
5. During upload: Progress indicator shown (circular progress if file < 5MB, linear progress bar with percentage if ≥ 5MB)
6. Success: Green snackbar notification "Document uploaded successfully!" with "View" action button, modal closes automatically
7. Error: Red snackbar with error message (e.g., "File too large. Maximum 50MB"), modal remains open for retry
8. Accepted file types visually indicated: "Supported: PDF, DOCX, XLSX, JPG, PNG"
9. Multiple file uploads not supported (single file at a time for MVP)

---

### Story 1.6: Pillar View with Document List

**As an** HR manager,  
**I want** to view all documents in a specific pillar organized by category tabs,  
**so that** I can find documents quickly during the audit.

#### Acceptance Criteria

1. Pillar view component renders with breadcrumb navigation: "Home > Pillar X: [Name]"
2. Four category tabs displayed horizontally: Policies, Procedures, Forms, Evidence (using Material-UI Tabs component)
3. Tab click fetches documents from `/api/documents/pillar/:pillar/category/:category` and displays in table
4. Document table has columns: Icon (file type), Name, Upload Date (formatted: MMM DD, YYYY), Size (human-readable: KB/MB), Actions (View, Delete icons)
5. Empty state: If no documents in category, show message "No documents uploaded yet" with "Upload" button
6. View icon click: Opens document viewer (Story 1.7)
7. Delete icon click: Shows confirmation dialog "Delete [filename]?", on confirm calls DELETE endpoint and refreshes list
8. Upload button scoped to current pillar (pre-selects pillar in upload modal)
9. Loading state: Shows skeleton rows while fetching documents
10. Back button/breadcrumb click navigates to dashboard

---

### Story 1.7: PDF Viewer and File Download

**As an** HR manager,  
**I want** to view PDF files in-browser and download other file types,  
**so that** I can quickly show documents to the auditor without leaving the application.

#### Acceptance Criteria

1. Clicking "View" on PDF document opens full-screen modal overlay with embedded PDF viewer (react-pdf component)
2. PDF viewer displays document with zoom controls (+, -, Fit to width), page navigation (previous, next, page X of Y), and close button (X)
3. PDF loads from `/api/documents/:id/download` endpoint with proper authentication/CORS headers
4. Loading state: Shows spinner while PDF renders
5. Error state: If PDF fails to load, shows message "Unable to load document" with "Download" fallback button
6. Clicking "View" on DOCX/XLSX/image opens modal with file icon, filename, size, and "Open in [Default App]" button that triggers download
7. Download button calls `/api/documents/:id/download` which triggers browser download
8. Modal close (X button or ESC key) returns to document list without page reload (maintains scroll position)
9. Keyboard accessibility: ESC closes modal, Tab navigates controls

---

## Epic 2: Search, CAPA Tracking & Polish

**Epic Goal:** Add fast document search functionality to enable quick retrieval during auditor requests, implement CAPA (Corrective and Preventive Action) tracking system to demonstrate compliance maturity, and apply final UI polish for a production-ready audit experience. This epic transforms the basic document manager into a comprehensive compliance platform that impresses the inspector.

**Estimated Time:** 3-4 hours

---

### Story 2.1: Document Search Backend API

**As a** backend developer,  
**I want** a search API endpoint that queries documents by filename and metadata,  
**so that** the frontend can provide fast document search functionality.

#### Acceptance Criteria

1. `GET /api/search?q={searchTerm}` endpoint accepts query parameter and returns matching documents
2. Search queries against: `original_filename`, `filename`, `pillar`, `category` fields using SQLite `LIKE` operator (case-insensitive)
3. Search returns documents array with all metadata fields plus relevance indicator (e.g., which field matched)
4. Empty search term returns 400 error with message "Search term required"
5. Search term minimum length 2 characters, returns 400 error if shorter
6. Results ordered by relevance: exact filename matches first, then partial matches, then pillar/category matches
7. Search returns maximum 50 results (pagination not required for MVP)
8. Search completes and returns results within 500ms for database with 200 documents
9. Endpoint handles special characters in search term (SQL injection prevention via parameterized queries)

---

### Story 2.2: Global Search UI with Results Page

**As an** HR manager,  
**I want** to search for documents by name from any page,  
**so that** I can quickly find specific documents when the auditor requests them.

#### Acceptance Criteria

1. Search bar in top AppBar is functional with text input field and search icon button
2. User types search term and presses Enter or clicks search icon → navigates to `/search?q={term}` route
3. Search results page displays search term at top: "Search results for: '{term}'"
4. Results displayed as Material-UI Cards grouped by pillar (collapsible sections)
5. Each result card shows: File type icon, Document name (highlighted matching text), Path breadcrumb (Pillar > Category), Upload date
6. Click on result card opens document viewer (reuses Story 1.7 viewer modal)
7. No results found: Display message "No documents found for '{term}'" with "Try different search term" suggestion
8. Search results page includes "Back to Dashboard" button
9. Loading state: Shows skeleton cards while search API call in progress
10. Search bar shows loading spinner during search, disabled during API call to prevent multiple requests

---

### Story 2.3: CAPA Management Backend API

**As a** backend developer,  
**I want** CRUD API endpoints for CAPA records,  
**so that** the frontend can manage corrective and preventive actions.

#### Acceptance Criteria

1. `GET /api/capas` returns array of all CAPA records with all fields from database schema
2. `GET /api/capas/:id` returns single CAPA record or 404 if not found
3. `GET /api/capas/status/:status` returns filtered CAPAs by status (open, in-progress, closed)
4. `POST /api/capas` creates new CAPA with required fields: capa_id (unique), description, status; optional: pillar, severity, dates, root_cause, actions
5. `PUT /api/capas/:id` updates existing CAPA (all fields editable except id and date_opened)
6. `DELETE /api/capas/:id` deletes CAPA and returns 204 status
7. Validation: capa_id must be unique (return 409 conflict if duplicate), status must be valid enum value
8. Auto-set date_opened to current datetime on POST if not provided
9. Auto-set date_closed to current datetime on PUT when status changed to 'closed'
10. All endpoints return proper error messages for validation failures (400) and server errors (500)

---

### Story 2.4: CAPA Tracker Dashboard UI

**As an** HR manager,  
**I want** a CAPA tracker interface to view and manage corrective actions,  
**so that** I can demonstrate our continuous improvement process to the auditor.

#### Acceptance Criteria

1. CAPA Tracker page accessible from dashboard card, displays two-column layout: CAPA list (left 40%) and details panel (right 60%)
2. CAPA list shows all CAPAs with color-coded status badges: Red (Critical/Overdue), Orange (Major), Yellow (Minor), Green (Closed)
3. List items display: CAPA ID, Description (truncated to 60 chars), Status, Due date (if open)
4. Filter buttons above list: "All", "Open", "In Progress", "Closed" (calls appropriate API endpoint)
5. Sort dropdown: "Due Date", "Status", "Severity" (client-side sorting)
6. Click CAPA in list → highlights item and loads details in right panel
7. Details panel shows all CAPA fields in read-only format with labels: CAPA ID, Description, Pillar, Severity, Status, Dates, Root Cause, Corrective Action, Preventive Action
8. "Add CAPA" button (top-right) opens create modal (Story 2.5)
9. Edit button in details panel opens edit modal (Story 2.5)
10. Delete button shows confirmation dialog, on confirm calls DELETE API and refreshes list
11. Empty state: "No CAPAs found" with "Add CAPA" button if list is empty

---

### Story 2.5: CAPA Create/Edit Form Modal

**As an** HR manager,  
**I want** a form to create and edit CAPA records,  
**so that** I can track corrective actions throughout the year.

#### Acceptance Criteria

1. "Add CAPA" button opens modal dialog with form title "Create CAPA"
2. Edit button opens same modal with title "Edit CAPA" and form pre-populated with existing data
3. Form fields: CAPA ID (text, required, unique), Description (multiline text, required), Pillar (dropdown: Pillar 1-4), Severity (dropdown: Critical, Major, Minor, Observation)
4. Form fields: Status (dropdown: Open, In Progress, Closed, required, default: Open), Due Date (date picker), Root Cause (multiline text), Corrective Action (multiline text), Preventive Action (multiline text)
5. Form validation: Shows error messages under fields if required fields empty or CAPA ID duplicate
6. Save button disabled until required fields filled and valid
7. Save button calls POST (create) or PUT (edit) API endpoint with form data
8. Success: Snackbar "CAPA saved successfully", modal closes, list refreshes with new/updated CAPA selected
9. Error: Snackbar with API error message, modal remains open for retry
10. Cancel button closes modal without saving (shows confirmation if form has unsaved changes)

---

### Story 2.6: Production Build & Deployment Setup

**As a** developer,  
**I want** a production build process and startup script,  
**so that** the HR manager can easily run the application on audit day.

#### Acceptance Criteria

1. Frontend build script (`npm run build` in frontend/) creates optimized production bundle in `frontend/dist/` folder
2. Backend serves frontend static files from `dist/` folder when `NODE_ENV=production`
3. Backend updated: Single port (5000) serves both API routes (`/api/*`) and frontend static files (all other routes)
4. `START_PLATFORM.bat` script created in project root with contents per Technical Assumptions section
5. Double-clicking `.bat` file starts backend server and opens browser to `http://localhost:5000`
6. `README.md` updated with production deployment instructions: Build frontend, start backend, access application
7. Production build removes console.logs and uses minified assets
8. Environment variable `NODE_ENV` properly set to `production` when running from `.bat` script
9. Test: After running startup script, application fully functional (upload, view, search, CAPA all working)

---

### Story 2.7: UI Polish & Final Testing

**As an** HR manager,  
**I want** a polished, professional user interface with loading states and error handling,  
**so that** the application looks impressive and handles edge cases gracefully during the audit.

#### Acceptance Criteria

1. All buttons have consistent styling (Material-UI primary/secondary variants), proper spacing, and icons
2. All pages have consistent header styling, breadcrumb navigation, and spacing
3. Loading states implemented on all data-fetching operations: Dashboard counts, Document lists, Search results, CAPA list (skeleton screens or spinners)
4. Error states implemented: Failed API calls show user-friendly error messages with retry options
5. Empty states implemented: All lists show helpful messages when empty (e.g., "No documents uploaded yet. Click Upload to get started.")
6. Success/error snackbar notifications are consistent across all operations (green for success, red for error, auto-dismiss after 5 seconds)
7. Responsive layout tested and working on laptop resolutions: 1366×768, 1920×1080
8. Keyboard navigation tested: Tab order logical, Enter triggers buttons, Escape closes modals
9. File type icons consistent and recognizable (PDF red, DOCX blue, XLSX green, images purple)
10. Final walkthrough test passed: Complete audit scenario (upload 10 documents, search, view, manage CAPA) executed without errors

---

## Checklist Results Report

### PRD Validation Summary

**Overall Completeness:** 92% ✅  
**MVP Scope:** Just Right ✅  
**Readiness for Development:** READY ✅  
**Timeline Realism:** Aggressive but Achievable (8-10 hours) ⚠️

### Category Statuses

| Category                         | Status  | Critical Issues |
| -------------------------------- | ------- | --------------- |
| 1. Problem Definition & Context  | PASS ✅ | None |
| 2. MVP Scope Definition          | PASS ✅ | None |
| 3. User Experience Requirements  | PASS ✅ | None |
| 4. Functional Requirements       | PASS ✅ | None |
| 5. Non-Functional Requirements   | PASS ✅ | None |
| 6. Epic & Story Structure        | PASS ✅ | None |
| 7. Technical Guidance            | PASS ✅ | None |
| 8. Cross-Functional Requirements | PARTIAL ⚠️ | Minimal operational requirements (acceptable for MVP) |
| 9. Clarity & Communication       | PASS ✅ | None |

### Key Strengths

✅ **Comprehensive Technical Specification** - Database schema, API endpoints, tech stack all detailed  
✅ **Well-Sized Stories** - Each story 30-60 minutes, appropriate for overnight development  
✅ **Clear Acceptance Criteria** - All testable and specific  
✅ **Realistic Scope** - MVP features directly support audit scenario  
✅ **Professional UI Vision** - Clear design goals, branding, interaction paradigms

### Recommendations

**Contingency Plan:**

If development falls behind schedule:

**Minimum Viable (Epic 1 Only):**
- Document upload, storage, and viewing works
- Pillar/category organization functional
- Can demonstrate documents to auditor (core audit use case met)

**Skip if Necessary:**
- Search functionality (can browse manually)
- CAPA tracker (can show CAPA documents without tracker)
- UI polish (functional > beautiful for emergency)

Epic 1 completion = Audit-ready, even if not impressive.

### Final Decision

## ✅ **READY FOR DEVELOPMENT**

The PRD is comprehensive, well-structured, and ready for immediate development.

**Confidence Level:** 95%

**Approval:** Developer can start Story 1.1 immediately.

---

## Next Steps

### For Developer: Quick Start Guide

**Before Starting:**
1. Review this entire PRD (focus on Technical Assumptions and Epic/Story sections)
2. Verify Node.js v18+ installed
3. Confirm you have 8-10 hours available for focused development
4. Set up communication channel with HR manager for questions

**Development Sequence:**
1. **Start:** Story 1.1 (Project Setup) - 45 min
2. **Build:** Stories 1.2-1.7 (Core features) - 4.5 hours
3. **Checkpoint:** Demo Epic 1 to HR manager, begin document uploads
4. **Continue:** Stories 2.1-2.7 (Enhanced features) - 3.5 hours
5. **Deploy:** Test on actual audit laptop, create backup

**Testing Priorities:**
- Upload 20+ documents across all pillars
- View largest PDF (30MB+)
- Search for documents by name
- Create and manage CAPA records
- Run START_PLATFORM.bat on audit laptop
- Complete full audit walkthrough (< 10 seconds per document)

### For UX Expert

*Note: Given timeline constraints, UX work happens inline during development. No separate UX phase.*

**UX Priorities for Developer:**
- Use Material-UI default components (saves time)
- Focus on clarity over creativity
- Ensure keyboard navigation works
- Test on 1366×768 resolution minimum

### For Architect

*Note: Architecture is pre-defined in Technical Assumptions section. No separate architecture phase required.*

**Architecture Summary:**
- Monorepo: Frontend (React + Vite) + Backend (Node + Express)
- Database: SQLite (file-based)
- Deployment: Local laptop, localhost:5000
- All technical decisions finalized in PRD

---

**END OF PRD**

---

**Document Status:** APPROVED ✅  
**Ready for Development:** YES  
**Target Completion:** 8-10 hours  
**Audit Date:** October 29, 2025 (tomorrow)

**Good luck with development! 🚀**
