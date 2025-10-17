/**
 * Утилитарные типы для приложения
 *
 * Содержит общие типы и generic типы для:
 * - Partial updates
 * - Form state
 * - Async operations
 * - Common patterns
 */

/**
 * Partial update с обязательным id
 * Используется для операций обновления
 *
 * @example
 * type UpdateUser = PartialUpdate<User>;
 * const update: UpdateUser = { id: '123', name: 'New Name' };
 */
export type PartialUpdate<T> = Partial<T> & { id: string | number };

/**
 * Состояние формы
 * Содержит данные, ошибки валидации, флаги состояния
 *
 * @example
 * const formState: FormState<LoginData> = {
 *   data: { email: '', password: '' },
 *   errors: {},
 *   isDirty: false,
 *   isSubmitting: false
 * };
 */
export type FormState<T> = {
  /** Данные формы */
  data: T;
  /** Ошибки валидации (поле -> сообщение) */
  errors: Partial<Record<keyof T, string>>;
  /** Флаг изменения формы */
  isDirty: boolean;
  /** Флаг отправки формы */
  isSubmitting: boolean;
  /** Флаг успешной отправки */
  isSubmitted?: boolean;
  /** Флаг валидности формы */
  isValid?: boolean;
};

/**
 * Состояние асинхронной операции
 * Стандартный паттерн для работы с async операциями
 *
 * @example
 * const profileState: AsyncState<Profile> = {
 *   data: null,
 *   loading: true,
 *   error: null
 * };
 */
export type AsyncState<T> = {
  /** Данные (null если не загружены) */
  data: T | null;
  /** Флаг загрузки */
  loading: boolean;
  /** Ошибка (null если нет ошибки) */
  error: Error | null;
};

/**
 * Состояние асинхронной операции с дополнительными метаданными
 */
export type ExtendedAsyncState<T, M = Record<string, unknown>> = AsyncState<T> & {
  /** Дополнительные метаданные */
  metadata?: M;
  /** Время последнего обновления */
  lastUpdated?: Date;
  /** Флаг первой загрузки */
  isInitialLoad?: boolean;
};

/**
 * Результат операции (success/error)
 *
 * @example
 * function saveProfile(): Result<Profile> {
 *   try {
 *     const profile = ...;
 *     return { success: true, data: profile };
 *   } catch (error) {
 *     return { success: false, error };
 *   }
 * }
 */
export type Result<T, E = Error> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: E };

/**
 * Nullable тип (может быть null или undefined)
 */
export type Nullable<T> = T | null | undefined;

/**
 * Optional тип (может быть undefined)
 */
export type Optional<T> = T | undefined;

/**
 * Делает все поля объекта required (рекурсивно)
 * Обратное к Partial<T>
 *
 * Note: Не путать с встроенным Required<T> из TypeScript
 */
export type StrictRequired<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * Делает указанные поля required
 *
 * @example
 * type User = { id?: string; name?: string; email?: string };
 * type UserWithId = RequireFields<User, 'id' | 'email'>;
 * // { id: string; name?: string; email: string }
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Делает указанные поля optional
 *
 * @example
 * type User = { id: string; name: string; email: string };
 * type PartialUser = OptionalFields<User, 'email'>;
 * // { id: string; name: string; email?: string }
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Извлекает значения enum или union
 *
 * @example
 * const Status = { ACTIVE: 'active', INACTIVE: 'inactive' } as const;
 * type StatusValue = ValueOf<typeof Status>; // 'active' | 'inactive'
 */
export type ValueOf<T> = T[keyof T];

/**
 * Создает тип из массива значений
 *
 * @example
 * const colors = ['red', 'green', 'blue'] as const;
 * type Color = ArrayElement<typeof colors>; // 'red' | 'green' | 'blue'
 */
export type ArrayElement<T extends readonly unknown[]> = T[number];

/**
 * Глубокий Partial (рекурсивно делает все поля optional)
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Глубокий Required (рекурсивно делает все поля required)
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Глубокий Readonly (рекурсивно делает все поля readonly)
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Тип для пагинации
 */
