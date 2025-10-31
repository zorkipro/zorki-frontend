import { useState, useEffect, useCallback } from "react";
import { getAllBloggers } from "@/api/endpoints/blogger";
import { mapApiListBloggerToLocal } from "@/utils/api/mappers";
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
  adminEnrichBloggersWithGender,
  adminGetBloggersWithoutGender,
} from "../../api/endpoints/admin";
import type {
  AdminGetLinkBloggerClientRequestOutputDto,
  LinkRequestStatus,
  AdminGetBloggerOutputDto,
  AdminGetBloggersStatsOutputDto,
  AdminBloggerWithGender,
  ApiGender,
} from "../../api/types";

interface BloggerStats {
  totalBloggersCount: number;
  totalApprovedBloggersCount: number;
  totalVisibleBloggersCount: number;
  totalModerationLinkRequestsCount: number;
}

interface GetLinkRequestsParams {
  page?: number;
  size?: number;
  sortDirection?: "asc" | "desc";
  sortField?: "createdAt";
  status?: LinkRequestStatus;
}

export const useAdminBloggers = () => {
  const { toast } = useToast();
  const [allBloggers, setAllBloggers] = useState<AdminBloggerWithGender[]>(
    [],
  );
  const [bloggersWithoutGender, setBloggersWithoutGender] = useState<AdminBloggerWithGender[]>([]);
  const [loadingGenderBloggers, setLoadingGenderBloggers] = useState(false);
  const [genderBloggersPage, setGenderBloggersPage] = useState(1);
  const [hasMoreGenderBloggers, setHasMoreGenderBloggers] = useState(true);
  const [totalGenderBloggersCount, setTotalGenderBloggersCount] = useState(0);
  const [genderPagesCache, setGenderPagesCache] = useState<Map<number, AdminBloggerWithGender[]>>(new Map());
  const [linkRequests, setLinkRequests] = useState<
    AdminGetLinkBloggerClientRequestOutputDto[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false); // Отдельное состояние для поиска
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreBloggers, setHasMoreBloggers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBloggersCount, setTotalBloggersCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms задержка
  const [stats, setStats] = useState<AdminGetBloggersStatsOutputDto>({
    totalBloggersCount: 0,
    totalApprovedBloggersCount: 0,
    totalVisibleBloggersCount: 0,
    totalModerationLinkRequestsCount: 0,
  });

  const fetchBloggers = useCallback(
    async (
      page: number = 1,
      append: boolean = false,
      isSearch: boolean = false,
    ) => {
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
          sortDirection: "desc",
          sortField: "createdAt",
          username: debouncedSearchTerm || undefined, // Используем debounced поиск
        });

        // 1.5. Обогащаем блогеров информацией о поле
        const enrichedBloggers = await adminEnrichBloggersWithGender(bloggersResponse.items);

        // Обновляем состояние блогеров
        if (page === 1) {
          setAllBloggers(enrichedBloggers);
        } else {
          setAllBloggers((prev) => [...prev, ...enrichedBloggers]);
        }

        // Обновляем информацию о пагинации
        setTotalBloggersCount(bloggersResponse.totalCount);
        setHasMoreBloggers(
          bloggersResponse.items.length === 50 &&
            page * 50 < bloggersResponse.totalCount,
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
            status: "MODERATION",
            page: 1,
            size: 50,
            sortDirection: "desc",
            sortField: "createdAt",
          });

          setLinkRequests(linkRequestsResponse.items);
        }
      } catch (error: unknown) {
        logError("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "Неизвестная ошибка");

        if (error instanceof APIError) {
          toast({
            title: "Ошибка API",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить данные",
            variant: "destructive",
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
    [debouncedSearchTerm],
  ); // Используем debounced значение

  // Объединенный эффект для загрузки и поиска (предотвращает дублирование запросов)
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchBloggers(1, false, true);
    } else {
      fetchBloggers(1, false, false);
    }
  }, [debouncedSearchTerm, fetchBloggers]);

  const loadMoreBloggers = useCallback(async () => {
    if (!hasMoreBloggers || isLoadingMore) return;
    await fetchBloggers(currentPage + 1, true);
  }, [hasMoreBloggers, isLoadingMore, currentPage, fetchBloggers]);

  const approveRequest = useCallback(async (requestId: number) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Отправляем запрос к API без проверки локального состояния
      await approveLinkRequest(requestId);

      // Обновляем локальное состояние запросов на связывание
      setLinkRequests((prev) => {
        const filtered = prev.filter(
          (req) => Number(req.id) !== Number(requestId),
        );
        return filtered;
      });

      // Обновляем статистику
      setStats((prev) => ({
        ...prev,
        totalModerationLinkRequestsCount:
          prev.totalModerationLinkRequestsCount - 1,
        totalApprovedBloggersCount: prev.totalApprovedBloggersCount + 1,
      }));
    } catch (err: unknown) {
      logError("❌ Ошибка при одобрении запроса:", err);

      // Дополнительная диагностика
      if (err instanceof Error) {
        logError("❌ Детали ошибки:", {
          message: err.message,
          name: err.name,
          stack: err.stack,
        });
      }

      // Обрабатываем API ошибки
      if (err instanceof APIError) {
        setError(err.message);
        throw err; // Пробрасываем APIError для обработки в UI
      }

      // Обрабатываем обычные ошибки
      const errorMessage =
        err instanceof Error ? err.message : "Ошибка при одобрении запроса";
      setError(errorMessage);
      throw new Error(errorMessage); // Создаем новую ошибку для проброса
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const rejectRequest = useCallback(async (requestId: number) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Отправляем запрос к API без проверки локального состояния
      await rejectLinkRequest(requestId);

      // Обновляем локальное состояние запросов на связывание
      setLinkRequests((prev) => {
        const filtered = prev.filter(
          (req) => Number(req.id) !== Number(requestId),
        );
        return filtered;
      });

      // Обновляем статистику
      setStats((prev) => ({
        ...prev,
        totalModerationLinkRequestsCount:
          prev.totalModerationLinkRequestsCount - 1,
      }));
    } catch (err: unknown) {
      logError("❌ Ошибка при отклонении запроса:", err);

      // Обрабатываем API ошибки
      if (err instanceof APIError) {
        setError(err.message);
        throw err; // Пробрасываем APIError для обработки в UI
      }

      // Обрабатываем обычные ошибки
      const errorMessage =
        err instanceof Error ? err.message : "Ошибка при отклонении запроса";
      setError(errorMessage);
      throw new Error(errorMessage); // Создаем новую ошибку для проброса
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Функция для обновления видимости блогера в локальном состоянии
  const updateBloggerVisibility = useCallback(
    (bloggerId: number, isHidden: boolean) => {
      setAllBloggers((prev) =>
        prev.map((blogger) =>
          blogger.id === bloggerId ? { ...blogger, isHidden } : blogger,
        ),
      );

      // Обновляем статистику видимых блогеров
      setStats((prev) => ({
        ...prev,
        totalVisibleBloggersCount: isHidden
          ? prev.totalVisibleBloggersCount - 1
          : prev.totalVisibleBloggersCount + 1,
      }));
    },
    [],
  );

  // Фильтруем блогеров в зависимости от настройки показа скрытых
  const filteredBloggers = showHidden 
    ? allBloggers 
    : allBloggers.filter(blogger => !blogger.isHidden);

  // Локальное обновление пола блогера без перезагрузки
  const updateBloggerGenderLocally = useCallback((bloggerId: number, genderType: ApiGender) => {
    setAllBloggers(prevBloggers => 
      prevBloggers.map(blogger => 
        blogger.id === bloggerId 
          ? { ...blogger, genderType }
          : blogger
      )
    );
    
    // Удаляем блогера из списка без пола
    setBloggersWithoutGender(prevBloggers => 
      prevBloggers.filter(blogger => blogger.id !== bloggerId)
    );
    
    // Обновляем кэш - удаляем этого блогера из всех страниц в кэше
    setGenderPagesCache(prevCache => {
      const newCache = new Map(prevCache);
      newCache.forEach((bloggers, pageNumber) => {
        const updatedBloggers = bloggers.filter(blogger => blogger.id !== bloggerId);
        newCache.set(pageNumber, updatedBloggers);
      });
      return newCache;
    });
    
    // Уменьшаем общий счетчик
    setTotalGenderBloggersCount(prev => Math.max(0, prev - 1));
  }, []);

  // Загрузка блогеров без пола
  const fetchBloggersWithoutGender = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      setLoadingGenderBloggers(true);
      
      const result = await adminGetBloggersWithoutGender(page, 50, genderPagesCache);
      
      // Дополнительно фильтруем результат, чтобы исключить блогеров с уже выбранным полом
      const filteredBloggers = result.bloggers.filter(blogger => 
        !blogger.genderType || blogger.genderType === null
      );
      
      if (append) {
        setBloggersWithoutGender(prev => [...prev, ...filteredBloggers]);
      } else {
        setBloggersWithoutGender(filteredBloggers);
      }
      
      setHasMoreGenderBloggers(result.hasMore);
      setTotalGenderBloggersCount(result.totalCount);
      setGenderBloggersPage(page);
      
      // Обновляем кэш
      setGenderPagesCache(result.cachedPages);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить блогеров без пола",
        variant: "destructive",
      });
    } finally {
      setLoadingGenderBloggers(false);
    }
  }, [toast, genderPagesCache]);

  // Загрузка следующей пачки блогеров без пола
  const loadMoreGenderBloggers = useCallback(() => {
    if (!loadingGenderBloggers && hasMoreGenderBloggers) {
      fetchBloggersWithoutGender(genderBloggersPage + 1, true);
    }
  }, [loadingGenderBloggers, hasMoreGenderBloggers, genderBloggersPage, fetchBloggersWithoutGender]);

  // Очистка кэша блогеров без пола (например, при обновлении данных)
  const clearGenderCache = useCallback(() => {
    setGenderPagesCache(new Map());
    setBloggersWithoutGender([]);
    setGenderBloggersPage(1);
    setHasMoreGenderBloggers(true);
    setTotalGenderBloggersCount(0);
  }, []);

  return {
    allBloggers: filteredBloggers,
    bloggersWithoutGender,
    linkRequests,
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
    // Дополнительные функции для работы с запросами на связывание
    approveRequest,
    rejectRequest,
    // Функция для обновления видимости блогера
    updateBloggerVisibility,
    // Функция для локального обновления пола блогера
    updateBloggerGenderLocally,
    // Функции для работы с блогерами без пола
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
