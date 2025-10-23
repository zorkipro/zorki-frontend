import React from "react";
import {
  InstagramStats,
  YouTubeStats,
  TikTokStats,
  TelegramStats,
} from "./PlatformStats";
import { Card, CardContent } from "@/ui-kit";
import { LoadingSpinner } from "@/ui-kit/components";
import { Users, TrendingUp, Eye } from "lucide-react";
import { PlatformStats, EditData } from "@/types/profile";
import { getPlatformName } from "@/components/icons/PlatformIcons";

interface PlatformStatsRendererProps {
  platform: string;
  stats: PlatformStats;
  formData: EditData;
  editingSection: string | null;
  saving: boolean;
  onEditingChange: (section: string | null) => void;
  onSave: (data: Partial<EditData>) => void;
  formatNumber: (num: number) => string;
  isPending?: boolean; // Флаг "на модерации"
  isVerified?: boolean; // Статус верификации пользователя
}

export const PlatformStatsRenderer: React.FC<PlatformStatsRendererProps> = (
  props,
) => {
  const { platform, stats, isPending } = props;
  
  // Если платформа в процессе парсинга
  if (stats.isLoading) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <LoadingSpinner className="w-12 h-12" />
          <div className="text-center">
            <h3 className="text-lg font-semibold">Парсинг данных {getPlatformName(platform)}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Это может занять несколько минут. Пожалуйста, подождите...
            </p>
          </div>
        </div>
      </Card>
    );
  }
  
  // Debug: PlatformStatsRenderer rendering

  switch (platform) {
    case "instagram":
      return <InstagramStats {...props} />;
    case "youtube":
      return <YouTubeStats {...props} />;
    case "tiktok":
      return <TikTokStats {...props} />;
    case "telegram":
      return <TelegramStats {...props} />;
    default:
      return null;
  }
};
