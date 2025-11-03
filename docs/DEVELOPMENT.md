# 👨‍💻 Руководство разработчика Zorki7

## 🚀 Быстрый старт

### Минимальные требования

- **Node.js** 18+
- **npm** 9+

### Установка (3 шага)

```bash
# 1. Установка зависимостей
npm install

# 2. Настройка окружения (опционально)
cp dev-config.env.example dev-config.env

# 3. Запуск
npm run dev
```

Приложение будет доступно на http://localhost:8080

---

## 🛠️ Основные команды разработки

## 📁 Организация файлов

```
src/
├── components/     # 99 UI компонентов
├── pages/         # 19 страниц
├── hooks/         # 41 хук
├── api/           # API клиент (8 модулей, 56 функций)
├── types/         # TypeScript типы
├── utils/         # Утилиты
├── contexts/      # React контексты
└── config/        # Конфигурация
```

Подробнее: [ARCHITECTURE.md](ARCHITECTURE.md)

## 🎨 Стилизация

### Tailwind CSS

```typescript
// Использование Tailwind классов
const Button = ({ variant }: { variant: 'primary' | 'secondary' }) => (
  <button className={cn(
    'px-4 py-2 rounded-md font-medium',
    variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
  )}>
    Click me
  </button>
);
```

### Утилита cn

```typescript
import { cn } from '@/utils/cn';

// Объединение классов
const className = cn('base-class', condition && 'conditional-class', 'another-class');
```

## 🎣 Система хуков

### useAuth - Аутентификация

```typescript
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiClient.login(credentials);
      setUser(response.user);
      sessionStorage.setItem('accessToken', response.accessToken);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return { user, loading, login };
};
```

### useLocalStorage - Локальное хранение

```typescript
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};
```

## 🔌 API интеграция

### Централизованный API клиент

```typescript
// api/client.ts
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async getBloggers(params: BloggerParams): Promise<Blogger[]> {
    const response = await fetch(`${this.baseURL}/bloggers`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  }
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_URL);
```

### Использование в компонентах

```typescript
const BloggerList = () => {
  const [bloggers, setBloggers] = useState<Blogger[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBloggers = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getBloggers({});
      setBloggers(data);
    } catch (error) {
      console.error('Failed to fetch bloggers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloggers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {bloggers.map(blogger => (
        <BloggerCard key={blogger.id} blogger={blogger} />
      ))}
    </div>
  );
};
```

## 🧪 Тестирование

### Unit тесты

```bash
# Запуск тестов
npm run test

# Тесты в watch режиме
npm run test:watch

# Покрытие кода
npm run test:coverage
```

### E2E тесты

```bash
# Запуск E2E тестов
npm run test:e2e

# UI тесты
npm run test:ui

# Генерация отчета
npx playwright show-report
```

## ⚡ Производительность

### Оптимизация компонентов

```typescript
// React.memo для предотвращения лишних рендеров
const BloggerCard = React.memo(({ blogger }: { blogger: Blogger }) => {
  return (
    <div className="blogger-card">
      <h3>{blogger.name}</h3>
      <p>{blogger.description}</p>
    </div>
  );
});

// useMemo для тяжелых вычислений
const ExpensiveComponent = ({ data }: { data: any[] }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: heavyCalculation(item)
    }));
  }, [data]);

  return <div>{/* Рендер обработанных данных */}</div>;
};
```

### Lazy Loading

```typescript
// Lazy loading компонентов
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProfileEditor = lazy(() => import('./pages/ProfileEditor'));

// Использование с Suspense
const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/profile" element={<ProfileEditor />} />
    </Routes>
  </Suspense>
);
```

## 🔧 Отладка

### React DevTools

```typescript
// Включение строгого режима
const App = () => (
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Маршруты */}
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
```

### Логирование

```typescript
// Централизованное логирование
import { logDev, logError } from '@/utils/logger';

const Component = () => {
  const handleAction = async () => {
    try {
      logDev('Starting action...');
      const result = await apiCall();
      logDev('Action completed successfully');
      return result;
    } catch (error) {
      logError('Action failed:', error);
      throw error;
    }
  };
};
```

## 📦 Развертывание

### Локальная сборка

```bash
# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview
```

### Supabase развертывание

```bash
# Логин в Supabase CLI
supabase login

# Связывание с проектом
supabase link --project-ref your-project-ref

# Применение миграций
supabase db push
```

## 🎯 Готовность к разработке

✅ **Архитектура** - модульная, масштабируемая  
✅ **Технологии** - современный стек  
✅ **Документация** - полная документация  
✅ **Тестирование** - настроенные тесты  
✅ **Качество кода** - ESLint, Prettier  
✅ **Производительность** - оптимизация

---

## 📊 Актуальная информация

- **Версия проекта:** 2.0.3
- **Компоненты:** 97 компонентов
- **Хуки:** 41 хук
- **API функции:** 56 функций в 8 модулях
- **Страницы:** 19 страниц
- **Тесты:** 9 E2E тестов (Playwright)
- **Таблицы БД:** 12 таблиц

---

_Последнее обновление: Январь 2025_
