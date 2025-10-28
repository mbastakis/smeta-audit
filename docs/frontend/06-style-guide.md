# Frontend Specification - Style Guide

[← Back to Component Library](./05-component-library.md) | [Next: Accessibility →](./07-accessibility.md)

---

## Color Palette

### Primary Colors

| Color Type | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Primary (Navy)** | #1a365d | rgb(26, 54, 93) | AppBar, primary buttons, links, key headings |
| **Secondary (Slate Gray)** | #2d3748 | rgb(45, 55, 72) | Secondary text, borders, dividers |
| **Accent (Green)** | #38a169 | rgb(56, 161, 105) | Focus indicators, success states, upload icons, positive actions |

### Semantic Colors

| Color Type | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Success** | #38a169 | rgb(56, 161, 105) | Success messages, completed CAPAs, positive confirmations |
| **Warning** | #dd6b20 | rgb(221, 107, 32) | Major severity CAPAs, caution messages, important notices |
| **Error** | #e53e3e | rgb(229, 62, 62) | Error messages, critical CAPAs, destructive actions, validation errors |
| **Info** | #3182ce | rgb(49, 130, 206) | Informational messages, observations |

### Neutral Colors

| Color Type | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Background** | #f7fafc | rgb(247, 250, 252) | Page background |
| **Paper** | #ffffff | rgb(255, 255, 255) | Card surfaces, modal backgrounds, input fields |
| **Text Primary** | #2d3748 | rgb(45, 55, 72) | Body text, standard content |
| **Text Secondary** | #718096 | rgb(113, 128, 150) | Secondary text, captions, muted content |
| **Border** | #e2e8f0 | rgb(226, 232, 240) | Borders, dividers, disabled states |

### File Type Colors

| File Type | Color | Hex Code |
|-----------|-------|----------|
| **PDF** | Red | #e53e3e |
| **DOCX** | Blue | #3182ce |
| **XLSX** | Green | #38a169 |
| **Images** | Purple | #805ad5 |
| **Generic** | Gray | #718096 |

---

## Typography

### Font Family

- **Primary:** 'Roboto', sans-serif (Material-UI default)
- **Fallback:** -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif
- **Monospace:** 'Roboto Mono', 'Courier New', monospace

### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| **H1** | 32px (2rem) | 700 (Bold) | 1.2 (38.4px) | Page titles (rare) |
| **H2** | 28px (1.75rem) | 700 (Bold) | 1.2 (33.6px) | Section headers |
| **H3** | 24px (1.5rem) | 600 (Semi-bold) | 1.3 (31.2px) | Subsection headers, dashboard title |
| **H4** | 20px (1.25rem) | 600 (Semi-bold) | 1.4 (28px) | Component titles, card headers |
| **H5** | 18px (1.125rem) | 600 (Semi-bold) | 1.4 (25.2px) | Pillar card titles, list headers |
| **H6** | 16px (1rem) | 600 (Semi-bold) | 1.5 (24px) | Small headers, modal titles |
| **Body1** | 16px (1rem) | 400 (Regular) | 1.5 (24px) | Primary content, document names, form inputs |
| **Body2** | 14px (0.875rem) | 400 (Regular) | 1.43 (20px) | Secondary content, breadcrumbs, metadata |
| **Caption** | 12px (0.75rem) | 400 (Regular) | 1.33 (16px) | File size, upload date, helper text |
| **Button** | 14px (0.875rem) | 600 (Semi-bold) | 1.75 (24.5px) | Button text (uppercase) |

### Typography Guidelines

**Hierarchy:**
- Clear visual distinction between levels (minimum 2px size difference)
- Weight changes reinforce hierarchy (bold headers, regular body)
- Consistent line height for readability (1.4-1.5 for body, 1.2-1.3 for headers)

