/**
 * Общие утилиты для маппинга данных
 * Парсинг BigInt, Decimal, работа с именами
 */

/**
 * Парсит BigInt строку в number
 * Backend возвращает BigInt поля как строки для предотвращения overflow
 *
 * @param value - BigInt как строка или null/undefined
 * @returns число или 0 при ошибке парсинга
 *
 * @example
 * parseBigInt("1234567890") // => 1234567890
 * parseBigInt(null) // => 0
 * parseBigInt("invalid") // => 0
 */
export function parseBigInt(value: string | null | undefined): number {
  if (!value) return 0;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Парсит Decimal строку в number
 * Backend возвращает Decimal поля как строки для точности
 *
 * @param value - Decimal как строка или null/undefined
 * @returns число или 0 при ошибке парсинга
 *
 * @example
 * parseDecimal("123.45") // => 123.45
 * parseDecimal(null) // => 0
 * parseDecimal("invalid") // => 0
 */
export function parseDecimal(value: string | null | undefined): number {
  if (!value) return 0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Разделяет полное имя на имя и фамилию
 * Первое слово - имя, остальные - фамилия
 *
 * @param fullName - Полное имя (например, "Иван Иванов Петрович")
 * @returns Объект с полями name и lastName
 *
 * @example
 * splitFullName("Иван Иванов") // => { name: "Иван", lastName: "Иванов" }
 * splitFullName("Иван") // => { name: "Иван", lastName: "" }
 * splitFullName("") // => { name: "", lastName: "" }
 */
export function splitFullName(fullName: string | undefined): {
  name: string;
  lastName: string;
} {
  if (!fullName) return { name: "", lastName: "" };

  const parts = fullName.trim().split(/\s+/);
  return {
    name: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

/**
 * Объединяет имя и фамилию в полное имя
 *
 * @param name - Имя
 * @param lastName - Фамилия
 * @returns Полное имя или пустая строка
 *
 * @example
 * joinFullName("Иван", "Иванов") // => "Иван Иванов"
 * joinFullName("Иван", "") // => "Иван"
 * joinFullName("", "Иванов") // => "Иванов"
 */
export function joinFullName(
  name: string | null,
  lastName: string | null,
): string {
  return [name, lastName].filter(Boolean).join(" ") || "";
}
