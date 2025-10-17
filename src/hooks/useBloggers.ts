import { useState, useEffect, useCallback } from 'react';
import { Blogger, FilterState } from '@/types/blogger';
import { getAllBloggers } from '@/api/endpoints/blogger';
import { mapApiListBloggerToLocal } from '@/utils/api/mappers';
import { APIError } from '@/api/client';
import { useErrorHandler } from '@/utils/errorHandler';
import { logError } from '@/utils/logger';
import { buildApiParams } from '@/utils/api/filterParams';
import { useDebounce } from '@/hooks/useDebounce';
import { useTopics } from '@/hooks/useTopics';
import { DEFAULT_FILTER_STATE } from '@/config/filters';

export const useBloggers = (externalFilters?: FilterState) => {
  const { handleError } = useErrorHandler({
    showNotifications: true,
  });
  const { categories, restrictedTopics } = useTopics();
  const [bloggers, setBloggers] = useState<Blogger[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false); // Отдельное состояние для поиска
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const debouncedSearchTerm = useDebounce(filters.search || '', 500); // 500ms задержка

  const fetchBloggers = useCallback(async () => {
    try {
      const isSearch = !!debouncedSearchTerm;
      if (isSearch) {
        setSearchLoading(true); // Для поиска используем отдельное состояние
      } else {
        setLoading(true); // Для обычной загрузки используем основное состояние
      }
      setError('');

      const topicsData = {
        categories,
        restrictedTopics,
      };

      const apiParams = buildApiParams({ ...filters, search: debouncedSearchTerm }, 1, 50, topicsData);
      const response = await getAllBloggers(apiParams);

      // Трансформация данных
      const transformedBloggers = response.items.map(mapApiListBloggerToLocal);

      setBloggers(transformedBloggers);
      setTotalCount(response.totalCount); // Реальное количество из API
      setCurrentPage(1);
      setHasMore(response.pagesCount > 1);
    } catch (err: unknown) {
      logError('Error fetching bloggers:', err);

      // Используем универсальный обработчик ошибок
      const processedError = handleError(err, {
        showNotification: true,
        logError: true,
      });

      setError(processedError.message);
    } finally {
      const isSearch = !!debouncedSearchTerm;
      if (isSearch) {
        setSearchLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [debouncedSearchTerm, filters, categories, restrictedTopics]); // Добавляем зависимости для тематик

  // Возвращаем всех блогеров без дополнительной фильтрации
  // Поиск теперь обрабатывается на сервере через параметр username
  const filteredBloggers = bloggers;

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const getBloggerById = useCallback(
    (id: string): Blogger | undefined => {
      return bloggers.find((b) => b.id === id);
    },
    [bloggers]
  );

  const loadMoreBloggers = useCallback(async () => {
    if (!hasMore || isLoadingMore) {
      return;
    }

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;

      const topicsData = {
        categories,
        restrictedTopics,
      };

      const apiParams = buildApiParams({ ...filters, search: debouncedSearchTerm }, nextPage, 50, topicsData);
      const response = await getAllBloggers(apiParams);

      // Проверяем, что страница существует и содержит данные
      if (!response.items || response.items.length === 0) {
        setHasMore(false);
        return;
      }

      // Добавляем новых блогеров к существующим
      const newBloggers = response.items.map(mapApiListBloggerToLocal);
      setBloggers((prev) => [...prev, ...newBloggers]);

      // Обновляем состояние пагинации
      setCurrentPage(nextPage);
      setHasMore(nextPage < response.pagesCount && response.items.length > 0);
    } catch (err: unknown) {
      logError('Error loading more bloggers:', err);

      // Если получили ошибку "Invalid page", останавливаем пагинацию
      if (err instanceof Error && err.message.includes('Invalid page')) {
        setHasMore(false);
      }
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, hasMore, isLoadingMore, debouncedSearchTerm, filters, categories, restrictedTopics]);

  useEffect(() => {
    fetchBloggers();
  }, [fetchBloggers]); // Убираем user из зависимостей

  useEffect(() => {
    if (externalFilters) {
      setFilters(externalFilters);
    }
  }, [externalFilters]);

  return {
    allBloggers: bloggers,
    filteredBloggers: filteredBloggers,
    loading,
    searchLoading,
    error,
    filters,
    updateFilters,
    getBloggerById,
    refetch: fetchBloggers,
    totalCount,
    hasMore,
    isLoadingMore,
    loadMoreBloggers,
  };
};
