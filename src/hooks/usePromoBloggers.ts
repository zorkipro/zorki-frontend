import { useState, useEffect } from "react";
import { Blogger } from "@/types/blogger";
import { getAllBloggers } from "@/api/endpoints/blogger";
import { mapApiListBloggerToLocal } from "@/utils/api/mappers";
import { useErrorHandler } from "@/utils/errorHandler";

/**
 * Хук для получения топ-5 промо-блогеров
 * Промо-блогеры - это те, у которых заполнен promoText (заплатили за промо)
 */
export const usePromoBloggers = () => {
  const { handleError } = useErrorHandler({ showNotifications: false });
  const [promoBloggers, setPromoBloggers] = useState<Blogger[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromoBloggers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Получаем больше блогеров, чтобы найти тех, у кого есть promoText
        // Запрашиваем первые несколько страниц, чтобы найти промо-блогеров
        const responses = await Promise.all([
          getAllBloggers({ page: 1, size: 50 }),
          getAllBloggers({ page: 2, size: 50 }),
        ]);

        // Собираем всех блогеров из ответов
        const allBloggers = responses.flatMap(response => 
          response.items.map(mapApiListBloggerToLocal)
        );

        // Фильтруем блогеров с заполненным promoText и берем топ-5
        const bloggersWithPromo = allBloggers
          .filter(blogger => blogger.promoText && blogger.promoText.trim().length > 0)
          .slice(0, 5);

        setPromoBloggers(bloggersWithPromo);
      } catch (err: unknown) {
        setError(handleError(err).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoBloggers();
  }, [handleError]);

  return { promoBloggers, loading, error };
};

