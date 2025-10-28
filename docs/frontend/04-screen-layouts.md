# Frontend Specification - Screen Layouts

[← Back to User Flows](./03-user-flows.md) | [Next: Component Library →](./05-component-library.md)

---

## Design Approach

**Text-based wireframes** optimized for rapid implementation with Material-UI components. Given the 8-10 hour development timeline, these specifications enable the developer to build directly without separate visual design phase.

**Component Reference:** Material-UI v5 (https://mui.com/material-ui/)

---

## Screen 1: Dashboard (Homepage)

**Purpose:** Primary navigation hub - quick access to all pillars, KPIs, and CAPA tracker

**Route:** `/` (root)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [SMETA Logo]  SMETA Compliance Platform    [🔍 Search...] [📤 Upload] │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│         SMETA Compliance Documentation Platform              │
│              Organized Evidence for Audit Excellence          │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   👥         │  │   🏥          │  │   🤝          │      │
│  │  Pillar 1    │  │  Pillar 2     │  │  Pillar 3     │      │
│  │  Labour      │  │  Health &     │  │  Business     │      │
│  │  Standards   │  │  Safety       │  │  Ethics       │      │
│  │              │  │               │  │               │      │
│  │  45 docs     │  │  48 docs      │  │  38 docs      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   🌱         │  │   📊          │  │   📋          │      │
│  │  Pillar 4    │  │  KPIs         │  │  CAPA         │      │
│  │  Environment │  │  Dashboard    │  │  Tracker      │      │
│  │              │  │               │  │               │      │
│  │  42 docs     │  │  4 docs       │  │  12 CAPAs     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Component Breakdown

**AppBar (Top):**
- **Component:** `AppBar` position="fixed"
- **Height:** 64px
- **Background:** Navy (#1a365d)
- **Content:**
  - Left: Typography variant="h6" - "SMETA Compliance Platform"
  - Center: TextField (search input) - Width 400px, placeholder "Search documents..."
  - Right: Button variant="contained" - "Upload" with UploadIcon

**Hero Section:**
- **Container:** Box with centered text
- **Title:** Typography variant="h3" - "SMETA Compliance Documentation Platform"
- **Subtitle:** Typography variant="body1" color="text.secondary" - "Organized Evidence for Audit Excellence"
- **Spacing:** margin-top 48px

**Navigation Cards Grid:**
- **Component:** Grid container spacing={3}
- **Layout:** 
  - xs={12} sm={6} md={4} (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
- **Card Dimensions:** 280px × 220px (flexible on smaller screens)
- **Each Card:**
  - Component: `Card` elevation={2}
  - Wrapper: `CardActionArea` (makes entire card clickable)
  - Icon: 48px, centered, color: accent green (#38a169)
  - Title: Typography variant="h5" - Bold, centered
  - Subtitle: Typography variant="body2" - Centered (e.g., "Labour Standards")
  - Badge: Chip size="small" - Document count, bottom-right position

**Card Icons:**
- Pillar 1: GroupIcon (people)
- Pillar 2: LocalHospitalIcon (health)
- Pillar 3: HandshakeIcon (ethics)
- Pillar 4: EcoIcon (environment)
- KPIs: BarChartIcon (analytics)
- CAPA: AssignmentIcon (tasks)

### Interaction States

**Card Hover:**
- Elevation: 2 → 8
- Transform: scale(1.02)
- Duration: 200ms

**Card Click:**
- Navigate to respective pillar/section view
- React Router: `/pillar-1`, `/pillar-2`, `/kpis`, `/capa`

### Loading State

- Skeleton cards shown while fetching document counts
- Use Material-UI `Skeleton` variant="rectangular"

---

## Screen 2: Pillar View with Category Tabs

**Purpose:** Browse documents within a specific pillar, organized by category

**Route:** `/pillar-:id` (e.g., `/pillar-2`)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [SMETA Logo]  SMETA Compliance Platform    [🔍 Search...] [📤 Upload] │
└─────────────────────────────────────────────────────────────┘
│ Home > Pillar 2: Health & Safety                            │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  Policies | Procedures | Forms | Evidence                   │
│  ────────                                                    │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 📄  Fire Safety Policy v2.0              Jan 15, 2025  │ │
│  │     2.3 MB                               [👁] [🗑]     │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ 📄  Workplace Safety Policy v1.2         Dec 10, 2024  │ │
│  │     1.8 MB                               [👁] [🗑]     │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ 📄  PPE Policy                           Nov 22, 2024  │ │
│  │     1.1 MB                               [👁] [🗑]     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Showing 12 documents | Sort by: Date (Newest) ▼           │
└─────────────────────────────────────────────────────────────┘
```

### Component Breakdown

**Breadcrumb Navigation:**
- **Component:** `Breadcrumbs`
- **Placement:** Below AppBar, 16px padding
- **Items:**
  - "Home" (Link to `/`)
  - "Pillar X: Name" (Typography, bold, current page)

**Category Tabs:**
- **Component:** `Tabs` variant="standard"
- **Tabs:** Policies, Procedures, Forms, Evidence
- **Indicator:** Bottom border 3px, accent green
- **Behavior:** Click tab → Fetch and display documents for that category

**Document List:**
- **Component:** `List` or `Table`
- **Each Row:**
  - `ListItem` or `TableRow`
  - File icon: 24px, color-coded (PDF=red, DOCX=blue, XLSX=green, Image=purple)
  - Document name: Typography variant="body1", truncate >60 chars
  - File size: Typography variant="caption" color="text.secondary"
  - Upload date: Typography variant="caption" - Format "MMM DD, YYYY"
  - Actions: IconButton (VisibilityIcon), IconButton (DeleteIcon)
- **Hover State:** Background #f5f5f5

**Footer Controls:**
- Document count (left): Typography variant="body2"
- Sort dropdown (right): Select component

### Empty State

```
┌─────────────────────────────────────┐
│                                     │
│         📂                          │
│                                     │
│   No documents uploaded yet         │
│                                     │
│   Click Upload to add documents     │
│   to this category                  │
│                                     │
│   [Upload Document]                 │
│                                     │
└─────────────────────────────────────┘
```

- Component: Box with centered content
- Icon: FolderOpenIcon (48px, gray)
- Message: Typography variant="body1"
- Button: Button variant="contained" - "Upload Document"

---

## Screen 3: Document Viewer Modal (PDF)

**Purpose:** In-browser PDF viewing without leaving current context

**Trigger:** Click "View" icon on document in list

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Fire Safety Policy v2.0                           [✕ Close] │
├─────────────────────────────────────────────────────────────┤
│  [−] [+] [Fit to Width] [Download]     Page 1 of 12  [< >] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                                                              │
│                   [PDF CONTENT AREA]                        │
│                                                              │
│                                                              │
│                                                              │
│                                                              │
│                                                              │
│                                                              │
│                                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Component Breakdown

**Modal Container:**
- **Component:** `Dialog` maxWidth="lg" fullWidth={true}
- **Size:** 90vw × 90vh
- **Backdrop:** Semi-transparent dark (rgba(0,0,0,0.5))
- **Close:** ESC key or backdrop click

**Header:**
- **Component:** `DialogTitle`
- **Content:**
  - Document filename: Typography variant="h6", truncate with Tooltip
  - Close button: IconButton with CloseIcon (top-right)

**Toolbar:**
- **Component:** `AppBar` position="static" color="default"
- **Controls:**
  - Zoom out: IconButton (ZoomOutIcon)
  - Zoom in: IconButton (ZoomInIcon)
  - Fit to width: Button size="small"
  - Download: IconButton (DownloadIcon)
  - Page counter: Typography "Page X of Y"
  - Previous page: IconButton (ArrowBackIcon)
  - Next page: IconButton (ArrowForwardIcon)

**PDF Viewer Area:**
- **Component:** react-pdf `Document` and `Page`
- **Background:** White
- **Scrollable:** If content exceeds viewport height
- **Loading:** CircularProgress centered

### States

**Loading:**
```
┌─────────────────────────────────────┐
│                                     │
│              ⌛                      │
│                                     │
│         Loading PDF...              │
│                                     │
└─────────────────────────────────────┘
```

**Error:**
```
┌─────────────────────────────────────┐
│                                     │
│              ⚠️                     │
│                                     │
│    Unable to load PDF document      │
│                                     │
│    [Download Instead]  [Close]      │
│                                     │
└─────────────────────────────────────┘
```

---

## Screen 4: Upload Modal

**Purpose:** Drag-and-drop document upload with pillar/category selection

**Trigger:** Click "Upload" button in AppBar or empty state

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Upload Document                                   [✕ Close] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │              📤                                        │ │
│  │                                                        │ │
│  │     Drag and drop file here, or click to browse       │ │
│  │                                                        │ │
│  │   Supported: PDF, DOCX, XLSX, JPG, PNG (Max 50MB)    │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  OR                                                          │
│                                                              │
│  [Browse Files]                                              │
│                                                              │
│  ────────────────────────────────────────────────────────── │
│                                                              │
│  📄 Fire-Drill-Report-2025-01.pdf                           │
│  2.3 MB                                                      │
│                                                              │
│  Select Pillar: [Pillar 2: Health & Safety        ▼]       │
│                                                              │
│  Select Category: [Evidence                        ▼]       │
│                                                              │
│  [Cancel]                              [Upload Document]    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Component Breakdown

**Modal:**
- **Component:** `Dialog` maxWidth="sm" fullWidth
- **Width:** 600px

**Drop Zone:**
- **Library:** react-dropzone
- **Styling:**
  - Border: 2px dashed #999
  - Height: 200px
  - Centered content
  - Hover: Border solid green, background light green tint
- **Icon:** CloudUploadIcon 48px
- **Text:** Typography variant="body1"

**File Preview (after selection):**
- File icon + filename + size
- Typography variant="body2"
- Remove option: IconButton with CloseIcon

**Form Controls:**
- **Pillar Dropdown:**
  - Component: FormControl + InputLabel + Select
  - Options: Pillar 1, 2, 3, 4, KPIs, CAPA
  - Required field (marked with *)
  
- **Category Dropdown:**
  - Component: FormControl + InputLabel + Select
  - Options: Policies, Procedures, Forms, Evidence
  - Disabled when KPIs or CAPA selected
  - Required for Pillars 1-4

**Action Buttons:**
- Cancel: Button variant="text" (left)
- Upload: Button variant="contained" color="primary" (right, disabled until valid)

### Upload Progress State

```
┌─────────────────────────────────────┐
│  Uploading...                       │
│                                     │
│  Fire-Drill-Report-2025-01.pdf     │
│  ████████████░░░░░░░░ 65%          │
│                                     │
└─────────────────────────────────────┘
```

- Component: LinearProgress with percentage label
- Shows for files >5MB
- CircularProgress for files <5MB

---

## Screen 5: CAPA Tracker

**Purpose:** View and manage corrective/preventive actions with auditor

**Route:** `/capa`

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [SMETA Logo]  SMETA Compliance Platform    [🔍 Search...] [📤 Upload] │
└─────────────────────────────────────────────────────────────┘
│ Home > CAPA Tracker                                         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  CAPA Tracker                                [+ Add CAPA]   │
│                                                              │
│  [All] [Open] [In Progress] [Closed]                        │
│                                                              │
│  ┌──────────────────┬──────────────────────────────────────┐│
│  │ CAPA List        │ CAPA Details                         ││
│  │                  │                                      ││
│  │ 🔴 CAPA-2024-03  │ CAPA ID: CAPA-2024-01               ││
│  │ Emergency exit   │                                      ││
│  │ Due: Jan 30      │ Description:                         ││
│  │                  │ Emergency exit door blocked in       ││
│  │ 🟢 CAPA-2024-02  │ warehouse area during inspection     ││
│  │ Training records │                                      ││
│  │ Closed           │ Pillar: Pillar 2 - Health & Safety  ││
│  │                  │                                      ││
│  │ 🟢 CAPA-2024-01  │ Severity: Major                      ││
│  │ Fire drill freq  │ Status: Closed ✓                     ││
│  │ Closed           │                                      ││
│  │                  │ Date Opened: Dec 15, 2024            ││
│  │                  │ Date Due: Jan 31, 2025               ││
│  │                  │ Date Closed: Jan 20, 2025            ││
│  │                  │                                      ││
│  │                  │ Root Cause:                          ││
│  │                  │ Lack of warehouse floor marking...   ││
│  │                  │                                      ││
│  │                  │ [Edit] [Delete]                      ││
│  └──────────────────┴──────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Component Breakdown

**Header:**
- Title: Typography variant="h4" - "CAPA Tracker"
- Add button: Button variant="contained" - "+ Add CAPA"

**Filter Buttons:**
- **Component:** ToggleButtonGroup
- **Options:** All, Open, In Progress, Closed
- **Active:** Primary color background

**Two-Column Layout:**
- **Left (40%):** CAPA List
  - Component: List
  - Each item: ListItem with status indicator (colored circle), CAPA ID, short description, due date
  - Selected: Highlighted background (light blue)
  
- **Right (60%):** CAPA Details Panel
  - Component: Box with read-only fields
  - Field labels: Typography variant="caption" color="text.secondary" bold
  - Field values: Typography variant="body2"
  - Multi-line fields: TextField multiline disabled (for display)
  - Actions: Button "Edit", Button "Delete" (bottom)

**Status Color Indicators:**
- 🔴 Red: Critical/Overdue (#e53e3e)
- 🟠 Orange: Major (#dd6b20)
- 🟡 Yellow: Minor (#ecc94b)
- 🟢 Green: Closed (#38a169)

---

## Screen 6: Search Results

**Purpose:** Display search results grouped by pillar for easy scanning

**Route:** `/search?q={searchTerm}`

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [SMETA Logo]  SMETA Compliance Platform    [🔍 Search...] [📤 Upload] │
└─────────────────────────────────────────────────────────────┘
│ Home > Search Results                                       │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  Search results for: "fire drill"                  12 found │
│                                                              │
│  ▼ Pillar 2: Health & Safety (8 results)                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 📄  Fire Drill Report - January 2025                   │ │
│  │     Pillar 2 > Evidence                                │ │
│  │     ...monthly fire drill conducted on Jan 15, 2025... │ │
│  │     Uploaded: Jan 16, 2025                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [Back to Dashboard]                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Component Breakdown

**Search Header:**
- Query: Typography variant="h5" - "Search results for: '{term}'"
- Count: Typography variant="body2" color="text.secondary" (right-aligned)

**Result Groups:**
- **Component:** Accordion (one per pillar with results)
- **Header:** Pillar name + result count for that pillar
- **Default:** All expanded

**Result Cards:**
- **Component:** Card with CardActionArea
- **Content:**
  - File icon: 24px (top-left)
  - Document name: Typography variant="h6" bold
  - Breadcrumb: Typography variant="caption" - "Pillar > Category"
  - Snippet: Typography variant="body2" - Search term highlighted (mark tag or styled span)
  - Date: Typography variant="caption" (bottom)
- **Hover:** Elevation increase
- **Click:** Opens document viewer modal

**Back Button:**
- Component: Button variant="text" with ArrowBackIcon
- Returns to dashboard

### No Results State

```
┌─────────────────────────────────────┐
│                                     │
│              🔍                     │
│                                     │
│   No documents found for "xyz"      │
│                                     │
│   Suggestions:                      │
│   • Check spelling                  │
│   • Try different keywords          │
│   • Browse by pillar                │
│                                     │
│   [Back to Dashboard]               │
│                                     │
└─────────────────────────────────────┘
```

---

**[← Back to User Flows](./03-user-flows.md) | [Next: Component Library →](./05-component-library.md)**
