import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui-kit";
import { Button } from "@/ui-kit";
import { Badge } from "@/ui-kit";
import { useToast } from "@/hooks/use-toast";
import { startIgParsing } from "@/api/endpoints/instagram";
import { startTgParsing } from "@/api/endpoints/telegram";
import { startYtParsing } from "@/api/endpoints/youtube";
import { startTtParsing } from "@/api/endpoints/tiktok";
import { getTgSessions } from "@/api/endpoints/telegram";
import { getYtSessions } from "@/api/endpoints/youtube";
import { getTtSessions } from "@/api/endpoints/tiktok";
import { Instagram, MessageCircle, Youtube, Music, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

interface ParserStatus {
  isActive: boolean;
  activeSessions: number; // Авторизованные сессии
  totalSessions: number; // Всего сессий
  lastReset?: string;
  loading: boolean;
  // Статистика по запросам/квоте/кредитам
  totalRequests?: number; // Сумма запросов для Telegram/Instagram
  totalQuota?: number; // Сумма использованной квоты (запросов) для YouTube
  totalCredits?: number; // Сумма кредитов для TikTok
  lastRun?: string; // Время последнего запуска парсера (сохраняется в localStorage)
}

export const ParserControls: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<{
    instagram: boolean;
    telegram: boolean;
    youtube: boolean;
    tiktok: boolean;
  }>({
    instagram: false,
    telegram: false,
    youtube: false,
    tiktok: false,
  });

  // Загружаем время последнего запуска из localStorage
  const getLastRunFromStorage = (platform: string): string | undefined => {
    try {
      const stored = localStorage.getItem(`parser_last_run_${platform}`);
      return stored || undefined;
    } catch {
      return undefined;
    }
  };

  // Сохраняем время последнего запуска в localStorage
  const saveLastRunToStorage = (platform: string, timestamp: string) => {
    try {
      localStorage.setItem(`parser_last_run_${platform}`, timestamp);
    } catch (error) {
      console.error(`Failed to save last run for ${platform}:`, error);
    }
  };

  const [status, setStatus] = useState<{
    instagram: ParserStatus;
    telegram: ParserStatus;
    youtube: ParserStatus;
    tiktok: ParserStatus;
  }>({
    instagram: { 
      isActive: false, 
      activeSessions: 0, 
      totalSessions: 0, 
      loading: false,
      lastRun: getLastRunFromStorage('instagram'),
    },
    telegram: { 
      isActive: false, 
      activeSessions: 0, 
      totalSessions: 0, 
      loading: false,
      lastRun: getLastRunFromStorage('telegram'),
    },
    youtube: { 
      isActive: false, 
      activeSessions: 0, 
      totalSessions: 0, 
      loading: false,
      lastRun: getLastRunFromStorage('youtube'),
    },
    tiktok: { 
      isActive: false, 
      activeSessions: 0, 
      totalSessions: 0, 
      loading: false,
      lastRun: getLastRunFromStorage('tiktok'),
    },
  });

  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    setRefreshing(true);
    try {
      // Instagram - использует стороннее API, не требует проверки сессий
      // Всегда считаем активным, так как API доступен без аккаунтов
      setStatus(prev => ({
        ...prev,
        instagram: {
          isActive: true, // Instagram использует стороннее API, всегда доступен
          activeSessions: 0,
          totalSessions: 0,
          loading: false,
        },
      }));

      // Telegram - аналогично
      try {
        const tgSessionsAll = await getTgSessions({ size: 50 });
        const authorizedTg = tgSessionsAll.items.filter(s => s.isAuthorized);
        const hasAnySessions = tgSessionsAll.totalCount > 0;
        // Суммируем запросы по всем сессиям
        const totalRequests = tgSessionsAll.items.reduce((sum, s) => sum + (s.requests || 0), 0);
        
        setStatus(prev => ({
          ...prev,
          telegram: {
            isActive: hasAnySessions,
            activeSessions: authorizedTg.length,
            totalSessions: tgSessionsAll.totalCount,
            lastReset: authorizedTg[0]?.lastReset || tgSessionsAll.items[0]?.lastReset,
            totalRequests,
            loading: false,
          },
        }));
      } catch {
        setStatus(prev => ({ ...prev, telegram: { ...prev.telegram, loading: false } }));
      }

      // YouTube
      try {
        const ytSessions = await getYtSessions({ size: 50 });
        // Суммируем квоту по всем сессиям
        const totalQuota = ytSessions.items.reduce((sum, s) => sum + (s.quota || 0), 0);
        
        setStatus(prev => ({
          ...prev,
          youtube: {
            isActive: ytSessions.totalCount > 0,
            activeSessions: ytSessions.totalCount, // Для YouTube все сессии считаются активными
            totalSessions: ytSessions.totalCount,
            lastReset: ytSessions.items[0]?.lastReset,
            totalQuota,
            loading: false,
          },
        }));
      } catch {
        setStatus(prev => ({ ...prev, youtube: { ...prev.youtube, loading: false } }));
      }

      // TikTok
      try {
        const ttSessions = await getTtSessions({ size: 50 });
        // Суммируем кредиты по всем сессиям
        const totalCredits = ttSessions.items.reduce((sum, s) => sum + (s.credits || 0), 0);
        
        setStatus(prev => ({
          ...prev,
          tiktok: {
            isActive: ttSessions.totalCount > 0,
            activeSessions: ttSessions.totalCount, // Для TikTok все сессии считаются активными
            totalSessions: ttSessions.totalCount,
            lastReset: ttSessions.items[0]?.createdAt, // TikTok использует createdAt вместо lastReset
            totalCredits,
            loading: false,
          },
        }));
      } catch {
        setStatus(prev => ({ ...prev, tiktok: { ...prev.tiktok, loading: false } }));
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Обновляем статус каждые 30 секунд
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStartParsing = async (
    platform: "instagram" | "telegram" | "youtube" | "tiktok",
    parserFunction: () => Promise<void>,
    platformName: string
  ) => {
    setLoading((prev) => ({ ...prev, [platform]: true }));

    try {
      await parserFunction();
      
      // Сохраняем время последнего запуска
      const now = new Date().toISOString();
      saveLastRunToStorage(platform, now);
      
      // Обновляем состояние
      setStatus(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          lastRun: now,
        },
      }));
      
      toast({
        title: "Успех",
        description: `Парсер ${platformName} успешно запущен`,
      });
      // Обновляем статус после запуска
      setTimeout(fetchStatus, 2000);
    } catch (error) {
      console.error(`Ошибка запуска парсера ${platformName}:`, error);
      toast({
        title: "Ошибка",
        description: `Не удалось запустить парсер ${platformName}`,
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [platform]: false }));
    }
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return "только что";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин. назад`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч. назад`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} дн. назад`;
    return date.toLocaleDateString("ru-RU");
  };

  const ParserButton = ({
    platform,
    platformName,
    icon: Icon,
    status: platformStatus,
    onStart,
    isLoading,
  }: {
    platform: "instagram" | "telegram" | "youtube" | "tiktok";
    platformName: string;
    icon: React.ComponentType<{ className?: string }>;
    status: ParserStatus;
    onStart: () => void;
    isLoading: boolean;
  }) => {
    return (
      <div className="flex flex-col gap-3">
        <Button
          onClick={onStart}
          disabled={isLoading}
          className="w-full h-auto py-6 flex flex-col items-center justify-center gap-2 relative"
          variant="outline"
        >
          <div className="absolute top-2 right-2">
            {platformStatus.isActive ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-gray-400" />
            )}
          </div>
          <Icon className="h-6 w-6" />
          <span className="font-medium">
            {isLoading ? "Запуск..." : `Запустить ${platformName}`}
          </span>
        </Button>
        <div className="flex flex-col gap-1 text-xs text-muted-foreground px-2">
          <div className="flex items-center justify-between">
            <span>Статус:</span>
            <Badge
              variant={platformStatus.isActive ? "default" : "secondary"}
              className={platformStatus.isActive ? "bg-green-100 text-green-800" : ""}
            >
              {platformStatus.isActive ? "Активен" : "Неактивен"}
            </Badge>
          </div>
          {platform === "instagram" ? (
            <>
              <div className="flex items-center justify-between">
                <span>Тип:</span>
                <span className="font-medium text-xs">Стороннее API</span>
              </div>
              {platformStatus.lastRun && (
                <div className="flex items-center justify-between">
                  <span>Последний запуск:</span>
                  <span className="font-medium">{formatTimeAgo(platformStatus.lastRun)}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span>Сессий:</span>
                <span className="font-medium">
                  {platformStatus.activeSessions > 0 
                    ? `${platformStatus.activeSessions}${platformStatus.totalSessions > platformStatus.activeSessions ? ` / ${platformStatus.totalSessions}` : ''}`
                    : platformStatus.totalSessions > 0 
                      ? `0 / ${platformStatus.totalSessions}`
                      : '0'
                  }
                </span>
              </div>
              {/* Статистика по запросам/квоте/кредитам */}
              {platform === "telegram" && platformStatus.totalRequests !== undefined && (
                <div className="flex items-center justify-between">
                  <span>Запросов:</span>
                  <span className="font-medium">{platformStatus.totalRequests.toLocaleString('ru-RU')}</span>
                </div>
              )}
              {platform === "youtube" && platformStatus.totalQuota !== undefined && (
                <div className="flex items-center justify-between">
                  <span>Запросов:</span>
                  <span className="font-medium">{platformStatus.totalQuota.toLocaleString('ru-RU')}</span>
                </div>
              )}
              {platform === "tiktok" && platformStatus.totalCredits !== undefined && (
                <div className="flex items-center justify-between">
                  <span>Кредиты:</span>
                  <span className="font-medium">{platformStatus.totalCredits.toLocaleString('ru-RU')}</span>
                </div>
              )}
              {platformStatus.lastRun && (
                <div className="flex items-center justify-between">
                  <span>Последний запуск:</span>
                  <span className="font-medium">{formatTimeAgo(platformStatus.lastRun)}</span>
                </div>
              )}
              {platformStatus.lastReset && (
                <div className="flex items-center justify-between">
                  <span>Последний сброс:</span>
                  <span className="font-medium">{formatTimeAgo(platformStatus.lastReset)}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Управление парсерами
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchStatus}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          <span>Обновить</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ParserButton
            platform="instagram"
            platformName="Instagram"
            icon={Instagram}
            status={status.instagram}
            onStart={() => handleStartParsing("instagram", startIgParsing, "Instagram")}
            isLoading={loading.instagram}
          />

          <ParserButton
            platform="telegram"
            platformName="Telegram"
            icon={MessageCircle}
            status={status.telegram}
            onStart={() => handleStartParsing("telegram", startTgParsing, "Telegram")}
            isLoading={loading.telegram}
          />

          <ParserButton
            platform="youtube"
            platformName="YouTube"
            icon={Youtube}
            status={status.youtube}
            onStart={() => handleStartParsing("youtube", startYtParsing, "YouTube")}
            isLoading={loading.youtube}
          />

          <ParserButton
            platform="tiktok"
            platformName="TikTok"
            icon={Music}
            status={status.tiktok}
            onStart={() => handleStartParsing("tiktok", startTtParsing, "TikTok")}
            isLoading={loading.tiktok}
          />
        </div>
      </CardContent>
    </Card>
  );
};
