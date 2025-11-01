import { useState, useEffect, useMemo } from "react";
import { getAllCategories, getAllRestrictedTopics } from "@/api/endpoints/topics";
import type { TopicsOutputDto } from "@/api/types";
import { logError } from "@/utils/logger";

interface UseTopicsReturn {
  categories: TopicsOutputDto[];
  restrictedTopics: TopicsOutputDto[];
  loading: boolean;
  error: string | null;
  getCategoryIdByName: (name: string) => number | null;
  getRestrictedTopicIdByName: (name: string) => number | null;
  getCategoryNameById: (id: number) => string | null;
  getRestrictedTopicNameById: (id: number) => string | null;
  topicLookup: Record<string, number>;
  topicReverseLookup: Record<number, string>;
}

const cache: {
  categories: TopicsOutputDto[] | null;
  restrictedTopics: TopicsOutputDto[] | null;
  promise: Promise<void> | null;
} = {
  categories: null,
  restrictedTopics: null,
  promise: null,
};

export const useTopics = (): UseTopicsReturn => {
  const [categories, setCategories] = useState<TopicsOutputDto[]>(cache.categories || []);
  const [restrictedTopics, setRestrictedTopics] = useState<TopicsOutputDto[]>(cache.restrictedTopics || []);
  const [loading, setLoading] = useState(!cache.categories || !cache.restrictedTopics);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache.categories && cache.restrictedTopics) {
      return;
    }

    if (cache.promise) {
      cache.promise.then(() => {
        setCategories(cache.categories || []);
        setRestrictedTopics(cache.restrictedTopics || []);
        setLoading(false);
      });
      return;
    }

    setLoading(true);
    cache.promise = Promise.all([getAllCategories(), getAllRestrictedTopics()])
      .then(([categoriesData, restrictedTopicsData]) => {
        cache.categories = categoriesData;
        cache.restrictedTopics = restrictedTopicsData;
        setCategories(categoriesData);
        setRestrictedTopics(restrictedTopicsData);
        setLoading(false);
      })
      .catch((err) => {
        logError("Error loading topics:", err);
        setError("Ошибка загрузки тематик");
        setLoading(false);
      })
      .finally(() => {
        cache.promise = null;
      });
  }, []);

  const getCategoryIdByName = (name: string) => categories.find((cat) => cat.name === name)?.id ?? null;
  const getRestrictedTopicIdByName = (name: string) => restrictedTopics.find((topic) => topic.name === name)?.id ?? null;
  const getCategoryNameById = (id: number) => categories.find((cat) => cat.id === id)?.name ?? null;
  const getRestrictedTopicNameById = (id: number) => restrictedTopics.find((topic) => topic.id === id)?.name ?? null;

  const topicLookup = useMemo(
    () =>
      [...categories, ...restrictedTopics].reduce(
        (acc, topic) => {
          acc[topic.name] = topic.id;
          return acc;
        },
        {} as Record<string, number>
      ),
    [categories, restrictedTopics]
  );

  const topicReverseLookup = useMemo(
    () =>
      [...categories, ...restrictedTopics].reduce(
        (acc, topic) => {
          acc[topic.id] = topic.name;
          return acc;
        },
        {} as Record<number, string>
      ),
    [categories, restrictedTopics]
  );

  return {
    categories,
    restrictedTopics,
    loading,
    error,
    getCategoryIdByName,
    getRestrictedTopicIdByName,
    getCategoryNameById,
    getRestrictedTopicNameById,
    topicLookup,
    topicReverseLookup,
  };
};
