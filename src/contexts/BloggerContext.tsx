/**
 * BloggerContext - управление данными блогера
 * Отвечает только за blogger info (SRP - Single Responsibility Principle)
 */

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { logger } from '@/utils/logger';
import { getClientMe } from '@/api/endpoints/client';
import { useSession } from './SessionContext';
import type { ClientBloggerInfo, ClientLinkRequestInfo } from '@/api/types';

export interface BloggerContextType {
  /** Информация о блогере */
  bloggerInfo: ClientBloggerInfo | null;
  /** Последний запрос на привязку соцсети */
  lastLinkRequest: ClientLinkRequestInfo | null;
  /** Флаг загрузки данных блогера */
  bloggerInfoLoading: boolean;
  /** Ошибка загрузки данных блогера */
  bloggerInfoError: string | null;
  /** Обновить данные блогера вручную */
  refreshBloggerInfo: () => Promise<void>;
  /** Попытаться загрузить данные блогера (тихо игнорирует 401) */
  tryLoadBloggerInfo: () => Promise<void>;
  /** Обновить только конкретные поля блогера */
  updateBloggerFields: (fields: Partial<ClientBloggerInfo>) => void;
  /** Очистить данные блогера */
  clearBloggerInfo: () => void;
}

const BloggerContext = createContext<BloggerContextType | undefined>(undefined);

/**
 * Hook для доступа к BloggerContext
 * @throws {Error} если используется вне BloggerProvider
 */
export const useBlogger = () => {
  const context = useContext(BloggerContext);
  if (!context) {
    throw new Error('useBlogger must be used within a BloggerProvider');
  }
  return context;
};

interface BloggerProviderProps {
  children: ReactNode;
}

/**
 * Provider для управления данными блогера
 * Автоматически загружает данные при наличии активной сессии
 */
