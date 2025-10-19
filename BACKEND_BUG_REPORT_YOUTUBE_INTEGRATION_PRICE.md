# 🐛 Bug Report: YouTube Integration Price Not Saving

## 📋 **Описание проблемы**

При попытке изменить цену интеграции YouTube в админ-панели через эндпоинт `/admin/blogger/social-price/{bloggerId}` изменения не сохраняются в базе данных, несмотря на успешный ответ сервера (204 No Content).

## 🔍 **Детали воспроизведения**

### **Шаги воспроизведения:**
1. Открыть админ-панель: `http://localhost:8082/admin`
2. Войти в систему администратора
3. Перейти к редактированию блогера: `/admin/blogger/_agentgirl_/edit`
4. Открыть таб **YouTube**
5. Изменить цену интеграции (например, с 0 на 999)
6. Нажать кнопку "Сохранить"

### **Ожидаемое поведение:**
- Цена интеграции должна сохраниться в базе данных
- После сохранения значение должно отображаться в интерфейсе

### **Фактическое поведение:**
- Сервер возвращает успешный ответ (204 No Content)
- Цена остается 0, изменения не сохраняются

## 📊 **Технические детали**

### **API запрос:**
```http
PUT /api/admin/blogger/social-price/1111
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "type": "YOUTUBE",
  "integrationPrice": 999
}
```

### **Ответ сервера:**
```http
HTTP/1.1 204 No Content
```

### **Логи фронтенда:**
```
💾 YouTube price save clicked, value: 999
💰 Processing price changes: {youtube_integration_price: '999'}
🔍 mapPlatformPricesToUpdate: {platform: 'YOUTUBE', ...}
✅ Added integrationPrice: 999
📤 Final DTO: {dto: {type: 'YOUTUBE', integrationPrice: 999}, hasChanges: true}
🚀 Updating YOUTUBE prices: {type: 'YOUTUBE', integrationPrice: 999}
🌐 adminUpdateBloggerSocialPrice API call: {url: '/admin/blogger/social-price/1111', method: 'PUT', data: {...}}
🌐 API Request Debug: {url: '/api/admin/blogger/social-price/1111', method: 'PUT', headers: {...}, body: '{"type":"YOUTUBE","integrationPrice":999}', skipAuth: false, ...}
📥 API Response Debug: {endpoint: '/admin/blogger/social-price/1111', status: 204, statusText: 'No Content', headers: {...}, ok: true}
✅ 204 No Content response for: /admin/blogger/social-price/1111
✅ adminUpdateBloggerSocialPrice API response: undefined
✅ YOUTUBE prices updated successfully
```

## 🔧 **Возможные причины проблемы**

### **1. Проблема с базой данных**
- **Описание:** Данные не сохраняются в таблице цен социальных сетей
- **Возможные причины:**
  - Ошибка в SQL запросе UPDATE
  - Проблема с транзакциями (rollback)
  - Неправильная структура таблицы
  - Отсутствие записи для данного блогера и платформы

### **2. Проблема с валидацией**
- **Описание:** Сервер принимает запрос, но не сохраняет из-за валидации
- **Возможные причины:**
  - Валидация `integrationPrice` не проходит
  - Проблема с типом данных (number vs string)
  - Ограничения на значения цен
  - Проблема с полем `type: "YOUTUBE"`

### **3. Проблема с правами доступа**
- **Описание:** Админ не имеет прав на изменение цен
- **Возможные причины:**
  - Неправильная проверка ролей
  - Проблема с токеном авторизации
  - Ограничения на уровне базы данных

### **4. Проблема с маппингом данных**
- **Описание:** Данные не правильно маппятся в модель базы данных
- **Возможные причины:**
  - Неправильное поле в DTO
  - Проблема с преобразованием типов
  - Отсутствие поля `integrationPrice` в модели

### **5. Проблема с кешированием**
- **Описание:** Данные сохраняются, но не отображаются из-за кеша
- **Возможные причины:**
  - Кеш не инвалидируется после обновления
  - Проблема с Redis/Memcached
  - Кеш на уровне базы данных

### **6. Проблема с логикой бизнеса**
- **Описание:** Есть бизнес-правила, которые блокируют сохранение
- **Возможные причины:**
  - Блогер не верифицирован
  - Платформа YouTube не активна
  - Ограничения по статусу блогера

## 🛠️ **Рекомендации для исправления**

### **1. Проверить логи бэкенда**
```bash
# Проверить логи сервера при выполнении запроса
tail -f /var/log/backend.log | grep "social-price"
```

### **2. Проверить базу данных**
```sql
-- Проверить существование записи для блогера
SELECT * FROM blogger_social_prices 
WHERE blogger_id = 1111 AND type = 'YOUTUBE';

-- Проверить структуру таблицы
DESCRIBE blogger_social_prices;

-- Проверить права доступа
SHOW GRANTS FOR 'backend_user'@'localhost';
```

### **3. Проверить Swagger документацию**
- Убедиться, что эндпоинт `/admin/blogger/social-price/{bloggerId}` работает правильно
- Проверить схему `BloggerUpdateSocialPriceInputDto`
- Убедиться, что поле `integrationPrice` поддерживается

### **4. Добавить логирование на бэкенде**
```typescript
// В контроллере добавить логирование
@Put('social-price/:bloggerId')
async updateBloggerSocialPrice(
  @Param('bloggerId') bloggerId: number,
  @Body() data: BloggerUpdateSocialPriceInputDto,
) {
  console.log('🔧 Backend: Updating social price', {
    bloggerId,
    data,
    timestamp: new Date().toISOString()
  });
  
  // ... логика обновления
  
  console.log('✅ Backend: Social price updated successfully');
}
```

### **5. Проверить валидацию**
```typescript
// Убедиться, что валидация проходит
export class BloggerUpdateSocialPriceInputDto {
  @IsEnum(['YOUTUBE', 'INSTAGRAM', 'TELEGRAM', 'TIKTOK'])
  type: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  postPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  storiesPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  integrationPrice?: number; // ← Убедиться, что это поле есть
}
```

## 📝 **Дополнительная информация**

### **Окружение:**
- Frontend: React + TypeScript + Vite
- Backend: Node.js + NestJS (предположительно)
- Database: PostgreSQL (предположительно)
- Admin ID: 1111
- Blogger: _agentgirl_

### **Приоритет:** 🔴 **Высокий**
- Критическая функциональность админ-панели
- Влияет на бизнес-процессы

### **Статус:** 🟡 **В работе**
- Фронтенд работает корректно
- Проблема на стороне бэкенда

---

**Дата создания:** $(date)  
**Автор:** Frontend Developer  
**Теги:** `backend`, `admin`, `youtube`, `integration-price`, `bug`

