import React from "react";
import { Button } from "@/ui-kit";
import { Badge } from "@/ui-kit";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/ui-kit";
import { 
  Trash2, 
  LogOut, 
  MoreHorizontal,
  Loader2,
  AlertCircle 
} from "lucide-react";
import { ReauthInstagramAccountDialog } from "./ReauthInstagramAccountDialog";
import { ReauthTelegramAccountDialog } from "./ReauthTelegramAccountDialog";
import type { ParserAccount, ParserPlatform } from "@/api/types";

interface ParserAccountsTableProps {
  accounts: ParserAccount[];
  platform: ParserPlatform;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onDelete?: (id: number) => void;
  onLogout?: (id: number) => void;
  onReauth?: (id: number, username: string, password: string) => Promise<void> | ((id: number, phone: string, apiHash: string, apiId: number, code: string) => Promise<void>) | ((id: number, phoneOrUsername: string, apiHashOrPassword: string, apiId?: number, code?: string) => Promise<void>);
  totalCount?: number;
}

export const ParserAccountsTable: React.FC<ParserAccountsTableProps> = ({
  accounts,
  platform,
  loading = false,
  hasMore = false,
  onLoadMore,
  onDelete,
  onLogout,
  onReauth,
  totalCount = 0,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        return "только что";
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} мин. назад`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} ч. назад`;
      } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} дн. назад`;
      } else {
        return date.toLocaleDateString("ru-RU");
      }
    } catch {
      return "неизвестно";
    }
  };

  const formatRequests = (requests?: number | null) => {
    if (requests === undefined || requests === null) return "-";
    return requests.toLocaleString("ru-RU");
  };

  const getStatusBadge = (isAuthorized: boolean) => {
    return (
      <Badge 
        variant={isAuthorized ? "default" : "destructive"}
        className={isAuthorized ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
      >
        {isAuthorized ? "Активен" : "Неактивен"}
      </Badge>
    );
  };

  const getPlatformIcon = (platform: ParserPlatform) => {
    switch (platform) {
      case "INSTAGRAM":
        return "📸";
      case "TELEGRAM":
        return "✈️";
      case "YOUTUBE":
        return "📺";
      case "TIKTOK":
        return "🎵";
      default:
        return "🔗";
    }
  };

  const getPlatformName = (platform: ParserPlatform) => {
    switch (platform) {
      case "INSTAGRAM":
        return "Instagram";
      case "TELEGRAM":
        return "Telegram";
      case "YOUTUBE":
        return "YouTube";
      case "TIKTOK":
        return "TikTok";
      default:
        return platform;
    }
  };

  if (loading && accounts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Загрузка аккаунтов...</span>
        </div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Аккаунты не найдены
        </h3>
        <p className="text-muted-foreground">
          {platform === "INSTAGRAM" 
            ? "Добавьте Instagram аккаунты для парсинга данных"
            : platform === "TELEGRAM"
            ? "Добавьте Telegram аккаунты для парсинга данных"
            : "Аккаунты для этой платформы пока недоступны"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with count */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-xl sm:text-2xl">{getPlatformIcon(platform)}</span>
          <h3 className="text-base sm:text-lg font-semibold">
            {getPlatformName(platform)} аккаунты
          </h3>
          <Badge variant="outline" className="text-xs">
            {totalCount} аккаунтов
          </Badge>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">ID</TableHead>
              <TableHead>
                {platform === "INSTAGRAM" ? "Username" : "Телефон"}
              </TableHead>
              <TableHead>Статус</TableHead>
              {platform === "INSTAGRAM" && (
                <>
                  <TableHead className="text-center">Запросы</TableHead>
                  <TableHead>Последний сброс</TableHead>
                </>
              )}
              <TableHead>Создан</TableHead>
              <TableHead className="w-24">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-mono text-sm">
                  {account.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {platform === "INSTAGRAM" ? `@${account.identifier}` : account.identifier}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(account.isAuthorized)}
                </TableCell>
                {platform === "INSTAGRAM" && (
                  <>
                    <TableCell className="text-center font-mono">
                      {formatRequests(account.requests)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {account.lastReset ? formatDate(account.lastReset) : "-"}
                    </TableCell>
                  </>
                )}
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(account.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {platform === "INSTAGRAM" && !account.isAuthorized && onReauth && (
                      <ReauthInstagramAccountDialog
                        accountId={account.id}
                        username={account.identifier}
                        onReauth={onReauth as (id: number, username: string, password: string) => Promise<void>}
                        disabled={loading}
                      />
                    )}
                    {platform === "TELEGRAM" && !account.isAuthorized && onReauth && (
                      <ReauthTelegramAccountDialog
                        accountId={account.id}
                        phone={account.identifier}
                        onReauth={onReauth as (id: number, phone: string, code: string) => Promise<void>}
                        disabled={loading}
                      />
                    )}
                    {(platform === "INSTAGRAM" || platform === "TELEGRAM") && onLogout && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onLogout(account.id)}
                        disabled={!account.isAuthorized}
                        className="h-8 w-8 p-0"
                        title="Отключить аккаунт"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(account.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Удалить аккаунт"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {accounts.map((account) => (
          <div key={account.id} className="bg-white border rounded-lg p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getPlatformIcon(platform)}</span>
                <div>
                  <div className="font-medium text-sm">
                    {platform === "INSTAGRAM" ? `@${account.identifier}` : account.identifier}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    ID: {account.id}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {platform === "INSTAGRAM" && !account.isAuthorized && onReauth && (
                  <ReauthInstagramAccountDialog
                    accountId={account.id}
                    username={account.identifier}
                    onReauth={onReauth as (id: number, username: string, password: string) => Promise<void>}
                    disabled={loading}
                  />
                )}
                {platform === "TELEGRAM" && !account.isAuthorized && onReauth && (
                  <ReauthTelegramAccountDialog
                    accountId={account.id}
                    phone={account.identifier}
                    onReauth={onReauth as (id: number, phone: string, apiHash: string, apiId: number, code: string) => Promise<void>}
                    disabled={loading}
                  />
                )}
                {(platform === "INSTAGRAM" || platform === "TELEGRAM") && onLogout && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLogout(account.id)}
                    disabled={!account.isAuthorized}
                    className="h-8 w-8 p-0"
                    title="Отключить аккаунт"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(account.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Удалить аккаунт"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Статус:</span>
              {getStatusBadge(account.isAuthorized)}
            </div>

            {/* Instagram specific fields */}
            {platform === "INSTAGRAM" && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Запросы:</span>
                  <span className="font-mono text-sm">{formatRequests(account.requests)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Последний сброс:</span>
                  <span className="text-sm">{account.lastReset ? formatDate(account.lastReset) : "-"}</span>
                </div>
              </>
            )}

            {/* Created date */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Создан:</span>
              <span className="text-sm">{formatDate(account.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            className="min-w-32"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Загрузка...
              </>
            ) : (
              "Загрузить еще"
            )}
          </Button>
        </div>
      )}

      {/* Footer info */}
      <div className="text-sm text-muted-foreground text-center">
        Показано {accounts.length} из {totalCount} аккаунтов
      </div>
    </div>
  );
};
