/**
 * COMPONENTS - Составные компоненты (Molecules)
 *
 * Более сложные компоненты, состоящие из нескольких примитивов
 * Используются для построения интерфейсов
 */

// ============================================================================
// CONTAINERS - Контейнеры
// ============================================================================
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
export { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// ============================================================================
// OVERLAYS - Оверлеи и диалоги
// ============================================================================
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

// ============================================================================
// NAVIGATION - Навигация
// ============================================================================
export { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb';
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// ============================================================================
// MENUS - Меню
// ============================================================================
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '@/components/ui/dropdown-menu';
export { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

// ============================================================================
// DATA DISPLAY - Отображение данных
// ============================================================================
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
export { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// ============================================================================
// FORMS - Формы
// ============================================================================
export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField,
} from '@/components/ui/form';
export { FormField as CustomFormField } from '@/components/ui/FormField';

// ============================================================================
// CUSTOM COMPONENTS - Кастомные компоненты
// ============================================================================
export { EditableCard } from '@/components/ui/EditableCard';
export { FollowersDisplay } from '@/components/ui/FollowersDisplay';
export { default as InfiniteScrollList } from '@/components/ui/InfiniteScrollList';
export { MultiSelect } from '@/components/ui/MultiSelect';
export { PageSkeleton } from '@/components/ui/PageSkeleton';

// ============================================================================
// AUTH COMPONENTS - Компоненты авторизации
// ============================================================================
export {
  GoogleAuthButton,
  InputWithIcon,
  PasswordInput,
  DividerWithText,
  ErrorNotification,
} from '../components/auth';
export type {
  GoogleAuthButtonProps,
  InputWithIconProps,
  PasswordInputProps,
  DividerWithTextProps,
} from '../components/auth';
export { useErrorNotification } from '@/hooks/useErrorNotification';
export { ProtectedRoute } from '@/components/ProtectedRoute';

// ============================================================================
// FEEDBACK COMPONENTS - Компоненты обратной связи
// ============================================================================
export { ErrorAlert, LoadingSpinner, EmptyState } from '../components/feedback';
export type { ErrorAlertProps, LoadingSpinnerProps, EmptyStateProps } from '../components/feedback';

// ============================================================================
// LAYOUT COMPONENTS - Layout компоненты
// ============================================================================
export { CenteredAuthLayout } from '../components/layout';
export type { CenteredAuthLayoutProps } from '../components/layout';
