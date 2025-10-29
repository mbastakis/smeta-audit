import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Breadcrumbs,
  Link,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import CodeIcon from '@mui/icons-material/Code';
import RefreshIcon from '@mui/icons-material/Refresh';
import { kpiService } from '../services/kpiService';
import { KPIItem, KPICategoryType } from '../types/kpi';
import { KPIUploadModal } from '../components/kpi/KPIUploadModal';
import { useNotification } from '../contexts/NotificationContext';
import { formatters } from '../utils/formatters';

const categoryLabels: Record<KPICategoryType, string> = {
  statistics: 'Statistics',
  research: 'Research',
  kpis: 'KPIs',
  'org-chart': 'Organization Chart',
  'business-plan': 'Business Plan',
};

const fileTypeIcons: Record<string, React.ReactElement> = {
  pdf: <PictureAsPdfIcon />,
  xlsx: <TableChartIcon />,
  docx: <DescriptionIcon />,
  jpg: <ImageIcon />,
  png: <ImageIcon />,
  'html-package': <CodeIcon />,
};

export const KPICategoryView: React.FC = () => {
  const { category } = useParams<{ category: KPICategoryType }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [items, setItems] = useState<KPIItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<KPIItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (category) {
      loadItems();
    }
  }, [category]);

  const loadItems = async () => {
    if (!category) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedItems = await kpiService.getByCategory(category);
      setItems(fetchedItems);
    } catch (err: any) {
      console.error('Error loading KPI items:', err);
      setError(err.response?.data?.error || 'Failed to load items');
      showError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (item: KPIItem) => {
    setItems((prev) => [item, ...prev]);
    setUploadModalOpen(false);
  };

  const handleViewItem = (item: KPIItem) => {
    kpiService.openItem(item);
  };

  const handleDeleteClick = (item: KPIItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      await kpiService.delete(itemToDelete.id);
      setItems((prev) => prev.filter((item) => item.id !== itemToDelete.id));
      showSuccess(`Successfully deleted: ${itemToDelete.title}`);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err: any) {
      console.error('Error deleting item:', err);
      showError(err.response?.data?.error || 'Failed to delete item');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  if (!category || !categoryLabels[category]) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Invalid category</Alert>
      </Container>
    );
  }

  const categoryLabel = categoryLabels[category];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
        <Link
          component="button"
          onClick={() => navigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'text.primary',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          Home
        </Link>
        <Link
          component="button"
          onClick={() => navigate('/kpis')}
          sx={{
            textDecoration: 'none',
            color: 'text.primary',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          KPIs Dashboard
        </Link>
        <Typography color="text.primary">{categoryLabel}</Typography>
      </Breadcrumbs>

      {/* Header with Upload Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {categoryLabel}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setUploadModalOpen(true)}
        >
          Upload
        </Button>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {!loading && error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadItems} startIcon={<RefreshIcon />}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
            border: '2px dashed',
            borderColor: 'grey.300',
            borderRadius: 2,
            bgcolor: 'grey.50',
          }}
        >
          <Typography variant="h6" gutterBottom color="text.secondary">
            No items uploaded yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Upload your first {categoryLabel.toLowerCase()} document
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setUploadModalOpen(true)}
          >
            Upload
          </Button>
        </Box>
      )}

      {/* Items Grid */}
      {!loading && !error && items.length > 0 && (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* File Type Icon */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ color: 'primary.main' }}>
                      {fileTypeIcons[item.fileType] || <DescriptionIcon />}
                    </Box>
                    <Chip
                      label={item.fileType.toUpperCase()}
                      size="small"
                      color={item.hasIndexHtml ? 'secondary' : 'default'}
                    />
                  </Box>

                  {/* Title */}
                  <Typography variant="h6" component="h2" gutterBottom>
                    {item.title}
                  </Typography>

                  {/* Upload Date */}
                  <Typography variant="body2" color="text.secondary">
                    Uploaded {formatters.formatDate(item.uploadDate)}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    startIcon={item.hasIndexHtml ? <VisibilityIcon /> : <DownloadIcon />}
                    onClick={() => handleViewItem(item)}
                  >
                    {item.hasIndexHtml ? 'View' : 'Download'}
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(item)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Upload Modal */}
      {category && (
        <KPIUploadModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          category={category}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{itemToDelete?.title}</strong>? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : null}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
