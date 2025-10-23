# Техническое задание: Таблица выбора пола блогеров в админ-панели

## 1. Общее описание

Создать временную таблицу в админ-панели для быстрого выбора пола блогеров. Таблица должна показывать только блогеров без указанного пола и позволять быстро назначать пол одним кликом.

## 2. Функциональные требования

### 2.1 Основной функционал
- **Отображение блогеров без пола**: Показывать только блогеров с `genderType = null`
- **Быстрый выбор пола**: Кнопки для каждого типа пола (Мужской, Женский, Пара, Публичная страница)
- **Визуальная обратная связь**: Кнопка должна "гореть" (активное состояние) если пол уже выбран
- **Локальное обновление**: После выбора пола блогер мгновенно исчезает из списка без перезагрузки страницы
- **Пагинация**: Загрузка блогеров порциями с кнопкой "Загрузить еще"

### 2.2 Технические требования
- **Кэширование**: Кэшировать результаты загруженных страниц для оптимизации
- **Фильтрация кэша**: Исключать блогеров с выбранным полом из кэшированных данных
- **Обновление счетчика**: Показывать актуальное количество блогеров без пола

## 3. Архитектура решения

### 3.1 API слой

#### 3.1.1 Типы данных
```typescript
// Расширенный тип для админки с информацией о поле
export interface AdminBloggerWithGender extends AdminGetBloggerOutputDto {
  genderType: ApiGender | null; // Получено через публичный API
}

export type ApiGender = "MALE" | "FEMALE" | "COUPLE" | "PUBLIC_PAGE";
```

#### 3.1.2 API функции
```typescript
// Получение информации о поле блогера через публичный API
export async function adminGetBloggerGenderInfo(
  bloggerId: number,
): Promise<Pick<PublicGetBloggerByIdOutputDto, 'id' | 'genderType'>>

// Обогащение списка блогеров информацией о поле
export async function adminEnrichBloggersWithGender(
  bloggers: AdminGetBloggersResponse['items']
): Promise<AdminBloggerWithGender[]>

// Загрузка блогеров без пола с пагинацией и кэшированием
export async function adminGetBloggersWithoutGender(
  page: number = 1,
  size: number = 50,
  cachedPages: Map<number, AdminBloggerWithGender[]> = new Map()
): Promise<{
  bloggers: AdminBloggerWithGender[];
  hasMore: boolean;
  totalCount: number;
  cachedPages: Map<number, AdminBloggerWithGender[]>;
}>
```

### 3.2 Хук управления состоянием

#### 3.2.1 Состояние
```typescript
const [bloggersWithoutGender, setBloggersWithoutGender] = useState<AdminBloggerWithGender[]>([]);
const [loadingGenderBloggers, setLoadingGenderBloggers] = useState(false);
const [genderBloggersPage, setGenderBloggersPage] = useState(1);
const [hasMoreGenderBloggers, setHasMoreGenderBloggers] = useState(true);
const [totalGenderBloggersCount, setTotalGenderBloggersCount] = useState(0);
const [genderPagesCache, setGenderPagesCache] = useState<Map<number, AdminBloggerWithGender[]>>(new Map());
```

#### 3.2.2 Основные функции
```typescript
// Локальное обновление пола блогера
const updateBloggerGenderLocally = useCallback((bloggerId: number, genderType: ApiGender) => {
  // 1. Обновить основной список блогеров
  setAllBloggers(prevBloggers => 
    prevBloggers.map(blogger => 
      blogger.id === bloggerId 
        ? { ...blogger, genderType }
        : blogger
    )
  );
  
  // 2. Удалить из списка без пола
  setBloggersWithoutGender(prevBloggers => 
    prevBloggers.filter(blogger => blogger.id !== bloggerId)
  );
  
  // 3. Обновить кэш - удалить из всех страниц
  setGenderPagesCache(prevCache => {
    const newCache = new Map(prevCache);
    newCache.forEach((bloggers, pageNumber) => {
      const updatedBloggers = bloggers.filter(blogger => blogger.id !== bloggerId);
      newCache.set(pageNumber, updatedBloggers);
    });
    return newCache;
  });
  
  // 4. Уменьшить счетчик
  setTotalGenderBloggersCount(prev => Math.max(0, prev - 1));
}, []);

// Загрузка блогеров без пола
const fetchBloggersWithoutGender = useCallback(async (page: number = 1, append: boolean = false) => {
  const result = await adminGetBloggersWithoutGender(page, 50, genderPagesCache);
  
  // Дополнительная фильтрация
  const filteredBloggers = result.bloggers.filter(blogger => 
    !blogger.genderType || blogger.genderType === null
  );
  
  // Обновление состояния...
}, [toast, genderPagesCache]);
```

