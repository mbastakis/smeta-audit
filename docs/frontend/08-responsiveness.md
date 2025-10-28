# Frontend Specification - Responsiveness Strategy

[← Back to Accessibility](./07-accessibility.md) | [Next: Animation →](./09-animation.md)

---

## Overview

The SMETA Compliance Platform is **desktop-first**, optimized primarily for laptop use during audits. Mobile and tablet support is functional but secondary.

---

## Breakpoints

| Breakpoint | Min Width | Max Width | Target Devices | Priority |
|------------|-----------|-----------|----------------|----------|
| **Mobile** | 0px | 599px | Phones | Low |
| **Tablet** | 600px | 959px | Tablets (portrait) | Low |
| **Desktop** | 960px | 1279px | Small laptops, tablet landscape | Medium |
| **Large Desktop** | 1280px | 1919px | Standard laptops/desktops | **High (primary)** |
| **Wide** | 1920px | - | Large monitors | Medium |

**Critical Breakpoint:** 1366×768 (minimum audit laptop resolution per PRD)

**Testing Priorities:**
1. **1366×768** (minimum audit laptop) - MUST work perfectly
2. **1920×1080** (standard laptop) - SHOULD work perfectly
3. **960-1279px** (small laptop) - SHOULD work acceptably
4. **<960px** (tablet/mobile) - MAY work with compromises

---

## Layout Adaptations

### Dashboard (Navigation Cards)

**Large Desktop (≥1280px):**
- 3 columns × 2 rows
- Card size: 280px × 220px
- Gap: 24px

**Desktop (960-1279px):**
- 2 columns × 3 rows
- Card size: Flexible width (50% - gap)
- Gap: 24px

**Tablet (600-959px):**
- 1 column × 6 rows
- Card size: 100% width, auto height
- Gap: 16px

**Mobile (<600px):**
- Same as tablet (1 column)
- Reduced padding: 8px sides

**Implementation:**
```jsx
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={4}>
    <NavigationCard />
  </Grid>
</Grid>
```

---

### Pillar View (Document List)

**Desktop/Large Desktop (≥960px):**
- Table layout with columns: Icon | Name | Date | Size | Actions
- Full metadata visible
- Actions inline (icon buttons)

**Tablet (600-959px):**
- Table layout compressed
- Size column hidden (less critical)
- Actions in dropdown menu (3-dot icon)

**Mobile (<600px):**
- List layout (not table)
- Stacked information:
  ```
  [Icon] Document Name
         Date | Actions menu
  ```
- Date format abbreviated (e.g., "Jan 15")
- Actions in dropdown menu

---

### CAPA Tracker (Two-Column Layout)

**Desktop/Large Desktop (≥960px):**
- Side-by-side layout
- List: 40% width | Details: 60% width

**Tablet/Mobile (<960px):**
- Stacked layout (master-detail pattern)
- List view first (full width)
- Selecting CAPA navigates to detail view (full width)
- "Back to List" button for navigation

---

### Modals

**Desktop/Large Desktop (≥960px):**
- Modal width: 90% viewport (max 1200px for large, 600px for small)
- Modal height: 90% viewport
- Centered on screen

**Tablet (600-959px):**
- Modal width: 95% viewport
- Modal height: 90% viewport

**Mobile (<600px):**
- Modal: Full-screen (100% width × 100% height)
- Slide-up animation instead of fade-in
- Close button top-left (easier thumb reach)

---

## Navigation Adaptations

### AppBar

**Desktop/Large Desktop (≥960px):**
- All elements visible: Logo | Platform Name | Search (400px) | Upload
- Search bar: 400px width

**Tablet (600-959px):**
- Search bar: Flexible width (grows to fill space)
- Upload button: Icon only (text hidden)

**Mobile (<600px):**
- Logo abbreviated: "SMETA" only
- Search: Icon opens full-screen search overlay
- Upload: Icon only

---

### Breadcrumbs

**Desktop (≥960px):**
- Full text visible: "Home > Pillar 2: Health & Safety"

**Tablet/Mobile (<960px):**
- Simplified to "< Back" button
- Or: "Home > Pillar 2" (truncate pillar name)

---

### Category Tabs

