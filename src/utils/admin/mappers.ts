import type { AdminGetLinkBloggerClientRequestOutputDto } from '@/api/types';

/**
 * Маппер для преобразования API данных запроса на связывание в формат таблицы
 */
export const mapLinkRequestToTableFormat = (request: AdminGetLinkBloggerClientRequestOutputDto) => {
  const mainSocial =
    request.blogger.socialAccounts.find((s) => s.type === 'INSTAGRAM') ||
    request.blogger.socialAccounts[0];

  // Берем имя из поля title социального аккаунта, если оно есть
  let fullName = 'Не указано';

  if (mainSocial?.title && mainSocial.title.trim()) {
    fullName = mainSocial.title.trim();
  } else if (request.blogger.name && request.blogger.name.trim()) {
    fullName = request.blogger.name.trim();
  } else if (mainSocial?.username && mainSocial.username.trim()) {
    // Если нет title и name, используем username как имя
    fullName = mainSocial.username.trim();
  }

  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    id: request.id.toString(),
    name: firstName,
    lastName: lastName,
    username: mainSocial?.username || 'Не указано',
    followers: mainSocial?.subscribers ? parseInt(mainSocial.subscribers) || 0 : 0,
    verification_status: 'PENDING', // Статус запроса
    visibility_status: 'VISIBLE',
    linked_user_id: request.blogger.userId || '',
    has_drafts: false,
    request_id: request.id,
    request_created_at: request.createdAt,
    user_email: request.user.email,
    status: request.status,
    social_accounts: request.blogger.socialAccounts.map((social) => ({
      id: social.id,
      type: social.type,
      title: social.title,
      avatarUrl: social.avatarUrl,
      username: social.username,
      externalId: social.externalId,
      subscribers: social.subscribers,
    })),
    social: mainSocial
      ? {
          username: mainSocial.username,
          type: mainSocial.type,
          avatar: mainSocial.avatarUrl,
        }
      : null,
  };
};
