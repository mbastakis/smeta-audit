import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Breadcrumbs,
  Link,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  FolderOpen as FolderOpenIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { documentService } from '../services/documentService';
import type { Document } from '../types/document';
import { formatFileSize, formatDate } from '../utils/formatters';
import { getDisplayName, getDocumentIcon } from '../utils/documentDisplay';
import { DocumentViewerModal } from '../components/documents/DocumentViewerModal';
import { UploadModal } from '../components/documents/UploadModal';
import { useNotification } from '../contexts/NotificationContext';

const PILLAR_NAMES: Record<string, string> = {
  'pillar-1': 'Pillar 1: Labour Standards',
  'pillar-2': 'Pillar 2: Health & Safety',
  'pillar-3': 'Pillar 3: Business Ethics',
  'pillar-4': 'Pillar 4: Environment',
};

const CATEGORIES = ['policies', 'procedures', 'forms', 'evidence'];

export const PillarView: React.FC = () => {
  const { pillarId } = useParams<{ pillarId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  
  const [currentTab, setCurrentTab] = useState(0);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [documentToView, setDocumentToView] = useState<Document | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
  const currentCategory = CATEGORIES[currentTab];
  const pillarName = pillarId ? PILLAR_NAMES[pillarId] : '';

  // Fetch documents when tab changes
  useEffect(() => {
    if (pillarId) {
      fetchDocuments();
    }
  }, [pillarId, currentTab]);

  const fetchDocuments = async () => {
    if (!pillarId) return;
    
    setLoading(true);
    setError(null);
    try {
      const docs = await documentService.getDocumentsByPillarAndCategory(pillarId, currentCategory);
      setDocuments(docs);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load documents';
      setError(errorMessage);
      showError(errorMessage);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleBreadcrumbClick = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate('/');
  };

  const handleViewDocument = (document: Document) => {
    setDocumentToView(document);
    setViewerOpen(true);
  };

  const handleViewerClose = () => {
    setViewerOpen(false);
    setDocumentToView(null);
  };

  const handleDeleteClick = (document: Document) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    try {
      await documentService.deleteDocument(documentToDelete.id);
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
      showSuccess('Document deleted successfully');
      // Refresh document list
      fetchDocuments();
    } catch (err) {
      console.error('Failed to delete document:', err);
      showError('Failed to delete document. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  const handleUploadClick = () => {
    setUploadModalOpen(true);
  };

  const handleUploadClose = () => {
    setUploadModalOpen(false);
  };

  const handleUploadSuccess = () => {
    setUploadModalOpen(false);
    // Refresh document list
    fetchDocuments();
  };

  // Loading skeleton
  if (loading && documents.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Skeleton width={60} />
          <Skeleton width={200} />
        </Breadcrumbs>
        <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          {CATEGORIES.map((cat) => (
            <Tab key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)} />
          ))}
        </Tabs>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={72} sx={{ mb: 1 }} />
        ))}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body1"
          onClick={handleBreadcrumbClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'text.primary',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
          Home
        </Link>
        <Typography variant="body1" fontWeight="bold" color="text.primary">
          {pillarName}
        </Typography>
      </Breadcrumbs>

      {/* Category Tabs */}
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        {CATEGORIES.map((cat) => (
          <Tab
            key={cat}
            label={cat.charAt(0).toUpperCase() + cat.slice(1)}
          />
        ))}
      </Tabs>

      {/* Error State with Retry */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={fetchDocuments}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Document List or Empty State */}
      {documents.length === 0 && !loading && !error ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            textAlign: 'center',
          }}
        >
          <FolderOpenIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No documents uploaded yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Click Upload to add documents to this category
          </Typography>
          <Button variant="contained" color="primary" onClick={handleUploadClick}>
            Upload Document
          </Button>
        </Box>
      ) : !error ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={50}></TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell width={130}>Upload Date</TableCell>
                  <TableCell width={100}>Size</TableCell>
                  <TableCell width={120} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((document) => (
                  <TableRow
                    key={document.id}
                    hover
                    sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getDocumentIcon(document)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" noWrap sx={{ maxWidth: 400 }}>
                        {getDisplayName(document)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(document.uploadDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(document.fileSize)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewDocument(document)}
                        aria-label="View document"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(document)}
                        aria-label="Delete document"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer with document count */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {documents.length} document{documents.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </>
      ) : null}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{documentToDelete ? getDisplayName(documentToDelete) : ''}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        open={viewerOpen}
        document={documentToView}
        onClose={handleViewerClose}
      />

      {/* Upload Modal */}
      <UploadModal
        open={uploadModalOpen}
        onClose={handleUploadClose}
        onUploadSuccess={handleUploadSuccess}
        initialPillar={pillarId || ''}
        initialCategory={currentCategory}
      />
    </Container>
  );
};
