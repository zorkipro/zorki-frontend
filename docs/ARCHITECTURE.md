# 🏗️ Архитектура Zorki7

## 🎯 Обзор

Zorki7 построен на модульной архитектуре с акцентом на производительность, масштабируемость и удобство разработки.

## 📁 Структура проекта

```
src/
├── components/     # UI компоненты (50+ файлов)
├── pages/         # Страницы приложения (15+ файлов)
├── hooks/         # React хуки (20+ файлов)
├── api/           # API клиент и типы
├── types/         # TypeScript типы
├── utils/         # Утилиты и хелперы
├── ui-kit/        # Собственная UI библиотека
├── contexts/      # React контексты
├── config/        # Конфигурация
└── integrations/ # Интеграции с внешними сервисами
```

## 📄 Основные страницы

**Публичные страницы:**

- `HomePage` - главная страница с поиском
- `BloggerProfile` - профиль блогера
- `SearchResults` - результаты поиска

**Пользовательские страницы:**

- `ProfileEditor` - редактирование профиля
- `Dashboard` - личный кабинет
- `Settings` - настройки

**Админские страницы:**

- `AdminDashboard` - админ панель
- `BloggerManagement` - управление блогерами
- `ContentModeration` - модерация контента

## 🔧 Архитектурные паттерны

### Component Composition Pattern

```typescript
// Композиция компонентов
const BloggerCard = ({ blogger }: { blogger: Blogger }) => (
  <Card>
    <CardHeader>
      <BloggerAvatar blogger={blogger} />
      <BloggerInfo blogger={blogger} />
    </CardHeader>
    <CardContent>
      <BloggerStats blogger={blogger} />
      <BloggerActions blogger={blogger} />
    </CardContent>
  </Card>
);
```

### Custom Hooks Pattern

```typescript
// Переиспользуемая логика
const useBloggers = (filters: FilterState) => {
  const [bloggers, setBloggers] = useState<Blogger[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBloggers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.getBloggers(filters);
      setBloggers(data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  return { bloggers, loading, refetch: fetchBloggers };
};
```

## 🎣 Система хуков

**Общие хуки:**

- `useAuth` - аутентификация
- `useLocalStorage` - локальное хранение
- `useDebounce` - дебаунс для поиска

**Хуки профилей:**

- `useBloggerProfile` - данные блогера
- `useProfileEditor` - редактирование профиля

**Админ хуки:**

- `useAdminDashboard` - админ панель
- `useContentModeration` - модерация

## ⚡ Система производительности

### Бесконечный скролл

```typescript
const useInfiniteScroll = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore]);

  return { page, hasMore, loadMore };
};
```

### Оптимизация рендеринга

```typescript
// Мемоизация компонентов
const BloggerCard = React.memo(({ blogger }: { blogger: Blogger }) => {
  return <div>{blogger.name}</div>;
});

// Мемоизация вычислений
const filteredBloggers = useMemo(() => {
  return bloggers.filter(blogger =>
    blogger.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [bloggers, searchQuery]);
```

## 🎨 UI/UX архитектура

### Адаптивный дизайн

```typescript
// Breakpoints
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
};

// Условный рендеринг
const ResponsiveLayout = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {bloggers.map(blogger => (
      <BloggerCard key={blogger.id} blogger={blogger} />
    ))}
  </div>
);
```

## 🔌 API архитектура

### Структура API

```typescript
// Централизованный API клиент
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
```

## 🔐 Безопасность

### Аутентификация

```typescript
// JWT токены
const useAuth = () => {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem('accessToken'));

  const login = async (credentials: LoginCredentials) => {
    const response = await apiClient.login(credentials);
    setToken(response.accessToken);
    sessionStorage.setItem('accessToken', response.accessToken);
  };

  return { token, login };
};
```

## 🎯 Готовность архитектуры

✅ **Модульность** - четкое разделение ответственности  
✅ **Производительность** - оптимизация и мемоизация  
✅ **Масштабируемость** - готовность к росту  
✅ **Типизация** - полная типизация TypeScript  
✅ **Переиспользование** - компоненты и хуки  
✅ **Тестируемость** - изолированные модули

---

_Последнее обновление: Октябрь 2025_
