import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  description?: string;
  className?: string;
}

const FormFieldComponent = ({
  label,
  error,
  required = false,
  children,
  description,
  className,
}: FormFieldProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export const FormField = memo(FormFieldComponent);
