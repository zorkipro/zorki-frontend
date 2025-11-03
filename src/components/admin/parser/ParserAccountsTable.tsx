import React from "react";
import { Button } from "@/ui-kit";
import { Badge } from "@/ui-kit";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui-kit";
import { Trash2, LogOut, Loader2, AlertCircle } from "lucide-react";
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
  onReauth?: (id: number, username: string, password: string) => Promise<void> | ((id: number, phone: string, code: string) => Promise<void>);
  totalCount?: number;
}

interface AccountActionsProps {
  account: ParserAccount;
  platform: ParserPlatform;
  loading: boolean;
  onDelete?: (id: number) => void;
  onLogout?: (id: number) => void;
  onReauth?: (id: number, ...args: any[]) => Promise<void>;
}

const AccountActions: React.FC<AccountActionsProps> = ({ account, platform, loading, onDelete, onLogout, onReauth }) => {
  const isIg = platform === "INSTAGRAM";
  const isTg = platform === "TELEGRAM";
  const supportsAuth = isIg || isTg;
  const needsReauth = !account.isAuthorized && onReauth;

  return (
    <div className="flex items-center space-x-1">
      {isIg && needsReauth && (
        <ReauthInstagramAccountDialog
          accountId={account.id}
          username={account.identifier}
          onReauth={onReauth as (id: number, username: string, password: string) => Promise<void>}
          disabled={loading}
        />
      )}
      {isTg && needsReauth && (
        <ReauthTelegramAccountDialog
          accountId={account.id}
          phone={account.identifier}
          onReauth={onReauth as (id: number, phone: string, code: string) => Promise<void>}
          disabled={loading}
        />
      )}
      {supportsAuth && onLogout && (
        <Button variant="ghost" size="sm" onClick={() => onLogout(account.id)} disabled={!account.isAuthorized} className="h-8 w-8 p-0" title="Отключить аккаунт">
          <LogOut className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button variant="ghost" size="sm" onClick={() => onDelete(account.id)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" title="Удалить аккаунт">
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

const PLATFORM_INFO = {
  INSTAGRAM: { icon: "📸", name: "Instagram", label: "Username", isInstagram: true },
  TELEGRAM: { icon: "✈️", name: "Telegram", label: "Телефон", isInstagram: false },
  YOUTUBE: { icon: "📺", name: "YouTube", label: "Телефон", isInstagram: false },
  TIKTOK: { icon: "🎵", name: "TikTok", label: "Телефон", isInstagram: false },
} as const;

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
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return "только что";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин. назад`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч. назад`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} дн. назад`;
    return date.toLocaleDateString("ru-RU");
  };

  const formatRequests = (requests?: number | null) => requests?.toLocaleString("ru-RU") ?? "-";
  const getStatusBadge = (isAuthorized: boolean) => (
    <Badge variant={isAuthorized ? "default" : "destructive"} className={isAuthorized ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
      {isAuthorized ? "Активен" : "Неактивен"}
    </Badge>
  );

  const platformInfo = PLATFORM_INFO[platform] || { icon: "🔗", name: platform, label: "Идентификатор", isInstagram: false };
  const isInstagram = platform === "INSTAGRAM";
  const canAddAccounts = platform === "INSTAGRAM" || platform === "TELEGRAM";

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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Аккаунты не найдены</h3>
        <p className="text-muted-foreground">
          {canAddAccounts ? `Добавьте ${platformInfo.name} аккаунты для парсинга данных` : "Аккаунты для этой платформы пока недоступны"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with count */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-xl sm:text-2xl">{platformInfo.icon}</span>
          <h3 className="text-base sm:text-lg font-semibold">{platformInfo.name} аккаунты</h3>
          <Badge variant="outline" className="text-xs">{totalCount} аккаунтов</Badge>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">ID</TableHead>
              <TableHead>{platformInfo.label}</TableHead>
              <TableHead>Статус</TableHead>
              {isInstagram && (
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
                <TableCell className="font-mono text-sm">{account.id}</TableCell>
                <TableCell><span className="font-medium">{isInstagram ? `@${account.identifier}` : account.identifier}</span></TableCell>
                <TableCell>{getStatusBadge(account.isAuthorized)}</TableCell>
                {isInstagram && (
                  <>
                    <TableCell className="text-center font-mono">{formatRequests(account.requests)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{account.lastReset ? formatDate(account.lastReset) : "-"}</TableCell>
                  </>
                )}
                <TableCell className="text-sm text-muted-foreground">{formatDate(account.createdAt)}</TableCell>
                <TableCell>
                  <AccountActions account={account} platform={platform} loading={loading} onDelete={onDelete} onLogout={onLogout} onReauth={onReauth} />
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{platformInfo.icon}</span>
                <div>
                  <div className="font-medium text-sm">{isInstagram ? `@${account.identifier}` : account.identifier}</div>
                  <div className="text-xs text-muted-foreground font-mono">ID: {account.id}</div>
                </div>
              </div>
              <AccountActions account={account} platform={platform} loading={loading} onDelete={onDelete} onLogout={onLogout} onReauth={onReauth} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Статус:</span>
              {getStatusBadge(account.isAuthorized)}
            </div>
            {isInstagram && (
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