### 3.3 UI компонент

#### 3.3.1 Интерфейс пропсов
```typescript
interface GenderSelectionTableProps {
  bloggers: AdminBloggerWithGender[];
  onGenderUpdated?: () => void;
  onBloggerGenderUpdated?: (bloggerId: number, genderType: ApiGender) => void;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  totalCount?: number;
  onClearCache?: () => void;
}
```

#### 3.3.2 Структура компонента
```typescript
export const GenderSelectionTable: React.FC<GenderSelectionTableProps> = ({
  bloggers,
  onBloggerGenderUpdated,
  loading = false,
  hasMore = false,
  onLoadMore,
  totalCount = 0,
  onClearCache,
}) => {
  // Фильтрация блогеров без пола
  const bloggersWithoutGender = bloggers.filter(
    (blogger) => !blogger.genderType || blogger.genderType === null
  );

  // Обработка выбора пола
  const handleGenderUpdate = async (bloggerId: number, genderType: ApiGender) => {
    // 1. Вызов API для обновления
    await adminUpdateBlogger(bloggerId, {
      genderType,
      topics: [],
      restrictedTopics: [],
    });

    // 2. Локальное обновление
    if (onBloggerGenderUpdated) {
      onBloggerGenderUpdated(bloggerId, genderType);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Выбор пола блогеров</CardTitle>
        <CardDescription>
          Показано: {bloggersWithoutGender.length} из {totalCount} блогеров
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Таблица с блогерами и кнопками выбора пола */}
        {/* Кнопка "Загрузить еще" */}
      </CardContent>
    </Card>
  );
};
```

## 4. Интеграция в админ-панель

### 4.1 Добавление вкладки
```typescript
// В AdminDashboard.tsx
<Button
  variant={activeTab === "gender-selection" ? "default" : "outline"}
  onClick={() => setActiveTab("gender-selection")}
  size="sm"
>
  Выбор пола
</Button>
```

### 4.2 Условный рендеринг
```typescript
{activeTab === "gender-selection" ? (
  <GenderSelectionTable
    bloggers={bloggersWithoutGender}
    onBloggerGenderUpdated={updateBloggerGenderLocally}
    loading={loadingGenderBloggers}
    hasMore={hasMoreGenderBloggers}
    onLoadMore={loadMoreGenderBloggers}
    totalCount={totalGenderBloggersCount}
    onClearCache={clearGenderCache}
  />
) : (
  // Другие компоненты
)}
```

### 4.3 Автозагрузка при переходе
```typescript
useEffect(() => {
  if (activeTab === "gender-selection" && bloggersWithoutGender.length === 0 && !loadingGenderBloggers) {
    fetchBloggersWithoutGender(1, false);
  }
}, [activeTab, bloggersWithoutGender.length, loadingGenderBloggers, fetchBloggersWithoutGender]);
```

## 5. Алгоритм работы

### 5.1 Загрузка данных
1. **При переходе на вкладку**: Автоматически загружается первая пачка блогеров без пола
2. **Обогащение данными**: Для каждого блогера запрашивается информация о поле через публичный API
3. **Фильтрация**: Оставляются только блогеры с `genderType = null`
4. **Кэширование**: Результаты сохраняются в `Map<номер_страницы, блогеры>`

### 5.2 Выбор пола
1. **API вызов**: Отправляется запрос на обновление пола блогера
2. **Локальное обновление**: Блогер удаляется из текущего списка
3. **Обновление кэша**: Блогер удаляется из всех закэшированных страниц
4. **Обновление счетчика**: Уменьшается общее количество блогеров без пола

