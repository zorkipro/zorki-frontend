import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxDisplayItems?: number;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Выберите опции...',
  className,
  disabled = false,
  maxDisplayItems = 3,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    if (disabled) return;

    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [optionValue, ...value];

    onChange(newValue);
  };

  const removeOption = (optionValue: string) => {
    if (disabled) return;
    onChange(value.filter((v) => v !== optionValue));
  };

  const displayedItems = value.slice(0, maxDisplayItems);
  const remainingCount = value.length - maxDisplayItems;

  const getOptionLabel = (optionValue: string) => {
    return options.find((opt) => opt.value === optionValue)?.label || optionValue;
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          'cursor-pointer transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50',
          isOpen && 'ring-2 ring-ring ring-offset-2'
        )}
      >
        <div className="flex flex-1 flex-wrap gap-1 items-center">
          {value.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            <>
              {displayedItems.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="mr-1 cursor-pointer hover:bg-secondary/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(item);
                  }}
                >
                  {getOptionLabel(item)}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
              {remainingCount > 0 && (
                <Badge variant="outline" className="mr-1">
                  +{remainingCount} еще
                </Badge>
              )}
            </>
          )}
        </div>
        <ChevronDown
          className={cn('h-4 w-4 opacity-50 transition-transform', isOpen && 'rotate-180')}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          <div className="max-h-60 overflow-auto">
            {options.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <div
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  className={cn(
                    'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                    'transition-colors hover:bg-accent hover:text-accent-foreground',
                    isSelected && 'bg-accent text-accent-foreground'
                  )}
                >
                  <div className="flex h-3.5 w-3.5 items-center justify-center mr-2">
                    {isSelected && <Check className="h-4 w-4" />}
                  </div>
                  {option.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
