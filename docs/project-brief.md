# Project Brief: SMETA Compliance Documentation Platform

**Project Name:** SMETA Audit Presentation Platform  
**Prepared By:** Mary, Business Analyst 📊  
**Date:** October 28, 2025  
**Version:** 1.0  
**Status:** Ready for Implementation

---

## Executive Summary

### Project Overview

Development of a local-first, desktop application for organizing and presenting SMETA (Sedex Members Ethical Trade Audit) compliance documentation to Sedex inspectors. The platform will manage 160-200 documents across 4 compliance pillars, enabling fast retrieval, professional presentation, and systematic organization to demonstrate compliance maturity during audits.

### Business Context

- **Immediate Need:** SMETA audit scheduled for October 29, 2025 (tomorrow)
- **Primary User:** Internal HR/Compliance team
- **Primary "Customer":** Sedex auditor who evaluates compliance
- **Strategic Goal:** Impress inspector with organization, speed, and professionalism while demonstrating full compliance control

### Key Success Metrics

**For Tomorrow's Audit:**
- ✅ Sub-10-second document retrieval speed
- ✅ Professional, organized presentation
- ✅ Zero missing documents during audit
- ✅ Auditor confidence in compliance system maturity

**Long-term (Post-Audit):**
- ✅ Reusable for future audits (yearly cycle)
- ✅ Time savings: 50-70% reduction in document search time
- ✅ Easy document updates and additions
- ✅ Scalable to other compliance frameworks if needed

### Single-Phase Approach

**IMMEDIATE DEVELOPMENT (Tonight - October 28, 2025)**
- **Timeline:** 8-12 hours (development + deployment)
- **Solution:** React frontend + Node.js backend web application
- **Deployment:** Runs locally on laptop (localhost), no internet required during audit
- **Goal:** Full-featured, professional SMETA compliance platform ready for tomorrow's audit

---

## Project Goals & Objectives

### Primary Objectives

**1. Pass SMETA Audit with Excellence**
- Demonstrate comprehensive compliance across all 4 pillars
- Impress Sedex auditor with organization and preparedness
- Achieve zero non-conformances related to documentation availability

**2. Create Reusable Compliance System**
- Establish ongoing tool for future audits
- Enable easy document updates throughout the year
- Reduce audit preparation stress and time

**3. Demonstrate Organizational Maturity**
- Professional presentation showcases compliance culture
- Systematic approach to evidence management
- Clear CAPA tracking demonstrates continuous improvement

### Secondary Objectives

- Time savings: Reduce document search time by 50-70%
- Scalability: Adaptable to other audit types (ISO, customer audits)
- Knowledge preservation: Institutional memory for compliance
- Confidence building: HR team empowerment through better tools

---

## Stakeholders

### Primary Stakeholders

**1. HR/Compliance Team (You)**
- **Role:** Platform owner, primary user
- **Needs:** Easy document upload, fast retrieval, professional presentation
- **Success criteria:** Smooth audit experience, reusable system

**2. Sedex Auditor**
- **Role:** Platform "customer" (evaluates evidence)
- **Needs:** Fast document access, clear evidence trails, cross-referencing ability
- **Success criteria:** Efficient audit, clear documentation, confidence in compliance

### Secondary Stakeholders

**3. Management/Leadership**
- **Role:** Audit outcome stakeholders
- **Needs:** Successful audit result, compliance assurance
- **Success criteria:** SMETA certification achieved

**4. Workers/Employees**
- **Role:** Indirectly impacted by compliance system
- **Needs:** Fair treatment, safe workplace (demonstrated through compliance)
- **Success criteria:** Accurate representation of workplace conditions

---

## Scope

### In Scope - Full Application (Tonight)

**Core Features:**
- ✅ Beautiful web-based dashboard (React frontend)
- ✅ Document upload interface (drag-and-drop)
- ✅ Organized by 4 Pillars + KPIs + CAPA
- ✅ 160-200 document upload and storage
- ✅ Fast search functionality
- ✅ Professional visual navigation
- ✅ Local file storage via backend (no internet dependency)
- ✅ PDF viewer (in-browser)
- ✅ DOCX/XLSX preview or download
- ✅ Image viewing
- ✅ CAPA tracking with status management
- ✅ File metadata (upload date, file size, type)
- ✅ Responsive design (works on laptop screen)

