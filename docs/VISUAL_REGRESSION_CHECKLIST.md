# Visual Regression Testing Checklist

Чеклист для проверки визуальных изменений после рефакторинга.

## 🎯 Цель

Убедиться, что после рефакторинга:
- Все страницы отображаются корректно
- Нет визуальных регрессий
- Responsive design работает
- Функциональность сохранена

---

## 📋 Общий чеклист

### Подготовка

- [ ] Запустить приложение в dev mode: `npm run dev`
- [ ] Открыть DevTools (F12)
- [ ] Проверить отсутствие ошибок в console
- [ ] Проверить отсутствие warnings в console

---

## 📱 Страницы для проверки

### 1. Landing Page (/)

#### Desktop (1920x1080)
- [ ] Hero section отображается
- [ ] Navigation menu работает
- [ ] Footer корректный
- [ ] Все ссылки работают

#### Tablet (768x1024)
- [ ] Responsive меню работает
- [ ] Контент адаптируется
- [ ] Нет горизонтальной прокрутки

#### Mobile (375x667)
- [ ] Mobile menu работает
- [ ] Кнопки кликабельны
- [ ] Текст читаемый

---

### 2. Login Page (/login)

#### Desktop
- [ ] Форма логина отображается
- [ ] Google OAuth кнопка работает
- [ ] Валидация форм работает
- [ ] Ошибки отображаются корректно

#### Mobile
- [ ] Форма адаптивная
- [ ] Клавиатура не перекрывает поля
- [ ] Кнопки доступны

---

### 3. Dashboard (/dashboard)

#### Desktop
- [ ] Список блогеров загружается
- [ ] Фильтры работают
- [ ] Поиск работает (debounce)
- [ ] Карточки блогеров корректные
- [ ] Пагинация работает

#### Функциональность
- [ ] Клик по карточке открывает профиль
- [ ] Сортировка работает
- [ ] Фильтры применяются
- [ ] Loading states корректные

#### Performance
- [ ] Нет лагов при скролле
- [ ] Поиск не вызывает слишком частых запросов
- [ ] React DevTools: количество re-renders оптимально

---

### 4. Profile Page (/profile/:id)

#### Desktop
- [ ] Профиль блогера загружается
- [ ] Платформы отображаются (Instagram, TikTok, YouTube, Telegram)
- [ ] Статистика корректная
- [ ] Цены отображаются
- [ ] Кнопки действий работают

#### Platform Cards
- [ ] Instagram card корректная
- [ ] TikTok card корректная
- [ ] YouTube card корректная
- [ ] Telegram card корректная

#### Responsive
- [ ] Карточки платформ адаптивные
- [ ] Статистика читаемая на mobile
- [ ] Кнопки доступны

---

### 5. Profile Editor (/profile/edit)

#### Desktop
- [ ] Форма редактирования загружается
- [ ] Все поля заполняются
- [ ] Валидация работает
- [ ] Auto-save работает (debounce 2 сек)
- [ ] Unsaved changes warning работает

#### Секции
- [ ] **BloggerInfo** section:
  - [ ] Category selector работает
  - [ ] Legal form selector
  - [ ] Restricted topics
  - [ ] Contact URL
  - [ ] Gender selector
  - [ ] Barter checkbox
  - [ ] Mart registry checkbox
  - [ ] Save/Cancel buttons

- [ ] **CooperationTermsSection**:
  - [ ] Dialog открывается
  - [ ] Textarea редактируется
  - [ ] Save работает

- [ ] **Platform Forms**:
  - [ ] Instagram form
  - [ ] TikTok form
  - [ ] YouTube form
  - [ ] Telegram form
  - [ ] Screenshot upload работает

#### Функциональность
- [ ] Сохранение работает
- [ ] Черновики отображаются
- [ ] Ошибки валидации показываются
- [ ] Success уведомления работают

#### Performance
- [ ] React.memo предотвращает лишние re-renders
- [ ] useCallback работает корректно
- [ ] Форма отзывчива

---

### 6. Profile Setup (/profile/setup)

#### Desktop
- [ ] Первоначальная настройка профиля
- [ ] Шаги wizard работают
- [ ] Валидация на каждом шаге
- [ ] Финальное сохранение

#### Responsive
- [ ] Wizard адаптивный
- [ ] Progress bar корректный
- [ ] Кнопки Next/Back работают

---

### 7. Admin Dashboard (/admin/dashboard)

#### Desktop
- [ ] Список всех блогеров
- [ ] Фильтры работают
- [ ] Статусы отображаются
- [ ] Действия админа доступны

#### Функциональность
- [ ] Approve blogger
- [ ] Reject blogger
- [ ] Edit blogger (admin)
- [ ] Delete blogger

---

## 🔍 Specific Components Testing

### BloggerInfo Component

