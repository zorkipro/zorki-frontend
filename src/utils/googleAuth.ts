// ============================================
// Access Token Management
// ============================================
// Утилиты для работы с Access Token согласно техническому заданию

/**
 * Сохраняет Access Token в sessionStorage под ключом accessToken
 * Согласно ТЗ: sessionStorage.setItem('accessToken', accessToken);
 */
export const saveAccessToken = (token: string): void => {
  sessionStorage.setItem("accessToken", token);
};

/**
 * Получает Access Token из sessionStorage
 */
export const getAccessToken = (): string | null => {
  return sessionStorage.getItem("accessToken");
};

/**
 * Удаляет Access Token из sessionStorage
 * Согласно ТЗ: sessionStorage.removeItem('accessToken');
 */
export const removeAccessToken = (): void => {
  sessionStorage.removeItem("accessToken");
};

/**
 * Проверяет, есть ли Access Token
 */
export const hasAccessToken = (): boolean => {
  return !!getAccessToken();
};

/**
 * Получает заголовок Authorization для API запросов
 * Согласно ТЗ: Authorization: Bearer <ACCESS_TOKEN>
 */
export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Проверяет, является ли токен JWT токеном Supabase
 */
export const isSupabaseJWT = (token: string): boolean => {
  // JWT токены Supabase начинаются с eyJ
  return token.startsWith("eyJ");
};

/**
 * Логирует информацию о токене для отладки
 */
export const logTokenInfo = (token: string): void => {
  // Debug function - removed console.log statements
};
