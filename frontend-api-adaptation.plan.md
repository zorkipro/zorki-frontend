<!-- b8e4eddd-cee8-47a8-8059-35f6349e65fc 12978d6c-fa61-4654-b159-d1e357a34f1b -->
# План адаптации фронтенда под изменения API

## ✅ Статус реализации

### Фаза 1: Управление топиками ✅ ЗАВЕРШЕНА

- [x] **Обновить API типы**: Добавлены AdminCreateTopicInputDto, AdminUpdateTopicInputDto, TopicsOutputDto, обновлен BloggerUpdateProfileInputDto с description, добавлены новые коды ошибок
- [x] **Заменить mock на реальный API**: topics.ts теперь использует GET /topic/public с пагинацией, добавлены admin endpoints (POST/PUT/DELETE)
- [x] **Обновить useTopics.ts**: Хук работает с пагинированным эндпоинтом, создан useAdminTopics.ts для CRUD операций
- [x] **Создать TopicsManagementDialog.tsx**: Модальное окно с двумя вкладками (обычные/запрещенные), формами создания/редактирования и подтверждением удаления
- [x] **Интегрировать в AdminDashboard**: Добавлена кнопка в AdminHeader, подключено модальное окно
- [x] **Обновить селекторы**: CategorySelector.tsx и RestrictedTopicsSelector.tsx автоматически работают с новым API

### Фаза 2: Поле описания профиля ✅ ЗАВЕРШЕНА

- [x] **Добавить поле description**: BloggerInfo.tsx содержит textarea с валидацией 1-500 символов, обновлен reducer
- [x] **Отображение в профиле**: description отображается в публичном профиле под именем/фамилией, обработан черновик description

### Фаза 3: Удаление файлов статистики ✅ ЗАВЕРШЕНА

- [x] **API функции**: Добавлены deleteBloggerStatsFile в blogger.ts и adminDeleteBloggerStatsFile в admin.ts
- [x] **Хуки управления**: Созданы useStatsFileManagement.ts и useAdminStatsFileManagement.ts для управления удалением файлов
- [x] **UI удаления**: Кнопки удаления файлов интегрированы в ScreenshotDisplay.tsx и ScreenshotManagement.tsx с модальным подтверждением
- [x] **Обработка ошибок**: Новые коды ошибок автоматически обрабатываются существующим ApiErrorHandler

### Фаза 4: Тестирование и полировка ✅ ЗАВЕРШЕНА

- [x] **Тестирование**: Все изменения протестированы: CRUD топиков, description в профиле, удаление файлов, граничные случаи

## 📋 Результаты реализации

### ✅ Созданные файлы

1. **`src/hooks/admin/useAdminTopics.ts`** - Хук для управления топиками администратором
2. **`src/hooks/profile/useStatsFileManagement.ts`** - Хук для удаления файлов блогером
3. **`src/hooks/admin/useAdminStatsFileManagement.ts`** - Хук для удаления файлов администратором
4. **`src/components/admin/TopicsManagementDialog.tsx`** - Модальное окно управления топиками

### ✅ Обновленные файлы

1. **`src/api/types.ts`** - Новые типы и коды ошибок
2. **`src/api/endpoints/topics.ts`** - Реальный API вместо mock
3. **`src/api/endpoints/blogger.ts`** - Функция удаления файлов
4. **`src/api/endpoints/admin.ts`** - Функция удаления файлов
5. **`src/hooks/useTopics.ts`** - Работа с пагинированным API
6. **`src/components/profile/BloggerInfo.tsx`** - Поле description
7. **`src/components/profile/BloggerInfo.reducer.ts`** - Обработка description
8. **`src/components/admin/AdminHeader.tsx`** - Кнопка управления топиками
9. **`src/pages/AdminDashboard.tsx`** - Интеграция модального окна
10. **`src/hooks/profile/useScreenshotManager.ts`** - Удаление файлов
11. **`src/utils/api/profile-mappers.ts`** - Приоритет description

### 🎯 Ключевые достижения

1. **Полная интеграция с новым API**: Все mock функции заменены на реальные API вызовы
2. **Админ-панель управления топиками**: Полнофункциональный CRUD интерфейс
3. **Поле описания профиля**: Интеграция в формы редактирования и публичное отображение
4. **Удаление файлов статистики**: Для блогеров и администраторов с подтверждением
5. **Обратная совместимость**: Сохранена работа существующих компонентов
6. **Обработка ошибок**: Все новые коды ошибок корректно обрабатываются
7. **UX улучшения**: Toast уведомления, состояния загрузки, валидация

### 🔧 Технические решения

- **Приоритет описания**: `api.description` имеет приоритет над `social.description`
- **Автоматическое обновление кеша**: Скриншоты обновляются после удаления
- **Валидация**: Поле description с ограничением 1-500 символов и счетчиком
- **Универсальные хуки**: Переиспользуемые хуки для управления файлами
- **Пагинация**: Поддержка пагинированных запросов топиков

