/**
 * Утилиты для работы с темами (категориями)
 * Конвертация между ID и названиями
 */

/**
 * Конвертирует ID темы в название
 */
export const convertTopicIdToName = (
  topicId: string | number,
  lookup: Record<number, string>,
): string => {
  const id = typeof topicId === "string" ? parseInt(topicId, 10) : topicId;
  return lookup[id] ?? "";
};

/**
 * Конвертирует массив ID тем в массив названий
 */
export const convertTopicIdsToNames = (
  topicIds: (string | number)[],
  lookup: Record<number, string>,
): string[] => {
  return topicIds
    .map((id) => convertTopicIdToName(id, lookup))
    .filter(Boolean);
};

/**
 * Конвертирует названия тем в массив ID
 */
export const convertTopicNamesToIds = (
  topicNames: string[],
  categoryLookup: (name: string) => number | undefined,
  generalLookup: Record<string, number>,
): number[] => {
  return topicNames
    .map((name) => categoryLookup(name) ?? generalLookup[name])
    .filter((id): id is number => typeof id === "number");
};