### 5.3 Пагинация
1. **Кнопка "Загрузить еще"**: Загружается следующая страница блогеров
2. **Использование кэша**: Если страница уже загружена, данные берутся из кэша
3. **Фильтрация**: Дополнительно фильтруются блогеры с уже выбранным полом

## 6. Ключевые особенности реализации

### 6.1 Оптимизация производительности
- **Кэширование страниц**: Избегаем повторных запросов к API
- **Пакетная обработка**: Обогащение данными по 5 блогеров одновременно
- **Локальные обновления**: Мгновенная обратная связь без перезагрузки

### 6.2 Надежность
- **Дополнительная фильтрация**: На каждом уровне проверяем `genderType`
- **Обновление кэша**: Синхронизируем кэш при каждом изменении
- **Обработка ошибок**: Graceful fallback при ошибках API

### 6.3 UX
- **Индикаторы загрузки**: Показываем состояние загрузки
- **Счетчики**: Отображаем прогресс работы
- **Кнопка очистки кэша**: Для отладки и принудительного обновления

## 7. Файлы для создания/изменения

### 7.1 Новые файлы
- `src/components/admin/GenderSelectionTable.tsx`

### 7.2 Изменяемые файлы
- `src/api/types.ts` - добавление типа `AdminBloggerWithGender`
- `src/api/endpoints/admin.ts` - новые API функции
- `src/hooks/admin/useAdminBloggers.ts` - логика управления состоянием
- `src/pages/AdminDashboard.tsx` - интеграция компонента

## 8. Тестирование

### 8.1 Сценарии тестирования
1. **Переход на вкладку**: Проверить автозагрузку блогеров без пола
2. **Выбор пола**: Убедиться, что блогер исчезает из списка
3. **Пагинация**: Проверить загрузку следующих страниц
4. **Кэширование**: Убедиться, что блогеры с выбранным полом не появляются повторно
5. **Очистка кэша**: Проверить работу кнопки очистки

### 8.2 Критерии готовности
- ✅ Блогеры без пола отображаются корректно
- ✅ Выбор пола работает мгновенно
- ✅ Пагинация загружает только новые данные
- ✅ Кэш обновляется корректно
- ✅ Счетчики показывают актуальные данные
- ✅ Нет повторного появления блогеров с выбранным полом

## 9. Детальная реализация

### 9.1 API функции (src/api/endpoints/admin.ts)

