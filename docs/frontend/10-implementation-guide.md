# Frontend Specification - Implementation Guide

[← Back to Animation](./09-animation.md)

---

## Developer Handoff Summary

This guide provides quick reference for implementing the SMETA Compliance Platform frontend within the 8-10 hour timeline.

---

## Technology Stack

### Required Dependencies

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

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── NavigationCard.jsx
│   │   ├── PillarView.jsx
│   │   ├── DocumentList.jsx
│   │   ├── DocumentViewer.jsx
│   │   ├── UploadModal.jsx
│   │   ├── CAPATracker.jsx
│   │   ├── CAPAForm.jsx
│   │   ├── SearchResults.jsx
│   │   └── AppBarComponent.jsx
│   ├── services/
│   │   └── api.js (Axios instance)
│   ├── theme/
│   │   └── theme.js (MUI theme config)
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## Build Priority

Implement in this order for fastest path to working application:

### Phase 1: Foundation (Hours 1-2)

1. **Setup & Theme**
   - Initialize Vite + React project
   - Install dependencies
   - Configure MUI theme (colors, typography)
   - Set up React Router

2. **AppBar + Dashboard**
   - Create AppBar component (logo, search placeholder, upload button)
   - Create Dashboard with 6 navigation cards
   - Fetch document counts from API
   - Wire up navigation to pillar routes

### Phase 2: Core Features (Hours 3-5)

3. **Document Upload**
   - Create UploadModal component
   - Implement react-dropzone
   - Form validation (pillar, category selection)
   - Connect to POST /api/documents/upload
   - Success/error snackbar notifications

4. **Pillar View + Document List**
   - Create PillarView with breadcrumbs
   - Implement category tabs
   - Document list with file icons
   - View and Delete actions
   - Connect to GET /api/documents/pillar/:pillar/category/:category

5. **Document Viewer**
   - Create DocumentViewer modal
   - Implement react-pdf for PDF viewing
   - Zoom controls, page navigation
   - Download button for non-PDFs
   - Loading and error states

### Phase 3: Enhanced Features (Hours 6-7)

6. **Search Functionality**
   - Implement search bar in AppBar
   - Create SearchResults component
   - Group results by pillar
   - Connect to GET /api/search?q={term}

7. **CAPA Tracker**
   - Create CAPATracker with two-column layout
   - CAPA list with status filters
   - CAPA details panel
   - Create CAPAForm modal
   - Connect to CAPA API endpoints

### Phase 4: Polish (Hours 8-9)

8. **UI Polish**
   - Add loading skeletons
   - Implement empty states
   - Verify all hover/focus states
   - Test responsive layouts
   - Add tooltips where helpful

9. **Error Handling & Edge Cases**
   - Network error handling
   - Form validation messages
   - Confirmation dialogs (delete actions)
   - 404/error pages

10. **Final Testing**
    - Full audit scenario walkthrough
    - Test on 1366×768 resolution
    - Keyboard navigation test
    - Lighthouse accessibility audit

---

## Quick Reference

### Theme Configuration

```javascript
// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1a365d' }, // Navy
    secondary: { main: '#2d3748' }, // Slate Gray
    success: { main: '#38a169' }, // Green
    error: { main: '#e53e3e' }, // Red
    warning: { main: '#dd6b20' }, // Orange
    info: { main: '#3182ce' }, // Blue
    background: {
      default: '#f7fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
});

export default theme;
```

### API Service Setup

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

export const getDocumentCounts = () => api.get('/documents/counts');
export const getDocumentsByPillar = (pillar, category) => 
  api.get(`/documents/pillar/${pillar}/category/${category}`);
export const uploadDocument = (formData) => 
  api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteDocument = (id) => api.delete(`/documents/${id}`);
export const searchDocuments = (query) => api.get(`/search?q=${query}`);

export default api;
```

### Navigation Card Component

```jsx
// src/components/NavigationCard.jsx
import { Card, CardActionArea, CardContent, Typography, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NavigationCard({ icon: Icon, title, subtitle, count, route }) {
  const navigate = useNavigate();
  
  return (
    <Card 
      elevation={2}
      sx={{
        width: 280,
        height: 220,
        transition: 'all 200ms',
        '&:hover': {
          transform: 'translateY(-4px)',
          elevation: 8,
        },
      }}
    >
      <CardActionArea onClick={() => navigate(route)} sx={{ height: '100%' }}>
        <CardContent sx={{ textAlign: 'center', p: 3 }}>
          <Icon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {subtitle}
          </Typography>
          <Chip label={`${count} docs`} size="small" sx={{ mt: 2 }} />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
```

---

## Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| Page Load | ≤3 seconds | Yes |
| Document Retrieval | ≤5 seconds | Yes |
| Search Results | ≤3 seconds | Yes |
| Interaction Response | ≤100ms | Yes |
| Animation FPS | 60fps | No |

---

## Testing Checklist

### Pre-Launch

- [ ] Upload document successfully
- [ ] View PDF in modal
- [ ] Search returns results
- [ ] Delete document with confirmation
- [ ] Create CAPA record
- [ ] Navigate all pillars
- [ ] Test on 1366×768 resolution
- [ ] Keyboard-only navigation works
- [ ] Focus indicators visible
- [ ] Lighthouse accessibility score 90+
- [ ] No console errors
- [ ] All loading states implemented
- [ ] Error messages user-friendly

---

## Common Pitfalls

1. **Don't animate width/height** - Use transform instead
2. **Don't forget aria-labels** - Icon-only buttons need them
3. **Don't hardcode colors** - Use theme tokens
4. **Don't skip loading states** - Users need feedback
5. **Don't forget error handling** - Network can fail
6. **Don't remove focus outlines** - Accessibility requirement
7. **Don't make modals too small** - 90vw × 90vh minimum
8. **Don't forget breadcrumbs** - Critical for orientation
9. **Don't skip empty states** - Better UX than blank screens
10. **Don't forget reduced motion** - Accessibility requirement

---

## Success Criteria

### Minimum Viable (Epic 1)
✅ Document upload works  
✅ Document viewing works  
✅ Pillar navigation works  
✅ Professional appearance  

### Full Featured (Epic 2)
✅ Search functional  
✅ CAPA tracker complete  
✅ All edge cases handled  
✅ Polished UI  

---

## Support Resources

**Material-UI Documentation:** https://mui.com/material-ui/  
**React Router Documentation:** https://reactrouter.com/  
**react-pdf Documentation:** https://github.com/wojtekmaj/react-pdf  
**react-dropzone Documentation:** https://react-dropzone.js.org/  

---

## Final Notes

**Remember:**
- Material-UI handles most accessibility automatically
- Use `sx` prop for styling (not CSS files)
- Keep components simple (no over-engineering)
- Test frequently during development
- Prioritize working features over perfect design

**Good luck! The specification is comprehensive - if stuck, refer back to the detailed sections.**

---

**[← Back to Animation](./09-animation.md)**
