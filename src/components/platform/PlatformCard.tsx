/**
 * Универсальная карточка платформы
 *
 * Компонент отображает информацию о социальной платформе блогера:
 * - Иконка и название платформы
 * - Подписчики, вовлеченность, охват
 * - Цены на публикации и истории
 *
 * Использует платформенную абстракцию для единообразного отображения.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PlatformType } from '@/types/platform';
import type { PlatformData } from '@/types/profile';
import { PLATFORM_CONFIGS } from '@/config/platforms';
import { getPlatformDisplayName, getPlatformColor } from '@/config/platforms';

export interface PlatformCardProps {
  /** Тип платформы */
  platform: PlatformType;
  /** Данные платформы */
  data: PlatformData;
  /** Показывать ли цены */
  showPricing?: boolean;
  /** Класс для стилизации */
  className?: string;
  /** Обработчик клика по карточке */
  onClick?: () => void;
}

/**
 * Форматирует число с разделителями тысяч
 */
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ru-RU').format(num);
};

/**
 * Форматирует цену в рубли
 */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * Универсальная карточка платформы
 *
 * @example
 * <PlatformCard
 *   platform="instagram"
 *   data={instagramData}
 *   showPricing={true}
 * />
 */
export const PlatformCard: React.FC<PlatformCardProps> = React.memo(
  ({ platform, data, showPricing = false, className = '', onClick }) => {
    const config = PLATFORM_CONFIGS[platform];
    const displayName = getPlatformDisplayName(platform);
    const color = getPlatformColor(platform);

    const hasData = data.subscribers > 0;

    return (
      <Card
        className={`transition-all hover:shadow-md ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
        style={{ borderColor: hasData ? color : undefined }}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{config.icon}</span>
              <span>{displayName}</span>
            </div>
            {hasData && (
              <Badge variant="secondary" style={{ backgroundColor: color, color: 'white' }}>
                Активна
              </Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {!hasData ? (
            <p className="text-sm text-muted-foreground">Нет данных</p>
          ) : (
            <>
              {/* Основная статистика */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Подписчики</p>
                  <p className="text-lg font-semibold">{formatNumber(data.subscribers)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Вовлеченность</p>
                  <p className="text-lg font-semibold">{data.er.toFixed(2)}%</p>
                </div>
              </div>

              {/* Охваты */}
              {data.reach > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Охват поста</p>
                    <p className="text-sm font-medium">{formatNumber(data.reach)}</p>
                  </div>
                  {data.storyReach > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Охват истории</p>
                      <p className="text-sm font-medium">{formatNumber(data.storyReach)}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Цены (опционально) */}
              {showPricing && (data.price > 0 || data.storyPrice > 0) && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  {data.price > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Пост</p>
                      <p className="text-sm font-semibold text-primary">
                        {formatPrice(data.price)}
                      </p>
                    </div>
                  )}
                  {data.storyPrice > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">История</p>
                      <p className="text-sm font-semibold text-primary">
                        {formatPrice(data.storyPrice)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Username и ссылка */}
              {data.username && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">Профиль</p>
                  <p className="text-sm font-medium text-blue-600">@{data.username}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  }
);

PlatformCard.displayName = 'PlatformCard';
