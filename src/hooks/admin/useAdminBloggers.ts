import { useState, useEffect, useCallback } from 'react';
import { getAllBloggers } from '@/api/endpoints/blogger';
import { mapApiListBloggerToLocal } from '@/utils/api/mappers';
import { APIError } from '@/api/client';
import { useToast } from '@/hooks/use-toast';
import { logError, logWarn } from '@/utils/logger';
import { useDebounce } from '@/hooks/useDebounce';
import {
  getAdminLinkRequests,
  approveLinkRequest,
  rejectLinkRequest,
  adminGetBloggers,
  adminGetBloggersStats,
} from '../../api/endpoints/admin';
import type {
  AdminGetLinkBloggerClientRequestOutputDto,
  LinkRequestStatus,
  AdminGetBloggerOutputDto,
  AdminGetBloggersStatsOutputDto,
} from '../../api/types';

interface BloggerStats {
  totalBloggersCount: number;
  totalApprovedBloggersCount: number;
  totalVisibleBloggersCount: number;
  totalModerationLinkRequestsCount: number;
}

interface GetLinkRequestsParams {
  page?: number;
  size?: number;
  sortDirection?: 'asc' | 'desc';
  sortField?: 'createdAt';
  status?: LinkRequestStatus;
}

export const useAdminBloggers = () => {
  const { toast } = useToast();
  const [allBloggers, setAllBloggers] = useState<AdminGetBloggerOutputDto[]>([]);
  const [linkRequests, setLinkRequests] = useState<AdminGetLinkBloggerClientRequestOutputDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false); // Отдельное состояние для поиска
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreBloggers, setHasMoreBloggers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBloggersCount, setTotalBloggersCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms задержка
  const [stats, setStats] = useState<AdminGetBloggersStatsOutputDto>({
    totalBloggersCount: 0,
    totalApprovedBloggersCount: 0,
    totalVisibleBloggersCount: 0,
    totalModerationLinkRequestsCount: 0,
  });

  const fetchBloggers = useCallback(
    async (page: number = 1, append: boolean = false, isSearch: boolean = false) => {
      try {
        if (page === 1) {
          if (isSearch) {
            setSearchLoading(true); // Для поиска используем отдельное состояние
          } else {
            setLoading(true); // Для обычной загрузки используем основное состояние
          }
        } else {
          setIsLoadingMore(true);
        }
        setError(null);

        // ============================================
        // ✅ ИСПОЛЬЗУЕМ АДМИНСКИЕ ЭНДПОИНТЫ
        // ============================================

        // 1. Загружаем блогеров через админский API
        const bloggersResponse = await adminGetBloggers({
          page: page,
          size: 50,
          sortDirection: 'desc',
          sortField: 'createdAt',
          username: debouncedSearchTerm || undefined, // Используем debounced поиск
        });

        // Обновляем состояние блогеров
        if (page === 1) {
          setAllBloggers(bloggersResponse.items);
        } else {
          setAllBloggers((prev) => [...prev, ...bloggersResponse.items]);
        }

        // Обновляем информацию о пагинации
        setTotalBloggersCount(bloggersResponse.totalCount);
        setHasMoreBloggers(
          bloggersResponse.items.length === 50 && page * 50 < bloggersResponse.totalCount
        );
        setCurrentPage(page);

        // 2. Загружаем статистику (только для первой страницы)
        if (page === 1) {
          const statsResponse = await adminGetBloggersStats();
          setStats(statsResponse);
        }

        // 3. Загружаем запросы на связывание (только для первой страницы)
        if (page === 1) {
          const linkRequestsResponse = await getAdminLinkRequests({
            status: 'MODERATION',
            page: 1,
            size: 50,
            sortDirection: 'desc',
            sortField: 'createdAt',
          });

          setLinkRequests(linkRequestsResponse.items);
        }
      } catch (error: unknown) {
        logError('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Неизвестная ошибка');

        if (error instanceof APIError) {
          toast({
            title: 'Ошибка API',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Ошибка',
            description: 'Не удалось загрузить данные',
            variant: 'destructive',
          });
        }
      } finally {
        if (page === 1) {
          if (isSearch) {
            setSearchLoading(false);
          } else {
            setLoading(false);
          }
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [debouncedSearchTerm]
  ); // Используем debounced значение

  // Эффект для обычной загрузки (без поиска)
  useEffect(() => {
    if (!debouncedSearchTerm) {
      fetchBloggers(1, false, false);
    }
  }, [fetchBloggers, debouncedSearchTerm]);

  // Эффект для поиска
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchBloggers(1, false, true);
    }
  }, [debouncedSearchTerm, fetchBloggers]);

  const loadMoreBloggers = useCallback(async () => {
    if (!hasMoreBloggers || isLoadingMore) return;
    await fetchBloggers(currentPage + 1, true);
  }, [hasMoreBloggers, isLoadingMore, currentPage, fetchBloggers]);

  const approveRequest = useCallback(
    async (requestId: number) => {
      try {
        setIsProcessing(true);
        setError(null);

        // Проверяем, существует ли запрос в локальном состоянии
        const existingRequest = linkRequests.find((req) => req.id === requestId);
        if (!existingRequest) {
          logWarn(`⚠️ Запрос ID ${requestId} не найден в локальном состоянии`);
          throw new Error(
            `Запрос ID ${requestId} не найден в локальном состоянии. Возможно, он уже был обработан.`
          );
        }

        // Проверяем, что запрос в статусе MODERATION
        if (existingRequest.status !== 'MODERATION') {
          throw new Error(
            `Запрос ID ${requestId} уже обработан. Текущий статус: ${existingRequest.status}`
          );
        }

        await approveLinkRequest(requestId);

        // Обновляем локальное состояние запросов на связывание
        setLinkRequests((prev) => prev.filter((req) => req.id !== requestId));

        // Обновляем статистику
        setStats((prev) => ({
          ...prev,
          totalModerationLinkRequestsCount: prev.totalModerationLinkRequestsCount - 1,
          totalApprovedBloggersCount: prev.totalApprovedBloggersCount + 1,
        }));
      } catch (err: unknown) {
        logError('❌ Ошибка при одобрении запроса:', err);

        // Дополнительная диагностика
        if (err instanceof Error) {
          logError('❌ Детали ошибки:', {
            message: err.message,
            name: err.name,
            stack: err.stack,
          });
        }

        setError(err instanceof Error ? err.message : 'Ошибка при одобрении запроса');
        throw err; // Пробрасываем ошибку для обработки в UI
      } finally {
        setIsProcessing(false);
      }
    },
    [linkRequests]
  );

  const rejectRequest = useCallback(async (requestId: number) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Проверяем, существует ли запрос в локальном состоянии
      const existingRequest = linkRequests.find((req) => req.id === requestId);
      if (!existingRequest) {
        logWarn(`⚠️ Запрос ID ${requestId} не найден в локальном состоянии`);
        throw new Error(
          `Запрос ID ${requestId} не найден в локальном состоянии. Возможно, он уже был обработан.`
        );
      }

      // Проверяем, что запрос в статусе MODERATION
      if (existingRequest.status !== 'MODERATION') {
        throw new Error(
          `Запрос ID ${requestId} уже обработан. Текущий статус: ${existingRequest.status}`
        );
      }

      await rejectLinkRequest(requestId);

      // Обновляем локальное состояние запросов на связывание
      setLinkRequests((prev) => prev.filter((req) => req.id !== requestId));

      // Обновляем статистику
      setStats((prev) => ({
        ...prev,
        totalModerationLinkRequestsCount: prev.totalModerationLinkRequestsCount - 1,
      }));
    } catch (err: unknown) {
      logError('❌ Ошибка при отклонении запроса:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при отклонении запроса');
      throw err; // Пробрасываем ошибку для обработки в UI
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Функция для обновления видимости блогера в локальном состоянии
  const updateBloggerVisibility = useCallback((bloggerId: number, isHidden: boolean) => {
    setAllBloggers((prev) =>
      prev.map((blogger) => (blogger.id === bloggerId ? { ...blogger, isHidden } : blogger))
    );

    // Обновляем статистику видимых блогеров
    setStats((prev) => ({
      ...prev,
      totalVisibleBloggersCount: isHidden
        ? prev.totalVisibleBloggersCount - 1
        : prev.totalVisibleBloggersCount + 1,
    }));
  }, []);

  return {
    allBloggers,
    linkRequests,
    loading,
    searchLoading,
    isLoadingMore,
    hasMoreBloggers,
    totalBloggersCount,
    stats,
    searchTerm,
    setSearchTerm,
    fetchBloggers,
    loadMoreBloggers,
    // Дополнительные функции для работы с запросами на связывание
    approveRequest,
    rejectRequest,
    // Функция для обновления видимости блогера
    updateBloggerVisibility,
    isProcessing,
    error,
  };
};
