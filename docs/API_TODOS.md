# API Integration TODOs

Список backend endpoints и функциональности, которые требуют разработки.

## 📋 Статус: 15 TODO

---

## 🔴 Критичные (Backend не реализован)

### 1. Topics API
**Файлы:** `src/api/endpoints/topics.ts`, `src/components/filters/FilterSidebar.tsx`

**Требуется:**
- `GET /topic` - Получить все темы (категории и запрещенные)
- Response: `TopicOutputDto[]` с полями `id`, `name`, `isTopicRestricted`

**Обходное решение:** Используется mock данные в `getAllTopicsMock()`

**Приоритет:** HIGH - блокирует фильтрацию и выбор тем

---

### 2. Admin Blogger Management
**Файлы:** `src/hooks/admin/useAdminBloggerActions.ts`, `src/api/endpoints/admin.ts`

**Требуется:**
- `PUT /admin/blogger/:id` - Обновить данные блогера
- `DELETE /admin/blogger/:id` - Удалить блогера
- `PATCH /admin/blogger/:id/visibility` - Переключить видимость

**Приоритет:** HIGH - критично для админ-панели

---

### 3. Draft Management
**Файлы:** `src/hooks/admin/useAdminDraftPublisher.ts`

**Требуется:**
- `POST /admin/blogger/:id/publish-drafts` - Опубликовать черновики
- `POST /admin/blogger/:id/approve` - Одобрить блогера
- `POST /admin/blogger/:id/reject` - Отклонить блогера

**Приоритет:** HIGH - блокирует верификацию блогеров

---

### 4. Screenshot Management
**Файлы:** `src/hooks/profile/useScreenshotManager.ts`, `src/hooks/profile/useScreenshotLoader.ts`

**Требуется:**
- `GET /blogger/screenshots/:bloggerId` - Получить скриншоты
- `DELETE /blogger/screenshot/:screenshotId` - Удалить скриншот
- `POST /blogger/screenshots` - Загрузить скриншоты

**Обходное решение:** Пустой массив скриншотов

**Приоритет:** MEDIUM - функциональность доступна, но не работает

---

## 🟡 Средние (Недостающие поля)

### 5. Story Reach
**Файлы:** `src/utils/api/mappers.ts`, `src/hooks/profile/useProfileData.ts`

**Требуется:** Добавить `storyReach` в API response для социальных сетей

**Обходное решение:** Устан авливается в 0

**Приоритет:** MEDIUM - влияет на полноту данных

---

### 6. Cooperation Conditions & Payment Terms
**Файлы:** `src/utils/api/mappers.ts`

**Требуется:**
- `cooperationConditions` field в blogger profile
- `paymentTerms` field в blogger profile

**Обходное решение:** Пустые строки

**Приоритет:** LOW - редко используемые поля

---

### 7. Coverage Social Type
**Файлы:** `src/utils/api/mappers.ts`

**Требуется:** `coverageSocialType` для обновления coverage по платформе

**Приоритет:** LOW - можно вычислить на backend

---

## 🟢 Низкие (UI/UX)

### 8. Gender in Link Requests
**Файлы:** `src/components/admin/AdminLinkRequestsTable.tsx`

**Требуется:** Добавить `gender` в blogger data для AdminLinkRequestsTable

**Обходное решение:** Hardcoded 'MALE'

**Приоритет:** LOW - влияет только на placeholder avatar

---

### 9. Unsaved Changes Detection
**Файлы:** `src/pages/ProfileEditor.tsx`

**Требуется:** Implement `hasUnsavedChanges` detection

**Обходное решение:** Всегда false

**Приоритет:** LOW - UX feature

---

## 🔧 В ПРОЦЕССЕ

### 10. Topics Lookup
**Файлы:** `src/hooks/profile/useProfileSaver.ts`

**Требуется:** Справочник topics для преобразования `name -> id` и наоборот

**Зависит от:** TODO #1 (Topics API)

**Приоритет:** HIGH - после реализации Topics API

---

## 📝 ДОКУМЕНТАЦИЯ

### Создать документацию для:
1. Admin API endpoints
2. Blogger API endpoints
3. Topics API
4. Screenshot API

### API Contracts

Все endpoints должны следовать единому формату:
```typescript
// Success Response
{
  data: T,
  status: number,
  message?: string
}

// Error Response
{
  message: string,
  statusCode: number,
  errorField: string[] | null
}
```

---

## 🎯 ПРИОРИТИЗАЦИЯ

**Для MVP (Минимально работающего продукта):**
1. ✅ Topics API
2. ✅ Admin Blogger Management (PUT, DELETE, PATCH visibility)
3. ✅ Draft Management (publish, approve, reject)

**Для v1.0:**
4. Screenshot Management
5. Story Reach
6. Topics Lookup

**Для v1.1:**
7. Cooperation Conditions
8. Payment Terms
9. Unsaved Changes

---

## 📞 КОНТАКТЫ

По вопросам реализации backend обращаться к backend-разработчику.

**Последнее обновление:** 2025-10-16
