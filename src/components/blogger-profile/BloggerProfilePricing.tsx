import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/ui-kit";
import { CheckCircle } from "lucide-react";
import {
  getPlatformIcon,
  getPlatformName,
} from "@/components/icons/PlatformIcons";
import { Blogger } from "@/types/blogger";
import { useTopics } from "@/hooks/useTopics";

interface BloggerProfilePricingProps {
  blogger: Blogger;
}

export const BloggerProfilePricing = ({
  blogger,
}: BloggerProfilePricingProps) => {
  const { getRestrictedTopicNameById, loading: topicsLoading } = useTopics();

  // Проверяем, есть ли хотя бы одна платформа с заполненной ценой
  const hasAnyPrices = Object.values(blogger.platforms).some(
    (stats) =>
      (stats.price && stats.price > 0) ||
      (stats.storyPrice && stats.storyPrice > 0) ||
      (stats.integrationPrice && stats.integrationPrice > 0)
  );

  return (
    <div className="space-y-6">
      {/* Prices */}
      {hasAnyPrices && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Прайс-лист</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(blogger.platforms)
              .sort(([a], [b]) => {
                // Instagram всегда первый
                if (a === "instagram") return -1;
                if (b === "instagram") return 1;
                // Остальные в алфавитном порядке
                return a.localeCompare(b);
              })
              .map(([platform, stats]) => (
                <div
                  key={platform}
                  className="border-b border-border-light pb-3 last:border-b-0"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {getPlatformIcon(platform)}
                    <span className="font-medium">
                      {getPlatformName(platform)}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {platform === "youtube" ? "Интеграция:" : "Публикация:"}
                      </span>
                      <span className="font-medium">{stats.price || 0} BYN</span>
                    </div>
                    {platform === "instagram" && stats.storyPrice && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Сторис:</span>
                        <span className="font-medium">
                          {stats.storyPrice || 0} BYN
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Work Conditions */}
      {(blogger.legalForm ||
        (blogger.restrictedTopics && blogger.restrictedTopics.length > 0) ||
        blogger.inMartRegistry === true) && (
        <Card>
          <CardHeader>
            <CardTitle>Условия сотрудничества</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Информация о правовой форме */}
            {blogger.legalForm && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Правовая форма:
                </span>
                <span className="text-sm font-medium">{blogger.legalForm}</span>
              </div>
            )}

            {/* Тематики, которые не берет в рекламу */}
            {blogger.restrictedTopics.length > 0 && (
              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  Не рекламирую
                </div>
                <div className="flex flex-wrap gap-1">
                  {blogger.restrictedTopics.map((topic, index) => {
                    // Конвертируем ID в название, если это число
                    const topicName =
                      typeof topic === "number"
                        ? topicsLoading
                          ? `Загрузка...`
                          : getRestrictedTopicNameById(topic) ||
                            `Тематика ${topic}`
                        : topic;

                    return (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs text-muted-foreground"
                      >
                        {topicName}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Показываем информацию о реестре МАРТ только если блогер в реестре */}
            {blogger.inMartRegistry === true && (
              <div className="flex items-center justify-between pt-2 border-t border-border-light">
                <span className="text-sm text-muted-foreground">
                  В реестре МАРТ
                </span>
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cooperation Conditions Text */}
      {blogger.cooperationConditions?.trim() && (
        <Card>
          <CardHeader>
            <CardTitle>Подробнее про сотрудничество</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {blogger.cooperationConditions}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
