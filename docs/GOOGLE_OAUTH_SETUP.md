# Настройка Google OAuth в Supabase

## Данные для настройки

**Project number:** `YOUR_PROJECT_NUMBER`  
**Project ID:** `YOUR_PROJECT_ID`  
**Client ID:** `YOUR_CLIENT_ID.apps.googleusercontent.com`  
**Client secret:** `YOUR_CLIENT_SECRET`

## Шаги настройки в Supabase

### 1. Перейти в панель Supabase
- Откройте проект: `https://db.zorki.pro` (или в панели Supabase)
- Перейдите в **Authentication** → **Providers**

### 2. Настроить Google Provider
1. Найдите **Google** в списке провайдеров
2. Включите переключатель **Enable Google provider**
3. Введите следующие данные:
   - **Client ID (for OAuth):** `YOUR_CLIENT_ID.apps.googleusercontent.com`
   - **Client Secret (for OAuth):** `YOUR_CLIENT_SECRET`

### 3. Настроить Authorized Redirect URIs в Google Cloud Console

В Google Cloud Console (https://console.cloud.google.com/) для проекта `zorkipro`:

1. Перейдите в **APIs & Services** → **Credentials**
2. Найдите OAuth 2.0 Client ID: `YOUR_CLIENT_ID.apps.googleusercontent.com`
3. Нажмите **Edit**
4. В разделе **Authorized redirect URIs** добавьте следующие URL:

```
https://db.zorki.pro/auth/v1/callback
http://localhost:8085/auth/v1/callback
```

**Важно:** 
- Для продакшена используйте: `https://db.zorki.pro/auth/v1/callback`
- Для разработки используйте: `http://localhost:8085/auth/v1/callback` (или ваш локальный порт)

### 4. Проверка настроек

После настройки проверьте:

1. **В Supabase:**
   - Google provider включен
   - Client ID и Secret сохранены
   - Нет ошибок валидации

2. **В Google Cloud Console:**
   - Authorized redirect URIs содержат правильные URL
   - OAuth consent screen настроен (если требуется)

3. **В приложении:**
   - Кнопка "Войти через Google" работает
   - После авторизации происходит редирект обратно в приложение

## Локальная разработка

Для локальной разработки убедитесь, что:
- Supabase URL: `https://db.zorki.pro`
- Redirect URL в коде: `window.location.origin` (автоматически подставится `http://localhost:8085`)
- В Google Console добавлен redirect URI: `http://localhost:8085/auth/v1/callback`

## Продакшен

Для продакшена:
- Supabase URL: `https://db.zorki.pro`
- Redirect URL: ваш домен (например, `https://zorki.pro`)
- В Google Console добавлен redirect URI: `https://db.zorki.pro/auth/v1/callback`

## Отладка

Если возникают проблемы:

1. **Проверьте консоль браузера:**
   - Должны быть логи: `🔐 Google OAuth: { redirectUrl, supabaseUrl }`
   - При ошибках: `❌ Ошибка Google OAuth: { message, status, name }`

2. **Проверьте настройки в Supabase:**
   - Authentication → Providers → Google
   - Убедитесь, что provider включен

3. **Проверьте Google Console:**
   - Authorized redirect URIs должны точно совпадать
   - OAuth consent screen должен быть опубликован (если требуется)

4. **Проверьте переменные окружения:**
   - `VITE_SUPABASE_URL=https://db.zorki.pro`
   - `VITE_SUPABASE_ANON_KEY` должен быть правильным

## Примечания

- Supabase автоматически обрабатывает OAuth callback через `/auth/v1/callback`
- После успешной авторизации пользователь будет перенаправлен обратно в приложение
- Сессия будет автоматически сохранена в localStorage





