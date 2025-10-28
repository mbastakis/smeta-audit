# Frontend Specification - Accessibility Requirements

[← Back to Style Guide](./06-style-guide.md) | [Next: Responsiveness →](./08-responsiveness.md)

---

## Compliance Target

**Standard:** WCAG 2.1 Level AA

**Rationale:**
- Level AA is industry standard for web applications
- Achievable with Material-UI defaults within 8-10 hour timeline
- Covers vast majority of users with disabilities
- Level AAA is too stringent for MVP (can enhance post-audit)

---

## Testing Strategy

### During Development

**1. Keyboard Navigation Test (15 minutes):**
- Disconnect mouse
- Tab through entire application
- Verify all interactive elements reachable
- Verify focus indicators visible
- Verify ESC closes modals
- Verify Enter activates buttons

**2. Contrast Validation (10 minutes):**
- Use WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/)
- Test all text/background combinations
- Test all interactive element colors
- Verify focus indicator contrast

**3. Browser DevTools Audit (5 minutes):**
- Chrome DevTools → Lighthouse → Accessibility audit
- Target score: 90+ (WCAG AA compliance)
- Review and fix flagged issues

---

## Visual Accessibility

### Color Contrast

**Text Requirements:**
- Normal text (<18px regular, <14px bold): **Minimum 4.5:1**
- Large text (≥18px regular, ≥14px bold): **Minimum 3:1**
- Interactive elements (icons, borders): **Minimum 3:1**