**Implementation Approach:**
- React frontend (beautiful UI)
- Node.js + Express backend (file management, API)
- Local SQLite database (metadata)
- File storage on local filesystem
- Runs on localhost (http://localhost:3000)
- No internet required after initial setup

### Out of Scope

**Not Included:**
- ❌ Cloud synchronization (local-only by design)
- ❌ Multi-user collaboration features
- ❌ Real-time document editing
- ❌ Integration with external systems (HR, time tracking)
- ❌ Mobile app version
- ❌ Automated compliance scoring/AI analysis
- ❌ Supplier/vendor management
- ❌ Workflow automation
- ❌ Email notifications
- ❌ Multi-language support (Phase 2 maybe)

---

## User Stories & Use Cases

### Primary User Stories

**As an HR Compliance Manager, I want to:**

**US-1: Fast Document Retrieval**
- Retrieve any document within 10 seconds of auditor request
- So that I demonstrate preparedness and professionalism

**US-2: Organized Evidence Presentation**
- Navigate intuitively through pillars, categories, and documents
- So that auditor can easily find and verify compliance evidence

**US-3: CAPA Transparency**
- Show complete CAPA lifecycle (finding → action → closure)
- So that I demonstrate continuous improvement culture

**US-4: Visual Dashboard**
- Display KPI summary at a glance
- So that auditor sees data-driven compliance management

**US-5: Reliable Offline Access**
- Access all documents without internet connection
- So that I'm not vulnerable to connectivity issues during audit

**US-6: Easy Document Addition**
- Upload new documents to correct pillar/category
- So that I can maintain system throughout the year

### Audit Day Use Cases

**UC-1: Opening Meeting Presentation**
1. Auditor arrives, opening meeting begins
2. Open platform on laptop
3. Show dashboard with platform structure (3 minutes)
4. Auditor impressed by organization → Positive first impression
5. **Success:** Platform sets professional tone

**UC-2: Specific Document Request**
1. Auditor: "Show me your fire drill records from January 2025"
2. Navigate: Pillar 2 → Evidence → Fire Drills → 2025-01-15 folder
3. Open: Fire-Drill-Report.pdf (2-5 seconds)
4. Auditor reviews, asks: "Do you have photos?"
5. Open: Photos-and-Evidence.pdf (2 seconds)
6. **Success:** Fast, seamless evidence provision

**UC-3: Cross-Pillar Verification**
1. Auditor: "You mentioned safety training. Show me the training matrix."
2. Navigate: Pillar 2 → Evidence → Training-Matrix-2025.xlsx
3. Auditor: "Now show me the curriculum for fire safety."
4. Navigate: Pillar 2 → Procedures → Fire-Safety-Training-Curriculum.pdf
5. Auditor: "And a completed training attendance record?"
6. Navigate: Pillar 2 → Forms → Training-Attendance-2025-01-15.pdf
7. **Success:** Quick cross-referencing demonstrates system integrity

**UC-4: CAPA Review**
1. Auditor: "What CAPAs do you have from previous audits?"
2. Navigate: CAPA → CAPA-Register.xlsx
3. Show: 3 closed CAPAs from 2024, 1 open CAPA (on track)
4. Auditor: "Show me how you closed CAPA-001."
5. Navigate: CAPA → Closed CAPAs → 2024 → CAPA-001 folder
6. Show: Complete lifecycle documentation (finding → action → evidence → closure)
7. **Success:** Demonstrates compliance maturity and accountability

---

## Requirements

### Functional Requirements

**FR-1: Document Organization**
- System MUST organize documents by Pillar → Category → File
- System MUST support 4 pillars: Labour Standards, Health & Safety, Business Ethics, Environment
- System MUST support 4 categories per pillar: Policies, Procedures, Forms, Evidence
- System MUST include KPIs section
- System MUST include CAPA section

**FR-2: File Support**
- System MUST open PDF files
- System MUST open DOCX files (in system default app or preview)
- System MUST open XLSX files (in Excel or preview)
- System MUST display images (JPEG, PNG)

**FR-3: Search & Navigation**
- System MUST provide search functionality across all documents
- System MUST allow navigation from dashboard to any document in ≤3 clicks
- System MUST provide visual navigation (not just folder hierarchy)

**FR-4: CAPA Management**
- System MUST track open vs. closed CAPAs
- System MUST organize CAPA evidence by CAPA ID
- System MUST maintain CAPA register with key fields (ID, description, status, dates)

**FR-5: Local Storage**
- System MUST store all data locally (no cloud dependency)
- System MUST function 100% offline
- System MUST maintain data on single device (Windows laptop)

**FR-6: Document Upload (Phase 2)**
- System MUST allow document upload via UI
- System MUST enforce proper file naming conventions
- System MUST place documents in correct pillar/category folders

### Non-Functional Requirements

**NFR-1: Performance**
- Document retrieval time: ≤10 seconds (target: 2-5 seconds)
- Search results: ≤3 seconds
- Application startup: ≤5 seconds
- File opening: ≤3 seconds

**NFR-2: Usability**
- System MUST be usable by non-technical HR staff
- Navigation MUST be intuitive (≤5 minutes training)
- Professional visual design (impresses auditor)
- Consistent UI patterns throughout

**NFR-3: Reliability**
- System MUST work without internet connection
- System MUST not crash during audit
- System MUST preserve data integrity (no file corruption)
- Backup strategy required (USB backup for Phase 1)

**NFR-4: Maintainability**
- Easy document addition (drag-and-drop or simple upload)
- Clear folder structure for manual updates
- File naming conventions documented
- Version control for updated documents

**NFR-5: Portability**
- Runs on Windows 10/11
- Self-contained (no external dependencies beyond standard Windows)
- Portable to different laptop if needed

**NFR-6: Scalability (Phase 2)**
- Support up to 500 documents (future growth)
- Handle multiple audit years
- Adaptable to other compliance frameworks

---

## Technical Architecture

### Full-Stack Web Application (Local Deployment)

**Technology Stack:**

**Frontend:**
- **Framework:** React.js (with Vite for fast builds)
- **UI Library:** Material-UI (MUI) or Ant Design for professional components
- **Routing:** React Router
- **State Management:** React Context API or Zustand (lightweight)
- **PDF Viewer:** react-pdf or @react-pdf-viewer
- **File Upload:** react-dropzone
- **Charts:** Recharts or Chart.js (for KPI dashboard)
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS or MUI theming

**Backend:**
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** SQLite (file-based, local, zero configuration)
- **File Storage:** Local filesystem
- **File Uploads:** Multer middleware
- **Search:** Simple text search or MiniSearch library
- **API:** RESTful API

**Database Schema (SQLite):**
```sql
-- Documents table
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255),
  pillar VARCHAR(50),
  category VARCHAR(50),
  file_type VARCHAR(10),
  file_size INTEGER,
  upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  file_path VARCHAR(500)
);

-- CAPA tracking table
CREATE TABLE capas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  capa_id VARCHAR(50) UNIQUE,
  description TEXT,
  pillar VARCHAR(50),
  severity VARCHAR(20),
  status VARCHAR(20),
  date_opened DATE,
  date_due DATE,
  date_closed DATE,
  root_cause TEXT,
  corrective_action TEXT,
  preventive_action TEXT
);
```

**Architecture:**
```
smeta-platform/
├── backend/
│   ├── server.js (Express server)
│   ├── routes/
│   │   ├── documents.js
│   │   ├── capas.js
│   │   └── search.js
│   ├── controllers/
│   ├── database/
│   │   ├── db.js (SQLite connection)
│   │   └── schema.sql
│   ├── uploads/ (document storage)
│   │   ├── pillar-1/
│   │   ├── pillar-2/
│   │   ├── pillar-3/
│   │   ├── pillar-4/
│   │   ├── kpis/
│   │   └── capa/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PillarView.jsx
│   │   │   ├── DocumentViewer.jsx
│   │   │   ├── DocumentUpload.jsx
│   │   │   ├── CAPATracker.jsx
│   │   │   ├── KPIDashboard.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── services/
│   │   │   └── api.js (Axios instance)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── data/
│   └── smeta.db (SQLite database file)
└── README.md
```

**API Endpoints:**
```
GET    /api/documents              - List all documents
GET    /api/documents/:id          - Get specific document
GET    /api/documents/pillar/:name - List documents by pillar
POST   /api/documents/upload       - Upload document
DELETE /api/documents/:id          - Delete document
GET    /api/documents/:id/download - Download document
GET    /api/search?q=term          - Search documents

GET    /api/capas                  - List all CAPAs
POST   /api/capas                  - Create CAPA
PUT    /api/capas/:id              - Update CAPA
DELETE /api/capas/:id              - Delete CAPA
```

**Deployment (Local):**
```bash
# Start backend (terminal 1)
cd backend
npm install
npm start
# Server runs on http://localhost:5000

# Start frontend (terminal 2)
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000

# For audit day: Build frontend and serve from backend
cd frontend
npm run build
# Backend serves static files from frontend/dist
```

**Key Features:**
- ✅ Custom SMETA-native UI design
- ✅ Drag-and-drop document upload
- ✅ In-browser PDF viewing
- ✅ Document categorization by pillar/category
- ✅ Fast search across all documents
- ✅ CAPA tracking dashboard
- ✅ File metadata display
- ✅ Beautiful, professional design
- ✅ 100% local (no internet after setup)
- ✅ Persistent data (SQLite database)

**Technical Advantages:**
- ✅ Full control over UI/UX
- ✅ Easy to customize for SMETA requirements
- ✅ Standard web technologies (widely supported)
- ✅ Can run in any browser
- ✅ No installation required (just start servers)
- ✅ Easy to backup (copy database + uploads folder)

**Technical Challenges:**
- Browser file size limits (can handle via chunking)
- PDF rendering performance (use lazy loading)
- Large file uploads (implement progress bars)
- XLSX preview (may need to open externally or use SheetJS)

---

## Data Model & File Structure

### File Naming Convention

**Standard Format:**
```
[Pillar]-[Category]-[DocumentType]-[Date/Version].[ext]

Examples:
✅ P1-Policies-Forced-Labour-Policy-v2.0.pdf
✅ P2-Forms-Fire-Drill-Report-2025-01-15.pdf
✅ P2-Evidence-Fire-Drill-Photos-2025-01-15.pdf
✅ P4-Procedures-Waste-Segregation-Procedure-v1.2.pdf
✅ CAPA-Register-2025.xlsx
✅ Training-Matrix-All-Staff-2025-01.xlsx
```

**Naming Rules:**
- No spaces (use hyphens)
- Date format: YYYY-MM-DD (ISO 8601)
- Version format: v1.0, v2.1, etc.
- Pillar prefix: P1, P2, P3, P4
- Descriptive but concise names

### Folder Structure

**Top Level:**
```
SMETA-Compliance/
├── Pillar-1-Labour-Standards/
├── Pillar-2-Health-Safety/
├── Pillar-3-Business-Ethics/
├── Pillar-4-Environment/
├── KPIs/
└── CAPA/
```

**Per Pillar Structure:**
```
Pillar-X-[Name]/
├── Policies/
│   ├── [Policy documents - PDF]
│   └── Policy-Index.xlsx (optional)
├── Procedures/
│   ├── [Procedure documents - PDF]
│   └── Procedure-Index.xlsx (optional)
├── Forms/
│   ├── Blank-Templates/ (optional)
│   └── Completed-Forms/
│       ├── [Completed forms - PDF]
│       └── Form-Register.xlsx
└── Evidence/
    ├── [Organized by evidence type]
    ├── Photos/
    ├── Certificates/
    ├── Training-Records/
    └── Registers/ (Excel files)
```

**CAPA Structure:**
```
CAPA/
├── CAPA-Register.xlsx (master tracking file)
├── CAPA-Procedure.pdf
├── Open-CAPAs/
│   ├── Critical-[Description]-Due-[Date].pdf
│   ├── Major-[Description]-Due-[Date].pdf
│   └── Minor-[Description]-Due-[Date].pdf
└── Closed-CAPAs/
    ├── 2024/
    │   ├── CAPA-001-[Description]/
    │   │   ├── 1-Original-Finding.pdf
    │   │   ├── 2-Root-Cause-Analysis.pdf
    │   │   ├── 3-Action-Plan.pdf
    │   │   ├── 4-Implementation-Evidence.pdf
    │   │   └── 5-Verification-and-Closure.pdf
    │   └── CAPA-002-[Description]/
    └── 2023/
```

**KPIs Structure:**
```
KPIs/
├── KPI-Dashboard.xlsx (main dashboard file)
├── KPI-Dashboard-Visual.pdf (exported charts)
└── Supporting-Data/
    ├── Accident-Rate-Trend.xlsx
    ├── Training-Completion-Rate.xlsx
    └── CAPA-Closure-Rate.xlsx
```

### Document Count Estimates

| Section | Documents | Total |
|---------|-----------|-------|
| Pillar 1 | 40-50 | 45 avg |
| Pillar 2 | 40-50 | 45 avg |
| Pillar 3 | 40-50 | 45 avg |
| Pillar 4 | 40-50 | 45 avg |
| KPIs | 3-5 | 4 avg |
| CAPA | 10-20 | 15 avg |
| **TOTAL** | **~160-220** | **~199** |

---

## Implementation Plan

### Full Application Development (Tonight - October 28, 2025)

**Timeline: 8-12 hours (with hired developer working in parallel with you)**

**CRITICAL: You need to hire a developer NOW who can start immediately**

---

**Hours 1-2: Project Setup & Backend Foundation (Developer)**
- [ ] Initialize Node.js project (backend)
- [ ] Set up Express server
- [ ] Configure SQLite database
- [ ] Create database schema
- [ ] Set up file upload middleware (Multer)
- [ ] Create folder structure for uploads
- [ ] Test basic API endpoints

**Hours 1-2: Parallel - Document Preparation (You)**
- [ ] Inventory all documents (create spreadsheet)
- [ ] Organize documents by pillar on desktop
- [ ] Verify all files are accessible
- [ ] Prepare file names for renaming
- [ ] Write descriptions for key documents

---

**Hours 3-4: Backend API Development (Developer)**
- [ ] Implement document upload endpoint
- [ ] Implement document listing endpoints
- [ ] Implement search functionality
- [ ] Implement CAPA endpoints (CRUD)
- [ ] Test all API endpoints with Postman/Insomnia
- [ ] Add file metadata extraction

**Hours 3-4: Parallel - Frontend Setup (Developer or Second Dev)**
- [ ] Initialize React + Vite project
- [ ] Install UI library (Material-UI)
- [ ] Set up routing (React Router)
- [ ] Create basic layout structure
- [ ] Configure Axios for API calls
- [ ] Set up environment variables

---

**Hours 5-6: Core Frontend Components (Developer)**
- [ ] Dashboard component (homepage)
- [ ] Pillar navigation cards
- [ ] Document list view
- [ ] Document upload component (drag-and-drop)
- [ ] PDF viewer component
- [ ] Search bar component

**Hours 5-6: Parallel - Document Digitization (You)**
- [ ] Scan/digitize any paper documents
- [ ] Convert DOCX to PDF if needed
- [ ] Compress large files if necessary
- [ ] Organize into temporary folders by pillar/category

---

**Hours 7-8: Advanced Features (Developer)**
- [ ] CAPA tracker component
- [ ] CAPA form (add/edit)
- [ ] Document viewer (integrated PDF viewer)
- [ ] File categorization UI (pillar/category dropdowns)
- [ ] KPI dashboard placeholder
- [ ] Styling and responsive design

**Hours 7-8: Parallel - Document Upload & Testing (You)**
- [ ] Start uploading documents through UI
- [ ] Verify each upload works
- [ ] Test search functionality
- [ ] Organize documents in correct pillars
- [ ] Add CAPA entries

---

**Hours 9-10: Integration & Testing (Developer + You)**
- [ ] Full integration testing
- [ ] Test all user workflows
- [ ] Performance testing (large file uploads)
- [ ] Fix bugs and issues
- [ ] Polish UI/UX
- [ ] Test offline functionality

**Hours 9-10: Complete Upload (You)**
- [ ] Upload all remaining documents
- [ ] Verify all 160-200 documents accessible
- [ ] Test navigation paths
- [ ] Practice audit scenarios

---

**Hours 11-12: Final Polish & Deployment (Developer + You)**
- [ ] Build frontend for production
- [ ] Configure backend to serve frontend
- [ ] Create startup script (double-click to run)
- [ ] Full system walkthrough
- [ ] Create backup (copy entire project folder)
- [ ] Test on actual audit laptop
- [ ] Charge laptop, prepare for audit

---

**Deliverables:**
✅ Fully functional web application (frontend + backend)
✅ 160-200 documents uploaded and organized
✅ SQLite database with metadata
✅ Beautiful, professional UI
✅ Fast search and navigation
✅ CAPA tracking system
✅ Startup script for easy launch
✅ Project backup on USB

---

**Deployment Package Structure:**
```
smeta-platform-deployment/
├── START_PLATFORM.bat (Windows batch script)
├── backend/ (Node.js server + database)
├── frontend/ (Built React app)
├── data/ (SQLite database)
├── uploads/ (All documents)
├── README.txt (Simple instructions)
└── BACKUP/ (Full backup copy)
```

**START_PLATFORM.bat contents:**
```batch
@echo off
echo Starting SMETA Platform...
cd backend
start cmd /k "node server.js"
timeout /t 3
start http://localhost:3000
echo Platform is running! Close this window to stop.
pause
```

---

## Success Criteria

### Application Success Criteria (Audit Tomorrow)

**Critical Success Factors:**
- ✅ Application runs successfully on Windows laptop
- ✅ All 160-200 documents uploaded and accessible
- ✅ Document retrieval time ≤10 seconds (target: 2-5 seconds)
- ✅ Beautiful, professional visual presentation
- ✅ Zero technical failures during audit
- ✅ Auditor positive feedback on organization

**Technical Performance:**
- Application startup time: ≤10 seconds
- Document search results: ≤3 seconds
- Average document retrieval/viewing: Target ≤5 seconds
- Upload speed: ≤10 seconds per document
- PDF rendering: ≤3 seconds

**Audit Day Metrics:**
- Number of "can't find document" incidents: Target 0
- Number of technical errors/crashes: Target 0
- Auditor satisfaction (subjective): Target "impressed"
- Successful demonstration of all 4 pillars: 100%

**User Experience:**
- ✅ Intuitive navigation (no confusion)
- ✅ Professional design (impresses auditor)
- ✅ Fast, responsive UI
- ✅ Drag-and-drop upload works perfectly
- ✅ Search returns relevant results
- ✅ CAPA tracker displays clearly

**Long-term Value:**
- ✅ Reusable for future audits (2026 onwards)
- ✅ Easy to add/update documents year-round
- ✅ Time savings: 50-70% reduction vs. manual folder search
- ✅ Maintainable codebase for future enhancements

---

## Risk Assessment & Mitigation

### Development Risks (Immediate)

**RISK 1: Not Enough Time to Complete Development**
- **Probability:** HIGH
- **Impact:** CRITICAL
- **Mitigation:** 
  - **URGENT**: Hire experienced full-stack developer NOW (React + Node.js)
  - Pay premium for immediate availability (tonight)
  - Focus on MVP features only (cut non-essential)
  - Have backup: Well-organized folders + simple HTML index page
  - Parallel work: Developer builds while you organize documents

**RISK 2: Developer Availability**
- **Probability:** High
- **Impact:** Critical
- **Mitigation:**
  - Use Upwork/Fiverr/Freelancer for emergency hire
  - Look for developers in time zones that are daytime now
  - Offer bonus for overnight completion
  - Have 2-3 developer options lined up
  - Consider hiring development agency with on-call team

**RISK 3: Technical Issues During Development**
- **Probability:** Medium-High
- **Impact:** High
- **Mitigation:**
  - Use proven, simple tech stack (avoid experimental)
  - Extensive testing before audit
  - Keep it simple (don't over-engineer)
  - Have fallback: Static file server + organized folders
  - Developer must test on Windows environment

**RISK 4: Application Crashes During Audit**
- **Probability:** Low-Medium
- **Impact:** Critical
- **Mitigation:**
  - Thorough testing tonight (stress test)
  - Error handling and fallbacks in code
  - Keep servers running (don't restart during audit)
  - Have printed document index as backup
  - USB backup of entire application
  - Know how to restart quickly if needed

**RISK 5: File Upload Failures**
- **Probability:** Medium
- **Impact:** High
- **Mitigation:**
  - Test with large files (>10MB)
  - Implement upload progress indicator
  - Allow resume/retry on failure
  - Have alternative: Manually copy files to uploads folder
  - Verify file integrity after upload

**RISK 6: Browser Compatibility Issues**
- **Probability:** Low
- **Impact:** Medium
- **Mitigation:**
  - Test on Chrome (primary) and Edge (backup)
  - Use standard web technologies (avoid cutting-edge features)
  - Install both browsers on audit laptop
  - PDF viewer must work in both browsers

**RISK 7: Database Corruption**
- **Probability:** Low
- **Impact:** High
- **Mitigation:**
  - Regular backups during development
  - SQLite is reliable and simple
  - Keep backup database file
  - Can rebuild database from uploaded files if needed

**RISK 8: Budget Overruns (Emergency Developer)**
- **Probability:** Medium
- **Impact:** Medium
- **Mitigation:**
  - Set fixed price upfront ($500-1500 for overnight work)
  - Define scope clearly (MVP only)
  - Time-box development (8-10 hours max)
  - If over budget, fall back to simpler solution

---

## Budget & Resources

### Emergency Development (Tonight)

**URGENT DEVELOPMENT COSTS:**

**Option A: Emergency Freelance Developer (RECOMMENDED)**
- **Full-stack developer (React + Node.js):** $75-150/hr × 8-10 hours = $600-1,500
- **Premium for immediate start (tonight):** +$200-500
- **Bonus for completion before audit:** +$200-500
- **TOTAL IMMEDIATE COST: $1,000-2,500**

**Where to Find:**
- **Upwork** (filter by: available now, 90%+ success rate, React + Node.js)
- **Fiverr Pro** (premium developers, fast turnaround)
- **Freelancer.com** (post urgent project)
- **Toptal** (expensive but highly vetted, $150-200/hr)
- **Local developer networks** (LinkedIn, tech meetups)
- **Development agencies with emergency services** ($2,000-4,000 flat)

**Option B: Development Agency - Emergency Service**
- **Fixed-price overnight project:** $2,000-4,000
- **Includes**: Full development, testing, deployment
- **Pros**: Team can work faster, more reliable
- **Cons**: More expensive

**Option C: Find Two Developers (Parallel Work)**
- **Backend developer:** $50-100/hr × 6 hours = $300-600
- **Frontend developer:** $50-100/hr × 6 hours = $300-600
- **TOTAL: $600-1,200**
- **Advantage**: Faster completion (parallel work)

---

**SOFTWARE/TOOLS COSTS:**
- Node.js: FREE ✅
- React + Vite: FREE ✅
- Material-UI: FREE ✅
- SQLite: FREE ✅
- All dependencies: FREE (open-source) ✅

**YOUR TIME INVESTMENT:**
- Document organization: 2-3 hours
- Document upload: 2-3 hours
- Testing and verification: 2-3 hours
- **Total: 6-9 hours tonight**

---

### Total Project Budget

**IMMEDIATE (Tonight):**
- **Emergency developer:** $1,000-2,500
- **Software:** $0
- **Your time:** 6-9 hours
- **TOTAL CASH COST: $1,000-2,500**

**ALTERNATIVE (If budget is issue):**
- **Simpler solution:** Organized folders + basic HTML page: $0-300
- **Risk:** Less impressive, but functional

---

**ROI Justification:**
- **Immediate ROI:** Pass tomorrow's audit (priceless for certification)
- **Time savings:** 10-20 hours per future audit
- **Reusable:** For 5+ years of annual audits
- **Professional impression:** Better audit outcome = potential business benefits
- **Cost per audit year:** $200-500 (amortized over 5 years)
- **Break-even:** Immediate (if audit success is valued)

---

## Assumptions & Constraints

### Assumptions

1. **Documents are ready** - All required compliance documents exist or will be digitized tonight
2. **Developer available** - Can hire competent full-stack developer for emergency work tonight
3. **Budget available** - Can spend $1,000-2,500 for emergency development
4. **Single user** - Primary user is HR manager, no multi-user concurrency needed
5. **Windows environment** - Audit will be conducted on Windows laptop with Chrome/Edge
6. **Offline operation** - Application runs on localhost, no internet required during audit
7. **Sedex auditor is tech-friendly** - Comfortable with digital documentation (standard in 2025)
8. **Annual audit cycle** - SMETA audits occur yearly, system needs yearly updates
9. **No cloud storage** - Company preference for local-only data
10. **Document ownership** - All documents are company-owned, no licensing restrictions
11. **Node.js can be installed** - Windows laptop allows software installation

### Constraints

1. **Timeline: CRITICAL** - Audit in ~18 hours, application must be ready tonight
2. **Budget: $1,000-2,500** - Emergency development budget
3. **Technical skills: Hiring required** - HR staff needs developer for tonight
4. **Single device** - Runs on one laptop (localhost deployment)
5. **Document format variety** - Must handle PDF (view in browser), DOCX/XLSX (download/open)
6. **No existing system integration** - Standalone tool
7. **Windows-only** - No cross-platform requirement
8. **Browser-based** - Must work in Chrome or Edge (no IE support needed)
9. **Development time: 8-12 hours max** - Developer works overnight

---

## Dependencies

### External Dependencies

1. **Developer availability** - CRITICAL: Must find and hire developer who can start tonight
2. **Internet connection** - Needed for npm package installation (during development only)
3. **Node.js runtime** - Must be installable on Windows laptop
4. **Document completeness** - All 160-200 documents must exist or be digitized tonight
5. **Laptop functionality** - Windows laptop must be working, charged, reliable
6. **Browser availability** - Chrome or Edge must be installed

### Internal Dependencies

1. **Budget approval** - URGENT: Approval for $1,000-2,500 emergency developer cost
2. **Time availability tonight** - 6-9 hours for document prep and testing
3. **Document access** - All documents must be accessible (not locked, corrupted, or on external systems)
4. **Management approval** - Implicit approval to use web application vs. paper binders
5. **Developer coordination** - Clear communication and requirements with hired developer
6. **Payment method** - Ability to pay developer tonight (credit card, PayPal, wire transfer)

---

## Appendix

### A. SMETA Pillar Requirements Summary

**(From Market Research Document - See docs/market-research.md for full detail)**

**Pillar 1: Labour Standards (45+ criteria)**
- Freely chosen employment, freedom of association, child labour, wages, working hours, discrimination, regular employment

**Pillar 2: Health & Safety (60+ criteria)**
- H&S management system, risk assessment, workplace safety, fire safety, PPE, accident reporting, occupational health, training

**Pillar 3: Business Ethics (15+ criteria)**
- Business integrity, whistleblowing, data protection, IP, supply chain management

**Pillar 4: Environment (25+ criteria)**
- Environmental management system, permits, pollution prevention, hazardous substances, water/energy, waste, biodiversity

### B. File Format Recommendations

**(From Market Research Document - See docs/market-research.md for full detail)**

| Evidence Type | Primary Format | Rationale |
|---------------|----------------|-----------|
| Policies | PDF | Professional, immutable |
| Procedures | PDF | Consistent formatting |
| Completed Forms | PDF | Signatures preserved |
| Registers/Logs | XLSX | Sortable, filterable |
| Training Records | XLSX + PDF | Matrices in Excel, certs in PDF |
| Photos | JPEG/PNG in PDF | Organized with context |
| CAPA Register | XLSX | Filter by status, pillar |

### C. Auditor Psychology Key Insights

**(From Market Research Document - See docs/market-research.md for full detail)**

**What Impresses Auditors:**
1. ⭐ Instant document retrieval (sub-10 seconds)
2. ⭐ Visual evidence integration (photos, videos)
3. ⭐ Cross-pillar consistency
4. ⭐ Clear CAPA tracking
5. ⭐ Professional presentation aesthetics

**What to Avoid:**
- ❌ Over-automation (looks fake)
- ❌ Technology showboating
- ❌ Defensive posture
- ❌ Too perfect (suspicious)

**The Wow Formula:**
```
WOW = (Speed × Evidence Quality) + (Organization × Transparency) - Complexity
```

### D. Reference Documents

1. **Market Research Report:** `docs/market-research.md`
   - Comprehensive SMETA requirements
   - Auditor persona analysis
   - File format strategy
   - Pillar requirements deep dive

2. **Competitor Analysis (Partial):** `docs/competitor-analysis.md`
   - Competitive landscape
   - Blue ocean validation
   - Technology inspiration sources

### E. Next Steps - IMMEDIATE ACTION REQUIRED

**🚨 CRITICAL: START NOW**

---

**YOUR IMMEDIATE ACTION (Next 30 minutes):**

**[ ] Step 1: HIRE DEVELOPER IMMEDIATELY** (30 min)
- Go to Upwork.com or Fiverr.com
- Search: "Full stack developer React Node.js urgent"
- Filter by: Available now, 90%+ rating
- Post job: "URGENT: React + Node.js web app needed in 8-10 hours, $1,000-1,500"
- Interview 2-3 candidates via video call
- **Hire within 30 minutes**
- Share this project brief with developer

**Job Posting Template:**
```
TITLE: URGENT - Full Stack Web App (React + Node.js) - Needed Tonight

DESCRIPTION:
Need experienced full-stack developer to build document management 
web application in 8-10 hours (overnight development).

REQUIREMENTS:
- React.js (frontend)
- Node.js + Express (backend)
- SQLite database
- File upload system (Multer)
- PDF viewer integration
- Must start IMMEDIATELY

DELIVERABLES:
- Working localhost application
- Document upload interface
- Beautiful, professional UI
- Search functionality
- Ready for use by 8am tomorrow

BUDGET: $1,000-1,500 USD
TIMELINE: Must start NOW, complete in 8-10 hours
LOCATION: Remote (any timezone currently in daytime)

BONUS: $300 for early completion + excellent quality
```

---

**[ ] Step 2: Organize Documents While Waiting** (2-3 hours)
- Create spreadsheet inventory of all documents
- Organize files on desktop by pillar/category
- Rename files using naming convention
- Verify all files open correctly
- Prepare any scans needed

---

**[ ] Step 3: Coordinate with Developer** (ongoing)
- Share technical requirements
- Answer questions promptly
- Provide example documents for testing
- Review progress every 2 hours

---

**[ ] Step 4: Upload Documents** (2-3 hours)
- Once application is ready, upload all documents
- Verify each category
- Test search functionality
- Ensure all files accessible

---

**[ ] Step 5: Testing & Preparation** (2 hours)
- Full walkthrough of audit scenarios
- Test document retrieval speed
- Practice navigation
- Create backup (copy entire folder)
- Charge laptop

---

**[ ] Step 6: Final Prep** (1 hour)
- Verify application starts correctly
- Test in Chrome and Edge
- Print backup document index
- Prepare workspace for audit
- Get sleep!

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Oct 28, 2025 | Mary (Business Analyst) | Initial comprehensive project brief |

**Approvals:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Owner | [Your Name] | ___________ | ______ |
| Management (Optional) | ___________ | ___________ | ______ |

**Distribution:**
- Project Owner (HR/Compliance Manager)
- Management (if required)
- Developer (Phase 2)

---

**END OF PROJECT BRIEF**

---

## 🚨 IMMEDIATE NEXT STEPS - CRITICAL

**YOU NEED TO START RIGHT NOW (WITHIN 30 MINUTES):**

### 1. HIRE DEVELOPER IMMEDIATELY ⚡

**Go to:**
- Upwork.com/hire/full-stack-developers
- Fiverr.com/categories/programming-tech/web-programming-services
- Toptal.com (if budget allows)

**Search for:**
"Full stack developer React Node.js available now urgent"

**Post job with:**
- Title: "URGENT - React + Node.js App Needed Tonight"
- Budget: $1,000-1,500
- Timeline: 8-10 hours (overnight)
- Skills: React, Node.js, Express, SQLite, PDF integration
- **Use job description template from Appendix E above**

**Interview criteria:**
- Available to start NOW
- Has built React + Node.js apps before
- Portfolio/samples available
- Good communication (video call required)
- **Hire within 30 minutes of posting**

---

### 2. PREPARE DOCUMENTS (While developer sets up)

- Inventory all documents in spreadsheet
- Organize by pillar on desktop
- Verify all files open
- Prepare for upload

---

### 3. BUDGET APPROVAL

- Get immediate approval for $1,000-2,500
- Set up payment method (PayPal, credit card, wire transfer)
- Prepare to pay 50% upfront, 50% on completion

---

### 4. SHARE PROJECT BRIEF WITH DEVELOPER

- Email this entire document
- Highlight Technical Architecture section
- Share API endpoints specification
- Provide example documents for testing

---

**TIMELINE IS CRITICAL - START HIRING NOW!**

**Questions? Need help finding developer? Reply immediately and I'll provide:**
- Pre-vetted developer profiles
- Technical specification document for developer
- Testing checklist
- Deployment instructions
