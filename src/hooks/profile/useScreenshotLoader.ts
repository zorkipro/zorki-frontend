import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { APIError } from '@/api/client';
import type { Screenshot } from '@/types/profile';

/**
 * Хук для загрузки скриншотов
 */
export const useScreenshotLoader = (
  profileId?: string,
  platform: string = 'instagram',
  isEditorPage: boolean = false
) => {
  const { user } = useAuth();
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchScreenshots = useCallback(
    async (forceFetch = false) => {
      if (!profileId || !user) {
        return;
      }

      try {
        setLoading(true);
        setError('');

        setScreenshots([]);
      } catch (error: unknown) {
        // Silent - screenshots fetch failed

        if (error instanceof APIError) {
          setError(error.message);
        } else {
          setError(error instanceof Error ? error.message : 'Failed to fetch screenshots');
        }
      } finally {
        setLoading(false);
      }
    },
    [profileId, platform, user, isEditorPage]
  );

  useEffect(() => {
    if (profileId) {
      fetchScreenshots();
    }
  }, [profileId, platform, fetchScreenshots]);

  return {
    screenshots,
    loading,
    error,
    fetchScreenshots,
    setScreenshots,
  };
};
