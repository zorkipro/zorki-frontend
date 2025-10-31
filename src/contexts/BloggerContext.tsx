/**
 * BloggerContext - управление данными блогера
 * Отвечает только за blogger info (SRP - Single Responsibility Principle)
 */

import {createContext, ReactNode, useCallback, useContext, useEffect} from 'react';
import {logger} from '@/utils/logger';
import {getClientMe} from '@/api/endpoints/client';
import {useSession} from './SessionContext';
import type {ClientBloggerInfo, ClientLinkRequestInfo} from '@/api/types';
import {useQuery, useQueryClient} from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  // КРИТИЧНО: Если нет валидной сессии - не загружаем данные
  const hasValidSession = !!(session?.access_token && accessToken && session?.user?.id);


  const {data, isLoading, isError, refetch,} = useQuery({
    queryKey:['bloggerInfo', session?.user?.id],
    queryFn: async () => {
      try {
        return await getClientMe();
      } catch (error) {
        if (error instanceof Error && !error.message.includes('401')) {
          logger.error('Failed to fetch blogger info', error);
        }
        throw error;
      }
    },
    enabled: hasValidSession,
    staleTime: Infinity,
    retry: 1,
  } );


  const bloggerInfo: ClientBloggerInfo | null = data?.blogger || null;
  const lastLinkRequest: ClientLinkRequestInfo | null = data?.lastLinkRequest || null;
  const bloggerInfoError: string | null = isError ? 'Ошибка загрузки данных блогера' : null;

  // Обновление только определённых полей локально
  const updateBloggerFields = useCallback(
      (fields: Partial<ClientBloggerInfo>) => {
        if (!bloggerInfo) return;

        const hasChanges = Object.keys(fields).some((key) => {
          const typedKey = key as keyof ClientBloggerInfo;
          return bloggerInfo[typedKey] !== fields[typedKey];
        });

        if (!hasChanges) return;

        queryClient.setQueryData(['bloggerInfo', session?.user?.id], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            blogger: { ...oldData.blogger, ...fields },
          };
        });
      },
      [bloggerInfo, queryClient, session?.user?.id]
  );

  // Очистка данных
  const clearBloggerInfo = useCallback(() => {
    queryClient.removeQueries({
      queryKey: ['bloggerInfo', session?.user?.id],
    });  }, [queryClient, session?.user?.id]);

  // «Тихая» загрузка (tryLoad)
  const tryLoadBloggerInfo = useCallback(async () => {
    if (!hasValidSession) return;

    try {
      await refetch({ throwOnError: false });
    } catch (error) {
      // Игнорируем 401 ошибки
      if (!(error instanceof Error && error.message.includes('401'))) {
        throw error;
      }
    }
  }, [hasValidSession, refetch]);

  const refreshBloggerInfo = useCallback(async () => {
    if (!hasValidSession) {
      clearBloggerInfo();
      return;
    }
    await refetch({ throwOnError: false });
  }, [hasValidSession, refetch, clearBloggerInfo]);

  const value: BloggerContextType = {
    bloggerInfo,
    lastLinkRequest,
    bloggerInfoLoading: isLoading,
    bloggerInfoError,
    refreshBloggerInfo,
    tryLoadBloggerInfo,
    updateBloggerFields,
    clearBloggerInfo,
  };


  return <BloggerContext.Provider value={value}>{children}</BloggerContext.Provider>;
};


