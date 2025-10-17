import React from 'react';
import { MultiSelect } from '@/ui-kit';
import { useTopics } from '@/hooks/useTopics';

interface RestrictedTopicsSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
}

export const RestrictedTopicsSelector: React.FC<RestrictedTopicsSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className,
}) => {
  const { restrictedTopics, loading, error } = useTopics();

  const topicsOptions = restrictedTopics.map((topic) => ({
    value: topic.name,
    label: topic.name,
  }));

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center p-3 text-sm text-muted-foreground ${className}`}
      >
        Загрузка запрещенных тематик...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center p-3 text-sm text-destructive ${className}`}>
        Ошибка загрузки запрещенных тематик: {error}
      </div>
    );
  }

  return (
    <MultiSelect
      options={topicsOptions}
      value={value}
      onChange={onChange}
      placeholder="Выберите запрещенные тематики..."
      disabled={disabled}
      className={className}
      maxDisplayItems={2}
    />
  );
};