```typescript
// Получение информации о поле блогера через публичный API
export async function adminGetBloggerGenderInfo(
  bloggerId: number,
): Promise<Pick<PublicGetBloggerByIdOutputDto, 'id' | 'genderType'>> {
  return apiRequest<Pick<PublicGetBloggerByIdOutputDto, 'id' | 'genderType'>>(
    `/blogger/public/${bloggerId}`,
    {
      method: "GET",
    },
  );
}

// Обогащение списка блогеров информацией о поле
export async function adminEnrichBloggersWithGender(
  bloggers: AdminGetBloggersResponse['items']
): Promise<AdminBloggerWithGender[]> {
  const enrichedBloggers: AdminBloggerWithGender[] = [];
  const batchSize = 5;
  
  for (let i = 0; i < bloggers.length; i += batchSize) {
    const batch = bloggers.slice(i, i + batchSize);
    const batchPromises = batch.map(async (blogger) => {
      try {
        const genderInfo = await adminGetBloggerGenderInfo(blogger.id);
        return {
          ...blogger,
          genderType: genderInfo.genderType,
        } as AdminBloggerWithGender;
      } catch (error) {
        console.warn(`Failed to get gender info for blogger ${blogger.id}:`, error);
        return {
          ...blogger,
          genderType: null,
        } as AdminBloggerWithGender;
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    enrichedBloggers.push(...batchResults);
  }
  
  return enrichedBloggers;
}

// Загрузка блогеров без пола с пагинацией и кэшированием
export async function adminGetBloggersWithoutGender(
  page: number = 1,
  size: number = 50,
  cachedPages: Map<number, AdminBloggerWithGender[]> = new Map()
): Promise<{
  bloggers: AdminBloggerWithGender[];
  hasMore: boolean;
  totalCount: number;
  cachedPages: Map<number, AdminBloggerWithGender[]>;
}> {
  const bloggersWithoutGender: AdminBloggerWithGender[] = [];
  let currentPage = page;
  let hasMore = true;
  const maxPages = 20;

  // Загружаем данные из кэша для предыдущих страниц
  for (let i = 1; i < page; i++) {
    const cachedBloggers = cachedPages.get(i);
    if (cachedBloggers) {
      const filteredCachedBloggers = cachedBloggers.filter(blogger =>
        !blogger.genderType || blogger.genderType === null
      );
      bloggersWithoutGender.push(...filteredCachedBloggers);
    }
  }

  // Загружаем новые данные
  while (hasMore && currentPage <= maxPages) {
    // Проверяем кэш
    if (cachedPages.has(currentPage)) {
      const cachedBloggers = cachedPages.get(currentPage)!;
      const filteredCachedBloggers = cachedBloggers.filter(blogger =>
        !blogger.genderType || blogger.genderType === null
      );
      bloggersWithoutGender.push(...filteredCachedBloggers);
      currentPage++;
      continue;
    }

    // Загружаем данные с сервера
    const bloggersResponse = await adminGetBloggers({
      page: currentPage,
      size: size,
      sortDirection: "desc",
      sortField: "createdAt",
    });

    if (bloggersResponse.items.length === 0) {
      hasMore = false;
      break;
    }

    // Обогащаем данными о поле
    const enrichedBloggers = await adminEnrichBloggersWithGender(bloggersResponse.items);
    const bloggersWithoutGenderInBatch = enrichedBloggers.filter(
      blogger => !blogger.genderType || blogger.genderType === null
    );

    // Сохраняем в кэш
    cachedPages.set(currentPage, bloggersWithoutGenderInBatch);
    bloggersWithoutGender.push(...bloggersWithoutGenderInBatch);

    // Проверяем условия завершения
    if (bloggersResponse.items.length < size) {
      hasMore = false;
    }

    if (bloggersWithoutGender.length >= size) {
      hasMore = false;
    }

    currentPage++;
  }

  return {
    bloggers: bloggersWithoutGender.slice(0, size),
    hasMore: hasMore && currentPage <= maxPages,
    totalCount: bloggersWithoutGender.length,
    cachedPages,
  };
}
```

### 9.2 Хук управления состоянием (src/hooks/admin/useAdminBloggers.ts)

