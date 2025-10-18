/**
 * Мапперы для работы с топиками (темами)
 * Конвертация между name и ID
 */

/**
 * Создает lookup таблицу name -> id из массива топиков
 * Используется для конвертации топиков при обновлении профиля
 *
 * @param topics - массив топиков с полями id и name
 * @returns объект { "Мода": 1, "Красота": 2, ... }
 *
 * @example
 * const topics = [
 *   { id: 1, name: "Мода" },
 *   { id: 2, name: "Красота" }
 * ];
 * createTopicLookup(topics) // => { "Мода": 1, "Красота": 2 }
 */
export function createTopicLookup(
  topics: Array<{ id: number; name: string }>,
): Record<string, number> {
  return topics.reduce(
    (acc, topic) => {
      acc[topic.name] = topic.id;
      return acc;
    },
    {} as Record<string, number>,
  );
}

/**
 * Создает reverse lookup таблицу id -> name
 * Используется для конвертации ID обратно в названия
 *
 * @param topics - массив топиков с полями id и name
 * @returns объект { 1: "Мода", 2: "Красота", ... }
 *
 * @example
 * const topics = [
 *   { id: 1, name: "Мода" },
 *   { id: 2, name: "Красота" }
 * ];
 * createTopicReverseLookup(topics) // => { 1: "Мода", 2: "Красота" }
 */
export function createTopicReverseLookup(
  topics: Array<{ id: number; name: string }>,
): Record<number, string> {
  return topics.reduce(
    (acc, topic) => {
      acc[topic.id] = topic.name;
      return acc;
    },
    {} as Record<number, string>,
  );
}

/**
 * Конвертирует массив названий топиков в массив ID
 * Фильтрует топики, которых нет в lookup
 *
 * @param topicNames - массив названий топиков
 * @param lookup - таблица name -> id
 * @returns массив ID топиков
 *
 * @example
 * const names = ["Мода", "Красота", "Несуществующая"];
 * const lookup = { "Мода": 1, "Красота": 2 };
 * convertTopicNamesToIds(names, lookup) // => [1, 2]
 */
export function convertTopicNamesToIds(
  topicNames: string[] | undefined,
  lookup: Record<string, number>,
): number[] {
  if (!topicNames || topicNames.length === 0) {
    return [];
  }

  return topicNames
    .map((name) => lookup[name])
    .filter((id): id is number => typeof id === "number");
}

/**
 * Конвертирует массив тем (названия или ID) в массив ID
 * Универсальная функция для обработки смешанных типов данных
 *
 * @param topics - массив тем (названия или ID)
 * @param lookup - таблица name -> id
 * @returns массив ID тем
 *
 * @example
 * const topics = ["Мода", 2, "Красота"];
 * const lookup = { "Мода": 1, "Красота": 2 };
 * convertTopicsToIds(topics, lookup) // => [1, 2, 2]
 */
export function convertTopicsToIds(
  topics: (string | number)[] | undefined,
  lookup: Record<string, number>,
): number[] {
  if (!topics || topics.length === 0) {
    return [];
  }

  return topics
    .map((topic) => {
      // Если уже ID - вернуть как есть
      if (typeof topic === "number") {
        return topic;
      }
      // Если название - конвертировать в ID
      return lookup[topic];
    })
    .filter((id): id is number => typeof id === "number");
}

/**
 * Конвертирует массив ID топиков в массив названий
 * Фильтрует ID, которых нет в lookup
 *
 * @param topicIds - массив ID топиков
 * @param reverseLookup - таблица id -> name
 * @returns массив названий топиков
 *
 * @example
 * const ids = [1, 2, 999];
 * const reverseLookup = { 1: "Мода", 2: "Красота" };
 * convertTopicIdsToNames(ids, reverseLookup) // => ["Мода", "Красота"]
 */
export function convertTopicIdsToNames(
  topicIds: number[] | undefined,
  reverseLookup: Record<number, string>,
): string[] {
  if (!topicIds || topicIds.length === 0) {
    return [];
  }

  return topicIds
    .map((id) => reverseLookup[id])
    .filter((name): name is string => typeof name === "string");
}
