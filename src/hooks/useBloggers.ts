import { useState, useEffect, useCallback } from "react";
import { Blogger, FilterState } from "@/types/blogger";
import { getAllBloggers } from "@/api/endpoints/blogger";
import { mapApiListBloggerToLocal } from "@/utils/api/mappers";
import { useErrorHandler } from "@/utils/errorHandler";
import { buildApiParams } from "@/utils/api/filterParams";
import { useDebounce } from "@/hooks/useDebounce";
import { useTopics } from "@/hooks/useTopics";
import { DEFAULT_FILTER_STATE } from "@/config/filters";

export const useBloggers = (externalFilters?: FilterState) => {
  const { handleError } = useErrorHandler({ showNotifications: true });
  const { categories, restrictedTopics } = useTopics();
  const filters = externalFilters || DEFAULT_FILTER_STATE;
  const debouncedSearch = useDebounce(filters.search || "", 500);
  
  const [bloggers, setBloggers] = useState<Blogger[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchBloggers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAllBloggers(
        buildApiParams({ ...filters, search: debouncedSearch }, 1, 50, { categories, restrictedTopics })
      );
      setBloggers(response.items.map(mapApiListBloggerToLocal));
      setTotalCount(response.totalCount);
      setCurrentPage(1);
      setHasMore(response.pagesCount > 1);
    } catch (err: unknown) {
      setError(handleError(err).message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters, categories, restrictedTopics, handleError]);

  const loadMoreBloggers = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await getAllBloggers(
        buildApiParams({ ...filters, search: debouncedSearch }, nextPage, 50, { categories, restrictedTopics })
      );
      setBloggers((prev) => [...prev, ...response.items.map(mapApiListBloggerToLocal)]);
      setCurrentPage(nextPage);
      setHasMore(nextPage < response.pagesCount);
    } catch (err: unknown) {
      const errorMessage = handleError(err).message;
      if (errorMessage.includes("Invalid page")) setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, hasMore, isLoadingMore, debouncedSearch, filters, categories, restrictedTopics, handleError]);

  useEffect(() => {
    fetchBloggers();
  }, [fetchBloggers]);

  return {
    filteredBloggers: bloggers,
    loading,
    error,
    totalCount,
    hasMore,
    isLoadingMore,
    loadMoreBloggers,
    refetch: fetchBloggers,
  };
};