```typescript
// Состояние для блогеров без пола
const [bloggersWithoutGender, setBloggersWithoutGender] = useState<AdminBloggerWithGender[]>([]);
const [loadingGenderBloggers, setLoadingGenderBloggers] = useState(false);
const [genderBloggersPage, setGenderBloggersPage] = useState(1);
const [hasMoreGenderBloggers, setHasMoreGenderBloggers] = useState(true);
const [totalGenderBloggersCount, setTotalGenderBloggersCount] = useState(0);
const [genderPagesCache, setGenderPagesCache] = useState<Map<number, AdminBloggerWithGender[]>>(new Map());

// Локальное обновление пола блогера
const updateBloggerGenderLocally = useCallback((bloggerId: number, genderType: ApiGender) => {
  // Обновляем основной список блогеров
  setAllBloggers(prevBloggers =>
    prevBloggers.map(blogger =>
      blogger.id === bloggerId
        ? { ...blogger, genderType }
        : blogger
    )
  );

  // Удаляем из списка без пола
  setBloggersWithoutGender(prevBloggers =>
    prevBloggers.filter(blogger => blogger.id !== bloggerId)
  );

  // Обновляем кэш - удаляем этого блогера из всех страниц в кэше
  setGenderPagesCache(prevCache => {
    const newCache = new Map(prevCache);
    newCache.forEach((bloggers, pageNumber) => {
      const updatedBloggers = bloggers.filter(blogger => blogger.id !== bloggerId);
      newCache.set(pageNumber, updatedBloggers);
    });
    return newCache;
  });

  // Уменьшаем счетчик
  setTotalGenderBloggersCount(prev => Math.max(0, prev - 1));
}, []);

// Загрузка блогеров без пола
const fetchBloggersWithoutGender = useCallback(async (page: number = 1, append: boolean = false) => {
  try {
    setLoadingGenderBloggers(true);
    const result = await adminGetBloggersWithoutGender(page, 50, genderPagesCache);

    // Дополнительно фильтруем результат, чтобы исключить блогеров с уже выбранным полом
    const filteredBloggers = result.bloggers.filter(blogger =>
      !blogger.genderType || blogger.genderType === null
    );

    if (append) {
      setBloggersWithoutGender(prev => [...prev, ...filteredBloggers]);
    } else {
      setBloggersWithoutGender(filteredBloggers);
    }

    setHasMoreGenderBloggers(result.hasMore);
    setTotalGenderBloggersCount(result.totalCount);
    setGenderBloggersPage(page);
    setGenderPagesCache(result.cachedPages);
  } catch (error) {
    console.error("Error fetching bloggers without gender:", error);
    toast({
      title: "Ошибка",
      description: "Не удалось загрузить блогеров без пола",
      variant: "destructive",
    });
  } finally {
    setLoadingGenderBloggers(false);
  }
}, [toast, genderPagesCache]);

// Загрузка следующей страницы
const loadMoreGenderBloggers = useCallback(() => {
  if (!loadingGenderBloggers && hasMoreGenderBloggers) {
    fetchBloggersWithoutGender(genderBloggersPage + 1, true);
  }
}, [loadingGenderBloggers, hasMoreGenderBloggers, genderBloggersPage, fetchBloggersWithoutGender]);

// Очистка кэша
const clearGenderCache = useCallback(() => {
  setGenderPagesCache(new Map());
  setBloggersWithoutGender([]);
  setGenderBloggersPage(1);
  setHasMoreGenderBloggers(true);
  setTotalGenderBloggersCount(0);
}, []);
```

### 9.3 UI компонент (src/components/admin/GenderSelectionTable.tsx)

