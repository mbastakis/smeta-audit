import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  Description as DescriptionIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { documentService } from '../services/documentService';
import type { Document } from '../types/document';
import { formatDate, getFileIconColor } from '../utils/formatters';

const PILLAR_NAMES: Record<string, string> = {
  'pillar-1': 'Pillar 1: Labour Standards',
  'pillar-2': 'Pillar 2: Health & Safety',
  'pillar-3': 'Pillar 3: Business Ethics',
  'pillar-4': 'Pillar 4: Environment',
  'kpis': 'KPIs',
  'capa': 'CAPA',
};

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q') || '';

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Group documents by pillar
  const groupedResults = results.reduce((acc, doc) => {
    if (!acc[doc.pillar]) {
      acc[doc.pillar] = [];
    }
    acc[doc.pillar].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      performSearch();
    } else {
      setLoading(false);
      setError('Search term must be at least 2 characters');
    }
  }, [searchQuery]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await documentService.searchDocuments(searchQuery);
      setResults(response.results);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Failed to search documents');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentClick = (document: Document) => {
    // TODO: Open document viewer (Story 1.7)
    console.log('View document:', document);
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  // Highlight matching text in document name
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} style={{ backgroundColor: '#fff59d', fontWeight: 'bold' }}>
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Searching...
        </Typography>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={120} sx={{ mb: 2 }} />
        ))}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToDashboard}
          sx={{ mr: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        Search results for: "<strong>{searchQuery}</strong>"
      </Typography>

      {/* Error State */}
      {error && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={handleBackToDashboard}
            sx={{ mt: 2 }}
          >
            Back to Dashboard
          </Button>
        </Box>
      )}

      {/* No Results State */}
      {!error && results.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No documents found for "{searchQuery}"
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try a different search term or check your spelling
          </Typography>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
          </Button>
        </Box>
      )}

      {/* Results grouped by pillar */}
      {!error && results.length > 0 && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Found {results.length} document{results.length !== 1 ? 's' : ''}
          </Typography>

          {Object.keys(groupedResults).map((pillar) => (
            <Accordion key={pillar} defaultExpanded sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {PILLAR_NAMES[pillar] || pillar}
                  </Typography>
                  <Chip
                    label={`${groupedResults[pillar].length} result${groupedResults[pillar].length !== 1 ? 's' : ''}`}
                    size="small"
                    color="primary"
                    sx={{ mr: 2 }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {groupedResults[pillar].map((document) => (
                  <Card key={document.id} sx={{ mb: 2 }}>
                    <CardActionArea onClick={() => handleDocumentClick(document)}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <DescriptionIcon
                            sx={{
                              fontSize: 40,
                              color: getFileIconColor(document.fileType),
                              mr: 2,
                            }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="div">
                              {highlightMatch(document.originalFilename, searchQuery)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {PILLAR_NAMES[document.pillar]}
                              {document.category && ` > ${document.category.charAt(0).toUpperCase() + document.category.slice(1)}`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              Uploaded: {formatDate(document.uploadDate)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      )}
    </Container>
  );
};
