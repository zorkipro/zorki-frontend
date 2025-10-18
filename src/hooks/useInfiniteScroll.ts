import { useState, useEffect, useCallback, useRef } from "react";

interface UseInfiniteScrollOptions<T> {
  data: T[];
  itemsPerPage?: number;
  threshold?: number;
  enabled?: boolean;
}

interface UseInfiniteScrollReturn<T> {
  visibleItems: T[];
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
  reset: () => void;
  totalItems: number;
  currentPage: number;
}

export const useInfiniteScroll = <T>({
  data,
  itemsPerPage = 20,
  threshold = 200,
  enabled = true,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasMore = currentPage < totalPages;

  const visibleItems = data.slice(0, currentPage * itemsPerPage);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Симуляция задержки для плавности
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore]);

  const reset = useCallback(() => {
    setCurrentPage(1);
    setIsLoading(false);
  }, []);

  // Настройка Intersection Observer
  useEffect(() => {
    if (!enabled || !loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      },
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, hasMore, isLoading, loadMore, threshold]);

  // Сброс при изменении данных
  useEffect(() => {
    reset();
  }, [data, reset]);

  return {
    visibleItems,
    hasMore,
    isLoading,
    loadMore,
    reset,
    totalItems,
    currentPage,
  };
};
