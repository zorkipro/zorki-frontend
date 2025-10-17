import React from 'react';
import { MultiSelect } from '@/ui-kit';
import { useTopics } from '@/hooks/useTopics';

interface CategorySelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className,
}) => {
  const { categories, loading, error } = useTopics();

  const categoryOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center p-3 text-sm text-muted-foreground ${className}`}
      >
        Загрузка тематик...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center p-3 text-sm text-destructive ${className}`}>
        Ошибка загрузки тематик: {error}
      </div>
    );
  }

  return (
    <MultiSelect
      options={categoryOptions}
      value={value}
      onChange={onChange}
      placeholder="Выберите тематики..."
      disabled={disabled}
      className={className}
      maxDisplayItems={2}
    />
  );
};
