import { useState, useMemo, useCallback, useEffect } from "react";
import {
  useInfiniteQuery,
  InfiniteData,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { FilterState, Blogger } from "@/types/blogger";
import { getAllBloggers } from "@/api/endpoints/blogger";
import { mapApiListBloggerToLocal } from "@/utils/api/mappers";
import { useDebounce } from "@/hooks/useDebounce";
import { useTopics } from "@/hooks/useTopics";
import { buildApiParams } from "@/utils/api/filterParams";
import { PAGINATION } from "@/config/pagination";
import {CACHE_SETTINGS} from "@/config";

interface BloggersPage {
  bloggers: Blogger[];
  totalCount: number;
  pagesCount: number;
  currentPage: number;
}

export const useBloggersQuery = (initialFilters: FilterState) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mergedBloggers, setMergedBloggers] = useState<Blogger[]>([]);

  const { categories, restrictedTopics } = useTopics();
  const debouncedSearch = useDebounce(filters.search || "", PAGINATION.LOAD_DELAY_MS);

  const memoizedFilters = useMemo(
      () => ({ ...filters, search: debouncedSearch }),
      [filters, debouncedSearch]
  );

  const queryOptions: UseInfiniteQueryOptions<BloggersPage, Error, InfiniteData<BloggersPage>, readonly unknown[], number> = {
    queryKey: ["bloggers", memoizedFilters],
    queryFn: async ({ pageParam = PAGINATION.DEFAULT_PAGE }) => {
      const apiParams = buildApiParams(
          memoizedFilters,
          pageParam,
          PAGINATION.DEFAULT_PAGE_SIZE,
          { categories, restrictedTopics }
      );

      const response = await getAllBloggers(apiParams);

      return {
        bloggers: response.items.map(mapApiListBloggerToLocal),
        totalCount: response.totalCount,
        pagesCount: response.pagesCount,
        currentPage: response.page,
      };
    },
    getNextPageParam: (lastPage) =>
        lastPage.currentPage < lastPage.pagesCount
            ? lastPage.currentPage + 1
            : undefined,
    initialPageParam: PAGINATION.DEFAULT_PAGE,
    staleTime: CACHE_SETTINGS.STALE_TIME,
    gcTime: CACHE_SETTINGS.PROFILE_CACHE_DURATION,
    refetchOnWindowFocus: false,
  };

  const query = useInfiniteQuery(queryOptions);

  useEffect(() => {
    if (!query.data) return;

    const newBloggers = query.data.pages.flatMap((p) => p.bloggers);

    setMergedBloggers((prev) => {
      const isReset =
          query.data.pages.length === 1 &&
          query.data.pages[0].currentPage === PAGINATION.DEFAULT_PAGE;

      if (isReset) {
        return newBloggers;
      }

      if (newBloggers.length > prev.length) {
        return [...prev, ...newBloggers.slice(prev.length)];
      }

      return prev;
    });
  }, [query.data]);

  const totalCount = query.data?.pages[0]?.totalCount || 0;
  const hasMore = !!query.hasNextPage;

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setMergedBloggers([]);
  }, []);

  const handleFilterToggle = useCallback((open: boolean) => {
    setIsFilterOpen(open);
  }, []);

  const allBloggers = useMemo(() => mergedBloggers, [mergedBloggers]);

  return {
    filters,
    setFilters,
    isFilterOpen,
    setIsFilterOpen,
    handleFilterChange,
    handleFilterToggle,
    allBloggers,
    filteredBloggers: allBloggers,
    loading: query.isLoading,
    searchLoading: query.isFetching && !query.isFetchingNextPage,
    error: query.isError ? "Ошибка загрузки данных" : "",
    totalCount,
    hasMore,
    isLoadingMore: query.isFetchingNextPage,
    loadMoreBloggers: query.fetchNextPage,
    refetch: query.refetch,
  };
};

// import { useMemo } from "react";
// import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
// import { FilterState, Blogger } from "@/types/blogger";
// import { getAllBloggers } from "@/api/endpoints/blogger";
// import { mapApiListBloggerToLocal } from "@/utils/api/mappers";
// import { useDebounce } from "@/hooks/useDebounce";
// import { useTopics } from "@/hooks/useTopics";
// import { buildApiParams } from "@/utils/api/filterParams";
//
// // Тип страницы
// interface BloggersPage {
//   bloggers: Blogger[];
//   totalCount: number;
//   pagesCount: number;
//   currentPage: number;
// }
//
// export const useBloggersQuery = (filters: FilterState) => {
//   const { categories, restrictedTopics } = useTopics();
//   const debouncedSearch = useDebounce(filters.search || "", 500);
//
//   const query = useInfiniteQuery<BloggersPage, Error, InfiniteData<BloggersPage>>({
//     queryKey: ["bloggers", debouncedSearch, filters],
//     queryFn: async ({ pageParam }) => {
//       const page = typeof pageParam === "number" ? pageParam : 1;
//
//       const apiParams = buildApiParams(
//           { ...filters, search: debouncedSearch },
//           page,
//           50,
//           { categories, restrictedTopics }
//       );
//
//       const response = await getAllBloggers(apiParams);
//
//       return {
//         bloggers: response.items.map(mapApiListBloggerToLocal),
//         totalCount: response.totalCount,
//         pagesCount: response.pagesCount,
//         currentPage: response.page,
//       };
//     },
//     getNextPageParam: (lastPage) =>
//         lastPage.currentPage < lastPage.pagesCount
//             ? lastPage.currentPage + 1
//             : undefined,
//     initialPageParam: 1, // обязательно для InfiniteQuery
//   });
//
//   const allBloggers: Blogger[] = useMemo(
//       () => query.data?.pages.flatMap((page) => page.bloggers) || [],
//       [query.data]
//   );
//
//   const totalCount = query.data?.pages[0]?.totalCount || 0;
//   const hasMore = !!query.hasNextPage;
//
//   return {
//     allBloggers,
//     filteredBloggers: allBloggers,
//     loading: query.isLoading,
//     searchLoading: query.isFetching,
//     error: query.isError ? "Ошибка загрузки данных" : "",
//     filters,
//     updateFilters: (newFilters: Partial<FilterState>) =>
//         console.warn("Для обновления фильтров используйте внешний setFilters"),
//     getBloggerById: (id: string) => allBloggers.find((b) => b.id === id),
//     refetch: query.refetch,
//     totalCount,
//     hasMore,
//     isLoadingMore: query.isFetchingNextPage,
//     loadMoreBloggers: query.fetchNextPage,
//   };
// };


