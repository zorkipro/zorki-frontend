/**
 * PRIMITIVES - Базовые элементы (Atoms)
 *
 * Самые простые, неделимые UI элементы
 * Используются как строительные блоки для более сложных компонентов
 */

// ============================================================================
// INPUTS - Элементы ввода
// ============================================================================
export {
  Button,
  buttonVariants,
  type ButtonProps,
} from "@/components/ui/button";
export { Input } from "@/components/ui/input";
export { Textarea } from "@/components/ui/textarea";
export { Checkbox } from "@/components/ui/checkbox";
export { Switch } from "@/components/ui/switch";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "@/components/ui/select";

// ============================================================================
// TYPOGRAPHY - Типографика
// ============================================================================
export { Label } from "@/components/ui/label";
export { Separator } from "@/components/ui/separator";

// ============================================================================
// FEEDBACK - Обратная связь
// ============================================================================
export { Badge, badgeVariants, type BadgeProps } from "@/components/ui/badge";
export { Skeleton } from "@/components/ui/skeleton";
export { toast, useToast } from "@/hooks/use-toast";
export { Toaster } from "@/components/ui/toaster";

// ============================================================================
// MEDIA - Медиа элементы
// ============================================================================
export { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// ============================================================================
// INTERACTIVE - Интерактивные элементы
// ============================================================================
export { Toggle, toggleVariants } from "@/components/ui/toggle";
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

// Re-export foundations для удобства
export * from "../foundations";
