// ============================================
// Instagram Client API Endpoints
// ============================================
// Endpoints для управления Instagram клиентом
// Используется админами для настройки Instagram аккаунтов
// ============================================

import { apiRequest } from '../client';
import type { IgClientLoginInputDto, IgClientLoginOutputDto } from '../types';

// ====== POST /ig-client/login - Логин Instagram аккаунта ======

/**
 * Логин нового Instagram аккаунта
 *
 * @param data - username, password
 * @returns Promise с состоянием авторизации
 *
 * @throws APIError 400 - Incorrect input data or can not load ig session
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * const result = await igClientLogin({
 *   username: 'your_instagram_username',
 *   password: 'your_password'
 * });
 *
 * if (result.isAuthorized && result.isVerify) {
 * }
 * ```
 */
export async function igClientLogin(data: IgClientLoginInputDto): Promise<IgClientLoginOutputDto> {
  return apiRequest<IgClientLoginOutputDto>('/ig-client/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
