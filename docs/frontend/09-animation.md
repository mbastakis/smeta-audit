# Frontend Specification - Animation & Micro-interactions

[← Back to Responsiveness](./08-responsiveness.md) | [Next: Implementation Guide →](./10-implementation-guide.md)

---

## Motion Principles

### Design Philosophy: "Purposeful, Not Flashy"

1. **Feedback over Flair** - Every animation communicates state or progress
2. **Speed over Spectacle** - Animations fast enough to feel responsive (150-300ms)
3. **Subtle over Showy** - Professional, understated motion
4. **Accessibility First** - Respect `prefers-reduced-motion` setting
5. **Performance Conscious** - GPU-accelerated properties only, 60fps target

### When to Animate

✅ State changes (hover, focus, active)  
✅ Transitions (modal open/close, page navigation)  
✅ Progress indication (upload, loading)  
✅ Feedback (success, error confirmation)

### When NOT to Animate

❌ Initial page load  
❌ Text appearance  
❌ Critical content (audit documents)  
❌ Decorative effects

---

## Key Animations

### 1. Button Hover/Press

**Purpose:** Provide immediate tactile feedback

**Hover:**
- **Properties:** Transform (scale), box-shadow
- **Duration:** 150ms
- **Easing:** cubic-bezier(0.4, 0.0, 0.2, 1)
- **Effect:** Scale 1.02, elevation increases

```css
.button {
  transition: transform 150ms cubic-bezier(0.4, 0.0, 0.2, 1),
              box-shadow 150ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
.button:hover {
  transform: scale(1.02);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
}
```

**Press (Active):**
- **Duration:** 100ms
- **Effect:** Scale 0.98 (press-down)

---

### 2. Navigation Card Hover

**Purpose:** Indicate clickability and focus attention

**Effect:**
- **Properties:** Transform (translateY), box-shadow
- **Duration:** 200ms
- **Transform:** translateY(-4px) - Card lifts slightly
- **Shadow:** Elevation from 2 to 8

```css
.nav-card {
  transition: transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1),
              box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
}
```

---

### 3. Modal Open/Close

**Purpose:** Orient user to new context

**Open:**
- **Duration:** 300ms
- **Easing:** cubic-bezier(0.0, 0.0, 0.2, 1) - Decelerate
- **Effect:** Opacity 0→1, Scale 0.95→1
- **Backdrop:** Opacity 0→0.5

**Close:**
- **Duration:** 200ms
- **Easing:** cubic-bezier(0.4, 0.0, 1, 1) - Accelerate
- **Effect:** Opacity 1→0 (no scale for faster exit)

---

### 4. Snackbar (Toast Notification)

**Purpose:** Draw attention to feedback without blocking workflow

**Enter:**
- **Duration:** 300ms
- **Easing:** cubic-bezier(0.0, 0.0, 0.2, 1)
- **Effect:** TranslateY(100px)→TranslateY(0), Opacity 0→1

**Exit:**
- **Duration:** 200ms
- **Effect:** Opacity 1→0 (simple fade)

---

### 5. Upload Progress Bar

**Purpose:** Communicate upload progress

**Effect:**
- **Width:** Updates instantly to percentage (no smooth animation)
- **Pulse:** Optional subtle background gradient shift (500ms cycle)
- **Rationale:** Instant updates feel more accurate than smooth animation

---

### 6. Focus Indicator

**Purpose:** Clear keyboard navigation feedback (accessibility critical)

**Effect:**
- **Duration:** 0ms (instant)
- **Appearance:** 2px solid accent green, 2px offset
- **No Animation:** Focus must appear immediately for accessibility

```css
.interactive-element:focus-visible {
  outline: 2px solid #38a169;
  outline-offset: 2px;
  /* No transition - must appear instantly */
}
```

---

### 7. List Item Hover

**Purpose:** Indicate row interactivity

**Effect:**
- **Property:** Background-color
- **Duration:** 150ms
- **Color:** white → light gray (#f5f5f5)

---

### 8. Tab Switch

**Purpose:** Smooth content transition

**Effect:**
- **Duration:** 200ms total
- **Sequence:**
  1. Old content: Opacity 1→0 (100ms)
  2. Content switches (instant)
  3. New content: Opacity 0→1 (100ms)

---

### 9. Loading Spinner

**Purpose:** Indicate async operation in progress

**Effect:**
- **Property:** Transform (rotate)
- **Duration:** 1000ms per rotation
- **Easing:** Linear
- **Loop:** Infinite

**Reduced Motion Alternative:**
```css
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: pulse 1500ms ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
}
```

---

### 10. Skeleton Loading

**Purpose:** Content placeholder during data fetch

**Effect:**
- **Duration:** 1500ms
- **Loop:** Infinite
- **Appearance:** Gray background with lighter gradient sweeping left-to-right

```css
.skeleton {
  background: linear-gradient(
    90deg,
    #e2e8f0 25%,
    #f7fafc 50%,
    #e2e8f0 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1500ms linear infinite;
}
@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## Reduced Motion Implementation

### CSS Media Query

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### JavaScript Detection

```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Use in components:
const duration = prefersReducedMotion ? 0 : 300;
```

### Material-UI Theme Override

```javascript
const theme = createTheme({
  transitions: {
    duration: {
      shortest: prefersReducedMotion ? 0 : 150,
      shorter: prefersReducedMotion ? 0 : 200,
      short: prefersReducedMotion ? 0 : 250,
      standard: prefersReducedMotion ? 0 : 300,
      complex: prefersReducedMotion ? 0 : 375,
    },
  },
});
```

---

## Performance Guidelines

### GPU-Accelerated Properties (Use These)

✅ `transform` (translate, scale, rotate)  
✅ `opacity`  
✅ `filter` (with caution)

### CPU-Bound Properties (Avoid Animating)

❌ `width`, `height` (causes layout recalculation)  
❌ `top`, `left`, `right`, `bottom` (use `transform: translate` instead)  
❌ `margin`, `padding` (causes layout)  
❌ `border-width` (causes layout)

### Best Practices

- Use `transform: translateX/Y` instead of `left`/`top`
- Use `transform: scale` instead of `width`/`height`
- Batch animations (multiple properties in single transition)
- Use `will-change` sparingly (only for critical animations)

---

## Animation Timing Reference

| Animation | Duration | Easing | Notes |
|-----------|----------|--------|-------|
| Button hover | 150ms | Standard | Fast feedback |
| Card hover | 200ms | Standard | Slight lift |
| Modal open | 300ms | Decelerate | Entering |
| Modal close | 200ms | Accelerate | Exiting |
| Snackbar | 300ms | Decelerate | Slides up |
| Focus | 0ms | None | Instant |
| List hover | 150ms | Standard | Background only |
| Tab switch | 200ms | Linear | Fade |
| Spinner | 1000ms | Linear | Infinite |
| Skeleton | 1500ms | Linear | Infinite |

---

**[← Back to Responsiveness](./08-responsiveness.md) | [Next: Implementation Guide →](./10-implementation-guide.md)**