export type Pagination = {
  /** Текущая страница */
  page: number;
  /** Размер страницы */
  pageSize: number;
  /** Общее количество элементов */
  total: number;
  /** Общее количество страниц */
  totalPages: number;
  /** Есть ли следующая страница */
  hasNext: boolean;
  /** Есть ли предыдущая страница */
  hasPrevious: boolean;
};

/**
 * Данные с пагинацией
 */
export type PaginatedData<T> = {
  /** Массив элементов */
  items: T[];
  /** Информация о пагинации */
  pagination: Pagination;
};

/**
 * Параметры сортировки
 */
export type SortParams<T> = {
  /** Поле для сортировки */
  field: keyof T;
  /** Направление сортировки */
  direction: 'asc' | 'desc';
};

/**
 * Параметры фильтрации
 */
export type FilterParams<T> = Partial<Record<keyof T, unknown>>;

/**
 * Параметры запроса списка (с пагинацией, сортировкой, фильтрацией)
 */
export type ListQueryParams<T> = {
  /** Пагинация */
  pagination?: Partial<Pagination>;
  /** Сортировка */
  sort?: SortParams<T>;
  /** Фильтры */
  filters?: FilterParams<T>;
  /** Поисковый запрос */
  search?: string;
};

/**
 * ID тип (может быть string или number)
 */
export type ID = string | number;

/**
 * Timestamp (миллисекунды или ISO string)
 */
export type Timestamp = number | string;

/**
 * Callback без возвращаемого значения
 */
export type VoidCallback = () => void;

/**
 * Callback с одним аргументом
 */
export type Callback<T> = (arg: T) => void;

/**
 * Async callback
 */
export type AsyncCallback<T = void> = () => Promise<T>;

/**
 * Async callback с аргументом
 */
export type AsyncCallbackWithArg<T, R = void> = (arg: T) => Promise<R>;

/**
 * Функция предиката для фильтрации
 */
export type Predicate<T> = (item: T) => boolean;

/**
 * Функция сравнения для сортировки
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Функция маппинга
 */
export type Mapper<T, R> = (item: T) => R;

/**
 * Reducer function
 */
export type Reducer<T, A> = (state: T, action: A) => T;

/**
 * Event handler
 */
export type EventHandler<E = Event> = (event: E) => void;

/**
 * Change handler для форм
 */
export type ChangeHandler<T = string> = (value: T) => void;

/**
 * Убирает null и undefined из типа
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Извлекает тип Promise
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/**
 * Конструирует тип из свойств T, где значения имеют тип K
 */
export type RecordOf<T extends keyof any, K> = Record<T, K>;

/**
 * Тип для хранения состояния загрузки по ключам
 */
export type LoadingState<T extends string> = Record<T, boolean>;

/**
 * Тип для хранения ошибок по ключам
 */
export type ErrorState<T extends string> = Record<T, Error | null>;

/**
 * Данные для селекта/dropdown
 */
export type SelectOption<T = string> = {
  /** Значение */
  value: T;
  /** Отображаемый текст */
  label: string;
  /** Дополнительное описание */
  description?: string;
  /** Отключен ли элемент */
  disabled?: boolean;
  /** Иконка */
  icon?: string;
};

/**
 * Группированные опции для селекта
 */
export type GroupedSelectOptions<T = string> = {
  /** Название группы */
  label: string;
  /** Опции в группе */
  options: SelectOption<T>[];
};

/**
 * Toast/Notification данные
 */
export type ToastData = {
  /** Заголовок */
  title: string;
  /** Описание */
  description?: string;
  /** Тип уведомления */
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  /** Длительность показа (мс) */
  duration?: number;
  /** Action button */
  action?: {
    label: string;
    onClick: VoidCallback;
  };
};

/**
 * Modal/Dialog данные
 */
export type DialogData = {
  /** Открыт ли диалог */
  isOpen: boolean;
  /** Заголовок */
  title: string;
  /** Описание */
  description?: string;
  /** Callback при подтверждении */
  onConfirm?: VoidCallback;
  /** Callback при отмене */
  onCancel?: VoidCallback;
  /** Текст кнопки подтверждения */
  confirmText?: string;
  /** Текст кнопки отмены */
  cancelText?: string;
};
