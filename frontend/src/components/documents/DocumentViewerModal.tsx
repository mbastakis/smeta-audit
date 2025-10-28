import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Document, Page, pdfjs } from 'react-pdf';
import type { Document as DocumentType } from '../../types/document';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentViewerModalProps {
  open: boolean;
  document: DocumentType | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  open,
  document,
  onClose,
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isPDF = document?.fileType === 'application/pdf';
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  const documentUrl = document ? `${apiBaseUrl}/documents/${document.id}/download` : '';

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
    setError(null);
  };

  const handleDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError('Unable to load document');
    setLoading(false);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleFitToWidth = () => {
    setScale(1.0);
  };

  const handlePreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const handleDownload = () => {
    if (!document) return;
    const link = window.document.createElement('a');
    link.href = documentUrl;
    link.download = document.originalFilename;
    link.click();
  };

  const handleClose = () => {
    setPageNumber(1);
    setScale(1.0);
    setLoading(true);
    setError(null);
    onClose();
  };

  // Handle ESC key
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  if (!document) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      onKeyDown={handleKeyDown}
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          py: 1.5,
        }}
      >
        <Typography variant="h6" noWrap sx={{ maxWidth: '80%' }}>
          {document.originalFilename}
        </Typography>
        <IconButton onClick={handleClose} aria-label="close" size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {isPDF ? (
        <>
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar variant="dense" sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <IconButton onClick={handleZoomOut} disabled={scale <= 0.5} aria-label="zoom out">
                <ZoomOutIcon />
              </IconButton>
              <IconButton onClick={handleZoomIn} disabled={scale >= 3.0} aria-label="zoom in">
                <ZoomInIcon />
              </IconButton>
              <Button size="small" onClick={handleFitToWidth} sx={{ ml: 1 }}>
                Fit to Width
              </Button>
              <IconButton onClick={handleDownload} sx={{ ml: 1 }} aria-label="download">
                <DownloadIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                onClick={handlePreviousPage}
                disabled={pageNumber <= 1}
                aria-label="previous page"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="body2" sx={{ mx: 2 }}>
                Page {pageNumber} of {numPages || '...'}
              </Typography>
              <IconButton
                onClick={handleNextPage}
                disabled={pageNumber >= numPages}
                aria-label="next page"
              >
                <ArrowForwardIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              bgcolor: '#f5f5f5',
              p: 2,
              overflow: 'auto',
            }}
          >
            {loading && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 400,
                }}
              >
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Loading PDF...
                </Typography>
              </Box>
            )}

            {error ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 400,
                }}
              >
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
                <Button variant="contained" onClick={handleDownload} startIcon={<DownloadIcon />}>
                  Download Instead
                </Button>
              </Box>
            ) : (
              <Document
                file={documentUrl}
                onLoadSuccess={handleDocumentLoadSuccess}
                onLoadError={handleDocumentLoadError}
                loading=""
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </Document>
            )}
          </DialogContent>
        </>
      ) : (
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
            textAlign: 'center',
          }}
        >
          <InsertDriveFileIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {document.originalFilename}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {formatFileSize(document.fileSize)} • {document.fileType}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownload}
            startIcon={<DownloadIcon />}
            sx={{ mt: 3 }}
          >
            Open in Default App
          </Button>
        </DialogContent>
      )}
    </Dialog>
  );
};