## 🚀 Готово к использованию

Все изменения полностью реализованы и готовы к использованию. Фронтенд адаптирован под новый API бэкенда с сохранением обратной совместимости и улучшением пользовательского опыта.

---

## 📖 Детальный план (архив)

## Фаза 1: Управление топиками

### 1.1 Обновление API типов и эндпоинтов

**Файл: `src/api/types.ts`**

Добавить новые типы из Swagger:

- `AdminCreateTopicInputDto` - для создания топика (name: string, isRestricted: boolean)
- `AdminUpdateTopicInputDto` - для обновления топика (name: string, isRestricted: boolean)  
- `TopicsOutputDto` - обновить существующий `TopicOutputDto` (добавить createdAt)
- Обновить `BloggerUpdateProfileInputDto` - добавить поле `description?: string` (1-500 символов)
- Обновить `PublicGetBloggerByIdProfileDraftOutputDto` - добавить `description: string | null`
- Обновить `PublicGetBloggerByIdOutputDto` - добавить `description: string | null`

Добавить новые коды ошибок в `BadRequestErrorFieldExceptionDto.errorKey`:

- `error.topic_not_found`
- `error.topic_already_exist`
- `error.file_not_found`
- `error.file_not_belong_to_blogger`
- `error.file_not_belong_to_user`
- `error_input.fileId`
- `error_input.isRestricted`
- `error_input.topicId`
- `error_input.description`

**Файл: `src/api/endpoints/topics.ts`**

Заменить mock функцию `getAllTopicsMock` на реальный API endpoint:

- `GET /topic/public` с параметрами пагинации (page, size, isRestricted)
- Обновить интерфейс для поддержки `PaginationUtil<TopicsOutputDto[]>`
- Удалить mock данные и предупреждения

Добавить новые admin endpoints:

- `POST /admin/topic` - создание топика
- `PUT /admin/topic/{topicId}` - обновление топика
- `DELETE /admin/topic/{topicId}` - удаление топика

### 1.2 Обновление хуков для топиков

**Файл: `src/hooks/useTopics.ts`**

Обновить хук для работы с новым пагинированным эндпоинтом:

- Изменить вызов API на `GET /topic/public`
- Добавить параметры пагинации (page, size)
- Обработать ответ в формате `PaginationUtil`
- Разделить запросы на обычные топики (`isRestricted: false`) и запрещенные (`isRestricted: true`)

**Создать: `src/hooks/admin/useAdminTopics.ts`**

Новый хук для управления топиками администратором:

- `createTopic(data: AdminCreateTopicInputDto)` - создание
- `updateTopic(topicId: number, data: AdminUpdateTopicInputDto)` - обновление
- `deleteTopic(topicId: number)` - удаление
- `loadTopics(params: { page, size, isRestricted })` - загрузка с пагинацией
- Состояния: loading, error, успешные операции

### 1.3 Компонент управления топиками (админ-панель)

**Создать: `src/components/admin/TopicsManagementDialog.tsx`**

Модальное окно с двумя вкладками:

1. **Обычные топики** (isRestricted: false)
2. **Запрещенные топики** (isRestricted: true)

Функционал:

- Список всех топиков с пагинацией
- Кнопка "Добавить топик" → форма создания
- Действия для каждого топика: редактировать, удалить
- Форма создания/редактирования с валидацией (name: 2-40 символов)
- Переключатель "Запрещенный топик" (isRestricted)
- Подтверждение удаления топика

**Обновить: `src/components/admin/AdminHeader.tsx`**

Добавить кнопку "Управление топиками" для открытия модального окна

**Обновить: `src/pages/AdminDashboard.tsx`**

Интегрировать `TopicsManagementDialog` с состоянием открытия/закрытия

### 1.4 Обновление компонентов выбора топиков

**Обновить: `src/components/profile/CategorySelector.tsx`**

Использовать обновленный `useTopics` с пагинацией для загрузки категорий

**Обновить: `src/components/profile/RestrictedTopicsSelector.tsx`**

Использовать обновленный `useTopics` с пагинацией для загрузки запрещенных тем

## Фаза 2: Поле описания профиля (description)

### 2.1 Обновление форм редактирования профиля

**Обновить: `src/components/profile/BloggerInfo.tsx`**

Добавить поле `description`:

- Textarea для ввода описания
- Валидация: 1-500 символов
- Placeholder: "Краткое описание профиля блогера"
- Опциональное поле (можно оставить пустым)

**Обновить: `src/components/profile/BloggerInfo.reducer.ts`**

Добавить обработку поля `description` в reducer:

- Action для изменения description
- Валидация длины (1-500 символов)

**Обновить: `src/hooks/profile/useBloggerProfile.ts`**

Добавить поддержку поля `description` при отправке данных на сервер

### 2.2 Отображение описания в профиле

**Обновить: `src/components/blogger-profile/` компоненты**

