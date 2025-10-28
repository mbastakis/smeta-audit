import { useState, useEffect } from 'react';
import { documentService } from '../services/documentService';
import type { DocumentCounts } from '../types/document';

interface UseDocumentCountsResult {
  counts: DocumentCounts | null;
  loading: boolean;
  error: string | null;
}

export const useDocumentCounts = (): UseDocumentCountsResult => {
  const [counts, setCounts] = useState<DocumentCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const data = await documentService.getCounts();
        setCounts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch document counts');
        console.error('Error fetching document counts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return { counts, loading, error };
};
