import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar as MuiAppBar,
  Toolbar,
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface AppBarProps {
  onUploadClick?: () => void;
}

export const AppBar: React.FC<AppBarProps> = ({ onUploadClick }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    if (searchTerm.trim().length >= 2) {
      setSearching(true);
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      // Reset searching state after navigation
      setTimeout(() => setSearching(false), 500);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <MuiAppBar position="static">
      <Toolbar sx={{ justifyContent: 'center', gap: 3 }}>
        <Box
          onClick={handleHomeClick}
          sx={{ 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'space-between',
            backgroundColor: 'white',
            borderRadius: '4px',
            '&:hover': {
              opacity: 0.9,
            },
          }}
        >
          <img 
            src="/assets/company-logo.png" 
            alt="People Hub HRIS - Respect • Safety • Growth" 
            style={{ 
              height: '80px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block'
            }} 
          />
        </Box>
        
        <Box sx={{ maxWidth: 600, width: '100%' }}>
          <TextField
            fullWidth
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={searching}
            size="small"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searching ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                </InputAdornment>
              ) : (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleSearch}
                    disabled={searchTerm.trim().length < 2}
                    sx={{ color: 'white' }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
              },
            }}
            sx={{
              '& .MuiInputBase-input': {
                color: 'white',
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
                opacity: 1,
              },
            }}
          />
        </Box>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<UploadFileIcon />}
          onClick={onUploadClick}
        >
          Upload Document
        </Button>
      </Toolbar>
    </MuiAppBar>
  );
};
