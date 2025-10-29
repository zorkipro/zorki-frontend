import {useQuery} from "@tanstack/react-query";
import {Blogger} from "@/types/blogger";
import {getAllBloggers, getBloggerById} from "@/api/endpoints/blogger";
import {mapApiDetailBloggerToLocal,} from "@/utils/api/mappers";
import {useErrorHandler} from "@/utils/errorHandler";
import {logError} from "@/utils/logger";
import {normalizeUsername} from "@/utils/username";
import {CACHE_SETTINGS} from "@/config";

interface UseBloggerProfileParams {
  id?: number;
  username?: string;
}

export const useBloggerProfile = ({ id, username }: UseBloggerProfileParams) => {
  const { handleError } = useErrorHandler({showNotifications: true});

  const normalizedUsername = username ? normalizeUsername(username) : null;

  const queryKey = id
      ? ["blogger-profile", "id", id]
      : ["blogger-profile", "username", normalizedUsername];

  const query = useQuery<Blogger, Error>({
    queryKey,
    enabled: !!id || !!normalizedUsername,
    queryFn: async () => {
      try {
        let bloggerId: string | number | null = id ?? null;

        if (!bloggerId) {
          if (!normalizedUsername) {
            throw new Error("Username не указан");
          }

          const searchResponse = await getAllBloggers({
            username: normalizedUsername,
            page: 1,
            size: 1,
          });

          if (!searchResponse.items || searchResponse.items.length === 0) {
            throw new Error("Блогер не найден");
          }

          bloggerId = searchResponse.items[0].id;
        }

        const detailedResponse = await getBloggerById(bloggerId);
        return mapApiDetailBloggerToLocal(detailedResponse);
      } catch (err: unknown) {
        logError("Error fetching blogger profile:", err);
        throw handleError(err, {
          showNotification: true,
          logError: true,
        });
      }
    },
    staleTime: CACHE_SETTINGS.STALE_TIME,
    gcTime: CACHE_SETTINGS.PROFILE_CACHE_DURATION,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    blogger: query.data || null,
    loading: query.isLoading,
    error: query.isError ? query.error.message : null,
    refetch: query.refetch,
  };
};

// /**
//  * Hook for loading blogger profile data by username
//  * Used in BloggerProfile page to fetch detailed blogger information
//  */
// export const useBloggerProfile = (username?: string) => {
//   const { handleError } = useErrorHandler({
//     showNotifications: true,
//   });
//
//   const [blogger, setBlogger] = useState<Blogger | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//
//   const fetchBloggerProfile = useCallback(async () => {
//     if (!username) {
//       setError("Username не указан");
//       return;
//     }
//
//     try {
//       setLoading(true);
//       setError(null);
//
//       // Нормализуем username - убираем @ если есть
//       const normalizedUsername = normalizeUsername(username);
//
//       // Сначала ищем блогера по username в списке
//       const searchResponse = await getAllBloggers({
//         username: normalizedUsername,
//         page: 1,
//         size: 1,
//       });
//
//       if (!searchResponse.items || searchResponse.items.length === 0) {
//         setError("Блогер не найден");
//         return;
//       }
//
//       const bloggerData = searchResponse.items[0];
//
//       // Получаем детальную информацию о блогере по ID
//       const detailedResponse = await getBloggerById(bloggerData.id);
//
//       // Преобразуем данные в локальный формат
//       const transformedBlogger = mapApiDetailBloggerToLocal(detailedResponse);
//
//       setBlogger(transformedBlogger);
//     } catch (err: unknown) {
//       logError("Error fetching blogger profile:", err);
//
//       const processedError = handleError(err, {
//         showNotification: true,
//         logError: true,
//       });
//
//       setError(processedError.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [username, handleError]);
//
//   useEffect(() => {
//     fetchBloggerProfile();
//   }, [fetchBloggerProfile]);
//
//   return {
//     blogger,
//     loading,
//     error,
//     refetch: fetchBloggerProfile,
//   };
// };
