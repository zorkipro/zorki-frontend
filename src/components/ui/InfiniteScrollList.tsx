import React, { forwardRef, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface InfiniteScrollListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemsPerPage?: number;
  threshold?: number;
  enabled?: boolean;
  className?: string;
  loadingComponent?: React.ReactNode;
  endMessage?: string;
  emptyMessage?: string;
  "aria-label"?: string;
  "aria-live"?: "polite" | "assertive" | "off";
  // Новые пропсы для внешнего infinite scroll
  hasMore?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
}

const InfiniteScrollList = <T,>({
  data,
  renderItem,
  itemsPerPage = 20,
  threshold = 200,
  enabled = true,
  className = "",
  loadingComponent,
  endMessage = "Вы просмотрели все элементы",
  emptyMessage = "Нет данных для отображения",
  "aria-label": ariaLabel,
  "aria-live": ariaLive = "polite",
  // Новые пропсы
  hasMore: externalHasMore,
  isLoading: externalIsLoading,
  onLoadMore: externalOnLoadMore,
}: InfiniteScrollListProps<T>) => {
  // Используем локальный хук только если не переданы внешние пропсы
  const localInfiniteScroll = useInfiniteScroll({
    data,
    itemsPerPage,
    threshold,
    enabled: !externalOnLoadMore, // Отключаем локальный хук если есть внешний
  });

  // Выбираем источник данных в зависимости от того, переданы ли внешние пропсы
  const visibleItems = externalOnLoadMore
    ? data
    : localInfiniteScroll.visibleItems;
  const hasMore =
    externalHasMore !== undefined
      ? externalHasMore
      : localInfiniteScroll.hasMore;
  const isLoading =
    externalIsLoading !== undefined
      ? externalIsLoading
      : localInfiniteScroll.isLoading;
  const totalItems = externalOnLoadMore
    ? data.length
    : localInfiniteScroll.totalItems;
  const currentPage = externalOnLoadMore ? 1 : localInfiniteScroll.currentPage;

  // Ref для Intersection Observer
  const observerRef = useRef<HTMLDivElement>(null);

  // Настройка Intersection Observer для внешнего infinite scroll
  useEffect(() => {
    if (!externalOnLoadMore || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          externalOnLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "500px", // Загружаем заранее, когда до конца остается 500px
      },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [externalOnLoadMore, hasMore, isLoading]);

  const defaultLoadingComponent = (
    <div
      className="flex items-center justify-center py-8"
      role="status"
      aria-label="Загрузка"
    >
      <Loader2 className="w-6 h-6 animate-spin mr-2" />
      <span>Загрузка...</span>
    </div>
  );

  if (data.length === 0) {
    return (
      <div
        className="text-center py-12 text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={className} aria-label={ariaLabel} aria-live={ariaLive}>
      <div role="list" className="space-y-4">
        {visibleItems.map((item, index) => (
          <div key={index} role="listitem">
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div role="status" aria-label="Загрузка дополнительных элементов">
          {loadingComponent || defaultLoadingComponent}
        </div>
      )}

      {/* End of list message */}
      {!hasMore && totalItems > 0 && (
        <div
          className="text-center py-8 text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          {endMessage}
        </div>
      )}

      {/* Intersection observer target */}
      {hasMore && <div ref={observerRef} className="h-1" aria-hidden="true" />}
    </div>
  );
};

export default InfiniteScrollList;
