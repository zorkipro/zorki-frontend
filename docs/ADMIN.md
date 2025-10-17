# 👨‍💼 Админ панель Zorki7

## Обзор админ-панели

Админ-панель Zorki7 предоставляет полный контроль над платформой для администраторов. Включает управление блогерами, модерацию контента, управление клиентами и интеграцию с социальными сетями.

## Доступ и аутентификация

### Доступ к админ-панели

- **URL:** `/admin`
- **Аутентификация:** JWT токены через NestJS API
- **Двухфакторная аутентификация:** Поддержка 2FA для дополнительной безопасности

### Процесс входа

```typescript
// Админская аутентификация
const adminLogin = async (credentials: AdminLoginInputDto) => {
  const response = await apiClient.post('/auth/admin/login', credentials);
  const { accessToken } = response.data;

  // Сохранение токена
  sessionStorage.setItem('adminToken', accessToken);

  return response.data;
};
```

### Проверка авторизации

```typescript
// Получение информации о текущем админе
const getAdminInfo = async () => {
  const token = sessionStorage.getItem('adminToken');

  const response = await apiClient.get('/auth/admin/me', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
```

## Основные функции

### Управление блогерами

#### Просмотр и фильтрация

- **Список всех блогеров** с пагинацией (50 на страницу)
- **Фильтрация по статусу** верификации
- **Поиск по имени** и описанию
- **Сортировка** по дате создания, имени, количеству подписчиков
- **Экспорт данных** в различных форматах

#### Добавление новых блогеров

```typescript
// Создание нового блогера
const createBlogger = async (bloggerData: AdminCreateBloggerInputDto) => {
  const response = await apiClient.post('/admin/bloggers', bloggerData);
  return response.data;
};

// Структура данных для создания
interface AdminCreateBloggerInputDto {
  name: string;
  lastName: string;
  email?: string;
  genderType?: ApiGender;
  workFormat?: ApiWorkFormat;
  socialAccounts?: SocialAccountInputDto[];
  topics?: number[];
  restrictedTopics?: number[];
}
```

#### Редактирование профилей

- **Основная информация** - имя, описание, контакты
- **Социальные аккаунты** - Instagram, YouTube, Telegram, TikTok
- **Цены и тарифы** - посты, сторис, интеграции
- **Тематики** - разрешенные и запрещенные темы
- **Статус верификации** - новый, одобрен, отклонен

#### Управление видимостью

- **Скрытие/показ** профилей
- **Массовые операции** с выбранными блогерами
- **Архивирование** неактивных профилей

### Модерация контента

#### Управление черновиками

```typescript
// Получение списка черновиков
const getPendingChanges = async () => {
  const response = await apiClient.get('/admin/pending-changes');
  return response.data;
};

// Одобрение изменений
const approveChanges = async (changeId: string) => {
  const response = await apiClient.post(`/admin/pending-changes/${changeId}/approve`);
  return response.data;
};

// Отклонение изменений
const rejectChanges = async (changeId: string, reason: string) => {
  const response = await apiClient.post(`/admin/pending-changes/${changeId}/reject`, {
    reason,
  });
  return response.data;
};
```

#### Workflow модерации

1. **Просмотр изменений** - детальный просмотр всех изменений
2. **Проверка данных** - валидация корректности информации
3. **Принятие решения** - одобрение или отклонение
4. **Уведомление пользователя** - автоматическое уведомление о решении
5. **Применение изменений** - публикация одобренных изменений

### Управление клиентами

#### Запросы на связывание

```typescript
// Получение списка запросов
const getLinkRequests = async (params: LinkRequestQueryParams) => {
  const response = await apiClient.get('/admin/link/blogger-client', { params });
  return response.data;
};

// Структура запроса на связывание
interface AdminGetLinkBloggerClientRequestOutputDto {
  id: number;
  status: 'APPROVED' | 'REJECTED' | 'MODERATION';
  blogger: {
    id: number;
    name: string | null;
    userId: string | null;
    socialAccounts: Array<{
      id: number;
      type: 'YOUTUBE' | 'INSTAGRAM' | 'TELEGRAM' | 'TIKTOK';
      title: string | null;
      avatarUrl: string | null;
      username: string;
      externalId: string | null;
      subscribers: string | null;
      createdAt: string;
      updatedAt: string | null;
    }>;
  };
  user: {
    id: string;
    email: string | null;
  };
  createdAt: string;
  finishAt: string | null;
}
```

