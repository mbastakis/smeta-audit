import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
  SelectChangeEvent,
  Alert,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RefreshIcon from '@mui/icons-material/Refresh';
import { capaService } from '../services/capaService';
import type { CAPA } from '../types/capa';
import { formatDate } from '../utils/formatters';
import { CAPAFormModal } from '../components/capa/CAPAFormModal';
import { useNotification } from '../contexts/NotificationContext';

type FilterStatus = 'all' | 'open' | 'in-progress' | 'closed';
type SortBy = 'dueDate' | 'status' | 'severity';

const PILLAR_NAMES: Record<string, string> = {
  'pillar-1': 'Pillar 1: Labour Standards',
  'pillar-2': 'Pillar 2: Health & Safety',
  'pillar-3': 'Pillar 3: Business Ethics',
  'pillar-4': 'Pillar 4: Environment',
};

const SEVERITY_ORDER = { critical: 1, major: 2, minor: 3, observation: 4 };
const STATUS_ORDER = { open: 1, 'in-progress': 2, closed: 3 };

export const CAPATracker: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('dueDate');
  const [selectedCapa, setSelectedCapa] = useState<CAPA | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [capaToDelete, setCapaToDelete] = useState<CAPA | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCapa, setEditingCapa] = useState<CAPA | null>(null);

  useEffect(() => {
    fetchCapas();
  }, [filterStatus]);

  const fetchCapas = async () => {
    setLoading(true);
    setError(null);
    try {
      let data: CAPA[];
      if (filterStatus === 'all') {
        data = await capaService.getAll();
      } else {
        data = await capaService.getByStatus(filterStatus);
      }
      setCapas(data);
      // Auto-select first CAPA if available
      if (data.length > 0 && !selectedCapa) {
        setSelectedCapa(data[0]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load CAPAs';
      setError(errorMessage);
      showError(errorMessage);
      setCapas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (_event: React.MouseEvent<HTMLElement>, newFilter: FilterStatus | null) => {
    if (newFilter !== null) {
      setFilterStatus(newFilter);
      setSelectedCapa(null);
    }
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as SortBy);
  };

  const handleCapaClick = (capa: CAPA) => {
    setSelectedCapa(capa);
  };

  const handleAddCapa = () => {
    setEditingCapa(null);
    setFormModalOpen(true);
  };

  const handleEditCapa = () => {
    setEditingCapa(selectedCapa);
    setFormModalOpen(true);
  };

  const handleFormSuccess = (capa: CAPA) => {
    setFormModalOpen(false);
    showSuccess(editingCapa ? 'CAPA updated successfully' : 'CAPA created successfully');
    fetchCapas(); // Refresh list
    setSelectedCapa(capa); // Select new/updated CAPA
  };

  const handleDeleteClick = (capa: CAPA) => {
    setCapaToDelete(capa);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!capaToDelete) return;

    try {
      await capaService.delete(capaToDelete.id);
      setDeleteDialogOpen(false);
      setCapaToDelete(null);
      showSuccess('CAPA deleted successfully');
      // If deleted CAPA was selected, clear selection
      if (selectedCapa?.id === capaToDelete.id) {
        setSelectedCapa(null);
      }
      // Refresh list
      fetchCapas();
    } catch (err) {
      console.error('Failed to delete CAPA:', err);
      showError('Failed to delete CAPA. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCapaToDelete(null);
  };

  const handleBreadcrumbClick = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate('/');
  };

  // Sort CAPAs
  const sortedCapas = [...capas].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dateDue) return 1;
        if (!b.dateDue) return -1;
        return new Date(a.dateDue).getTime() - new Date(b.dateDue).getTime();
      case 'status':
        return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      case 'severity':
        const aSev = a.severity || 'observation';
        const bSev = b.severity || 'observation';
        return SEVERITY_ORDER[aSev] - SEVERITY_ORDER[bSev];
      default:
        return 0;
    }
  });

  const getStatusColor = (capa: CAPA): string => {
    if (capa.status === 'closed') return '#38a169'; // Green

    const isOverdue = capa.dateDue && new Date(capa.dateDue) < new Date();
    if (isOverdue || capa.severity === 'critical') return '#e53e3e'; // Red

    if (capa.severity === 'major') return '#dd6b20'; // Orange
    if (capa.severity === 'minor') return '#ecc94b'; // Yellow

    return '#4299e1'; // Blue for in-progress
  };

  const truncate = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
          CAPA Tracker
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          CAPA Tracker
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddCapa}>
          Add CAPA
        </Button>
      </Box>

      {/* Filter Buttons */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ToggleButtonGroup
          value={filterStatus}
          exclusive
          onChange={handleFilterChange}
          aria-label="filter status"
        >
          <ToggleButton value="all" aria-label="all">
            All
          </ToggleButton>
          <ToggleButton value="open" aria-label="open">
            Open
          </ToggleButton>
          <ToggleButton value="in-progress" aria-label="in progress">
            In Progress
          </ToggleButton>
          <ToggleButton value="closed" aria-label="closed">
            Closed
          </ToggleButton>
        </ToggleButtonGroup>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sortBy} onChange={handleSortChange} label="Sort by">
            <MenuItem value="dueDate">Due Date</MenuItem>
            <MenuItem value="status">Status</MenuItem>
            <MenuItem value="severity">Severity</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Error State with Retry */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={fetchCapas}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Two-Column Layout */}
      {loading ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 2 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height={80} sx={{ mb: 1 }} />
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3 }}>
              <Skeleton height={40} sx={{ mb: 2 }} />
              <Skeleton height={120} sx={{ mb: 2 }} />
              <Skeleton height={80} />
            </Paper>
          </Grid>
        </Grid>
      ) : capas.length === 0 ? (
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
          <AssignmentIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No CAPAs found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {filterStatus === 'all'
              ? 'Create your first CAPA to track corrective actions'
              : `No CAPAs with status "${filterStatus}"`}
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddCapa}>
            Add CAPA
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Left Column: CAPA List */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ height: '600px', overflow: 'auto' }}>
              <List>
                {sortedCapas.map((capa) => (
                  <ListItem key={capa.id} disablePadding>
                    <ListItemButton
                      selected={selectedCapa?.id === capa.id}
                      onClick={() => handleCapaClick(capa)}
                      sx={{
                        borderLeft: 4,
                        borderColor: getStatusColor(capa),
                        '&.Mui-selected': {
                          bgcolor: 'action.selected',
                          borderLeftColor: getStatusColor(capa),
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {capa.capaId}
                            </Typography>
                            <Chip
                              label={capa.status}
                              size="small"
                              sx={{
                                bgcolor: getStatusColor(capa),
                                color: 'white',
                                fontSize: '0.7rem',
                                height: 20,
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {truncate(capa.description, 60)}
                            </Typography>
                            {capa.dateDue && capa.status !== 'closed' && (
                              <Typography variant="caption" color="text.secondary">
                                Due: {formatDate(capa.dateDue)}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Right Column: Details Panel */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, height: '600px', overflow: 'auto' }}>
              {selectedCapa ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">
                      {selectedCapa.capaId}
                    </Typography>
                    <Box>
                      <IconButton onClick={handleEditCapa} color="primary" aria-label="edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(selectedCapa)}
                        color="error"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">
                        Description
                      </Typography>
                      <Typography variant="body1">{selectedCapa.description}</Typography>
                    </Box>

                    {selectedCapa.pillar && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          Pillar
                        </Typography>
                        <Typography variant="body1">{PILLAR_NAMES[selectedCapa.pillar]}</Typography>
                      </Box>
                    )}

                    {selectedCapa.severity && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          Severity
                        </Typography>
                        <Chip
                          label={selectedCapa.severity.charAt(0).toUpperCase() + selectedCapa.severity.slice(1)}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    )}

                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">
                        Status
                      </Typography>
                      <Chip
                        label={selectedCapa.status.charAt(0).toUpperCase() + selectedCapa.status.slice(1)}
                        size="small"
                        sx={{
                          mt: 0.5,
                          bgcolor: getStatusColor(selectedCapa),
                          color: 'white',
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">
                        Date Opened
                      </Typography>
                      <Typography variant="body1">{formatDate(selectedCapa.dateOpened)}</Typography>
                    </Box>

                    {selectedCapa.dateDue && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          Date Due
                        </Typography>
                        <Typography variant="body1">{formatDate(selectedCapa.dateDue)}</Typography>
                      </Box>
                    )}

                    {selectedCapa.dateClosed && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          Date Closed
                        </Typography>
                        <Typography variant="body1">{formatDate(selectedCapa.dateClosed)}</Typography>
                      </Box>
                    )}

                    {selectedCapa.rootCause && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          Root Cause
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {selectedCapa.rootCause}
                        </Typography>
                      </Box>
                    )}

                    {selectedCapa.correctiveAction && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          Corrective Action
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {selectedCapa.correctiveAction}
                        </Typography>
                      </Box>
                    )}

                    {selectedCapa.preventiveAction && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          Preventive Action
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {selectedCapa.preventiveAction}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Select a CAPA to view details
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete CAPA</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete CAPA "{capaToDelete?.capaId}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* CAPA Form Modal */}
      <CAPAFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSuccess={handleFormSuccess}
        existingCapa={editingCapa}
      />
    </Container>
  );
};