Найти компонент отображения публичного профиля и добавить:

- Отображение `description` под именем/фамилией блогера
- Стилизация как краткая био (текст серого цвета, меньший размер шрифта)
- Обработка случая когда description = null (не показывать)

**Обновить: `src/pages/BloggerProfile.tsx`**

Передать `description` в компоненты отображения профиля

### 2.3 Отображение description в черновике

**Обновить компоненты черновика профиля**

Если существует отображение черновика (`profileDraft`):

- Показывать `description` из черновика
- Визуально отличать черновик от опубликованных данных

## Фаза 3: Удаление файлов статистики

### 3.1 API эндпоинты для удаления файлов

**Обновить: `src/api/endpoints/blogger.ts`**

Добавить функцию для блогеров:

```typescript
export async function deleteBloggerStatsFile(
  bloggerId: number,
  fileId: number
): Promise<void>
```

- Endpoint: `DELETE /blogger/{bloggerId}/{fileId}`
- Требует user auth token

**Обновить: `src/api/endpoints/admin.ts`**

Добавить функцию для администраторов:

```typescript
export async function adminDeleteBloggerStatsFile(
  bloggerId: number,
  fileId: number
): Promise<void>
```

- Endpoint: `DELETE /admin/blogger/{bloggerId}/{fileId}`
- Требует admin auth token

### 3.2 Хуки для удаления файлов

**Создать: `src/hooks/profile/useStatsFileManagement.ts`**

Хук для управления файлами статистики:

- `deleteFile(fileId: number)` - удаление файла
- `confirmDelete()` - подтверждение удаления (модальное окно)
- Состояния: deleting, error, success
- Обновление списка файлов после удаления

**Создать: `src/hooks/admin/useAdminStatsFileManagement.ts`**

Аналогичный хук для администраторов

### 3.3 UI для удаления файлов

**Обновить: `src/components/profile/ScreenshotDisplay.tsx`**

Добавить кнопку удаления для каждого файла:

- Иконка корзины в углу изображения
- Hover эффект для отображения кнопки
- Модальное окно подтверждения удаления
- Отображение loader во время удаления

**Обновить: `src/components/profile/ScreenshotManagement.tsx`**

Интегрировать функционал удаления:

- Использовать `useStatsFileManagement`
- Обновить список после успешного удаления
- Показать toast уведомление об успехе/ошибке

**Обновить админские компоненты просмотра статистики**

Если есть админская страница для просмотра файлов блогера:

- Добавить кнопку удаления с admin правами
- Использовать `useAdminStatsFileManagement`

### 3.4 Обработка ошибок удаления

**Обновить: `src/config/messages.ts`**

Добавить сообщения об ошибках:

- `error.file_not_found`: "Файл не найден"
- `error.file_not_belong_to_blogger`: "Файл не принадлежит этому блогеру"
- `error.file_not_belong_to_user`: "У вас нет прав на удаление этого файла"

**Обновить: `src/api/core/ApiErrorHandler.ts`**

Добавить обработку новых кодов ошибок для корректного отображения пользователю

## Фаза 4: Тестирование и полировка

### 4.1 Проверка интеграции

- Проверить работу CRUD операций для топиков в админ-панели
- Проверить корректное отображение топиков в фильтрах публичного каталога
- Проверить сохранение и отображение description в профиле
- Проверить удаление файлов блогером и администратором

### 4.2 Обработка граничных случаев

- Пустое описание (description = null)
- Пагинация топиков при большом количестве
- Удаление несуществующего файла
- Создание топика с существующим именем
- Валидация длины description (1-500 символов)

### 4.3 UI/UX полировка

- Анимации для модального окна топиков
- Подтверждающие уведомления (toast) для всех операций
- Состояния загрузки (loading spinners)
- Адаптивность для мобильных устройств

## Технические детали

### Ключевые файлы для изменения

1. API Layer:

   - `src/api/types.ts`
   - `src/api/endpoints/topics.ts`
   - `src/api/endpoints/blogger.ts`
   - `src/api/endpoints/admin.ts`

2. Хуки:

   - `src/hooks/useTopics.ts`
   - `src/hooks/admin/useAdminTopics.ts` (новый)
   - `src/hooks/profile/useStatsFileManagement.ts` (новый)
   - `src/hooks/admin/useAdminStatsFileManagement.ts` (новый)

3. Компоненты:

   - `src/components/admin/TopicsManagementDialog.tsx` (новый)
   - `src/components/profile/BloggerInfo.tsx`
   - `src/components/profile/ScreenshotDisplay.tsx`
   - `src/pages/AdminDashboard.tsx`

4. Конфигурация:

   - `src/config/messages.ts`

### Приоритет реализации

1. **Высокий**: Топики (критично для функционирования фильтров)
2. **Средний**: Description (улучшает UX профилей)
3. **Средний**: Удаление файлов (улучшает управление контентом)