// export const useBloggers = (externalFilters?: FilterState) => {
//   const { handleError } = useErrorHandler({
//     showNotifications: true,
//   });
//   const { categories, restrictedTopics } = useTopics();
//   const [bloggers, setBloggers] = useState<Blogger[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [searchLoading, setSearchLoading] = useState(false); // Отдельное состояние для поиска
//   const [error, setError] = useState("");
//   const [totalCount, setTotalCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//
//   const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
//   const debouncedSearchTerm = useDebounce(filters.search || "", 500); // 500ms задержка
//
//   const fetchBloggers = useCallback(async () => {
//     try {
//       const isSearch = !!debouncedSearchTerm;
//       if (isSearch) {
//         setSearchLoading(true); // Для поиска используем отдельное состояние
//       } else {
//         setLoading(true); // Для обычной загрузки используем основное состояние
//       }
//       setError("");
//
//       const topicsData = {
//         categories,
//         restrictedTopics,
//       };
//
//       const apiParams = buildApiParams(
//           { ...filters, search: debouncedSearchTerm },
//           1,
//           50,
//           topicsData,
//       );
//       const response = await getAllBloggers(apiParams);
//
//       // Трансформация данных
//       const transformedBloggers = response.items.map(mapApiListBloggerToLocal);
//
//       setBloggers(transformedBloggers);
//       setTotalCount(response.totalCount); // Реальное количество из API
//       setCurrentPage(1);
//       setHasMore(response.pagesCount > 1);
//     } catch (err: unknown) {
//       logError("Error fetching bloggers:", err);
//
//       // Используем универсальный обработчик ошибок
//       const processedError = handleError(err, {
//         showNotification: true,
//         logError: true,
//       });
//
//       setError(processedError.message);
//     } finally {
//       const isSearch = !!debouncedSearchTerm;
//       if (isSearch) {
//         setSearchLoading(false);
//       } else {
//         setLoading(false);
//       }
//     }
//   }, [debouncedSearchTerm, filters, categories, restrictedTopics]); // Добавляем зависимости для тематик
//
//   // Возвращаем всех блогеров без дополнительной фильтрации
//   // Поиск теперь обрабатывается на сервере через параметр username
//   const filteredBloggers = bloggers;
//
//   const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
//     setFilters((prev) => ({ ...prev, ...newFilters }));
//   }, []);
//
//   const getBloggerById = useCallback(
//       (id: string): Blogger | undefined => {
//         return bloggers.find((b) => b.id === id);
//       },
//       [bloggers],
//   );
//
//   const loadMoreBloggers = useCallback(async () => {
//     if (!hasMore || isLoadingMore) {
//       return;
//     }
//
//     try {
//       setIsLoadingMore(true);
//       const nextPage = currentPage + 1;
//
//       const topicsData = {
//         categories,
//         restrictedTopics,
//       };
//
//       const apiParams = buildApiParams(
//           { ...filters, search: debouncedSearchTerm },
//           nextPage,
//           50,
//           topicsData,
//       );
//       const response = await getAllBloggers(apiParams);
//
//       // Проверяем, что страница существует и содержит данные
//       if (!response.items || response.items.length === 0) {
//         setHasMore(false);
//         return;
//       }
//
//       // Добавляем новых блогеров к существующим
//       const newBloggers = response.items.map(mapApiListBloggerToLocal);
//       setBloggers((prev) => [...prev, ...newBloggers]);
//
//       // Обновляем состояние пагинации
//       setCurrentPage(nextPage);
//       setHasMore(nextPage < response.pagesCount && response.items.length > 0);
//     } catch (err: unknown) {
//       logError("Error loading more bloggers:", err);
//
//       // Если получили ошибку "Invalid page", останавливаем пагинацию
//       if (err instanceof Error && err.message.includes("Invalid page")) {
//         setHasMore(false);
//       }
//     } finally {
//       setIsLoadingMore(false);
//     }
//   }, [
//     currentPage,
//     hasMore,
//     isLoadingMore,
//     debouncedSearchTerm,
//     filters,
//     categories,
//     restrictedTopics,
//   ]);
//
//   useEffect(() => {
//     fetchBloggers();
//   }, [fetchBloggers]); // Убираем user из зависимостей
//
//   useEffect(() => {
//     if (externalFilters) {
//       setFilters(externalFilters);
//     }
//   }, [externalFilters]);
//
//   return {
//     allBloggers: bloggers,
//     filteredBloggers: filteredBloggers,
//     loading,
//     searchLoading,
//     error,
//     filters,
//     updateFilters,
//     getBloggerById,
//     refetch: fetchBloggers,
//     totalCount,
//     hasMore,
//     isLoadingMore,
//     loadMoreBloggers,
//   };
// };