#### Процесс одобрения

1. **Просмотр запроса** - детальная информация о блогере и клиенте
2. **Проверка соответствия** - валидация данных блогера
3. **Принятие решения** - одобрение или отклонение
4. **Уведомление сторон** - автоматические уведомления
5. **Обновление статуса** - изменение статуса в системе

### Статистика и аналитика

#### Общая статистика

- **Количество блогеров** - общее и по статусам
- **Количество клиентов** - зарегистрированных пользователей
- **Активность** - последние изменения и действия
- **Популярные платформы** - распределение по социальным сетям

#### Детальная аналитика

```typescript
// Получение статистики
const getDashboardStats = async () => {
  const response = await apiClient.get('/admin/dashboard/stats');
  return response.data;
};

// Структура статистики
interface DashboardStats {
  totalBloggers: number;
  verifiedBloggers: number;
  pendingBloggers: number;
  totalClients: number;
  linkRequests: number;
  pendingChanges: number;
  platformDistribution: {
    instagram: number;
    youtube: number;
    telegram: number;
    tiktok: number;
  };
  recentActivity: ActivityItem[];
}
```

## Компоненты админ-панели

### AdminDashboard

Главная страница админ-панели с общей статистикой и быстрым доступом к основным функциям.

```typescript
const AdminDashboard = () => {
  const { stats, loading } = useAdminDashboard();

  return (
    <div className="admin-dashboard">
      <DashboardHeader />
      <StatsCards stats={stats} />
      <RecentActivity />
      <QuickActions />
    </div>
  );
};
```

### AdminBloggerEditor

Редактор профилей блогеров с возможностью:

- Редактирования основной информации
- Управления социальными аккаунтами
- Настройки цен и тарифов
- Управления тематиками
- Загрузки аватарок и скриншотов

```typescript
const AdminBloggerEditor = ({ bloggerId }: { bloggerId: string }) => {
  const { blogger, updateBlogger, loading } = useAdminBloggerEditor(bloggerId);

  return (
    <div className="blogger-editor">
      <BloggerBasicInfo blogger={blogger} onUpdate={updateBlogger} />
      <SocialAccountsManager bloggerId={bloggerId} />
      <PricingManager bloggerId={bloggerId} />
      <TopicsManager bloggerId={bloggerId} />
    </div>
  );
};
```

### BloggerTable

Таблица блогеров с функциями:

- Сортировки по колонкам
- Фильтрации по статусу и платформам
- Поиска по имени и описанию
- Массовых операций
- Экспорта данных

```typescript
const BloggerTable = () => {
  const { bloggers, filters, setFilters, loading } = useAdminBloggers();

  return (
    <div className="blogger-table">
      <TableFilters filters={filters} onFiltersChange={setFilters} />
      <DataTable
        data={bloggers}
        columns={bloggerColumns}
        loading={loading}
        onRowClick={(blogger) => navigate(`/admin/bloggers/${blogger.id}`)}
      />
      <Pagination />
    </div>
  );
};
```

### PendingChanges

Управление черновиками изменений:

- Просмотр ожидающих изменений
- Детальный просмотр изменений
- Одобрение/отклонение с комментариями
- Массовые операции

```typescript
const PendingChanges = () => {
  const { changes, approveChange, rejectChange, loading } = usePendingChanges();

  return (
    <div className="pending-changes">
      <ChangesList
        changes={changes}
        onApprove={approveChange}
        onReject={rejectChange}
        loading={loading}
      />
    </div>
  );
};
```

### LinkRequestsManager

Управление запросами на связывание:

- Просмотр всех запросов
- Фильтрация по статусу
- Детальная информация о блогере и клиенте
- Одобрение/отклонение запросов

```typescript
const LinkRequestsManager = () => {
  const { requests, approveRequest, rejectRequest, loading } = useAdminLinkRequests();

  return (
    <div className="link-requests">
      <RequestsTable
        requests={requests}
        onApprove={approveRequest}
        onReject={rejectRequest}
        loading={loading}
      />
    </div>
  );
};
```

## Управление социальными клиентами

### InstagramClientManager

Управление Instagram клиентом для админов:

- Авторизация в Instagram через username/password
- Проверка статуса подключения (isAuthorized, isVerify)
- Управление сессиями Instagram аккаунтов
- Мониторинг подключений

