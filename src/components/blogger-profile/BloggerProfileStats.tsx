import { Card, CardContent } from '@/ui-kit';
import { Users, TrendingUp, Eye, Wallet } from 'lucide-react';
import { formatNumber } from '@/utils/formatters';
import { PlatformData } from '@/types/profile';

interface PlatformStatsCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color?: string;
}

const StatsCard = ({ icon, value, label, color = 'text-foreground' }: PlatformStatsCardProps) => (
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

export const BloggerProfileStats = ({ platform, stats }: BloggerProfileStatsProps) => {
  if (platform === 'instagram') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatsCard
          icon={<Users className="w-6 h-6" />}
          value={formatNumber(stats.subscribers)}
          label="Подписчиков"
          color="text-primary"
        />
        <StatsCard
          icon={<TrendingUp className="w-6 h-6" />}
          value={`${stats.er}%`}
          label="ER"
          color="text-success"
        />
        <StatsCard
          icon={<Eye className="w-6 h-6" />}
          value={formatNumber(stats.reach)}
          label="Охват публикаций"
          color="text-warning"
        />
        <StatsCard
          icon={<Eye className="w-6 h-6" />}
          value={formatNumber(stats.storyReach)}
          label="Охват сторис"
          color="text-warning"
        />
        <StatsCard
          icon={<Wallet className="w-6 h-6" />}
          value={`${stats.price} BYN`}
          label="Цена публикации"
          color="text-primary"
        />
        <StatsCard
          icon={<Wallet className="w-6 h-6" />}
          value={`${stats.storyPrice} BYN`}
          label="Цена сторис"
          color="text-primary"
        />
      </div>
    );
  }

  if (platform === 'youtube') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatsCard
          icon={<Users className="w-6 h-6" />}
          value={formatNumber(stats.subscribers)}
          label="Подписчиков"
          color="text-primary"
        />
        <StatsCard
          icon={<Eye className="w-6 h-6" />}
          value={formatNumber(stats.reach)}
          label="Просмотров"
          color="text-warning"
        />
        <StatsCard
          icon={<Wallet className="w-6 h-6" />}
          value={`${stats.price || 0} BYN`}
          label="Цена интеграции"
          color="text-primary"
        />
      </div>
    );
  }

  // TikTok и Telegram — без ER
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <StatsCard
        icon={<Users className="w-6 h-6" />}
        value={formatNumber(stats.subscribers)}
        label="Подписчиков"
        color="text-primary"
      />
      <StatsCard
        icon={<Eye className="w-6 h-6" />}
        value={formatNumber(stats.reach)}
        label="Охват публикаций"
        color="text-warning"
      />
      <StatsCard
        icon={<Wallet className="w-6 h-6" />}
        value={`${stats.price || 0} BYN`}
        label="Цена публикации"
        color="text-primary"
      />
    </div>
  );
};
