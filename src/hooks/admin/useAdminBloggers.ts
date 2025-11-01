import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { APIError } from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import { logError } from "@/utils/logger";
import { useDebounce } from "@/hooks/useDebounce";
import {
  getAdminLinkRequests,
  approveLinkRequest,
  rejectLinkRequest,
  adminGetBloggers,
  adminGetBloggersStats,
  adminGetBloggersWithoutGender,
} from "../../api/endpoints/admin";
import { mapLinkRequestToTableFormat } from "@/utils/admin/mappers";
import type {
  AdminGetLinkBloggerClientRequestOutputDto,
  AdminGetBloggersStatsOutputDto,
  AdminBloggerWithGender,
  AdminGetBloggerOutputDto,
  ApiGender,
} from "../../api/types";

export const useAdminBloggers = () => {
  const { toast } = useToast();
  const [allBloggers, setAllBloggers] = useState<AdminGetBloggerOutputDto[]>([]);
  const [bloggersWithoutGender, setBloggersWithoutGender] = useState<AdminBloggerWithGender[]>([]);
  const [loadingGenderBloggers, setLoadingGenderBloggers] = useState(false);
  const [genderBloggersPage, setGenderBloggersPage] = useState(1);
  const [hasMoreGenderBloggers, setHasMoreGenderBloggers] = useState(true);
  const [totalGenderBloggersCount, setTotalGenderBloggersCount] = useState(0);
  const [genderPagesCache, setGenderPagesCache] = useState<Map<number, AdminBloggerWithGender[]>>(new Map());
  const [linkRequests, setLinkRequests] = useState<AdminGetLinkBloggerClientRequestOutputDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreBloggers, setHasMoreBloggers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBloggersCount, setTotalBloggersCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const isFetchingRef = useRef(false);
  const [stats, setStats] = useState<AdminGetBloggersStatsOutputDto>({
    totalBloggersCount: 0,
    totalApprovedBloggersCount: 0,
    totalVisibleBloggersCount: 0,
    totalModerationLinkRequestsCount: 0,
  });

  const fetchBloggers = useCallback(
    async (page: number = 1, append: boolean = false, isSearch: boolean = false) => {
      if (isFetchingRef.current) return;

      const isFirstPage = page === 1;
      isFetchingRef.current = true;

      try {
        if (isFirstPage) {
          isSearch ? setSearchLoading(true) : setLoading(true);
        } else {
          setIsLoadingMore(true);
        }
        setError(null);

        const bloggersResponse = await adminGetBloggers({
          page,
          size: 50,
          sortDirection: "desc",
          sortField: "createdAt",
          username: debouncedSearchTerm || undefined,
        });

        setAllBloggers((prev) => (isFirstPage ? bloggersResponse.items : [...prev, ...bloggersResponse.items]));
        setTotalBloggersCount(bloggersResponse.totalCount);
        setHasMoreBloggers(bloggersResponse.items.length === 50 && page * 50 < bloggersResponse.totalCount);
        setCurrentPage(page);

        if (isFirstPage) {
          const [statsResponse, linkRequestsResponse] = await Promise.allSettled([
            adminGetBloggersStats(),
            getAdminLinkRequests({
              status: "MODERATION",
              page: 1,
              size: 50,
              sortDirection: "desc",
              sortField: "createdAt",
            }),
          ]);
          
          if (statsResponse.status === "fulfilled") {
            setStats(statsResponse.value);
          } else {
            logError("Error fetching stats:", statsResponse.reason);
          }
          
          if (linkRequestsResponse.status === "fulfilled") {
            setLinkRequests(linkRequestsResponse.value.items);
          } else {
            logError("Error fetching link requests:", linkRequestsResponse.reason);
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Не удалось загрузить данные";
        setError(message);
        toast({
          title: "Ошибка",
          description: message,
          variant: "destructive",
        });
        logError("Error fetching data:", err);
      } finally {
        if (isFirstPage) {
          isSearch ? setSearchLoading(false) : setLoading(false);
        } else {
          setIsLoadingMore(false);
        }
        isFetchingRef.current = false;
      }
    },
    [debouncedSearchTerm, toast],
  );

  useEffect(() => {
    fetchBloggers(1, false, !!debouncedSearchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const loadMoreBloggers = useCallback(() => {
    if (hasMoreBloggers && !isLoadingMore) {
      fetchBloggers(currentPage + 1, true);
    }
  }, [hasMoreBloggers, isLoadingMore, currentPage, fetchBloggers]);

  const approveRequest = useCallback(async (requestId: number) => {
    setIsProcessing(true);
    setError(null);
    try {
      await approveLinkRequest(requestId);
      setLinkRequests((prev) => prev.filter((req) => Number(req.id) !== Number(requestId)));
      setStats((prev) => ({
        ...prev,
        totalModerationLinkRequestsCount: prev.totalModerationLinkRequestsCount - 1,
        totalApprovedBloggersCount: prev.totalApprovedBloggersCount + 1,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ошибка при одобрении запроса";
      setError(errorMessage);
      logError("Ошибка при одобрении запроса:", err);
      throw err instanceof APIError ? err : new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const rejectRequest = useCallback(async (requestId: number) => {
    setIsProcessing(true);
    setError(null);
    try {
      await rejectLinkRequest(requestId);
      setLinkRequests((prev) => prev.filter((req) => Number(req.id) !== Number(requestId)));
      setStats((prev) => ({
        ...prev,
        totalModerationLinkRequestsCount: prev.totalModerationLinkRequestsCount - 1,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ошибка при отклонении запроса";
      setError(errorMessage);
      logError("Ошибка при отклонении запроса:", err);
      throw err instanceof APIError ? err : new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const updateBloggerVisibility = (bloggerId: number, isHidden: boolean) => {
    setAllBloggers((prev) =>
      prev.map((blogger) => (blogger.id === bloggerId ? { ...blogger, isHidden } : blogger))
    );
    setStats((prev) => ({
      ...prev,
      totalVisibleBloggersCount: isHidden ? prev.totalVisibleBloggersCount - 1 : prev.totalVisibleBloggersCount + 1,
    }));
  };

  const updateBloggerGenderLocally = (bloggerId: number, genderType: ApiGender) => {
    setBloggersWithoutGender((prev) => prev.filter((blogger) => blogger.id !== bloggerId));
    setGenderPagesCache((prevCache) => {
      const newCache = new Map(prevCache);
      newCache.forEach((bloggers, pageNumber) => {
        newCache.set(pageNumber, bloggers.filter((blogger) => blogger.id !== bloggerId));
      });
      return newCache;
    });
    setTotalGenderBloggersCount((prev) => Math.max(0, prev - 1));
  };

  const fetchBloggersWithoutGender = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        setLoadingGenderBloggers(true);
        const result = await adminGetBloggersWithoutGender(page, 50, genderPagesCache);
        if (append) {
          setBloggersWithoutGender((prev) => [...prev, ...result.bloggers]);
        } else {
          setBloggersWithoutGender(result.bloggers);
        }
        setHasMoreGenderBloggers(result.hasMore);
        setTotalGenderBloggersCount(result.totalCount);
        setGenderBloggersPage(page);
        setGenderPagesCache(result.cachedPages);
      } catch (err) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить блогеров без пола",
          variant: "destructive",
        });
      } finally {
        setLoadingGenderBloggers(false);
      }
    },
    [genderPagesCache, toast],
  );

  const loadMoreGenderBloggers = useCallback(() => {
    if (!loadingGenderBloggers && hasMoreGenderBloggers) {
      fetchBloggersWithoutGender(genderBloggersPage + 1, true);
    }
  }, [loadingGenderBloggers, hasMoreGenderBloggers, genderBloggersPage, fetchBloggersWithoutGender]);

  const clearGenderCache = () => {
    setGenderPagesCache(new Map());
    setBloggersWithoutGender([]);
    setGenderBloggersPage(1);
    setHasMoreGenderBloggers(true);
    setTotalGenderBloggersCount(0);
  };

  const filteredBloggers = showHidden ? allBloggers : allBloggers.filter((blogger) => !blogger.isHidden);

  const filteredLinkRequests = useMemo(() => {
    return linkRequests
      .map(mapLinkRequestToTableFormat)
      .filter((mapped) => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        const name = `${mapped.name} ${mapped.lastName}`.trim().toLowerCase();
        const username = (mapped.username || "").toLowerCase();
        const email = (mapped.user_email || "").toLowerCase();
        return name.includes(search) || username.includes(search) || email.includes(search);
      });
  }, [linkRequests, searchTerm]);

  return {
    allBloggers: filteredBloggers,
    bloggersWithoutGender,
    linkRequests: filteredLinkRequests,
    loading,
    searchLoading,
    isLoadingMore,
    hasMoreBloggers,
    totalBloggersCount,
    stats,
    searchTerm,
    setSearchTerm,
    showHidden,
    setShowHidden,
    fetchBloggers,
    loadMoreBloggers,
    approveRequest,
    rejectRequest,
    updateBloggerVisibility,
    updateBloggerGenderLocally,
    fetchBloggersWithoutGender,
    loadMoreGenderBloggers,
    loadingGenderBloggers,
    hasMoreGenderBloggers,
    totalGenderBloggersCount,
    clearGenderCache,
    isProcessing,
    error,
  };
};
