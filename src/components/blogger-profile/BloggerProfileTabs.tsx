import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui-kit";
import { Button } from "@/ui-kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui-kit";
import { ExternalLink } from "lucide-react";
import {
  getPlatformIcon,
  getPlatformName,
} from "@/components/icons/PlatformIcons";
import { ScreenshotDisplay } from "@/components/profile/ScreenshotDisplay";
import { BloggerProfileStats } from "./BloggerProfileStats";
import { Blogger } from "@/types/blogger";
import { normalizeUsername } from "@/utils/username";
import { sortPlatforms } from "@/utils/platform-field-helpers";

interface BloggerProfileTabsProps {
  blogger: Blogger;
}

const buildPlatformUrl = (platform: string, stats: any, bloggerHandle: string): string | null => {
  if (stats.url) return stats.url;
  const username = normalizeUsername(stats.username || bloggerHandle);
  if (!username) return null;
  
  const urls: Record<string, string> = {
    instagram: `https://www.instagram.com/${username}/`,
    tiktok: `https://www.tiktok.com/@${username}`,
    youtube: `https://www.youtube.com/@${username}`,
    telegram: `https://t.me/${username}`,
  };
  return urls[platform] || null;
};

export const BloggerProfileTabs = ({
  blogger,
}: BloggerProfileTabsProps) => {
  const sortedPlatforms = Object.entries(blogger.platforms).sort(sortPlatforms);
  const [activeTab, setActiveTab] = useState(sortedPlatforms[0]?.[0] || "instagram");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="flex w-full overflow-x-auto whitespace-nowrap gap-1 mb-8 md:grid md:grid-cols-4 md:gap-0">
        {sortedPlatforms.map(([platform, stats]) => (
          <TabsTrigger
            key={platform}
            value={platform}
            className="flex items-center space-x-2 shrink-0 px-6 md:px-3 flex-1 md:flex-initial"
          >
            {getPlatformIcon(platform)}
            <span className="hidden sm:inline">
              {getPlatformName(platform)}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {sortedPlatforms.map(([platform, stats]) => {
        const url = buildPlatformUrl(platform, stats, blogger.handle);
        return (
          <TabsContent key={platform} value={platform}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    {getPlatformIcon(platform)}
                    <span>Статистика {getPlatformName(platform)}</span>
                  </div>
                  {url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(url, "_blank")}
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
                <ScreenshotDisplay
                  platform={platform}
                  screenshots={stats.screenshots ?? []}
                  loading={false}
                  showUploadButton={false}
                  isVerified={true}
                  createdBy="admin"
                />
              </CardContent>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
};
