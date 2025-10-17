/**
 * EmptyState - Пустое состояние
 *
 * Универсальный компонент для отображения пустого состояния
 * Используется когда нет данных для отображения
 */

import React from 'react';
import { LucideIcon, Database } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface EmptyStateProps {
  /** Иконка */
  icon?: LucideIcon;
  /** Заголовок */
  title: string;
  /** Описание */
  description?: string;
  /** Действие (кнопка или элемент) */
  action?: React.ReactNode;
  /** Компактный режим */
  compact?: boolean;
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Пустое состояние
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={Database}
 *   title="Нет данных"
 *   description="Начните добавлять блогеров"
 *   action={<Button>Добавить блогера</Button>}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Database,
  title,
  description,
  action,
  compact = false,
  className = '',
}) => {
  if (compact) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
        {action && <div>{action}</div>}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{description}</p>
        )}
        {action && <div>{action}</div>}
      </CardContent>
    </Card>
  );
};
