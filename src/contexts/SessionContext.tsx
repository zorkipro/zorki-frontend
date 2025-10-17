/**
 * SessionContext - управление аутентификацией и сессией пользователя
 * Отвечает только за auth state (SRP - Single Responsibility Principle)
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { saveAccessToken, removeAccessToken } from '@/utils/googleAuth';

export interface SessionContextType {
  /** Текущий пользователь Supabase */
  user: User | null;
  /** Текущая сессия Supabase */
  session: Session | null;
  /** Флаг загрузки начальной сессии */
  loading: boolean;
  /** JWT токен доступа */
  accessToken: string | null;
  /** Выход из системы */
  signOut: () => Promise<void>;
  /** Обновить сессию вручную */
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

/**
 * Hook для доступа к SessionContext
 * @throws {Error} если используется вне SessionProvider
 */
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

interface SessionProviderProps {
  children: React.ReactNode;
}

/**
 * Provider для управления сессией пользователя
 */
export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  /**
   * Обновляет состояние сессии и токена
   */
  const updateSession = useCallback((newSession: Session | null) => {
    setSession(newSession);
    setUser(newSession?.user ?? null);

    const token = newSession?.access_token ?? null;
    setAccessToken(token);
    
    // Обновляем sessionStorage только при изменении токена
    if (token) {
      saveAccessToken(token);
    } else {
      removeAccessToken();
    }
  }, []);

  /**
   * Обновить сессию вручную (например, после изменения профиля)
   */
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      updateSession(data.session);
    } catch (error) {
      logger.error('Failed to refresh session', error, { component: 'SessionProvider' });
    }
  }, [updateSession]);

  /**
   * Выход из системы
   */
  const signOut = useCallback(async () => {
    try {
      // Очищаем токен
      removeAccessToken();
      setAccessToken(null);

      // Выходим из Supabase
      await supabase.auth.signOut();

      setUser(null);
      setSession(null);
    } catch (error) {
      logger.error('Sign out failed', error, { component: 'SessionProvider' });
      throw error;
    }
  }, []);

  // Инициализация сессии и подписка на изменения
  useEffect(() => {
    // Подписка на изменения auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      updateSession(newSession);
      setLoading(false);
    });

    // Проверяем существующую сессию
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      updateSession(initialSession);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [updateSession]);

  const value: SessionContextType = {
    user,
    session,
    loading,
    accessToken,
    signOut,
    refreshSession,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};