```typescript
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui-kit/card";
import { Button } from "@/ui-kit/button";
import { Badge } from "@/ui-kit/badge";
import { Loader2 } from "lucide-react";
import { adminUpdateBlogger } from "@/api/endpoints/admin";
import { useToast } from "@/hooks/use-toast";
import type { AdminBloggerWithGender, ApiGender } from "@/api/types";

interface GenderSelectionTableProps {
  bloggers: AdminBloggerWithGender[];
  onGenderUpdated?: () => void;
  onBloggerGenderUpdated?: (bloggerId: number, genderType: ApiGender) => void;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  totalCount?: number;
  onClearCache?: () => void;
}

const genderOptions: { value: ApiGender; label: string; color: string }[] = [
  { value: "MALE", label: "Мужской", color: "bg-blue-500" },
  { value: "FEMALE", label: "Женский", color: "bg-pink-500" },
  { value: "COUPLE", label: "Пара", color: "bg-purple-500" },
  { value: "PUBLIC_PAGE", label: "Публичная страница", color: "bg-green-500" },
];

export const GenderSelectionTable: React.FC<GenderSelectionTableProps> = ({
  bloggers,
  onGenderUpdated,
  onBloggerGenderUpdated,
  loading = false,
  hasMore = false,
  onLoadMore,
  totalCount = 0,
  onClearCache,
}) => {
  const { toast } = useToast();
  const [updatingBloggerId, setUpdatingBloggerId] = useState<number | null>(null);

  // Фильтруем блогеров без пола
  const bloggersWithoutGender = bloggers.filter(
    (blogger) => !blogger.genderType || blogger.genderType === null
  );

  const handleGenderUpdate = async (
    bloggerId: number,
    genderType: ApiGender
  ) => {
    try {
      setUpdatingBloggerId(bloggerId);
      await adminUpdateBlogger(bloggerId, {
        genderType,
        topics: [],
        restrictedTopics: [],
      });
      
      toast({
        title: "Успешно",
        description: `Пол блогера обновлен на "${genderOptions.find(g => g.value === genderType)?.label}"`,
      });

      // Приоритет локального обновления
      if (onBloggerGenderUpdated) {
        onBloggerGenderUpdated(bloggerId, genderType);
      } else if (onGenderUpdated) {
        onGenderUpdated();
      }
    } catch (error) {
      console.error("Error updating blogger gender:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить пол блогера",
        variant: "destructive",
      });
    } finally {
      setUpdatingBloggerId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Выбор пола блогеров</CardTitle>
            <CardDescription>
              Быстрый выбор пола для блогеров без указанного пола.
              Показано: {bloggersWithoutGender.length} из {totalCount} блогеров
            </CardDescription>
          </div>
          {onClearCache && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearCache}
              className="text-xs"
            >
              Очистить кэш
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Загрузка блогеров без пола...
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">Имя</th>
                      <th className="text-left p-2">Статус</th>
                      <th className="text-left p-2">Дата создания</th>
                      <th className="text-center p-2">Выбор пола</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bloggersWithoutGender.map((blogger) => (
                      <tr key={blogger.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-mono text-sm">{blogger.id}</td>
                        <td className="p-2">
                          <div className="font-medium">
                            {blogger.name || "Без имени"}
                            {blogger.lastName && ` ${blogger.lastName}`}
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge variant={blogger.status === "APPROVED" ? "default" : "secondary"}>
                            {blogger.status === "APPROVED" ? "Одобрен" : "На модерации"}
                          </Badge>
                        </td>
                        <td className="p-2 text-sm text-muted-foreground">
                          {new Date(blogger.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1 justify-center">
                            {genderOptions.map((option) => (
                              <Button
                                key={option.value}
                                size="sm"
                                variant={blogger.genderType === option.value ? "default" : "outline"}
                                onClick={() => handleGenderUpdate(blogger.id, option.value)}
                                disabled={updatingBloggerId === blogger.id}
                                className={`text-xs px-2 py-1 ${
                                  blogger.genderType === option.value ? option.color : ""
                                }`}
                              >
                                {updatingBloggerId === blogger.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  option.label
                                )}
                              </Button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <div className="space-y-4">
                {bloggersWithoutGender.map((blogger) => (
                  <Card key={blogger.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <div className="font-medium">
                            {blogger.name || "Без имени"}
                            {blogger.lastName && ` ${blogger.lastName}`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID: {blogger.id} • {new Date(blogger.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={blogger.status === "APPROVED" ? "default" : "secondary"}>
                            {blogger.status === "APPROVED" ? "Одобрен" : "На модерации"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Выбор пола:</div>
                          <div className="grid grid-cols-2 gap-2">
                            {genderOptions.map((option) => (
                              <Button
                                key={option.value}
                                size="sm"
                                variant={blogger.genderType === option.value ? "default" : "outline"}
                                onClick={() => handleGenderUpdate(blogger.id, option.value)}
                                disabled={updatingBloggerId === blogger.id}
                                className={`text-xs ${
                                  blogger.genderType === option.value ? option.color : ""
                                }`}
                              >
                                {updatingBloggerId === blogger.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  option.label
                                )}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Кнопка загрузки следующей пачки */}
        {!loading && hasMore && onLoadMore && (
          <div className="text-center mt-6">
            <Button
              onClick={onLoadMore}
              variant="outline"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Загрузка...
                </>
              ) : (
                "Загрузить еще блогеров"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

## 10. Заключение

Это техническое задание содержит полную спецификацию для создания таблицы выбора пола блогеров в админ-панели. Реализация включает:

- **Полную архитектуру решения** с API слоем, хуком управления состоянием и UI компонентом
- **Детальные алгоритмы** работы с кэшированием и пагинацией
- **Готовый код** для всех необходимых файлов
- **Сценарии тестирования** и критерии готовности

Следуя этому техническому заданию, можно воссоздать функциональность в любой момент времени.

