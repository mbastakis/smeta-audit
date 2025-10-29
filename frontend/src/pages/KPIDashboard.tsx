import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Breadcrumbs,
  Link,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScienceIcon from '@mui/icons-material/Science';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { KPICategoryInfo } from '../types/kpi';

const categories: KPICategoryInfo[] = [
  {
    id: 'statistics',
    title: 'Statistics',
    description: 'Statistical reports and data analysis',
    icon: 'BarChart',
    color: '#1976d2',
  },
  {
    id: 'research',
    title: 'Research',
    description: 'Research studies and findings',
    icon: 'Science',
    color: '#388e3c',
  },
  {
    id: 'kpis',
    title: 'KPIs',
    description: 'Key Performance Indicators',
    icon: 'TrendingUp',
    color: '#f57c00',
  },
  {
    id: 'org-chart',
    title: 'Organization Chart',
    description: 'Organizational structure and charts',
    icon: 'AccountTree',
    color: '#7b1fa2',
  },
  {
    id: 'business-plan',
    title: 'Business Plan',
    description: 'Business plans and strategy documents',
    icon: 'Business',
    color: '#c62828',
  },
];

const iconMap: Record<string, React.ReactElement> = {
  BarChart: <BarChartIcon sx={{ fontSize: 48 }} />,
  Science: <ScienceIcon sx={{ fontSize: 48 }} />,
  TrendingUp: <TrendingUpIcon sx={{ fontSize: 48 }} />,
  AccountTree: <AccountTreeIcon sx={{ fontSize: 48 }} />,
  Business: <BusinessIcon sx={{ fontSize: 48 }} />,
};

export const KPIDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
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
        <Typography color="text.primary">KPIs Dashboard</Typography>
      </Breadcrumbs>

      {/* Page Title */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          KPIs Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Organize and view statistics, research reports, KPI metrics, organization charts, and business plans
        </Typography>
      </Box>

      {/* Category Cards Grid */}
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardActionArea
                onClick={() => navigate(`/kpis/${category.id}`)}
                sx={{ height: '100%' }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    py: 4,
                    minHeight: 200,
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      color: category.color,
                      mb: 2,
                    }}
                  >
                    {iconMap[category.icon]}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {category.title}
                  </Typography>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
