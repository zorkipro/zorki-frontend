# 📚 Индекс документации Zorki

Полный перечень всей проектной документации с приоритетами для новых разработчиков.

**Обновлено**: Январь 2025  
**Версия проекта**: 2.0.3  
**Всего документов**: 10 файлов

---

## 🎯 Приоритеты чтения

### Must Read (обязательно для начала работы)

1. **[README.md](../README.md)** ⭐⭐⭐ - **Начните здесь!**
   - Быстрый старт за 5 минут
   - Обзор проекта и статистика
   - Основные команды

2. **[docs/FRONTEND_SETUP.md](FRONTEND_SETUP.md)** ⭐⭐ - Подробная настройка
   - Пошаговая инструкция
   - Решение проблем

### Nice to Have (изучите по необходимости)

3. **[docs/ARCHITECTURE.md](ARCHITECTURE.md)** ⭐ - Структура проекта
   - Архитектурные паттерны
   - Организация кода

4. **[docs/API.md](API.md)** ⭐ - Работа с API
   - Все эндпоинты
   - Примеры запросов

5. **[docs/DEVELOPMENT.md](DEVELOPMENT.md)** ⭐ - Процесс разработки
   - Git workflow
   - Best practices

### Справочная информация

6. **[CHANGELOG.md](../CHANGELOG.md)** - История изменений
   - Детальный changelog
   - Semantic versioning

---

## 🏗️ Архитектура и разработка

1. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Общая архитектура
   - Структура проекта (99 компонентов, 41 хук, 19 страниц)
   - Паттерны проектирования
   - Компоненты и хуки

2. **[API_ARCHITECTURE.md](API_ARCHITECTURE.md)** - Архитектура API
   - Модульная структура API клиента
   - TokenManager, ResponseHandler, ApiErrorHandler
   - Примеры использования

3. **[TECH_STACK.md](TECH_STACK.md)** - Технологический стек
   - Frontend/Backend технологии
   - Актуальные версии библиотек
   - Зависимости проекта

4. **[DEVELOPMENT.md](DEVELOPMENT.md)** - Процесс разработки
   - Git workflow
   - Code review
   - Best practices

---

## 🔧 Настройка и API

1. **[FRONTEND_SETUP.md](FRONTEND_SETUP.md)** - Настройка фронтенда
   - Установка зависимостей
   - Конфигурация окружения
   - Запуск dev сервера

2. **[API.md](API.md)** - API документация
   - 56 функций в 8 модулях
   - Endpoints и типы данных
   - Примеры запросов
   - Система аутентификации

3. **[DATABASE.md](DATABASE.md)** - База данных
   - Полная схема БД (12 таблиц)
   - ENUM типы и связи
   - Миграции и функции
   - Индексы и триггеры

4. **[ADMIN.md](ADMIN.md)** - Админская панель
   - Функции админа
   - 2FA настройка
   - Управление блогерами
   - Управление тематиками
   - Парсер-аккаунты

---

## 🎯 Рекомендованный порядок чтения для новых разработчиков

### Первые 30 минут (быстрый старт)

1. **[README.md](../README.md)** (5 мин) - Быстрый старт
2. Запуск проекта и проверка работы

### Первый день (общее понимание)

3. **[FRONTEND_SETUP.md](FRONTEND_SETUP.md)** (10 мин) - Подробная настройка
4. **[ARCHITECTURE.md](ARCHITECTURE.md)** (15 мин) - Структура проекта
5. **[API_ARCHITECTURE.md](API_ARCHITECTURE.md)** (15 мин) - Модульная архитектура API

### Второй день (углубленное изучение)

6. **[API.md](API.md)** (20 мин) - Детали API
7. **[DEVELOPMENT.md](DEVELOPMENT.md)** (15 мин) - Процесс разработки
8. **[TECH_STACK.md](TECH_STACK.md)** (10 мин) - Технологии

### По необходимости

9. **[DATABASE.md](DATABASE.md)** - Структура БД
10. **[ADMIN.md](ADMIN.md)** - Админская панель
11. **[CHANGELOG.md](../CHANGELOG.md)** - История изменений

---

## 💡 Быстрые ссылки

### Самое важное:
- **Начало работы**: [README.md](../README.md)

### Архитектура:
- **API модули**: [API_ARCHITECTURE.md](API_ARCHITECTURE.md)
- **Общая архитектура**: [ARCHITECTURE.md](ARCHITECTURE.md)

### Для разработки:
- **Настройка**: [FRONTEND_SETUP.md](FRONTEND_SETUP.md)
- **Процесс разработки**: [DEVELOPMENT.md](DEVELOPMENT.md)

---

## 🔍 Быстрые ссылки

**Ищете информацию о...**

- **Как запустить проект?** → [README.md](../README.md) ⚡
- **Настройка окружения?** → [FRONTEND_SETUP.md](FRONTEND_SETUP.md)
- **Архитектура проекта?** → [ARCHITECTURE.md](ARCHITECTURE.md)
- **API клиент и модули?** → [API_ARCHITECTURE.md](API_ARCHITECTURE.md)
- **Все API endpoints?** → [API.md](API.md)
- **База данных?** → [DATABASE.md](DATABASE.md)
- **Админ-панель?** → [ADMIN.md](ADMIN.md)
- **Процесс разработки?** → [DEVELOPMENT.md](DEVELOPMENT.md)
- **История изменений?** → [CHANGELOG.md](../CHANGELOG.md)

---

## ✅ Checklist для новых разработчиков

**Обязательно:**
- [ ] Прочитал [README.md](../README.md) и запустил проект
- [ ] Изучил [ARCHITECTURE.md](ARCHITECTURE.md) (понимание структуры)
- [ ] Настроил локальное окружение по [FRONTEND_SETUP.md](FRONTEND_SETUP.md)

**Рекомендуется:**
- [ ] Изучил [API_ARCHITECTURE.md](API_ARCHITECTURE.md) (модульная архитектура)
- [ ] Понял процесс разработки по [DEVELOPMENT.md](DEVELOPMENT.md)
- [ ] Изучил основные эндпоинты в [API.md](API.md)

---

## 📝 Вклад в документацию

При добавлении новой документации:

1. Создайте MD файл в `docs/`
2. Добавьте запись в этот индекс
3. Обновите README.md если нужно
4. Следуйте стилю существующей документации
5. Добавьте дату обновления

---

**Вопросы?** Все ответы в документации! 📚

_Последнее обновление: Январь 2025_