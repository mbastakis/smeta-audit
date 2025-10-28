import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Snackbar,
  SelectChangeEvent,
} from '@mui/material';
import { capaService } from '../../services/capaService';
import type { CAPA, CAPACreateRequest, CAPAUpdateRequest } from '../../types/capa';

interface CAPAFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (capa: CAPA) => void;
  existingCapa?: CAPA | null;
}

const PILLAR_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'pillar-1', label: 'Pillar 1: Labour Standards' },
  { value: 'pillar-2', label: 'Pillar 2: Health & Safety' },
  { value: 'pillar-3', label: 'Pillar 3: Business Ethics' },
  { value: 'pillar-4', label: 'Pillar 4: Environment' },
];

const SEVERITY_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'critical', label: 'Critical' },
  { value: 'major', label: 'Major' },
  { value: 'minor', label: 'Minor' },
  { value: 'observation', label: 'Observation' },
];

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
];

export const CAPAFormModal: React.FC<CAPAFormModalProps> = ({
  open,
  onClose,
  onSuccess,
  existingCapa,
}) => {
  const isEditMode = !!existingCapa;

  // Form state
  const [capaId, setCapaId] = useState('');
  const [description, setDescription] = useState('');
  const [pillar, setPillar] = useState<string>('');
  const [severity, setSeverity] = useState<string>('');
  const [status, setStatus] = useState<string>('open');
  const [dateDue, setDateDue] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [preventiveAction, setPreventiveAction] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  // Initialize form with existing data in edit mode
  useEffect(() => {
    if (existingCapa && open) {
      setCapaId(existingCapa.capaId);
      setDescription(existingCapa.description);
      setPillar(existingCapa.pillar || '');
      setSeverity(existingCapa.severity || '');
      setStatus(existingCapa.status);
      setDateDue(existingCapa.dateDue ? existingCapa.dateDue.split('T')[0] : '');
      setRootCause(existingCapa.rootCause || '');
      setCorrectiveAction(existingCapa.correctiveAction || '');
      setPreventiveAction(existingCapa.preventiveAction || '');
      setHasUnsavedChanges(false);
    } else if (!existingCapa && open) {
      // Reset form for create mode
      resetForm();
    }
  }, [existingCapa, open]);

  // Track unsaved changes
  useEffect(() => {
    if (open) {
      setHasUnsavedChanges(true);
    }
  }, [capaId, description, pillar, severity, status, dateDue, rootCause, correctiveAction, preventiveAction]);

  const resetForm = () => {
    setCapaId('');
    setDescription('');
    setPillar('');
    setSeverity('');
    setStatus('open');
    setDateDue('');
    setRootCause('');
    setCorrectiveAction('');
    setPreventiveAction('');
    setErrors({});
    setHasUnsavedChanges(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!capaId.trim()) {
      newErrors.capaId = 'CAPA ID is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const data: CAPACreateRequest | CAPAUpdateRequest = {
        capaId: capaId.trim(),
        description: description.trim(),
        pillar: (pillar || undefined) as CAPA['pillar'],
        severity: (severity || undefined) as CAPA['severity'],
        status: status as CAPA['status'],
        dateDue: dateDue || undefined,
        rootCause: rootCause.trim() || undefined,
        correctiveAction: correctiveAction.trim() || undefined,
        preventiveAction: preventiveAction.trim() || undefined,
      };

      let savedCapa: CAPA;
      if (isEditMode && existingCapa) {
        savedCapa = await capaService.update(existingCapa.id, data as CAPAUpdateRequest);
      } else {
        savedCapa = await capaService.create(data as CAPACreateRequest);
      }

      setSnackbarMessage('CAPA saved successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setHasUnsavedChanges(false);

      // Call success callback
      if (onSuccess) {
        onSuccess(savedCapa);
      }

      // Close modal after short delay
      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (error: any) {
      console.error('Save CAPA error:', error);

      let errorMessage = 'Failed to save CAPA';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;

        // Handle duplicate CAPA ID error
        if (errorMessage.includes('already exists')) {
          setErrors({ capaId: errorMessage });
          return;
        }
      }

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges && !saving) {
      setShowConfirmClose(true);
    } else {
      resetForm();
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmClose(false);
    resetForm();
    onClose();
  };

  const handleCancelClose = () => {
    setShowConfirmClose(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const isFormValid = capaId.trim() !== '' && description.trim() !== '' && !saving;

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{isEditMode ? 'Edit CAPA' : 'Create CAPA'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* CAPA ID */}
            <TextField
              label="CAPA ID"
              value={capaId}
              onChange={(e) => setCapaId(e.target.value)}
              required
              fullWidth
              error={!!errors.capaId}
              helperText={errors.capaId}
              disabled={saving}
              placeholder="e.g., CAPA-2025-001"
            />

            {/* Description */}
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              fullWidth
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description}
              disabled={saving}
            />

            {/* Pillar */}
            <FormControl fullWidth>
              <InputLabel>Pillar</InputLabel>
              <Select
                value={pillar}
                label="Pillar"
                onChange={(e: SelectChangeEvent) => setPillar(e.target.value)}
                disabled={saving}
              >
                {PILLAR_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Severity */}
            <FormControl fullWidth>
              <InputLabel>Severity</InputLabel>
              <Select
                value={severity}
                label="Severity"
                onChange={(e: SelectChangeEvent) => setSeverity(e.target.value)}
                disabled={saving}
              >
                {SEVERITY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Status */}
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e: SelectChangeEvent) => setStatus(e.target.value)}
                disabled={saving}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Due Date */}
            <TextField
              label="Due Date"
              type="date"
              value={dateDue}
              onChange={(e) => setDateDue(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={saving}
            />

            {/* Root Cause */}
            <TextField
              label="Root Cause"
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              fullWidth
              multiline
              rows={2}
              disabled={saving}
            />

            {/* Corrective Action */}
            <TextField
              label="Corrective Action"
              value={correctiveAction}
              onChange={(e) => setCorrectiveAction(e.target.value)}
              fullWidth
              multiline
              rows={2}
              disabled={saving}
            />

            {/* Preventive Action */}
            <TextField
              label="Preventive Action"
              value={preventiveAction}
              onChange={(e) => setPreventiveAction(e.target.value)}
              fullWidth
              multiline
              rows={2}
              disabled={saving}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={!isFormValid}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unsaved Changes Confirmation Dialog */}
      <Dialog open={showConfirmClose} onClose={handleCancelClose}>
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            You have unsaved changes. Are you sure you want to close without saving?
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose}>Continue Editing</Button>
          <Button onClick={handleConfirmClose} color="error">
            Discard Changes
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
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
