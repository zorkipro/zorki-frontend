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
        logger.debug('No changes detected, skipping update', {
          component: 'BloggerContext',
          fields,
        });
        return prev;
      }

      logger.debug('Updating blogger fields', {
        component: 'BloggerContext',
        fields,
        previousFields: Object.keys(fields).reduce((acc, key) => {
          const typedKey = key as keyof ClientBloggerInfo;
          (acc as any)[typedKey] = (prev as any)[typedKey];
          return acc;
        }, {} as Partial<ClientBloggerInfo>),
      });

      return { ...prev, ...fields };
    });
  }, []);

  /**
   * Обновить данные блогера
   */
  const refreshBloggerInfo = useCallback(async () => {
    if (!accessToken) {
      clearBloggerInfo();
      setBloggerInfoLoading(false);
      return;
    }

    try {
      setBloggerInfoLoading(true);
      setBloggerInfoError(null);

      const data = await getClientMe();
      

      setBloggerInfo(data.blogger);
      setLastLinkRequest(data.lastLinkRequest);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch blogger info';



      setBloggerInfoError(errorMessage);
      clearBloggerInfo();
    } finally {
      setBloggerInfoLoading(false);
    }
  }, [accessToken]);

  // Автоматическая загрузка данных блогера при изменении сессии
  useEffect(() => {
    if (session?.access_token) {
      refreshBloggerInfo();
    } else {
      clearBloggerInfo();
      setBloggerInfoLoading(false);
    }
  }, [session?.access_token, session?.user.id, refreshBloggerInfo]);

  const value: BloggerContextType = {
    bloggerInfo,
    lastLinkRequest,
    bloggerInfoLoading,
    bloggerInfoError,
    refreshBloggerInfo,
    updateBloggerFields,
    clearBloggerInfo,
  };

  return <BloggerContext.Provider value={value}>{children}</BloggerContext.Provider>;
};