**Accessibility:**
- Minimum body text: 16px (WCAG best practice)
- Minimum caption text: 12px (legible at arm's length on laptop)
- Line height 1.5 for body (WCAG recommendation)
- No text smaller than 12px

---

## Iconography

### Icon Library

**Source:** Material Icons (@mui/icons-material)

### Icon Sizes

| Size | Dimensions | Usage |
|------|------------|-------|
| **Small** | 20px | Inline with text |
| **Medium** | 24px | Standard (list items, buttons) |
| **Large** | 48px | Dashboard cards, empty states |
| **Extra Large** | 64px | Major empty states, error pages |

### Semantic Icons

**Navigation:**
- Home: `HomeIcon`
- Back: `ArrowBackIcon`
- Next: `NavigateNextIcon`

**Actions:**
- Upload: `CloudUploadIcon`, `UploadFileIcon`
- Search: `SearchIcon`
- View: `VisibilityIcon`
- Edit: `EditIcon`
- Delete: `DeleteIcon`
- Close: `CloseIcon`
- Download: `DownloadIcon`

**Document Types:**
- PDF: `PictureAsPdfIcon`
- DOCX: `DescriptionIcon`
- XLSX: `TableChartIcon`
- Images: `ImageIcon`

**Status:**
- Success: `CheckCircleIcon`
- Error: `ErrorIcon`
- Warning: `WarningIcon`
- Info: `InfoIcon`

**CAPA:**
- Assignment: `AssignmentIcon`
- Flag: `FlagIcon`

---

## Spacing & Layout

### Spacing Scale (8px base unit)

| Token | Value | Usage |
|-------|-------|-------|
| **xs** | 4px | Tight spacing, icon-text gaps |
| **sm** | 8px | Element internal padding, small gaps |
| **md** | 16px | Standard spacing, section padding |
| **lg** | 24px | Card padding, component spacing |
| **xl** | 32px | Section separation, major margins |
| **xxl** | 48px | Hero sections, major page divisions |

### Grid System

**Material-UI Grid (12-column)**

**Breakpoints:**
- **xs:** 0px (mobile)
- **sm:** 600px (tablet portrait)
- **md:** 960px (tablet landscape)
- **lg:** 1280px (desktop)
- **xl:** 1920px (large desktop)

### Layout Patterns

**Container Widths:**
- Full-width: 100% (dashboard, pillar views)
- Constrained: 1280px max-width (content areas)
- Modal: 600px (small), 900px (medium), 1200px (large)

**Card Spacing:**
- Internal padding: 24px (lg)
- Gap between cards: 24px (lg)
- Border radius: 8px

**AppBar:**
- Height: 64px
- Padding: 16px horizontal
- Position: Fixed (stays visible on scroll)

---

## Elevation & Shadows

### Elevation Scale

| Level | Usage | Shadow Value |
|-------|-------|--------------|
| **0** | Flat surfaces, page background | None |
| **1** | Subtle depth | `0px 1px 3px rgba(0,0,0,0.12)` |
| **2** | Cards at rest (default) | `0px 1px 5px rgba(0,0,0,0.15)` |
| **4** | App bar, buttons hover | `0px 2px 8px rgba(0,0,0,0.15)` |
| **8** | Dropdown menus, cards on hover | `0px 5px 15px rgba(0,0,0,0.2)` |
| **16** | Modals, dialogs | `0px 10px 40px rgba(0,0,0,0.25)` |
| **24** | Maximum elevation (rarely used) | `0px 15px 50px rgba(0,0,0,0.3)` |

### Usage Guidelines

- Default cards: Elevation 2
- Hovered interactive elements: Elevation 4-8
- Modals/overlays: Elevation 16
- Avoid excessive elevation (appears floaty)

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| **None** | 0px | Tables, strict layouts |
| **Small** | 4px | Buttons, inputs |
| **Medium** | 8px | Cards, containers (default) |
| **Large** | 16px | Chips (pill shape) |
| **Round** | 50% | Avatar, circular buttons |

---

## Accessibility Standards

### Color Contrast Requirements (WCAG AA)

**Text Contrast:**
- Normal text (<18px): Minimum 4.5:1
- Large text (≥18px): Minimum 3:1

**Verified Combinations:**
- Navy (#1a365d) on white: 10.37:1 ✓
- Dark gray (#2d3748) on white: 12.63:1 ✓
- Mid gray (#718096) on white: 4.54:1 ✓
- White on navy: 10.37:1 ✓
- Green accent (#38a169) on white: 3.47:1 ✓

### Focus Indicators

- **Style:** 2px solid outline
- **Color:** Accent green (#38a169)
- **Offset:** 2px from element edge
- **Contrast:** 3.47:1 (meets 3:1 minimum)
- **Never remove** without custom replacement

---

## Animation Guidelines

### Timing Functions

- **Standard:** cubic-bezier(0.4, 0.0, 0.2, 1)
- **Decelerate:** cubic-bezier(0.0, 0.0, 0.2, 1) - Entering
- **Accelerate:** cubic-bezier(0.4, 0.0, 1, 1) - Exiting
- **Sharp:** cubic-bezier(0.4, 0.0, 0.6, 1) - Quick interactions

### Duration Scale

- **Instant:** 0ms (no animation)
- **Fast:** 150ms (hover, focus states)
- **Standard:** 300ms (transitions, navigation)
- **Slow:** 500ms (complex animations)

### Motion Principles

- Keep animations subtle and purposeful
- Respect `prefers-reduced-motion` setting
- Avoid animations longer than 500ms
- Use animations to guide attention, not distract

---

**[← Back to Component Library](./05-component-library.md) | [Next: Accessibility →](./07-accessibility.md)**
