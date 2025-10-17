/**
 * Константы для UI сообщений
 */

export const UI_MESSAGES = {
  LOADING: 'Загрузка...',
  SAVING: 'Сохранение...',
  ERROR: 'Ошибка',
  SUCCESS: 'Успешно',
  DELETING: 'Удаление...',
  UPDATING: 'Обновление...',
} as const;

/**
 * Сообщения об ошибках для новых API endpoints
 */
export const ERROR_MESSAGES = {
  // Топики
  TOPIC_NOT_FOUND: 'Топик не найден',
  TOPIC_ALREADY_EXIST: 'Топик с таким названием уже существует',
  
  // Файлы
  FILE_NOT_FOUND: 'Файл не найден',
  FILE_NOT_BELONG_TO_BLOGGER: 'Файл не принадлежит этому блогеру',
  FILE_NOT_BELONG_TO_USER: 'У вас нет прав на удаление этого файла',
  
  // Валидация
  INVALID_FILE_ID: 'Некорректный ID файла',
  INVALID_IS_RESTRICTED: 'Некорректное значение флага ограничения',
  INVALID_TOPIC_ID: 'Некорректный ID топика',
  INVALID_DESCRIPTION: 'Некорректное описание',
} as const;