**Desktop (≥960px):**
- All tabs visible: [Policies] [Procedures] [Forms] [Evidence]

**Tablet (600-959px):**
- All tabs visible, labels may abbreviate if needed
- Or: Scrollable tabs (horizontal scroll)

**Mobile (<600px):**
- Dropdown menu (replaces tabs)
- Shows selected category: [Policies ▼]
- Click opens menu with all options

---

## Content Priority

### Always Visible (Critical)
1. Navigation to pillars (dashboard cards)
2. Document names and view action
3. Upload functionality
4. Search capability
5. Core CAPA information (ID, status, description)

### Can Be Hidden/Adapted (Secondary)
1. File size metadata (nice-to-have)
2. Upload date (abbreviate or hide)
3. Full breadcrumb trail (simplify to "Back")
4. Helper text in forms (show on focus/error only)
5. Icon labels (show icons only, add tooltips)

---

## Interaction Changes

### Touch vs. Mouse

**Desktop (Mouse Primary):**
- Hover states visible
- Icon buttons: 40×40px (adequate for mouse)
- Double-click not used
- Right-click not used

**Mobile/Tablet (Touch Primary):**
- Hover states skipped (go straight to active)
- Touch targets: Minimum 44×44px
- Gestures: Swipe to delete (optional enhancement)
- Long-press not used

### Upload Interaction

**Desktop:**
- Drag-and-drop primary interaction
- "Browse files" as secondary option

**Mobile:**
- "Browse files" button primary
- Drag-and-drop difficult on mobile

### Document Viewer

**Desktop:**
- PDF zoom controls visible
- Mouse wheel zoom enabled
- Click and drag to pan

**Mobile:**
- Pinch-to-zoom for PDF
- Swipe to change pages
- Zoom controls smaller/hidden

---

## Testing Requirements

### Required Testing Resolutions

**Must Test (Pre-Audit):**
1. **1366×768** - Full functionality test
2. **1920×1080** - Full functionality test
3. **1280×800** - Basic layout check

**Nice to Test (If time permits):**
4. **960×600** - Layout doesn't break
5. **375×667** - Basic mobile view works

### Testing Method

- Chrome DevTools → Device Toolbar
- Resize viewport to each resolution
- Test critical flows: Upload, view document, search

### Critical Test Cases

**1366×768:**
- [ ] Dashboard: 3 cards per row visible
- [ ] Document list: All columns visible
- [ ] Modal: Doesn't exceed viewport height
- [ ] Upload: Drag-and-drop area adequately sized
- [ ] CAPA: Two-column layout works

**1920×1080:**
- [ ] Same as 1366×768
- [ ] No excessive white space

---

## Known Limitations (MVP Scope)

**Acceptable:**
- Mobile experience functional but not optimized (low priority per PRD)
- Tablet portrait may have cramped CAPA layout
- Small laptops (<1280px) may require horizontal scroll for wide modals
- Very large screens (>1920px) may have excessive white space

**Not Supported:**
- Portrait orientation on small phones (<375px width)
- Landscape orientation on phones (untested)
- IE11/older browsers (modern browsers only)

---

## Implementation Notes

### Material-UI Grid System

```jsx
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={4}>
    <NavigationCard />
  </Grid>
</Grid>
```
- **xs:** Mobile (12 columns = full width)
- **sm:** Tablet (6 columns = 2 per row)
- **md:** Desktop (4 columns = 3 per row)

### Hidden Components

```jsx
// Hide on mobile, show on desktop
<Box sx={{ display: { xs: 'none', md: 'block' } }}>
  Desktop-only content
</Box>

// Show only on mobile
<Box sx={{ display: { xs: 'block', md: 'none' } }}>
  Mobile-only content
</Box>
```

### Responsive Typography

```jsx
<Typography 
  variant="h3" 
  sx={{ 
    fontSize: { xs: '1.5rem', md: '2rem' } 
  }}
>
  Heading
</Typography>
```

### Responsive Spacing

```jsx
<Box sx={{ 
  padding: { xs: 1, sm: 2, md: 3 },
  margin: { xs: 2, md: 4 }
}}>
  Content
</Box>
```

---

**[← Back to Accessibility](./07-accessibility.md) | [Next: Animation →](./09-animation.md)**
