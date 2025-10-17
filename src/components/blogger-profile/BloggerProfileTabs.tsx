import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui-kit';
import { Button } from '@/ui-kit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui-kit';
import { ExternalLink } from 'lucide-react';
import { getPlatformIcon, getPlatformName } from '@/components/icons/PlatformIcons';
import { ScreenshotDisplay } from '@/components/profile/ScreenshotDisplay';
import { BloggerProfileStats } from './BloggerProfileStats';
import { Blogger } from '@/types/blogger';
import { Screenshot } from '@/types/profile';
import { normalizeUsername } from '@/utils/username';

interface BloggerProfileTabsProps {
  blogger: Blogger;
  screenshots: Screenshot[];
  loadingScreenshots: boolean;
}

export const BloggerProfileTabs = ({
  blogger,
  screenshots,
  loadingScreenshots,
}: BloggerProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState('instagram');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="flex w-full overflow-x-auto whitespace-nowrap gap-1 mb-8 md:grid md:grid-cols-4 md:gap-0">
        {Object.entries(blogger.platforms)
          .sort(([a], [b]) => {
            // Instagram всегда первый
            if (a === 'instagram') return -1;
            if (b === 'instagram') return 1;
            // Остальные в алфавитном порядке
            return a.localeCompare(b);
          })
          .map(([platform, stats]) => (
            <TabsTrigger
              key={platform}
              value={platform}
              className="flex items-center space-x-2 shrink-0 px-6 md:px-3 flex-1 md:flex-initial"
            >
              {getPlatformIcon(platform)}
              <span className="hidden sm:inline">{getPlatformName(platform)}</span>
            </TabsTrigger>
          ))}
      </TabsList>

      {Object.entries(blogger.platforms)
        .sort(([a], [b]) => {
          // Instagram всегда первый
          if (a === 'instagram') return -1;
          if (b === 'instagram') return 1;
          // Остальные в алфавитном порядке
          return a.localeCompare(b);
        })
        .map(([platform, stats]) => (
          <TabsContent key={platform} value={platform}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    {getPlatformIcon(platform)}
                    <span>Статистика {getPlatformName(platform)}</span>
                  </div>
                  {(stats.url ||
                    platform === 'instagram' ||
                    platform === 'tiktok' ||
                    platform === 'youtube' ||
                    platform === 'telegram') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        let url = stats.url;

                        // Формируем ссылки для всех платформ
                        if (platform === 'instagram') {
                          const username = normalizeUsername(blogger.handle);
                          url = `https://www.instagram.com/${username}/`;
                        } else if (platform === 'tiktok') {
                          const username = stats.username || normalizeUsername(blogger.handle);
                          url = `https://www.tiktok.com/@${username}`;
                        } else if (platform === 'youtube') {
                          const username = stats.username || normalizeUsername(blogger.handle);
                          url = `https://www.youtube.com/@${username}`;
                        } else if (platform === 'telegram') {
                          const username = stats.username || normalizeUsername(blogger.handle);
                          url = `https://t.me/${username}`;
                        }

                        if (url) {
                          window.open(url, '_blank');
                        }
                      }}
                      className="flex items-center space-x-1"
                    >
                      <span>Перейти</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BloggerProfileStats platform={platform} stats={stats} />

                {/* Screenshots Section */}
                <ScreenshotDisplay
                  platform={platform}
                  screenshots={screenshots}
                  loading={loadingScreenshots}
                  showUploadButton={false}
                  isVerified={true} // Для публичной страницы блогера всегда показываем скриншоты
                  createdBy="admin" // Публичные страницы созданы админом
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
    </Tabs>
  );
};
