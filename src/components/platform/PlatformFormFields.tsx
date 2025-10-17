/**
 * Универсальные поля формы для платформы
 *
 * Генерирует набор полей ввода для редактирования данных социальной платформы.
 * Использует конфигурацию платформы для определения необходимых полей и их валидации.
 *
 * Следует принципу DRY - устраняет дублирование кода для разных платформ.
 */

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { PlatformType, PlatformFormField } from '@/types/platform';
import type { EditData } from '@/types/profile';
import { PLATFORM_CONFIGS } from '@/config/platforms';

export interface PlatformFormFieldsProps {
  /** Тип платформы */
  platform: PlatformType;
  /** Данные формы */
  formData: EditData;
  /** Обработчик изменения поля */
  onChange: (field: string, value: string) => void;
  /** Доступна ли форма для редактирования */
  disabled?: boolean;
  /** Показывать ли поля цен */
  showPricing?: boolean;
  /** Показывать ли поля охватов */
  showCoverage?: boolean;
  /** Класс для стилизации */
  className?: string;
}

/**
 * Получает значение поля из formData
 */
const getFieldValue = (
  formData: EditData,
  platform: PlatformType,
  field: PlatformFormField
): string => {
  const key = `${platform}_${field}` as keyof EditData;
  const value = formData[key];
  return value ? String(value) : '';
};

/**
 * Получает метку для поля
 */
const getFieldLabel = (field: PlatformFormField): string => {
  const labels: Record<PlatformFormField, string> = {
    username: 'Username',
    profile_url: 'Ссылка на профиль',
    followers: 'Подписчики',
    engagement_rate: 'Вовлеченность (%)',
    post_reach: 'Охват поста',
    story_reach: 'Охват истории',
    post_price: 'Цена поста (₽)',
    story_price: 'Цена истории (₽)',
  };
  return labels[field];
};

/**
 * Определяет тип input для поля
 */
const getFieldType = (field: PlatformFormField): string => {
  if (field === 'profile_url') return 'url';
  if (['followers', 'post_reach', 'story_reach', 'post_price', 'story_price'].includes(field)) {
    return 'number';
  }
  if (field === 'engagement_rate') return 'number';
  return 'text';
};

/**
 * Группирует поля по категориям
 */
const groupFields = (fields: readonly PlatformFormField[]) => {
  const basicFields: PlatformFormField[] = [];
  const statsFields: PlatformFormField[] = [];
  const coverageFields: PlatformFormField[] = [];
  const pricingFields: PlatformFormField[] = [];

  fields.forEach((field) => {
    if (field === 'username' || field === 'profile_url') {
      basicFields.push(field);
    } else if (field === 'followers' || field === 'engagement_rate') {
      statsFields.push(field);
    } else if (field === 'post_reach' || field === 'story_reach') {
      coverageFields.push(field);
    } else if (field === 'post_price' || field === 'story_price') {
      pricingFields.push(field);
    }
  });

  return { basicFields, statsFields, coverageFields, pricingFields };
};

/**
 * Универсальные поля формы для платформы
 *
 * @example
 * <PlatformFormFields
 *   platform="instagram"
 *   formData={formData}
 *   onChange={(field, value) => updateFormData({ [field]: value })}
 *   showPricing={true}
 * />
 */
export const PlatformFormFields: React.FC<PlatformFormFieldsProps> = React.memo(
  ({
    platform,
    formData,
    onChange,
    disabled = false,
    showPricing = true,
    showCoverage = true,
    className = '',
  }) => {
    const config = PLATFORM_CONFIGS[platform];
    const { basicFields, statsFields, coverageFields, pricingFields } = groupFields(config.fields);

    const handleChange = (field: PlatformFormField, value: string) => {
      const fieldName = `${platform}_${field}`;
      onChange(fieldName, value);
    };

    const renderField = (field: PlatformFormField) => {
      const value = getFieldValue(formData, platform, field);
      const label = getFieldLabel(field);
      const type = getFieldType(field);
      const placeholder = config.placeholders[field];

      return (
        <div key={field} className="space-y-2">
          <Label htmlFor={`${platform}_${field}`}>{label}</Label>
          <Input
            id={`${platform}_${field}`}
            type={type}
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            min={type === 'number' ? 0 : undefined}
            step={field === 'engagement_rate' ? 0.01 : undefined}
          />
        </div>
      );
    };

    return (
      <div className={`space-y-6 ${className}`}>
        {/* Основная информация */}
        {basicFields.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Профиль</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {basicFields.map(renderField)}
            </div>
          </div>
        )}

        {/* Статистика */}
        {statsFields.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Статистика</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {statsFields.map(renderField)}
            </div>
          </div>
        )}

        {/* Охваты */}
        {showCoverage && coverageFields.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Охваты</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coverageFields.map(renderField)}
            </div>
          </div>
        )}

        {/* Цены */}
        {showPricing && pricingFields.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Цены</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pricingFields.map(renderField)}
            </div>
          </div>
        )}
      </div>
    );
  }
);

PlatformFormFields.displayName = 'PlatformFormFields';
