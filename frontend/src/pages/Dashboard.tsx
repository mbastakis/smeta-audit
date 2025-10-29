import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Badge,
  Skeleton,
  Alert,
  Button,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import NatureIcon from '@mui/icons-material/Nature';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useDocumentCounts } from '../hooks/useDocumentCounts';
import { useNotification } from '../contexts/NotificationContext';

interface DashboardCard {
  id: string;
  title: string;
  icon: React.ReactElement;
  route: string;
}

const dashboardCards: DashboardCard[] = [
  { id: 'pillar-1', title: 'Pillar 1: Labour Standards', icon: <WorkIcon />, route: '/pillar/pillar-1' },
  { id: 'pillar-2', title: 'Pillar 2: Health & Safety', icon: <LocalHospitalIcon />, route: '/pillar/pillar-2' },
  { id: 'pillar-3', title: 'Pillar 3: Business Ethics', icon: <BusinessCenterIcon />, route: '/pillar/pillar-3' },
  { id: 'pillar-4', title: 'Pillar 4: Environment', icon: <NatureIcon />, route: '/pillar/pillar-4' },
  { id: 'kpis', title: 'KPIs Dashboard', icon: <AssessmentIcon />, route: '/kpis' },
  { id: 'capa', title: 'CAPA Tracker', icon: <AssignmentIcon />, route: '/capa' },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { counts, loading, error, refetch } = useDocumentCounts();
  const { showError } = useNotification();

  // Show notification on error
  useEffect(() => {
    if (error) {
      showError('Failed to load document counts. Please try again.');
    }
  }, [error, showError]);

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  const getCardCount = (cardId: string): number => {
    if (!counts || !counts[cardId]) return 0;
    return counts[cardId].total || 0;
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 6 }}>
        {/* Hero Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ fontWeight: 700, color: 'primary.main' }}
          >
            SMETA Compliance Documentation Platform
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ fontWeight: 400 }}
          >
            Organized Evidence for Audit Excellence
          </Typography>
        </Box>

        {/* Error State with Retry */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 4 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={handleRetry}
                startIcon={<RefreshIcon />}
              >
                Retry
              </Button>
            }
          >
            Error loading document counts: {error}
          </Alert>
        )}

        {/* Navigation Cards Grid */}
        <Grid container spacing={3}>
          {dashboardCards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.id}>
              {loading ? (
                // Loading Skeleton
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Skeleton variant="text" width="60%" sx={{ ml: 2 }} />
                    </Box>
                    <Skeleton variant="rectangular" height={60} />
                  </CardContent>
                </Card>
              ) : (
                // Actual Card
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      elevation: 8,
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => handleCardClick(card.route)}
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            color: 'white',
                            mr: 2,
                          }}
                        >
                          {React.cloneElement(card.icon, { fontSize: 'large' })}
                        </Box>
                        <Badge
                          badgeContent={getCardCount(card.id)}
                          color="secondary"
                          max={999}
                          sx={{
                            '& .MuiBadge-badge': {
                              fontSize: '1rem',
                              height: 28,
                              minWidth: 28,
                              borderRadius: 14,
                            },
                          }}
                        >
                          <Box sx={{ width: 40 }} />
                        </Badge>
                      </Box>
                      <Typography 
                        variant="h6" 
                        component="h2"
                        sx={{ 
                          fontWeight: 600,
                          color: 'text.primary',
                        }}
                      >
                        {card.title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};
