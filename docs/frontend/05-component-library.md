# Frontend Specification - Component Library

[← Back to Screen Layouts](./04-screen-layouts.md) | [Next: Style Guide →](./06-style-guide.md)

---

## Design System Approach

**Strategy:** Adopt Material-UI v5 with themed customization

**Rationale:**
- **Speed:** Pre-built accessible components, no need to build from scratch (critical for 8-10 hour timeline)
- **Professional:** Material Design is widely recognized, trusted aesthetic
- **Consistent:** Built-in design tokens ensure visual coherence
- **Accessible:** WCAG AA compliant out-of-the-box
- **Documentation:** Extensive docs enable fast developer implementation

**Customization Level:** Minimal (Theme Override Only)
- Override color palette to match SMETA branding (navy, green)
- Adjust typography scale for clarity
- Configure spacing/elevation as needed
- **Use MUI components as-is** (no custom component wrappers for MVP)

---

## Core Components Reference

This section documents the 10 most important components used throughout the application, with implementation guidance.

---

### 1. Navigation Card

**Purpose:** Clickable card on dashboard for navigating to pillars/sections

**MUI Components Used:**
- `Card` (root container)
- `CardActionArea` (makes entire card clickable)
- `CardContent` (content wrapper)
- `SvgIcon` (pillar icon)
- `Typography` (title, subtitle)
- `Chip` (document count badge)