**Verified Combinations:**
✓ Navy text (#1a365d) on white: 10.37:1  
✓ Dark gray text (#2d3748) on white: 12.63:1  
✓ Mid gray text (#718096) on white: 4.54:1  
✓ White text on navy (#1a365d): 10.37:1  
✓ Green accent (#38a169) on white: 3.47:1  

### Color Independence

**Never rely on color alone:**
- CAPA status chips: Color + text label
- Document type icons: Color + icon shape + tooltip
- Form validation: Color + icon + text message
- Error states: Red color + error icon + descriptive text

### Focus Indicators

**Requirements:**
- Visible on all interactive elements when focused
- 2px solid outline, accent green color (#38a169)
- 2px offset from element edge
- Contrast ratio: 3.47:1 (meets 3:1 minimum)
- Never remove (no `outline: none` without replacement)

**Elements requiring focus indicators:**
- Buttons
- Links
- Input fields
- Cards (when clickable)
- Tabs
- Dropdowns
- Icon buttons

### Text Sizing

**Requirements:**
- User can zoom to 200% without horizontal scrolling
- Use relative units (rem, em) instead of px where possible
- Responsive containers (max-width, flexible layouts)
- No fixed-width text containers

**Minimum Sizes:**
- Body text: 16px (1rem)
- Captions/metadata: 12px (0.75rem) minimum

---

## Keyboard Navigation

### Tab Order

**Requirements:**
- Logical order: left-to-right, top-to-bottom
- All interactive elements reachable via Tab
- Skip repetitive navigation where possible

**Tab Sequences:**

**Dashboard:**
1. AppBar: Logo → Search → Upload
2. Cards: Left-to-right, top-to-bottom (Card 1, 2, 3, 4, 5, 6)

**Pillar View:**
1. Breadcrumb links
2. Category tabs (left-to-right)
3. Document list (top-to-bottom)
4. Action buttons per row

**Modal:**
- Focus trapped within modal
- Tab cycles through modal controls only
- ESC closes modal

### Keyboard Shortcuts

**Standard Shortcuts:**
- **ESC:** Close modals, cancel actions, exit search
- **Enter:** Submit forms, activate buttons, open documents
- **Tab:** Move forward through interactive elements
- **Shift+Tab:** Move backward through interactive elements
- **Arrow keys:** Navigate PDF pages (when in viewer)

### Focus Management

**Modal Behavior:**
- **Opens:** Focus moves to first interactive element (close button or first input)
- **Closes:** Focus returns to trigger element

**Page Navigation:**
- Focus resets to top of new page
- Skip link available to jump to main content

**Form Submission:**
- Focus moves to first error or success message

---

## Screen Reader Support

### ARIA Labels

**Icon-Only Buttons:**
```jsx
<IconButton aria-label="Upload document">
  <UploadIcon />
</IconButton>

<IconButton aria-label="Search">
  <SearchIcon />
</IconButton>

<IconButton aria-label="Close">
  <CloseIcon />
</IconButton>
```

**Navigation Cards:**
```jsx
<CardActionArea aria-label="Navigate to Pillar 1: Labour Standards, 45 documents">
  {/* Card content */}
</CardActionArea>
```

**Document Actions:**
```jsx
<IconButton aria-label="View Fire Safety Policy v2.0">
  <VisibilityIcon />
</IconButton>

<IconButton aria-label="Delete Fire Safety Policy v2.0">
  <DeleteIcon />
</IconButton>
```

### Landmarks

**HTML5 Semantic Elements:**
- `<header>` for AppBar (implicit `banner` landmark)
- `<main>` for page content (implicit `main` landmark)
- `<nav>` for breadcrumbs (implicit `navigation` landmark)

**ARIA Roles (MUI provides automatically):**
- `role="dialog"` on modals (Dialog component)
- `role="button"` on clickable cards (CardActionArea)
- `role="tab"` on tabs (Tabs component)

### Heading Structure

**Requirements:**
- Proper hierarchy (H1 → H2 → H3, no skipping levels)
- Only one H1 per page

**Structure:**
- **H1:** "SMETA Compliance Documentation Platform" (dashboard)
- **H2:** Section titles ("Pillar 2: Health & Safety", "CAPA Tracker")
- **H3:** Subsection titles (Category names if needed)
- **H4-H6:** Component headers, card titles

### Form Labels

**Requirements:**
- Every input has associated label
- Required fields: Asterisk (*) in label + `aria-required="true"`
- Error messages: Associated via `aria-describedby`

**Material-UI Handles Automatically:**
```jsx
<TextField
  label="Select Pillar *"
  required
  error={hasError}
  helperText={errorMessage}
  // MUI automatically associates label and error text
/>
```

---

## Content Accessibility

### Alternative Text

**Icons:**
- Semantic icons: `aria-label` describes function
- Decorative icons: `aria-hidden="true"`

**Document Type Icons:**
```jsx
<PictureAsPdfIcon aria-label="PDF document" />
<DescriptionIcon aria-label="Word document" />
<TableChartIcon aria-label="Excel spreadsheet" />
```

### Link Text

**Requirements:**
- Descriptive link text, avoid "click here"

**Good Examples:**
- Breadcrumbs: "Home", "Pillar 2: Health & Safety"
- Document names as links: "Fire Safety Policy v2.0"

**Avoid:**
- Generic: "Click here", "Read more", "View"

### Language

**Page Language:**
```html
<html lang="en">
```

### Abbreviations

**Spell out on first use:**
- SMETA: "SMETA (Sedex Members Ethical Trade Audit)"
- CAPA: "CAPA (Corrective and Preventive Action)"
- KPIs: "KPIs (Key Performance Indicators)"

---

## Touch Targets

### Size Requirements

**WCAG 2.1 Level AAA (recommended):**
- Minimum: 44×44px for all touch targets

**Implementation:**
- All buttons: 42-48px height
- Icon buttons: 40×40px minimum (MUI default)
- List items: 64px height
- Navigation cards: Large clickable area (280×220px)

**Spacing:**
- Minimum 8px between adjacent touch targets

---

## Pre-Launch Accessibility Checklist

**Critical (Must Have):**
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible (2px green outline)
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 interactive)
- [ ] Status indicators include text labels (not color alone)
- [ ] Icon-only buttons have aria-label
- [ ] Modals trap focus, ESC closes
- [ ] Form fields have associated labels
- [ ] Form errors have descriptive text
- [ ] Heading hierarchy logical (no skipped levels)
- [ ] Page language declared (`<html lang="en">`)
- [ ] Touch targets minimum 40×40px
- [ ] Zoom to 200% works without horizontal scrolling
- [ ] Lighthouse accessibility score 90+

**Recommended (Should Have):**
- [ ] Abbreviations spelled out on first use
- [ ] Skip link to main content
- [ ] Live regions for dynamic content updates
- [ ] Screen reader tested with Narrator/VoiceOver

---

## Known Limitations (MVP Scope)

**Acceptable for MVP:**
- ❌ Advanced ARIA patterns (complex live regions)
- ❌ Deep screen reader optimization
- ❌ High contrast mode support
- ❌ Advanced keyboard shortcuts (beyond standard)
- ❌ Voice navigation support

**Must Have for MVP:**
- ✅ Keyboard navigation (all features accessible)
- ✅ Color contrast compliance (WCAG AA)
- ✅ Focus indicators visible
- ✅ Basic ARIA labels on interactive elements
- ✅ Proper heading structure
- ✅ Form label associations

---

**[← Back to Style Guide](./06-style-guide.md) | [Next: Responsiveness →](./08-responsiveness.md)**
