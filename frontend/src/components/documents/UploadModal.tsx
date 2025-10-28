import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  LinearProgress,
  Alert,
  Snackbar,
  SelectChangeEvent,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { documentService } from '../../services/documentService';
import type { Document } from '../../types/document';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess?: (document: Document) => void;
}

const PILLAR_OPTIONS = [
  { value: 'pillar-1', label: 'Pillar 1: Labour Standards' },
  { value: 'pillar-2', label: 'Pillar 2: Health & Safety' },
  { value: 'pillar-3', label: 'Pillar 3: Business Ethics' },
  { value: 'pillar-4', label: 'Pillar 4: Environment' },
  { value: 'kpis', label: 'KPIs' },
  { value: 'capa', label: 'CAPA' },
];

const CATEGORY_OPTIONS = [
  { value: 'policies', label: 'Policies' },
  { value: 'procedures', label: 'Procedures' },
  { value: 'forms', label: 'Forms' },
  { value: 'evidence', label: 'Evidence' },
];

const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const LARGE_FILE_THRESHOLD = 5 * 1024 * 1024; // 5MB

export const UploadModal: React.FC<UploadModalProps> = ({ open, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pillar, setPillar] = useState('');
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [uploadedDocument, setUploadedDocument] = useState<Document | null>(null);

  // Determine if category should be shown (not for kpis/capa)
  const showCategory = pillar && !['kpis', 'capa'].includes(pillar);

  // Determine if form is valid for submission
  const isFormValid = selectedFile && pillar && (showCategory ? category : true);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setSnackbarMessage('File too large. Maximum 50MB');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  // Handle file rejections
  React.useEffect(() => {
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setSnackbarMessage('File too large. Maximum 50MB');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setSnackbarMessage('Invalid file type. Supported: PDF, DOCX, XLSX, JPG, PNG');
      } else {
        setSnackbarMessage('File upload failed. Please try again.');
      }
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [fileRejections]);

  const handlePillarChange = (event: SelectChangeEvent) => {
    const newPillar = event.target.value;
    setPillar(newPillar);
    
    // Clear category if switching to kpis/capa
    if (['kpis', 'capa'].includes(newPillar)) {
      setCategory('');
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile || !pillar) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const document = await documentService.uploadDocument(
        selectedFile,
        pillar,
        showCategory ? category : undefined,
        (percentage) => {
          setUploadProgress(percentage);
        }
      );

      setUploadedDocument(document);
      setSnackbarMessage('Document uploaded successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess(document);
      }

      // Close modal after short delay
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error: any) {
      console.error('Upload error:', error);
      
      let errorMessage = 'Failed to upload document';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    // Reset state
    setSelectedFile(null);
    setPillar('');
    setCategory('');
    setUploading(false);
    setUploadProgress(0);
    setUploadedDocument(null);
    onClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showLinearProgress = selectedFile && selectedFile.size >= LARGE_FILE_THRESHOLD;

  return (
    <>
      <Dialog open={open} onClose={uploading ? undefined : handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          {/* Dropzone Area */}
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.400',
              borderRadius: 2,
              padding: 4,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
              marginBottom: 3,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
              },
            }}
          >
            <input {...getInputProps()} />
            {selectedFile ? (
              <Box>
                <Typography variant="body1" fontWeight="bold" gutterBottom>
                  Selected file:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography variant="body1" gutterBottom>
                  {isDragActive
                    ? 'Drop the file here...'
                    : 'Drag and drop file here, or click to browse'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supported: PDF, DOCX, XLSX, JPG, PNG (Max 50MB)
                </Typography>
              </Box>
            )}
          </Box>

          {/* Pillar Selection */}
          {selectedFile && (
            <>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="pillar-label">Pillar *</InputLabel>
                <Select
                  labelId="pillar-label"
                  value={pillar}
                  label="Pillar *"
                  onChange={handlePillarChange}
                  disabled={uploading}
                >
                  {PILLAR_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Category Selection (conditional) */}
              {showCategory && (
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel id="category-label">Category *</InputLabel>
                  <Select
                    labelId="category-label"
                    value={category}
                    label="Category *"
                    onChange={handleCategoryChange}
                    disabled={uploading}
                  >
                    {CATEGORY_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </>
          )}

          {/* Upload Progress */}
          {uploading && (
            <Box sx={{ marginTop: 2 }}>
              {showLinearProgress ? (
                <>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 1 }}>
                    {uploadProgress}%
                  </Typography>
                </>
              ) : (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!isFormValid || uploading}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          action={
            snackbarSeverity === 'success' && uploadedDocument ? (
              <Button color="inherit" size="small">
                View
              </Button>
            ) : undefined
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
