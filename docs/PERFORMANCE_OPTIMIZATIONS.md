# Performance Optimizations

Документация по оптимизациям производительности React приложения Zorki.

## ✅ Выполненные оптимизации

### React.memo

Мемоизированы следующие компоненты:

1. **BloggerInfo** (`src/components/profile/BloggerInfo.tsx`)
   - React.memo с useCallback для handleSave и handleCancel
   - useReducer вместо 7 useState для лучшей производительности

2. **VerificationNotice** (`src/components/profile/VerificationNotice.tsx`)
   - React.memo для предотвращения ненужных ререндеров
   - useCallback для handleContactAdmin
   - Константа ADMIN_INSTAGRAM_URL вынесена за пределы компонента

3. **ProfileHeader** (`src/components/profile/ProfileHeader.tsx`)
   - React.memo (260 строк)
   - Все функции передаются через props

4. **CooperationTermsSection** (`src/components/profile/CooperationTermsSection.tsx`)
   - React.memo
   - useRef для textarea

5. **PlatformCard** (`src/components/platform/PlatformCard.tsx`)
   - React.memo

6. **PlatformFormFields** (`src/components/platform/PlatformFormFields.tsx`)
   - React.memo

7. **PricingSection** (`src/components/profile/organisms/PricingSection.tsx`)
   - memo из React

8. **PlatformProfileForm** (`src/components/profile/organisms/PlatformProfileForm.tsx`)
   - memo из React

### useCallback

Оптимизированы callback функции:

1. **ProfileEditor** (`src/pages/ProfileEditor.tsx`)
   - handleScreenshotUpload обернут в useCallback

2. **BloggerInfo**
   - handleSave
   - handleCancel

3. **VerificationNotice**
   - handleContactAdmin

### useMemo

1. **BloggerInfo**
   - initialState вычисляется через useMemo

---

## 📋 Рекомендации для дальнейшей оптимизации

### High Priority

1. **Code Splitting**
   ```typescript
   // Вместо:
   import { ProfileEditor } from './pages/ProfileEditor';
   
   // Использовать:
   const ProfileEditor = lazy(() => import('./pages/ProfileEditor'));
   ```

2. **Виртуализация списков**
   - Используйте `react-window` или `react-virtual` для длинных списков блогеров
   - Особенно актуально для `/dashboard` и `/admin/bloggers`

3. **Image Optimization**
   - Lazy loading для изображений аватаров
   - WebP формат с fallback
   - Responsive images (srcSet)

### Medium Priority

4. **Debounce Search**
   ✅ Уже реализовано в `useDebounce`

5. **Мемоизация selector'ов**
   - Используйте `reselect` или `useMemo` для сложных вычислений

6. **Bundle Size Optimization**
   ```bash
   # Анализ bundle
   npm run build
   npx vite-bundle-visualizer
   ```

7. **Prefetch данных**
   - Используйте `<link rel="prefetch">` для критических маршрутов

### Low Priority

8. **Service Worker**
   - Кэширование статических ресурсов
   - Offline поддержка

9. **Web Vitals Monitoring**
   ```typescript
   import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
   
   getCLS(console.log);
   getFID(console.log);
   getFCP(console.log);
   getLCP(console.log);
   getTTFB(console.log);
   ```

---

## 🎯 Checklist для новых компонентов

При создании новых компонентов следуйте этим правилам:

- [ ] Используйте `React.memo` для компонентов, которые:
  - Принимают props
  - Рендерятся часто
  - Имеют сложную логику отрисовки

- [ ] Используйте `useCallback` для функций, которые:
  - Передаются как props дочерним компонентам
  - Используются в зависимостях других хуков

- [ ] Используйте `useMemo` для:
  - Дорогостоящих вычислений
  - Создания объектов/массивов, передаваемых как props
  - Фильтрации/сортировки больших массивов

- [ ] НЕ используйте мемоизацию для:
  - Простых компонентов (меньше 10 строк)
  - Компонентов, которые всегда получают новые props
  - Примитивных вычислений

---

## 📊 Метрики производительности

### До оптимизации
- **Компоненты с React.memo**: 2
- **useCallback использований**: 0
- **useMemo использований**: 0

### После оптимизации
- **Компоненты с React.memo**: 8 ✅
- **useCallback использований**: 4 ✅
- **useMemo использований**: 1 ✅
- **useReducer оптимизаций**: 1 (7 useState → 1 reducer) ✅

---

## 🔧 Инструменты для мониторинга

1. **React DevTools Profiler**
   - Анализ времени рендера
   - Flame charts
   - Ranked charts

2. **Chrome DevTools Performance**
   - Main thread activity
   - Memory usage
   - Network waterfall

3. **Lighthouse**
   ```bash
   npm install -g lighthouse
   lighthouse https://zorki.pro --view
   ```

4. **Bundle Analyzer**
   ```bash
   npm run build
   npx vite-bundle-visualizer
   ```

---

## 📚 Дополнительные ресурсы

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)
- [React.memo Guide](https://react.dev/reference/react/memo)

**Последнее обновление**: 2025-10-16

