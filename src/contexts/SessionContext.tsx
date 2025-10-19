/**
 * SessionContext - управление аутентификацией и сессией пользователя
 * Отвечает только за auth state (SRP - Single Responsibility Principle)
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";
import { saveAccessToken, removeAccessToken } from "@/utils/googleAuth";
import { getClientMe } from "@/api/endpoints/client";

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
  /** Определить маршрут после авторизации */
  determineRedirectPath: () => Promise<string>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

/**
 * Hook для доступа к SessionContext
 * @throws {Error} если используется вне SessionProvider
 */
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
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
   * Определяет куда направить пользователя после авторизации
   * на основе данных из /auth/client/me
   */
  const determineRedirectPath = useCallback(async (): Promise<string> => {
    try {
      if (import.meta.env.DEV) {
        console.log('🔍 SessionContext: Determining redirect path after auth...');
      }
      
      const clientData = await getClientMe();
      
      if (import.meta.env.DEV) {
        console.log('✅ SessionContext: Client data received:', {
          hasBlogger: !!clientData.blogger,
          bloggerUsername: clientData.blogger?.username,
          hasLinkRequest: !!clientData.lastLinkRequest,
          fullClientData: clientData  // Добавляем полный ответ для отладки
        });
      }

      // ПРОСТАЯ ЛОГИКА: Если есть username в blogger - идем на редактирование профиля
      // Проверяем разные возможные места, где может быть username
      const username = clientData.blogger?.username || 
                      (clientData as any).username || 
                      (clientData as any).user?.username;
      
      if (username) {
        if (import.meta.env.DEV) {
          console.log('✅ SessionContext: User has username, redirecting to profile edit', { username });
        }
        return '/profile/edit';
      }

      // Если нет username - идем на страницу настройки профиля
      if (import.meta.env.DEV) {
        console.log('❌ SessionContext: User has no username, redirecting to profile setup', {
          bloggerUsername: clientData.blogger?.username,
          directUsername: (clientData as any).username,
          userUsername: (clientData as any).user?.username,
          bloggerExists: !!clientData.blogger
        });
      }
      return '/profile-setup';
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('❌ SessionContext: Failed to get client data, redirecting to profile setup:', error);
      }
      
      // Если не удалось получить данные - идем на настройку профиля
      // Пользователь сможет ввести username
      return '/profile-setup';
    }
  }, []);

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
      logger.error("Failed to refresh session", error);
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
      logger.error("Sign out failed", error);
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
    determineRedirectPath,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
