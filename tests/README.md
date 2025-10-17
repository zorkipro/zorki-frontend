# Тесты для Zorki7

## Учетные данные администратора
**Email:** `11@gmail.com`  
**Password:** `12345678`

## Команды

```bash
# Все тесты
npx playwright test

# С видимым браузером
npx playwright test --headed

# Конкретный тест
npx playwright test tests/test-admin-with-auth.spec.ts --headed

# Отчет
npx playwright show-report
```

## Доступные тесты

- **`test-admin-with-auth.spec.ts`** - Полный тест админ панели
- **`test-console.spec.ts`** - Проверка консоли браузера

## Примечания

- Dev-сервер должен быть запущен на `http://localhost:8083`
- Тесты используют Supabase базу данных
- Учетные данные хранятся в `admin-credentials.ts`