export const BloggerProvider = ({ children }: BloggerProviderProps) => {
  const { session, accessToken } = useSession();

  const [bloggerInfo, setBloggerInfo] = useState<ClientBloggerInfo | null>(null);
  const [lastLinkRequest, setLastLinkRequest] = useState<ClientLinkRequestInfo | null>(null);
  const [bloggerInfoLoading, setBloggerInfoLoading] = useState(false);
  const [bloggerInfoError, setBloggerInfoError] = useState<string | null>(null);

  // КРИТИЧНО: Если нет валидной сессии - не загружаем данные
  const hasValidSession = !!(session?.access_token && accessToken && session?.user?.id);
  
  // Добавляем логирование для отладки (только в development)
  if (import.meta.env.DEV) {
    console.log('🔍 BloggerContext Debug:', {
      hasSession: !!session,
      hasAccessToken: !!accessToken,
      hasUser: !!session?.user?.id,
      hasValidSession,
      sessionAccessToken: session?.access_token ? 'present' : 'missing',
      accessTokenValue: accessToken ? 'present' : 'missing',
      sessionStorageToken: sessionStorage.getItem('accessToken') ? 'present' : 'missing'
    });
  }

  /**
   * Очистить данные блогера
   */
  const clearBloggerInfo = useCallback(() => {
    setBloggerInfo(null);
    setLastLinkRequest(null);
    setBloggerInfoError(null);
  }, []);

  /**
   * Обновить только конкретные поля блогера (оптимизированное обновление)
   */
  const updateBloggerFields = useCallback((fields: Partial<ClientBloggerInfo>) => {
    setBloggerInfo((prev) => {
      if (!prev) return prev;
      
      // Проверяем, есть ли реальные изменения
      const hasChanges = Object.keys(fields).some(key => {
        const typedKey = key as keyof ClientBloggerInfo;
        return prev[typedKey] !== fields[typedKey];
      });

      if (!hasChanges) {
        return prev;
      }

      return { ...prev, ...fields };
    });
  }, []);

  /**
   * Обновить данные блогера
   */
  const refreshBloggerInfo = useCallback(async () => {
    if (import.meta.env.DEV) {
      console.log('🔄 refreshBloggerInfo called:', { hasValidSession });
    }
    
    // КРИТИЧНО: Двойная проверка - не вызываем API если нет валидной сессии
    if (!hasValidSession) {
      if (import.meta.env.DEV) {
        console.log('❌ Skipping API call - no valid session');
      }
      clearBloggerInfo();
      setBloggerInfoLoading(false);
      return;
    }

    if (import.meta.env.DEV) {
      console.log('✅ Making API call to getClientMe');
    }
    try {
      setBloggerInfoLoading(true);
      setBloggerInfoError(null);

      const data = await getClientMe();
      
      setBloggerInfo(data.blogger);
      setLastLinkRequest(data.lastLinkRequest);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch blogger info';
      
      // Логируем ошибку только если это не 401 (неавторизованный пользователь)
      if (error instanceof Error && !error.message.includes('401')) {
        logger.error('Failed to fetch blogger info', error);
      }

      // Для 401 ошибок просто очищаем данные без показа ошибки
      if (error instanceof Error && error.message.includes('401')) {
        if (import.meta.env.DEV) {
          console.log('🔄 BloggerContext: 401 error - clearing blogger info silently');
        }
        clearBloggerInfo();
        setBloggerInfoError(null); // Не показываем ошибку для 401
      } else {
        setBloggerInfoError(errorMessage);
        clearBloggerInfo();
      }
    } finally {
      setBloggerInfoLoading(false);
    }
  }, [hasValidSession, clearBloggerInfo]);

  /**
   * Попытаться загрузить данные блогера (тихо игнорирует 401)
   * Используется для условной загрузки данных только когда они действительно нужны
   */
  const tryLoadBloggerInfo = useCallback(async () => {
    if (!hasValidSession) return;
    
    try {
      const data = await getClientMe();
      setBloggerInfo(data.blogger);
      setLastLinkRequest(data.lastLinkRequest);
      if (import.meta.env.DEV) {
        console.log('✅ Manual blogger info load successful:', data);
      }
    } catch (error) {
      // Тихо игнорируем 401 - пользователь может быть не связан с блогером
      if (!(error instanceof Error && error.message.includes('401'))) {
        if (import.meta.env.DEV) {
          console.log('❌ Manual blogger info load failed:', error);
        }
        throw error;
      }
      if (import.meta.env.DEV) {
        console.log('🔄 Manual load: 401 error - user not linked to blogger');
      }
    }
  }, [hasValidSession]);

  // Автоматическая загрузка данных блогера при изменении сессии
  // Загружаем данные только если есть сессия И данные еще не загружены
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🔄 BloggerContext useEffect triggered:', { hasValidSession, hasBloggerInfo: !!bloggerInfo });
    }
    
    if (!hasValidSession) {
      if (import.meta.env.DEV) {
        console.log('❌ Clearing blogger info - no valid session');
      }
      // Если нет сессии - очищаем данные
      clearBloggerInfo();
      setBloggerInfoLoading(false);
    } else if (!bloggerInfo && !bloggerInfoLoading) {
      // Если есть сессия, но нет данных блогера - загружаем их
      if (import.meta.env.DEV) {
        console.log('🔄 BloggerContext: Loading blogger info automatically...');
      }
      tryLoadBloggerInfo();
    }
  }, [hasValidSession, bloggerInfo, bloggerInfoLoading, clearBloggerInfo, tryLoadBloggerInfo]);

  const value: BloggerContextType = {
    bloggerInfo,
    lastLinkRequest,
    bloggerInfoLoading,
    bloggerInfoError,
    refreshBloggerInfo,
    tryLoadBloggerInfo,
    updateBloggerFields,
    clearBloggerInfo,
  };

  return <BloggerContext.Provider value={value}>{children}</BloggerContext.Provider>;
};