// /**
//  * BloggerContext - управление данными блогера
//  * Отвечает только за blogger info (SRP - Single Responsibility Principle)
//  */
//
// import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
// import { logger } from '@/utils/logger';
// import { getClientMe } from '@/api/endpoints/client';
// import { useSession } from './SessionContext';
// import type { ClientBloggerInfo, ClientLinkRequestInfo } from '@/api/types';
//
// export interface BloggerContextType {
//   /** Информация о блогере */
//   bloggerInfo: ClientBloggerInfo | null;
//   /** Последний запрос на привязку соцсети */
//   lastLinkRequest: ClientLinkRequestInfo | null;
//   /** Флаг загрузки данных блогера */
//   bloggerInfoLoading: boolean;
//   /** Ошибка загрузки данных блогера */
//   bloggerInfoError: string | null;
//   /** Обновить данные блогера вручную */
//   refreshBloggerInfo: () => Promise<void>;
//   /** Попытаться загрузить данные блогера (тихо игнорирует 401) */
//   tryLoadBloggerInfo: () => Promise<void>;
//   /** Обновить только конкретные поля блогера */
//   updateBloggerFields: (fields: Partial<ClientBloggerInfo>) => void;
//   /** Очистить данные блогера */
//   clearBloggerInfo: () => void;
// }
//
// const BloggerContext = createContext<BloggerContextType | undefined>(undefined);
//
// /**
//  * Hook для доступа к BloggerContext
//  * @throws {Error} если используется вне BloggerProvider
//  */
// export const useBlogger = () => {
//   const context = useContext(BloggerContext);
//   if (!context) {
//     throw new Error('useBlogger must be used within a BloggerProvider');
//   }
//   return context;
// };
//
// interface BloggerProviderProps {
//   children: ReactNode;
// }
//
// /**
//  * Provider для управления данными блогера
//  * Автоматически загружает данные при наличии активной сессии
//  */
// export const BloggerProvider = ({ children }: BloggerProviderProps) => {
//   const { session, accessToken } = useSession();
//
//   const [bloggerInfo, setBloggerInfo] = useState<ClientBloggerInfo | null>(null);
//   const [lastLinkRequest, setLastLinkRequest] = useState<ClientLinkRequestInfo | null>(null);
//   const [bloggerInfoLoading, setBloggerInfoLoading] = useState(false);
//   const [bloggerInfoError, setBloggerInfoError] = useState<string | null>(null);
//
//   // КРИТИЧНО: Если нет валидной сессии - не загружаем данные
//   const hasValidSession = !!(session?.access_token && accessToken && session?.user?.id);
//
//   // Добавляем логирование для отладки (только в development)
//
//   /**
//    * Очистить данные блогера
//    */
//   const clearBloggerInfo = useCallback(() => {
//     setBloggerInfo(null);
//     setLastLinkRequest(null);
//     setBloggerInfoError(null);
//   }, []);
//
//   /**
//    * Обновить только конкретные поля блогера (оптимизированное обновление)
//    */
//   const updateBloggerFields = useCallback((fields: Partial<ClientBloggerInfo>) => {
//     setBloggerInfo((prev) => {
//       if (!prev) return prev;
//
//       // Проверяем, есть ли реальные изменения
//       const hasChanges = Object.keys(fields).some(key => {
//         const typedKey = key as keyof ClientBloggerInfo;
//         return prev[typedKey] !== fields[typedKey];
//       });
//
//       if (!hasChanges) {
//         return prev;
//       }
//
//       return { ...prev, ...fields };
//     });
//   }, []);
//
//   /**
//    * Обновить данные блогера
//    */
//   const refreshBloggerInfo = useCallback(async () => {
//     // КРИТИЧНО: Двойная проверка - не вызываем API если нет валидной сессии
//     if (!hasValidSession) {
//       clearBloggerInfo();
//       setBloggerInfoLoading(false);
//       return;
//     }
//
//     try {
//       setBloggerInfoLoading(true);
//       setBloggerInfoError(null);
//
//       const data = await getClientMe();
//
//       setBloggerInfo(data.blogger);
//       setLastLinkRequest(data.lastLinkRequest);
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Failed to fetch blogger info';
//
//       // Логируем ошибку только если это не 401 (неавторизованный пользователь)
//       if (error instanceof Error && !error.message.includes('401')) {
//         logger.error('Failed to fetch blogger info', error);
//       }
//
//       // Для 401 ошибок просто очищаем данные без показа ошибки
//       if (error instanceof Error && error.message.includes('401')) {
//         clearBloggerInfo();
//         setBloggerInfoError(null); // Не показываем ошибку для 401
//       } else {
//         setBloggerInfoError(errorMessage);
//         clearBloggerInfo();
//       }
//     } finally {
//       setBloggerInfoLoading(false);
//     }
//   }, [hasValidSession, clearBloggerInfo]);
//
//   /**
//    * Попытаться загрузить данные блогера (тихо игнорирует 401)
//    * Используется для условной загрузки данных только когда они действительно нужны
//    */
//   const tryLoadBloggerInfo = useCallback(async () => {
//     if (!hasValidSession) return;
//
//     try {
//       const data = await getClientMe();
//       setBloggerInfo(data.blogger);
//       setLastLinkRequest(data.lastLinkRequest);
//     } catch (error) {
//       // Тихо игнорируем 401 - пользователь может быть не связан с блогером
//       if (!(error instanceof Error && error.message.includes('401'))) {
//         throw error;
//       }
//     }
//   }, [hasValidSession]);
//
//   // Автоматическая загрузка данных блогера при изменении сессии
//   // Загружаем данные только если есть сессия И данные еще не загружены
//   useEffect(() => {
//     if (!hasValidSession) {
//       // Если нет сессии - очищаем данные
//       clearBloggerInfo();
//       setBloggerInfoLoading(false);
//     } else if (!bloggerInfo && !bloggerInfoLoading) {
//       // Если есть сессия, но нет данных блогера - загружаем их
//       tryLoadBloggerInfo();
//     }
//   }, [hasValidSession, bloggerInfo, bloggerInfoLoading, clearBloggerInfo, tryLoadBloggerInfo]);
//
//   const value: BloggerContextType = {
//     bloggerInfo,
//     lastLinkRequest,
//     bloggerInfoLoading,
//     bloggerInfoError,
//     refreshBloggerInfo,
//     tryLoadBloggerInfo,
//     updateBloggerFields,
//     clearBloggerInfo,
//   };
//
//   return <BloggerContext.Provider value={value}>{children}</BloggerContext.Provider>;
// };