```typescript
const InstagramClientManager = () => {
  const {
    isAuthorized,
    isVerify,
    login,
    logout,
    loading
  } = useInstagramClient();

  return (
    <div className="instagram-client">
      <ClientStatus
        isAuthorized={isAuthorized}
        isVerify={isVerify}
      />
      <LoginForm onLogin={login} loading={loading} />
      <LogoutButton onLogout={logout} />
    </div>
  );
};
```

### TelegramClientManager

Управление Telegram клиентом для админов:

- Авторизация в Telegram через phone/apiHash/apiId
- Подтверждение SMS кодов
- Двухэтапная авторизация (login → confirm)
- Управление сессиями

```typescript
const TelegramClientManager = () => {
  const {
    isAuthorized,
    isVerify,
    login,
    confirm,
    loading
  } = useTelegramClient();

  return (
    <div className="telegram-client">
      <ClientStatus
        isAuthorized={isAuthorized}
        isVerify={isVerify}
      />
      <LoginForm onLogin={login} loading={loading} />
      <ConfirmForm onConfirm={confirm} loading={loading} />
    </div>
  );
};
```

## Хуки для админки

### useAdminDashboard

Главный хук админ панели:

```typescript
const useAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
};
```

### useAdminBloggers

Управление списком блогеров:

```typescript
const useAdminBloggers = (filters: BloggerFilters = {}) => {
  const [bloggers, setBloggers] = useState<Blogger[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchBloggers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAdminBloggers(filters);
      setBloggers(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch bloggers:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  return { bloggers, loading, total, refetch: fetchBloggers };
};
```

### useAdminBloggerActions

CRUD операции с блогерами:

```typescript
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { logDev, logError } from '@/utils/logger';

const useAdminBloggerActions = () => {
  const { handleError } = useErrorHandler();

  const createBlogger = useCallback(
    async (data: CreateBloggerDto) => {
      try {
        logDev('Creating blogger:', data);
        const blogger = await createAdminBlogger(data);
        toast.success('Блогер успешно создан');
        return blogger;
      } catch (error) {
        logError('Failed to create blogger:', error);
        handleError(error, { showNotification: true });
        throw error;
      }
    },
    [handleError]
  );

  const updateBlogger = useCallback(
    async (id: string, data: UpdateBloggerDto) => {
      try {
        logDev('Updating blogger:', { id, data });
        const blogger = await updateAdminBlogger(id, data);
        toast.success('Блогер успешно обновлен');
        return blogger;
      } catch (error) {
        logError('Failed to update blogger:', error);
        handleError(error, { showNotification: true });
        throw error;
      }
    },
    [handleError]
  );

  const deleteBlogger = useCallback(
    async (id: string) => {
      try {
        logDev('Deleting blogger:', id);
        await deleteAdminBlogger(id);
        toast.success('Блогер успешно удален');
      } catch (error) {
        logError('Failed to delete blogger:', error);
        handleError(error, { showNotification: true });
        throw error;
      }
    },
    [handleError]
  );

  return { createBlogger, updateBlogger, deleteBlogger };
};
```

### useAdminLinkRequests

Управление запросами на связывание:

```typescript
const useAdminLinkRequests = () => {
  const [requests, setRequests] = useState<LinkRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getLinkRequests();
      setRequests(response.items);
    } catch (error) {
      console.error('Failed to fetch link requests:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const approveRequest = useCallback(
    async (requestId: string) => {
      try {
        await approveLinkRequest(requestId);
        toast.success('Запрос одобрен');
        fetchRequests(); // Обновляем список
      } catch (error) {
        toast.error('Ошибка при одобрении запроса');
      }
    },
    [fetchRequests]
  );

  const rejectRequest = useCallback(
    async (requestId: string, reason: string) => {
      try {
        await rejectLinkRequest(requestId, reason);
        toast.success('Запрос отклонен');
        fetchRequests(); // Обновляем список
      } catch (error) {
        toast.error('Ошибка при отклонении запроса');
      }
    },
    [fetchRequests]
  );

  return { requests, loading, approveRequest, rejectRequest, refetch: fetchRequests };
};
```

## Права доступа и безопасность

### Роли администраторов

```typescript
// Типы ролей
type AdminRole = 'super_admin' | 'admin' | 'moderator';

// Проверка прав доступа
const hasPermission = (role: AdminRole, permission: string): boolean => {
  const permissions = {
    super_admin: ['*'], // Все права
    admin: ['bloggers.*', 'clients.*', 'moderation.*'],
    moderator: ['bloggers.read', 'moderation.*'],
  };

  return (
    permissions[role]?.includes('*') ||
    permissions[role]?.includes(permission) ||
    permissions[role]?.includes(`${permission.split('.')[0]}.*`)
  );
};
```

