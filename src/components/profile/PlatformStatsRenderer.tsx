import React from "react";
import {
  InstagramStats,
  YouTubeStats,
  TikTokStats,
  TelegramStats,
} from "./PlatformStats";
import { Card, CardContent } from "@/ui-kit";
import { Users, TrendingUp, Eye } from "lucide-react";
import { PlatformStats, EditData } from "@/types/profile";

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