**Visual Specs:**
- Dimensions: 280px width × 220px height
- Padding: 24px all sides
- Border radius: 8px (MUI default)
- Elevation: 2 (rest), 8 (hover)
- Icon size: 48px, accent green color (#38a169)
- Title: h5 typography, bold (600 weight)
- Subtitle: body2 typography, muted color (#666)

**States:**
- **Default:** Elevation 2, white background
- **Hover:** Elevation 8, scale 1.02, cursor pointer, duration 200ms
- **Focus:** 2px accent green outline
- **Loading:** Skeleton animation in badge area

**Usage Example:**
```jsx
<Card elevation={2} sx={{ width: 280, height: 220 }}>
  <CardActionArea onClick={() => navigate('/pillar-1')}>
    <CardContent sx={{ textAlign: 'center', padding: 3 }}>
      <GroupIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
      <Typography variant="h5" fontWeight="bold">
        Pillar 1
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Labour Standards
      </Typography>
      <Chip label="45 docs" size="small" sx={{ mt: 2 }} />
    </CardContent>
  </CardActionArea>
</Card>
```

---

### 2. Document List Item

**Purpose:** Display document metadata in pillar category views

**MUI Components Used:**
- `ListItem` (container)
- `ListItemIcon` (file type icon)
- `ListItemText` (document name, metadata)
- `IconButton` (view, delete actions)
- `Tooltip` (show full filename if truncated)

**Visual Specs:**
- Height: 64px (comfortable tap target)
- Padding: 16px horizontal
- File icon: 24px, color-coded by type (PDF=red, DOCX=blue, XLSX=green, Image=purple)
- Document name: body1 typography, truncate at 60 chars
- Metadata (size, date): caption typography, muted color

**States:**
- **Default:** White background
- **Hover:** Light gray background (#f5f5f5), duration 150ms

**Usage Example:**
```jsx
<ListItem
  sx={{ '&:hover': { bgcolor: 'grey.50' } }}
  secondaryAction={
    <>
      <IconButton edge="end" aria-label="view" onClick={handleView}>
        <VisibilityIcon />
      </IconButton>
      <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </>
  }
>
  <ListItemIcon>
    <PictureAsPdfIcon sx={{ color: 'error.main' }} />
  </ListItemIcon>
  <ListItemText
    primary="Fire Safety Policy v2.0"
    secondary="2.3 MB • Jan 15, 2025"
  />
</ListItem>
```

---

### 3. Upload Drop Zone

**Purpose:** Drag-and-drop area for file uploads

**MUI Components Used:**
- `Box` (container with react-dropzone integration)
- `Typography` (instructions, file preview)
- `CloudUploadIcon` (upload icon)
- `Button` (browse files fallback)

**Visual Specs:**
- Dimensions: 100% width × 200px height
- Border: 2px dashed #999 (default), 2px solid green (active)
- Border radius: 8px
- Background: White (default), light green (#e8f5e9) on drag hover
- Icon: 48px, centered, gray (default) / green (hover)

**States:**
- **Default:** Dashed border, gray
- **Drag hover:** Solid green border, light green background
- **File selected:** Solid green border, file preview visible
- **Error:** Solid red border, error message
- **Disabled:** Opacity 0.5, cursor not-allowed

**Usage Example:**
```jsx
<Box
  {...getRootProps()}
  sx={{
    border: '2px dashed',
    borderColor: isDragActive ? 'success.main' : 'grey.400',
    bgcolor: isDragActive ? 'success.light' : 'background.paper',
    borderRadius: 1,
    p: 4,
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
      borderColor: 'success.main',
      bgcolor: 'success.light'
    }
  }}
>
  <input {...getInputProps()} />
  <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
  <Typography variant="body1">
    Drag and drop file here, or click to browse
  </Typography>
  <Typography variant="caption" color="text.secondary">
    Supported: PDF, DOCX, XLSX, JPG, PNG (Max 50MB)
  </Typography>
</Box>
```

---

### 4. Document Viewer Modal

**Purpose:** Full-screen modal for viewing PDF documents in-browser

**MUI Components Used:**
- `Dialog` (modal container, maxWidth: 'lg', fullWidth)
- `DialogTitle` (document name + close button)
- `DialogContent` (PDF viewer area)
- `AppBar` (toolbar for zoom/navigation controls)
- `IconButton` (zoom, navigate, close actions)
- `CircularProgress` (loading state)

**Visual Specs:**
- Modal size: 90vw × 90vh
- Backdrop: rgba(0, 0, 0, 0.5)
- Header height: 64px
- Toolbar height: 56px
- Content area: Remaining height, scrollable

**States:**
- **Loading:** Circular progress spinner centered
- **Loaded:** PDF rendered with controls
- **Error:** Error message with download fallback button

**Usage Example:**
```jsx
<Dialog
  open={open}
  onClose={handleClose}
  maxWidth="lg"
  fullWidth
  PaperProps={{
    sx: { width: '90vw', height: '90vh' }
  }}
>
  <DialogTitle>
    Fire Safety Policy v2.0
    <IconButton
      aria-label="close"
      onClick={handleClose}
      sx={{ position: 'absolute', right: 8, top: 8 }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <AppBar position="static" color="default" elevation={0}>
    <Toolbar variant="dense">
      <IconButton onClick={handleZoomOut}><ZoomOutIcon /></IconButton>
      <IconButton onClick={handleZoomIn}><ZoomInIcon /></IconButton>
      <Button onClick={handleFitWidth}>Fit to Width</Button>
      <Box sx={{ flexGrow: 1 }} />
      <Typography>Page 1 of 12</Typography>
      <IconButton onClick={handlePrevPage}><ArrowBackIcon /></IconButton>
      <IconButton onClick={handleNextPage}><ArrowForwardIcon /></IconButton>
    </Toolbar>
  </AppBar>
  <DialogContent>
    {loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    ) : (
      <Document file={pdfUrl}>
        <Page pageNumber={pageNumber} />
      </Document>
    )}
  </DialogContent>
</Dialog>
```

---

### 5. Status Chip (CAPA)

**Purpose:** Visual indicator for CAPA status and severity

**MUI Components Used:**
- `Chip` (base component)

**Visual Specs:**
- Size: Small variant (24px height)
- Border radius: 16px (pill shape)
- Font: 12px, bold (600 weight)
- Padding: 4px horizontal

**Color Coding:**
- **Critical/Overdue:** Red background (#e53e3e), white text
- **Major:** Orange background (#dd6b20), white text
- **Minor:** Yellow background (#ecc94b), dark text (#2d3748)
- **Observation:** Blue background (#3182ce), white text
- **Closed:** Green background (#38a169), white text

**Usage Example:**
```jsx
// Critical CAPA
<Chip
  label="Critical"
  size="small"
  sx={{
    bgcolor: 'error.main',
    color: 'white',
    fontWeight: 'bold'
  }}
/>

// Closed CAPA
<Chip
  label="Closed"
  size="small"
  sx={{
    bgcolor: 'success.main',
    color: 'white',
    fontWeight: 'bold'
  }}
/>
```

---

### 6. Search Bar

**Purpose:** Global search input for finding documents

**MUI Components Used:**
- `TextField` (base input, variant: outlined)
- `InputAdornment` (search icon, loading spinner)
- `Autocomplete` (type-ahead suggestions)

**Visual Specs:**
- Width: 400px (desktop), 100% (mobile)
- Height: 48px
- Border: 1px solid #ccc (default), 2px solid green (focus)
- Border radius: 24px (pill shape)
- Search icon: Left side, 24px, gray
- Placeholder: "Search documents..." gray (#999)

**States:**
- **Default:** Gray border, placeholder visible
- **Focus:** Accent green border (2px), placeholder fades
- **Active typing:** Shows type-ahead suggestions dropdown
- **Loading:** Spinner icon in right end
- **Error:** Red border

**Usage Example:**
```jsx
<TextField
  variant="outlined"
  placeholder="Search documents..."
  sx={{
    width: 400,
    '& .MuiOutlinedInput-root': {
      borderRadius: '24px',
      '&.Mui-focused fieldset': {
        borderColor: 'success.main',
        borderWidth: 2
      }
    }
  }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    )
  }}
/>
```

---

### 7. Form Dropdown (Pillar/Category Selection)

**Purpose:** Select pillar and category during document upload

**MUI Components Used:**
- `FormControl` (wrapper)
- `InputLabel` (field label)
- `Select` (dropdown)
- `MenuItem` (options)
- `FormHelperText` (error messages)

**Visual Specs:**
- Width: 100% (within modal)
- Height: 56px
- Border: 1px solid #ccc, 2px green on focus, 2px red on error
- Border radius: 4px (MUI default)
- Required indicator: Red asterisk after label

**States:**
- **Default:** Closed, shows selected value or placeholder
- **Open:** Dropdown menu visible
- **Disabled:** Gray background, cursor not-allowed
- **Error:** Red border, error text below

**Usage Example:**
```jsx
<FormControl fullWidth required error={error}>
  <InputLabel>Select Pillar</InputLabel>
  <Select
    value={pillar}
    label="Select Pillar"
    onChange={handleChange}
  >
    <MenuItem value="pillar-1">Pillar 1: Labour Standards</MenuItem>
    <MenuItem value="pillar-2">Pillar 2: Health & Safety</MenuItem>
    <MenuItem value="pillar-3">Pillar 3: Business Ethics</MenuItem>
    <MenuItem value="pillar-4">Pillar 4: Environment</MenuItem>
    <MenuItem value="kpis">KPIs</MenuItem>
    <MenuItem value="capa">CAPA</MenuItem>
  </Select>
  {error && <FormHelperText>Please select a pillar</FormHelperText>}
</FormControl>
```

---

### 8. Action Button

**Purpose:** Primary and secondary action buttons throughout application

**MUI Components Used:**
- `Button` (base component)
- `CircularProgress` (loading state)
- `SvgIcon` (icons in buttons)

**Visual Specs:**
- Height: 42px (medium), 36px (small)
- Padding: 16px horizontal
- Border radius: 4px
- Font: 14px, bold (600 weight), uppercase

**Variants:**
- **Primary:** Navy background (#1a365d), white text, contained
- **Secondary:** Navy border (2px), navy text, outlined
- **Text:** No background, navy text
- **Danger:** Red background (#e53e3e), white text, contained

**States:**
- **Default:** Solid color, ready to click
- **Hover:** Darker shade, elevation increase (primary only), duration 150ms
- **Focus:** 2px outline, accent green
- **Active:** Pressed state, darker color
- **Disabled:** Gray, opacity 0.5, cursor not-allowed
- **Loading:** Spinner replaces text/icon

**Usage Example:**
```jsx
// Primary button
<Button
  variant="contained"
  color="primary"
  startIcon={<UploadIcon />}
  disabled={loading}
>
  {loading ? <CircularProgress size={24} /> : 'Upload Document'}
</Button>

// Danger button
<Button
  variant="contained"
  color="error"
  startIcon={<DeleteIcon />}
>
  Delete
</Button>
```

---

### 9. Snackbar Notification

**Purpose:** Temporary feedback messages for user actions

**MUI Components Used:**
- `Snackbar` (container)
- `Alert` (message content with severity styling)
- `IconButton` (close button)

**Visual Specs:**
- Position: Bottom-center (desktop), top-center (mobile)
- Width: Max 600px, min 300px
- Height: Auto (min 48px)
- Duration: 5 seconds (auto-dismiss success/info), manual dismiss (errors)
- Border radius: 4px

**Variants:**
- **Success:** Green background (#38a169), white text
- **Error:** Red background (#e53e3e), white text
- **Info:** Blue background (#3182ce), white text
- **Warning:** Orange background (#dd6b20), white text

**Usage Example:**
```jsx
<Snackbar
  open={open}
  autoHideDuration={5000}
  onClose={handleClose}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <Alert
    onClose={handleClose}
    severity="success"
    sx={{ width: '100%' }}
  >
    Document uploaded successfully!
  </Alert>
</Snackbar>
```

---

### 10. Breadcrumb Navigation

**Purpose:** Show current location and enable quick back-navigation

**MUI Components Used:**
- `Breadcrumbs` (container)
- `Link` (clickable breadcrumb items)
- `Typography` (current page, non-clickable)
- `NavigateNextIcon` (separator)

**Visual Specs:**
- Height: 40px
- Font: body2 typography (14px)
- Link color: Navy (#1a365d)
- Current page: Gray (#666), bold
- Separator: Gray chevron (›)

**Usage Example:**
```jsx
<Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
  <Link
    underline="hover"
    color="primary"
    href="/"
    onClick={handleHomeClick}
  >
    Home
  </Link>
  <Typography color="text.primary" fontWeight="bold">
    Pillar 2: Health & Safety
  </Typography>
</Breadcrumbs>
```

---

## Theme Configuration

**Material-UI Theme Override:**

```javascript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a365d', // Navy
    },
    secondary: {
      main: '#2d3748', // Slate Gray
    },
    success: {
      main: '#38a169', // Green
    },
    error: {
      main: '#e53e3e', // Red
    },
    warning: {
      main: '#dd6b20', // Orange
    },
    info: {
      main: '#3182ce', // Blue
    },
    background: {
      default: '#f7fafc', // Light Gray
      paper: '#ffffff', // White
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h3: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8, // 8px base unit
});

export default theme;
```

---

## Component Usage Guidelines

1. **Always use MUI components** - Don't create custom components for functionality that MUI provides
2. **Theme-based styling** - Use `sx` prop with theme tokens, avoid hardcoded values
3. **Responsive props** - Use responsive values: `sx={{ width: { xs: '100%', md: 400 } }}`
4. **Accessibility** - MUI components include ARIA attributes, don't remove them
5. **Consistent spacing** - Use theme spacing: `sx={{ mt: 3, p: 2 }}` (3 = 24px, 2 = 16px)

---

**[← Back to Screen Layouts](./04-screen-layouts.md) | [Next: Style Guide →](./06-style-guide.md)**