### Защищенные маршруты

```typescript
// Компонент для проверки прав доступа
const ProtectedAdminRoute = ({
  children,
  permission
}: {
  children: React.ReactNode;
  permission: string;
}) => {
  const { admin } = useAuth();

  if (!admin) {
    return <Navigate to="/admin/login" />;
  }

  if (!hasPermission(admin.role, permission)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};

// Использование
<ProtectedAdminRoute permission="bloggers.write">
  <AdminBloggerEditor />
</ProtectedAdminRoute>
```

### Валидация данных

```typescript
// Схемы валидации для админских форм
const bloggerSchema = z.object({
  name: z.string().min(1).max(30),
  lastName: z.string().min(1).max(30),
  email: z.string().email().optional(),
  genderType: z.enum(['MALE', 'FEMALE', 'COUPLE', 'PUBLIC_PAGE']).optional(),
  workFormat: z.enum(['SOLE_PROPRIETOR', 'SELF_EMPLOYED', 'SERVICE_CONTRACT', 'LLC']).optional(),
});

// Валидация перед отправкой
const validateBloggerData = (data: unknown) => {
  try {
    return bloggerSchema.parse(data);
  } catch (error) {
    throw new ValidationError('Invalid blogger data', error);
  }
};
```

## Мониторинг и логирование

### Логирование действий админов

```typescript
// Централизованное логирование вместо AdminLogger
import { logDev, logError, logWarn } from '@/utils/logger';

// Сервис для логирования действий
class AdminActionLogger {
  static logAction(action: string, details: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      adminId: getCurrentAdminId(),
      action,
      details,
      ip: getClientIP(),
      userAgent: navigator.userAgent,
    };

    logDev('Admin action:', logEntry);
    // Отправка в систему логирования
    sendLogEntry(logEntry);
  }
}

// Использование в компонентах
const AdminBloggerEditor = () => {
  const updateBlogger = async (data: UpdateBloggerDto) => {
    try {
      await updateAdminBlogger(data);
      AdminActionLogger.logAction('blogger.update', { bloggerId: data.id });
      toast.success('Блогер обновлен');
    } catch (error) {
      logError('Failed to update blogger:', error);
      AdminActionLogger.logAction('blogger.update.error', { error: error.message });
      toast.error('Ошибка при обновлении');
    }
  };
};
```

### Мониторинг производительности

```typescript
// Отслеживание производительности админ-панели
const usePerformanceMonitoring = () => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => observer.disconnect();
  }, []);
};
```

## Уведомления и алерты

### Система уведомлений

```typescript
// Централизованная система уведомлений
const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Автоматическое удаление через 5 секунд
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
    }, 5000);
  }, []);

  return { notifications, addNotification };
};
```

### Алерты о критических событиях

```typescript
// Мониторинг критических событий
const useCriticalAlerts = () => {
  const checkCriticalEvents = useCallback(async () => {
    try {
      const events = await getCriticalEvents();

      events.forEach((event) => {
        if (event.severity === 'critical') {
          toast.error(`Критическое событие: ${event.message}`);
        } else if (event.severity === 'warning') {
          toast.warning(`Предупреждение: ${event.message}`);
        }
      });
    } catch (error) {
      console.error('Failed to check critical events:', error);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(checkCriticalEvents, 30000); // Каждые 30 секунд
    return () => clearInterval(interval);
  }, [checkCriticalEvents]);
};
```

## 🎯 Готовность админ-панели

**Админ-панель полностью функциональна и готова к использованию!**

- ✅ Все основные функции реализованы
- ✅ Система аутентификации работает
- ✅ Управление блогерами функционально
- ✅ Модерация контента настроена
- ✅ Управление клиентами работает
- ✅ Социальные клиенты интегрированы
- ✅ Статистика и аналитика доступны
- ✅ Безопасность настроена

### Возможности для расширения

1. **Расширенная аналитика** - детальные отчеты и графики
2. **Автоматизация** - автоматическое одобрение по правилам
3. **Интеграции** - дополнительные социальные платформы
4. **Уведомления** - push-уведомления и email рассылки
5. **API для внешних систем** - интеграция с CRM и другими системами

---

_Документация админ-панели регулярно обновляется. Последнее обновление: Октябрь 2025_
