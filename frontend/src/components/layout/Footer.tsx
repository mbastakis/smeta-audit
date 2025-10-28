import { Box, Typography } from '@mui/material';

export const Footer = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 2,
        px: 3,
        backgroundColor: '#f7fafc',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        textAlign: 'center'
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1a365d' }}>
        SMETA Compliance Documentation Platform
      </Typography>
      <Typography variant="body2" color="text.secondary">
        © 2025 All Rights Reserved
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Prepared by: Marvie Koukounaraki
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Last updated: {currentDate}
      </Typography>
    </Box>
  );
};
