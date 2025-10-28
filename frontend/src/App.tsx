import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { AppBar } from './components/layout/AppBar';
import { Footer } from './components/layout/Footer';
import { Dashboard } from './pages/Dashboard';
import { PillarView } from './pages/PillarView';
import { SearchResults } from './pages/SearchResults';
import { CAPATracker } from './pages/CAPATracker';
import { UploadModal } from './components/documents/UploadModal';

function App() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleUploadClick = () => {
    setUploadModalOpen(true);
  };

  const handleUploadClose = () => {
    setUploadModalOpen(false);
  };

  const handleUploadSuccess = () => {
    // Refresh counts or document list if needed
    console.log('Document uploaded successfully');
  };

  return (
    <Router>
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', 
          bgcolor: 'background.default' 
        }}
      >
        <AppBar onUploadClick={handleUploadClick} />
        <Box component="main" sx={{ flexGrow: 1, pb: 3 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pillar/:pillarId" element={<PillarView />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/capa" element={<CAPATracker />} />
            {/* Placeholder routes - will be implemented in later stories */}
            <Route path="/kpis" element={<Dashboard />} />
          </Routes>
        </Box>
        <Footer />
        
        {/* Upload Modal */}
        <UploadModal
          open={uploadModalOpen}
          onClose={handleUploadClose}
          onUploadSuccess={handleUploadSuccess}
        />
      </Box>
    </Router>
  );
}

export default App;
