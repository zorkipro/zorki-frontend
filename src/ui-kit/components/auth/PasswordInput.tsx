/**
 * PasswordInput - Поле ввода пароля
 *
 * Input с встроенной логикой показа/скрытия пароля
 * Заменяет дублирующийся код в Login и Register
 */

import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { InputWithIcon } from './InputWithIcon';

export interface PasswordInputProps {
  /** Значение пароля */
  value: string;
  /** Обработчик изменения */
  onChange: (value: string) => void;
  /** Placeholder */
  placeholder?: string;
  /** Обязательное поле */
  required?: boolean;
  /** ID элемента */
  id?: string;
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Password Input с показом/скрытием
 *
 * @example
 * ```tsx
 * <PasswordInput
 *   value={password}
 *   onChange={(val) => setPassword(val)}
 *   placeholder="Введите пароль"
 * />
 * ```
 */
export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = 'Введите пароль',
  required = false,
  id = 'password',
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleButton = (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="text-muted-foreground hover:text-foreground"
      aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
    >
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <InputWithIcon
      id={id}
      type={showPassword ? 'text' : 'password'}
      icon={Lock}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      rightElement={toggleButton}
      className={className}
    />
  );
};
