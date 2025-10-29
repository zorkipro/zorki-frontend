import { memo, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Blogger } from "@/types/blogger";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui-kit";
import { InfiniteScrollList } from "@/ui-kit";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Button } from "@/ui-kit";
import { SafeAvatar } from "@/components/ui/SafeAvatar";
import { truncateName } from "@/utils/formatters";
import { normalizeUsername } from "@/utils/username";

interface BloggerTableProps {
  bloggers: Blogger[];
  loading?: boolean;
  searchLoading?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  totalCount?: number;
}

import {
  formatNumber,
  formatReach,
  formatPriceWithCurrency,
} from "@/utils/formatters";

const BloggerTableComponent = ({
  bloggers,
  loading = false,
  searchLoading = false,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  totalCount = 0,
}: BloggerTableProps) => {
  const navigate = useNavigate();

  // Используем локальную пагинацию только если не переданы внешние пропсы
  const {
    visibleItems: visibleBloggers,
    hasMore: hasMoreLocal,
    isLoading: isLoadingLocal,
    loadMore: loadMoreLocal,
    totalItems,
    currentPage,
  } = useInfiniteScroll({
    data: bloggers,
    itemsPerPage: 50,
    threshold: 200,
    enabled: !onLoadMore, // Отключаем локальный хук если есть внешний
  });

  // Выбираем данные для отображения
  const displayBloggers = onLoadMore ? bloggers : visibleBloggers;
  const displayHasMore = onLoadMore ? hasMore : hasMoreLocal;
  const displayIsLoading = onLoadMore ? isLoadingMore : isLoadingLocal;

  // Ref для Intersection Observer на десктопе
  const observerRef = useRef<HTMLDivElement>(null);

  // Настройка Intersection Observer для автоматической загрузки на десктопе
  useEffect(() => {
    if (!onLoadMore || !displayHasMore || displayIsLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
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
  }, [onLoadMore, displayHasMore, displayIsLoading]);

  const renderMobileCard = useCallback(
    (blogger: Blogger, index: number) => (
      <div
        key={blogger.id}
        className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow duration-200 cursor-pointer mb-4"
        onClick={() => navigate(`/${normalizeUsername(blogger.handle)}`,{
          state: { bloggerId: blogger.id },
        })}
      >
        {/* Аватарка/имя/никнейм - главная информация */}
        <div className="flex items-center space-x-4 mb-6">
          <SafeAvatar
            src={blogger.avatar}
            alt={`Аватар ${blogger.name}`}
            className="w-12 h-12 flex-shrink-0 aspect-square"
            username={normalizeUsername(blogger.handle)}
            gender={blogger.gender}
          />
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-gray-900 text-base truncate leading-tight"
              title={blogger.name}
            >
              {truncateName(blogger.name, 20)}
            </h3>
            <p className="text-sm text-gray-500 truncate mt-0.5">
              {blogger.handle}
            </p>
          </div>
        </div>

        {/* Статистика - вторичная информация */}
        <div className="space-y-4">
          {/* Подписчики и ER */}
          <div className="flex items-center">
            <div className="flex-1 text-center">
              <div className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
                Подписчиков
              </div>
              <div className="font-bold text-gray-900 text-lg">
                {formatNumber(blogger.followers)}
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200 mx-4"></div>
            <div className="flex-1 text-center">
              <div className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
                ER
              </div>
              <div className="font-bold text-gray-900 text-lg">
                {blogger.engagementRate}%
              </div>
            </div>
          </div>

          {/* Охваты */}
          <div className="flex items-center">
            <div className="flex-1 text-center">
              <div className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
                Охваты поста
              </div>
              <div className="font-bold text-gray-900 text-lg">
                {formatReach(blogger.postReach)}
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200 mx-4"></div>
            <div className="flex-1 text-center">
              <div className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
                Охваты сториз
              </div>
              <div className="font-bold text-gray-900 text-lg">
                {formatReach(blogger.storyReach)}
              </div>
            </div>
          </div>

          {/* Цены */}
          <div className="flex items-center">
            <div className="flex-1 text-center">
              <div className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
                Цена поста
              </div>
              <div className="font-bold text-gray-900 text-lg">
                {formatPriceWithCurrency(blogger.postPrice)}
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200 mx-4"></div>
            <div className="flex-1 text-center">
              <div className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
                Цена сториз
              </div>
              <div className="font-bold text-gray-900 text-lg">
                {formatPriceWithCurrency(blogger.storyPrice)}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    [navigate],
  );

  return (
    <>
      {/* Desktop Table */}
      <div
        className="hidden md:block border rounded-lg"
        role="region"
        aria-label="Таблица блогеров"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center min-w-[80px]">Место</TableHead>
              <TableHead className="min-w-[250px]">Блогер</TableHead>
              <TableHead className="text-center min-w-[120px]">
                Подписчиков
              </TableHead>
              <TableHead className="text-center min-w-[120px]">
                Охваты поста
              </TableHead>
              <TableHead className="text-center min-w-[120px]">
                Охваты сториз
              </TableHead>
              <TableHead className="text-center min-w-[120px]">
                Цена поста
              </TableHead>
              <TableHead className="text-center min-w-[120px]">
                Цена сториз
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-muted-foreground">
                      Загрузка блогеров...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : searchLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-muted-foreground">
                      Поиск блогеров...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : visibleBloggers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-muted-foreground">
                    Блогеры не найдены
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              displayBloggers.map((blogger, index) => (
                <TableRow
                  key={blogger.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() =>
                    navigate(`/${normalizeUsername(blogger.handle)}`,{
                      state: { bloggerId: blogger.id },
                    })
                  }
                  role="button"
                  tabIndex={0}
                  aria-label={`Перейти к профилю блогера ${blogger.name}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/${normalizeUsername(blogger.handle)}`,{
                        state: { bloggerId: blogger.id },
                      });
                    }
                  }}
                >
                  <TableCell className="text-center font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <SafeAvatar
                        src={blogger.avatar}
                        alt={`Аватар ${blogger.name}`}
                        className="w-10 h-10 aspect-square"
                        username={normalizeUsername(blogger.handle)}
                        gender={blogger.gender}
                      />
                      <div>
                        <div
                          className="font-medium text-foreground"
                          title={blogger.name}
                        >
                          {truncateName(blogger.name, 25)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {blogger.handle}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-medium">
                      {formatNumber(blogger.followers)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {blogger.engagementRate}% ER
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-medium">
                      {formatReach(blogger.postReach)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-medium">
                      {formatReach(blogger.storyReach)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-medium">
                      {formatPriceWithCurrency(blogger.postPrice)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-medium">
                      {formatPriceWithCurrency(blogger.storyPrice)}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Loading indicator for desktop */}
        {displayIsLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Загрузка следующих блогеров...</span>
            </div>
          </div>
        )}

        {/* Infinite Scroll Trigger for Desktop */}
        {displayHasMore && (
          <div
            ref={observerRef}
            className="h-4 flex items-center justify-center"
            aria-hidden="true"
          />
        )}

        {/* Pagination Info */}
        <div className="text-center text-sm text-muted-foreground mt-2">
          {onLoadMore ? (
            <>
              Показано {displayBloggers.length} из {totalCount} блогеров
              {displayHasMore && (
                <span className="ml-2 text-blue-600">
                  (автозагрузка при прокрутке)
                </span>
              )}
            </>
          ) : (
            `Показано ${displayBloggers.length} из ${totalItems} блогеров`
          )}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden" role="region" aria-label="Карточки блогеров">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground">
                Загрузка блогеров...
              </span>
            </div>
          </div>
        ) : bloggers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Блогеры не найдены
          </div>
        ) : (
          <InfiniteScrollList
            data={bloggers}
            renderItem={renderMobileCard}
            itemsPerPage={50}
            threshold={200}
            aria-label="Список блогеров в виде карточек"
            emptyMessage="Блогеры не найдены"
            endMessage="Вы просмотрели всех блогеров"
            hasMore={hasMore}
            isLoading={isLoadingMore}
            onLoadMore={onLoadMore}
          />
        )}
      </div>
    </>
  );
};

export const BloggerTable = memo(BloggerTableComponent);
