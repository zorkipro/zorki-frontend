import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { mapApiDetailBloggerToLocal } from "@/utils/api/mappers";
import { useErrorHandler } from "@/utils/errorHandler";
import type { Blogger } from "@/types/blogger";
import {useBloggerByIdQuery} from "@/hooks/profile/getBloggerByIdQuery.ts";
import { getAllBloggers, getBloggerById } from "@/api/endpoints/blogger";
import { normalizeUsername } from "@/utils/username";

interface UseBloggerProfileProps {
  username?: string;
  id?: number;
}

export const useBloggerProfile = ({ username, id }: UseBloggerProfileProps) => {
  const { handleError } = useErrorHandler({ showNotifications: true });

  // Если есть id - используем прямой запрос
  const byIdQuery = useBloggerByIdQuery({
    bloggerId: id,
    options: { enabled: !!id },
  });

  // Если нет id, но есть username - ищем по username
  const byUsernameQuery = useQuery({
    queryKey: ["bloggerByUsername", username],
    queryFn: async () => {
      if (!username) throw new Error("Username не указан");
      
      const normalizedUsername = normalizeUsername(username);
      if (!normalizedUsername) throw new Error("Username не указан");

      // Сначала ищем блогера по username
      const searchResponse = await getAllBloggers({
        username: normalizedUsername,
        page: 1,
        size: 1,
      });

      const bloggerData = searchResponse.items?.[0];
      if (!bloggerData) {
        throw new Error("Блогер не найден");
      }

      // Затем получаем детальную информацию по id
      const detailedResponse = await getBloggerById(bloggerData.id);
      return detailedResponse;
    },
    enabled: !id && !!username,
    staleTime: Infinity,
  });

  // Используем запрос по id, если он есть, иначе запрос по username
  const activeQuery = id ? byIdQuery : byUsernameQuery;
  const { data, isLoading, isError, error } = activeQuery;

  if (isError && error) handleError(error);

  const blogger = useMemo(() => (
      data ? (mapApiDetailBloggerToLocal(data) as Blogger) : null
      ), [data]);

  return {
    blogger,
    loading: isLoading,
    error: isError ? (error as Error).message : null,
  };
};


// import { useState, useEffect } from "react";
// import { Blogger } from "@/types/blogger";
// import { getAllBloggers, getBloggerById } from "@/api/endpoints/blogger";
// import { mapApiDetailBloggerToLocal } from "@/utils/api/mappers";
// import { useErrorHandler } from "@/utils/errorHandler";
// import { normalizeUsername } from "@/utils/username";
//
// export const useBloggerProfile = ({username,id}:{username?: string, id?:number}) => {
//   const { handleError } = useErrorHandler({ showNotifications: true });
//   const [blogger, setBlogger] = useState<Blogger | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//
//   useEffect(() => {
//     const normalizedUsername = normalizeUsername(username);
//     if (!normalizedUsername) {
//       setError("Username не указан");
//       setBlogger(null);
//       return;
//     }
//
//     const fetchProfile = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const searchResponse = await getAllBloggers({
//           username: normalizedUsername,
//           page: 1,
//           size: 1,
//         });
//
//         const bloggerData = searchResponse.items?.[0];
//         if (!bloggerData) {
//           setError("Блогер не найден");
//           return;
//         }
//
//         const detailedResponse = await getBloggerById(bloggerData.id);
//         setBlogger(mapApiDetailBloggerToLocal(detailedResponse));
//       } catch (err: unknown) {
//         setError(handleError(err).message);
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     fetchProfile();
//   }, [username, handleError]);
//
//   return { blogger, loading, error };
// };
