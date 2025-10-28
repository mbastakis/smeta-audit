import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
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

  return (
    <MuiAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          SMETA Platform
        </Typography>
        
        <Box sx={{ flexGrow: 1, maxWidth: 600 }}>
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
          sx={{ ml: 2 }}
        >
          Upload Document
        </Button>
      </Toolbar>
    </MuiAppBar>
  );
};