#### Reducer State
- [ ] Initial state загружается
- [ ] Dispatch actions работают:
  - [ ] SET_CATEGORIES
  - [ ] SET_LEGAL_FORM
  - [ ] SET_RESTRICTED_TOPICS
  - [ ] SET_CONTACT_URL
  - [ ] SET_GENDER
  - [ ] SET_BARTER_AVAILABLE
  - [ ] SET_MART_REGISTRY
  - [ ] RESET_TO_INITIAL
  - [ ] LOAD_FROM_FORM_DATA

#### React.memo
- [ ] Re-renders только при изменении props
- [ ] useCallback предотвращает лишние renders

---

### PlatformCard Component

#### Visual
- [ ] Icon платформы корректный
- [ ] Followers count форматирован
- [ ] Profile URL кликабелен
- [ ] Hover эффект работает

#### React.memo
- [ ] Не re-renders при изменении других cards

---

### CooperationTermsSection Component

#### Dialog
- [ ] Открывается по клику
- [ ] Закрывается по X
- [ ] Закрывается по ESC
- [ ] Закрывается по клику вне

#### Textarea
- [ ] useRef работает
- [ ] Автофокус при открытии
- [ ] Сохранение текста

---

## 🚀 Performance Testing

### React DevTools Profiler

1. **Запустить Profiler**:
   - [ ] Открыть React DevTools
   - [ ] Перейти на вкладку Profiler
   - [ ] Нажать Record

2. **Тест действий**:
   - [ ] Открыть ProfileEditor
   - [ ] Изменить несколько полей
   - [ ] Проверить Flame Chart
   - [ ] Убедиться что re-renders минимальны

3. **Проверить мемоизацию**:
   - [ ] BloggerInfo re-renders только при своих props
   - [ ] PlatformCard не re-renders при других изменениях
   - [ ] useCallback предотвращает propagation

---

## 🔧 Chrome DevTools Testing

### Network Tab

- [ ] API запросы правильные
- [ ] Нет дублирующихся запросов
- [ ] Retry logic работает при ошибках
- [ ] Debounce предотвращает частые запросы

### Console

- [ ] Нет console.log (все заменены на logger)
- [ ] Нет errors
- [ ] Нет warnings (кроме допустимых)

### Performance Tab

- [ ] Нет long tasks (>50ms)
- [ ] FPS стабильный при скролле
- [ ] Memory не утекает

---

## 📊 Lighthouse Testing

### Desktop

```bash
lighthouse https://localhost:5173 --view
```

- [ ] Performance: > 90
- [ ] Accessibility: > 95
- [ ] Best Practices: > 95
- [ ] SEO: > 90

### Mobile

```bash
lighthouse https://localhost:5173 --preset=mobile --view
```

- [ ] Performance: > 80
- [ ] Accessibility: > 95
- [ ] Best Practices: > 90
- [ ] SEO: > 90

---

## 🎨 Visual Regression Tools

### Percy (опционально)

```bash
npm install --save-dev @percy/cli @percy/playwright
npx percy exec -- playwright test
```

### Chromatic (опционально)

```bash
npm install --save-dev chromatic
npx chromatic --project-token=<token>
```

---

## ✅ Final Checklist

### Функциональность

- [ ] Все страницы загружаются
- [ ] Все формы работают
- [ ] Все кнопки кликабельны
- [ ] Валидация работает
- [ ] API запросы проходят
- [ ] Error handling работает

### Visual

- [ ] Нет визуальных багов
- [ ] Responsive design корректный
- [ ] Анимации плавные
- [ ] Loading states понятные
- [ ] Error states информативные

### Performance

- [ ] React.memo работает
- [ ] useCallback/useMemo оптимизируют
- [ ] Debounce предотвращает частые запросы
- [ ] Нет memory leaks
- [ ] Lighthouse > 90

### Code Quality

- [ ] 0 TypeScript errors
- [ ] 0 Linter errors
- [ ] 0 console.log
- [ ] 0 warnings

---

## 📝 Report Template

После проверки заполните:

```markdown
# Visual Regression Test Report

**Дата**: [YYYY-MM-DD]
**Тестер**: [Имя]
**Браузер**: [Chrome/Firefox/Safari]
**Версия**: [Version]

## Summary

- Total pages tested: [X]
- Issues found: [X]
- Critical issues: [X]
- Performance score: [X/100]

## Issues

1. **[Page Name] - [Issue Description]**
   - Severity: [Critical/High/Medium/Low]
   - Screenshot: [link]
   - Steps to reproduce: [...]

## Performance

- Lighthouse Desktop: [Score]
- Lighthouse Mobile: [Score]
- React Profiler: [Notes]

## Conclusion

[PASS/FAIL] - [Summary]
```

---

## 🎯 Критерии успеха

- ✅ Все функции работают как до рефакторинга
- ✅ Нет визуальных регрессий
- ✅ Performance улучшен или не ухудшен
- ✅ Responsive design работает
- ✅ Lighthouse > 90

**Статус**: ⏳ Требует ручной проверки

**Последнее обновление**: 2025-10-16

