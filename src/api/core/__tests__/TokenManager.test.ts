/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TokenManager } from '../TokenManager';
import * as googleAuth from '@/utils/googleAuth';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('TokenManager', () => {
  let tokenManager: TokenManager;

  beforeEach(() => {
    // Clear sessionStorage
    sessionStorage.clear();

    // Reset mocks
    vi.clearAllMocks();

    // Get fresh instance
    tokenManager = TokenManager.getInstance();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = TokenManager.getInstance();
      const instance2 = TokenManager.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('getAuthToken - priority order', () => {
    it('should return admin token as highest priority', async () => {
      sessionStorage.setItem('adminToken', 'admin-token-123');
      sessionStorage.setItem('adminTempToken', 'temp-token-456');
      sessionStorage.setItem('accessToken', 'access-token-789');

      const token = await tokenManager.getAuthToken();

      expect(token).toBe('admin-token-123');
    });

    it('should return admin temp token when no admin token', async () => {
      sessionStorage.setItem('adminTempToken', 'temp-token-456');
      sessionStorage.setItem('accessToken', 'access-token-789');

      const token = await tokenManager.getAuthToken();

      expect(token).toBe('temp-token-456');
    });

    it('should return access token when no admin tokens', async () => {
      vi.spyOn(googleAuth, 'getAccessToken').mockReturnValue('access-token-789');

      const token = await tokenManager.getAuthToken();

      expect(token).toBe('access-token-789');
    });

    it('should return supabase token as fallback', async () => {
      // Очищаем все токены из sessionStorage
      sessionStorage.clear();
      vi.spyOn(googleAuth, 'getAccessToken').mockReturnValue(null);

      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: {
          session: {
            access_token: 'supabase-token-xyz',
          } as any,
        },
        error: null,
      });

      const token = await tokenManager.getAuthToken();

      expect(token).toBe('supabase-token-xyz');
    });

    it('should return null when no tokens available', async () => {
      vi.spyOn(googleAuth, 'getAccessToken').mockReturnValue(null);

      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const token = await tokenManager.getAuthToken();

      expect(token).toBeNull();
    });

    it('should handle supabase error gracefully', async () => {
      vi.spyOn(googleAuth, 'getAccessToken').mockReturnValue(null);

      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.auth.getSession).mockRejectedValue(new Error('Supabase error'));

      const token = await tokenManager.getAuthToken();

      expect(token).toBeNull();
    });
  });

  describe('clearAllTokens', () => {
    it('should clear all tokens from sessionStorage', () => {
      sessionStorage.setItem('adminToken', 'admin-123');
      sessionStorage.setItem('adminTempToken', 'temp-456');
      sessionStorage.setItem('accessToken', 'access-789');

      tokenManager.clearAllTokens();

      expect(sessionStorage.getItem('adminToken')).toBeNull();
      expect(sessionStorage.getItem('adminTempToken')).toBeNull();
      expect(sessionStorage.getItem('accessToken')).toBeNull();
    });
  });

  describe('clearAdminTokens', () => {
    it('should clear only admin tokens', () => {
      sessionStorage.setItem('adminToken', 'admin-123');
      sessionStorage.setItem('adminTempToken', 'temp-456');
      sessionStorage.setItem('accessToken', 'access-789');

      tokenManager.clearAdminTokens();

      expect(sessionStorage.getItem('adminToken')).toBeNull();
      expect(sessionStorage.getItem('adminTempToken')).toBeNull();
      expect(sessionStorage.getItem('accessToken')).toBe('access-789');
    });
  });

  describe('hasAuthToken', () => {
    it('should return true when token exists', async () => {
      sessionStorage.setItem('accessToken', 'token-123');
      vi.spyOn(googleAuth, 'getAccessToken').mockReturnValue('token-123');

      const hasToken = await tokenManager.hasAuthToken();

      expect(hasToken).toBe(true);
    });

    it('should return false when no token exists', async () => {
      vi.spyOn(googleAuth, 'getAccessToken').mockReturnValue(null);

      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const hasToken = await tokenManager.hasAuthToken();

      expect(hasToken).toBe(false);
    });
  });

  describe('getCurrentTokenType', () => {
    it('should return "admin" when admin token exists', () => {
      sessionStorage.setItem('adminToken', 'admin-123');

      const type = tokenManager.getCurrentTokenType();

      expect(type).toBe('admin');
    });

    it('should return "admin_temp" when admin temp token exists', () => {
      sessionStorage.setItem('adminTempToken', 'temp-123');

      const type = tokenManager.getCurrentTokenType();

      expect(type).toBe('admin_temp');
    });

    it('should return "access" when access token exists', () => {
      vi.spyOn(googleAuth, 'getAccessToken').mockReturnValue('access-123');

      const type = tokenManager.getCurrentTokenType();

      expect(type).toBe('access');
    });

    it('should return "supabase" as fallback', () => {
      vi.spyOn(googleAuth, 'getAccessToken').mockReturnValue(null);

      const type = tokenManager.getCurrentTokenType();

      expect(type).toBe('supabase');
    });
  });
});
