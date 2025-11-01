import { Card, CardContent } from "@/ui-kit";
import { Users, TrendingUp, Eye, Wallet } from "lucide-react";
import { formatNumber } from "@/utils/formatters";
import { PlatformData } from "@/types/profile";

interface PlatformStatsCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color?: string;
}

const StatsCard = ({
  icon,
  value,
  label,
  color = "text-foreground",
}: PlatformStatsCardProps) => (
  <Card>
    <CardContent className="p-4 text-center">
      <div className={`w-6 h-6 ${color} mx-auto mb-2`}>{icon}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </CardContent>
  </Card>
);

interface BloggerProfileStatsProps {
  platform: string;
  stats: PlatformData;
}

type StatConfig = {
  icon: React.ReactNode;
  getValue: (stats: PlatformData) => string | number;
  label: string;
  color: string;
};

const getPlatformStatsConfig = (platform: string): StatConfig[] => {
  const base: StatConfig = {
    icon: <Users className="w-6 h-6" />,
    getValue: (s) => formatNumber(s.subscribers),
    label: "Подписчиков",
    color: "text-primary",
  };

  if (platform === "instagram") {
    return [
      base,
      { icon: <TrendingUp className="w-6 h-6" />, getValue: (s) => `${s.er}%`, label: "ER", color: "text-success" },
      { icon: <Eye className="w-6 h-6" />, getValue: (s) => formatNumber(s.reach), label: "Охват публикаций", color: "text-warning" },
      { icon: <Eye className="w-6 h-6" />, getValue: (s) => formatNumber(s.storyReach), label: "Охват сторис", color: "text-warning" },
      { icon: <Wallet className="w-6 h-6" />, getValue: (s) => `${s.price} BYN`, label: "Цена публикации", color: "text-primary" },
      { icon: <Wallet className="w-6 h-6" />, getValue: (s) => `${s.storyPrice} BYN`, label: "Цена сторис", color: "text-primary" },
    ];
  }
  
  if (platform === "youtube") {
    return [
      base,
      { icon: <Eye className="w-6 h-6" />, getValue: (s) => formatNumber(s.views || 0), label: "Просмотров", color: "text-warning" },
      { icon: <Wallet className="w-6 h-6" />, getValue: (s) => `${s.price || 0} BYN`, label: "Цена интеграции", color: "text-primary" },
    ];
  }

  return [
    base,
    { icon: <Eye className="w-6 h-6" />, getValue: (s) => formatNumber(s.reach), label: "Охват публикаций", color: "text-warning" },
    { icon: <Wallet className="w-6 h-6" />, getValue: (s) => `${s.price || 0} BYN`, label: "Цена публикации", color: "text-primary" },
  ];
};

export const BloggerProfileStats = ({ platform, stats }: BloggerProfileStatsProps) => {
  const config = getPlatformStatsConfig(platform);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {config.map((item, index) => (
        <StatsCard key={index} icon={item.icon} value={item.getValue(stats)} label={item.label} color={item.color} />
      ))}
    </div>
  );
};
