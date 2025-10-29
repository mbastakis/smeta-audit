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
  TextField,
  CircularProgress,
  LinearProgress,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { kpiService } from '../../services/kpiService';
import { KPICategoryType, KPIFileType, KPIItem } from '../../types/kpi';
import { useNotification } from '../../contexts/NotificationContext';

interface KPIUploadModalProps {
  open: boolean;
  onClose: () => void;
  category: KPICategoryType;
  onUploadSuccess?: (item: KPIItem) => void;
}

const FILE_TYPE_OPTIONS: { value: KPIFileType; label: string; accept: string }[] = [
  { value: 'pdf', label: 'PDF Document', accept: '.pdf' },
  { value: 'xlsx', label: 'Excel Spreadsheet', accept: '.xlsx' },
  { value: 'docx', label: 'Word Document', accept: '.docx' },
  { value: 'jpg', label: 'JPEG Image', accept: '.jpg,.jpeg' },
  { value: 'png', label: 'PNG Image', accept: '.png' },
  { value: 'html-package', label: 'HTML Package (ZIP)', accept: '.zip' },
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const KPIUploadModal: React.FC<KPIUploadModalProps> = ({
  open,
  onClose,
  category,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<KPIFileType>('pdf');
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showSuccess, showError } = useNotification();

  // Get accept string based on selected file type
  const getAcceptString = () => {
    const option = FILE_TYPE_OPTIONS.find((opt) => opt.value === fileType);
    return option?.accept || '*/*';
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        showError(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
        return;
      }

      setSelectedFile(file);
      
      // Auto-populate title from filename if empty
      if (!title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setTitle(nameWithoutExt);
      }
    }
  }, [title, showError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptString().split(',').reduce((acc, ext) => {
      acc[ext.trim()] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: 1,
    multiple: false,
  });

  const handleFileTypeChange = (event: SelectChangeEvent<KPIFileType>) => {
    setFileType(event.target.value as KPIFileType);
    // Clear selected file when type changes
    setSelectedFile(null);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTitle(value);
    
    // Validate title
    if (value.trim().length === 0) {
      setTitleError('Title is required');
    } else if (value.trim().length < 3) {
      setTitleError('Title must be at least 3 characters');
    } else {
      setTitleError('');
    }
  };

  const handleUpload = async () => {
    // Validate
    if (!selectedFile) {
      showError('Please select a file');
      return;
    }

    if (!title.trim() || title.trim().length < 3) {
      setTitleError('Title must be at least 3 characters');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const item = await kpiService.upload(
        {
          file: selectedFile,
          title: title.trim(),
          category,
          fileType,
        },
        (percentage) => {
          setUploadProgress(percentage);
        }
      );

      showSuccess(`Successfully uploaded: ${item.title}`);
      
      if (onUploadSuccess) {
        onUploadSuccess(item);
      }

      // Reset and close
      handleClose();
    } catch (error: any) {
      console.error('Upload error:', error);
      showError(error.response?.data?.error || 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null);
      setTitle('');
      setTitleError('');
      setFileType('pdf');
      setUploadProgress(0);
      onClose();
    }
  };

  const getCategoryLabel = () => {
    const labels: Record<KPICategoryType, string> = {
      statistics: 'Statistics',
      research: 'Research',
      kpis: 'KPIs',
      'org-chart': 'Organization Chart',
      'business-plan': 'Business Plan',
    };
    return labels[category];
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload to {getCategoryLabel()}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {/* File Type Selection */}
          <FormControl fullWidth>
            <InputLabel>File Type</InputLabel>
            <Select
              value={fileType}
              label="File Type"
              onChange={handleFileTypeChange}
              disabled={uploading}
            >
              {FILE_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Help text for HTML packages */}
          {fileType === 'html-package' && (
            <Alert severity="info" sx={{ mb: 1 }}>
              ZIP file must contain an <strong>index.html</strong> file. All assets (CSS, JS, images) should use relative paths.
            </Alert>
          )}

          {/* Title Input */}
          <TextField
            label="Title"
            value={title}
            onChange={handleTitleChange}
            error={!!titleError}
            helperText={titleError || 'Display name for this item'}
            disabled={uploading}
            fullWidth
            required
          />

          {/* File Upload Dropzone */}
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.400',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: isDragActive ? 'action.hover' : 'background.paper',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
          >
            <input {...getInputProps()} disabled={uploading} />
            <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            {selectedFile ? (
              <Box>
                <Typography variant="body1" gutterBottom>
                  <strong>Selected:</strong> {selectedFile.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography variant="body1" gutterBottom>
                  {isDragActive
                    ? 'Drop file here'
                    : 'Drag & drop file here, or click to select'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {fileType === 'html-package' ? 'ZIP files only' : FILE_TYPE_OPTIONS.find(o => o.value === fileType)?.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Max size: {MAX_FILE_SIZE / 1024 / 1024}MB
                </Typography>
              </Box>
            )}
          </Box>

          {/* Upload Progress */}
          {uploading && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Uploading... {uploadProgress}%
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!selectedFile || !title.trim() || !!titleError || uploading}
          startIcon={uploading ? <CircularProgress size={20} /> : null}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
