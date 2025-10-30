import { useState, useMemo, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FilterState, Blogger } from "@/types/blogger";
import { getAllBloggers } from "@/api/endpoints/blogger";
import { mapApiListBloggerToLocal } from "@/utils/api/mappers";
import { useDebounce } from "@/hooks/useDebounce";
import { useTopics } from "@/hooks/useTopics";
import { buildApiParams } from "@/utils/api/filterParams";
import { PAGINATION } from "@/config/pagination";
import { CACHE_SETTINGS } from "@/config";

export const useBloggersQuery = (initialFilters: FilterState) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { categories, restrictedTopics } = useTopics();
  const debouncedSearch = useDebounce(filters.search || "", PAGINATION.LOAD_DELAY_MS);

  const memoizedFilters = useMemo(
      () => ({ ...filters, search: debouncedSearch }),
      [filters, debouncedSearch]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    error,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
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
  });

  const allBloggers = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.bloggers);
  }, [data]);

  const totalCount = data?.pages[0]?.totalCount || 0;

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleFilterToggle = useCallback((open: boolean) => {
    setIsFilterOpen(open);
  }, []);

  return {
    filters,
    setFilters,
    isFilterOpen,
    setIsFilterOpen,
    handleFilterChange,
    handleFilterToggle,
    allBloggers,
    filteredBloggers: allBloggers,
    loading: isLoading,
    searchLoading: isFetching && !isFetchingNextPage,
    error: isError ? "Ошибка загрузки данных" : "",
    totalCount,
    hasMore: hasNextPage,
    isLoadingMore: isFetchingNextPage,
    loadMoreBloggers: fetchNextPage,
    refetch,
  };
};

