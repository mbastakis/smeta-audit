import { useState, useEffect, useCallback } from 'react';
import { documentService } from '../services/documentService';
import type { DocumentCounts } from '../types/document';

interface UseDocumentCountsResult {
  counts: DocumentCounts | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDocumentCounts = (): UseDocumentCountsResult => {
  const [counts, setCounts] = useState<DocumentCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await documentService.getCounts();
      setCounts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch document counts');
      console.error('Error fetching document counts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return { counts, loading, error, refetch: fetchCounts };
};
