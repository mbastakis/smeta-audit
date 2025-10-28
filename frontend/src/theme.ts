import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1a365d', // Navy blue
    },
    secondary: {
      main: '#38a169', // Green
    },
    background: {
      default: '#f7fafc',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});
