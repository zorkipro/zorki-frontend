import { memo, useCallback, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui-kit";
import { Button } from "@/ui-kit";
import { SafeAvatar } from "@/components/ui/SafeAvatar";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { formatSubscribers } from "@/utils/formatters";
import { logger } from "@/utils/logger";
import { APIError } from "@/api/client";

interface LinkRequest {
  id: string;
  name: string;
  lastName: string;
  username: string;
  followers: number;
  verification_status: string;
  visibility_status: string;
  linked_user_id: string;
  has_drafts: boolean;
  request_id: number;
  request_created_at: string;
  user_email: string | null;
  status: string;
  social_accounts: Array<{
    id: number;
    type: string;
    title: string | null;
    avatarUrl: string | null;
    username: string;
    externalId: string | null;
    subscribers: string | null; // НОВОЕ ПОЛЕ
  }>;
  social: {
    username: string;
    type: string;
    avatar: string | null;
  } | null;
}

interface AdminLinkRequestsTableProps {
  requests: LinkRequest[];
  loading?: boolean;
  isProcessing?: boolean;
  onApprove?: (requestId: number) => Promise<void>;
  onReject?: (requestId: number) => Promise<void>;
}

import { formatNumber } from "@/utils/formatters";

// Компонент кнопки с удержанием
interface HoldButtonProps {
  children: React.ReactNode;
  onAction: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
  className?: string;
  size?: "sm" | "default" | "lg";
  holdDuration?: number; // в миллисекундах
}

const HoldButton: React.FC<HoldButtonProps> = ({
  children,
  onAction,
  disabled = false,
  variant = "default",
  className = "",
  size = "sm",
  holdDuration = 1000,
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    if (startTimeRef.current) {
      const elapsed = Date.now() - startTimeRef.current;
      const progressPercent = Math.min((elapsed / holdDuration) * 100, 100);
      setProgress(progressPercent);

      // Отладочная информация
      if (elapsed % 500 < 16) {
        // Логируем каждые ~500мс
      }

      if (elapsed >= holdDuration) {
        onAction();
        stopHold();
      } else {
        animationRef.current = requestAnimationFrame(updateProgress);
      }
    }
  }, [holdDuration, onAction]);

  const startHold = useCallback(() => {
    if (disabled || isHolding) return;

    setIsHolding(true);
    setProgress(0);
    startTimeRef.current = Date.now();

    animationRef.current = requestAnimationFrame(updateProgress);
  }, [disabled, isHolding, updateProgress, holdDuration]);

  const stopHold = useCallback(() => {
    setIsHolding(false);
    setProgress(0);
    startTimeRef.current = null;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <Button
      size={size}
      variant={variant}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
      onMouseDown={startHold}
      onMouseUp={stopHold}
      onMouseLeave={stopHold}
      onTouchStart={startHold}
      onTouchEnd={stopHold}
    >
      <div className="relative z-10">{children}</div>
      {isHolding && (
        <div
          className="absolute inset-0 bg-white/20 transition-all duration-75 ease-out"
          style={{
            width: `${progress}%`,
            transition: "width 0ms linear",
          }}
        />
      )}
    </Button>
  );
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AdminLinkRequestsTableComponent = ({
  requests,
  loading = false,
  isProcessing = false,
  onApprove,
  onReject,
}: AdminLinkRequestsTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { adminSignOut } = useAdminAuth();

  const handleApprove = useCallback(
    async (requestId: number, bloggerName: string) => {
      if (!onApprove) {
        logger.error("onApprove function is not provided", undefined, {
          component: "AdminLinkRequestsTable",
          requestId: requestId.toString(),
        });
        return;
      }

      try {
        await onApprove(requestId);
        toast({
          title: "Запрос одобрен",
          description: `Блогер ${bloggerName} успешно верифицирован`,
          variant: "default",
        });
      } catch (error) {
        logger.error("Ошибка при одобрении запроса", error, {
          component: "AdminLinkRequestsTable",
          requestId: requestId.toString(),
        });

        // Проверяем, является ли это ошибкой авторизации
        if (error instanceof APIError && error.isAuthError()) {
          toast({
            title: "❌ Ошибка авторизации",
            description: "Сессия истекла. Необходимо войти в админку заново.",
            variant: "destructive",
          });
          // Не вызываем adminSignOut() автоматически, пусть пользователь сам решит
          return;
        }

        // Для других ошибок показываем общее сообщение
        toast({
          title: "❌ Ошибка при одобрении запроса",
          description:
            error instanceof APIError
              ? error.message
              : error instanceof Error
                ? error.message
                : "Произошла неизвестная ошибка",
          variant: "destructive",
        });
      }
    },
    [onApprove, toast, adminSignOut],
  );

  const handleReject = useCallback(
    async (requestId: number, bloggerName: string) => {
      if (!onReject) {
        logger.error("onReject function is not provided", undefined, {
          component: "AdminLinkRequestsTable",
          requestId: requestId.toString(),
        });
        return;
      }

      try {
        await onReject(requestId);
        toast({
          title: "Запрос отклонён",
          description: `Запрос от блогера ${bloggerName} отклонён`,
          variant: "default",
        });
      } catch (error) {
        logger.error("Ошибка при отклонении запроса", error, {
          component: "AdminLinkRequestsTable",
          requestId: requestId.toString(),
        });

        // Проверяем, является ли это ошибкой авторизации
        if (error instanceof APIError && error.isAuthError()) {
          toast({
            title: "❌ Ошибка авторизации",
            description: "Сессия истекла. Необходимо войти в админку заново.",
            variant: "destructive",
          });
          // Не вызываем adminSignOut() автоматически, пусть пользователь сам решит
          return;
        }

        // Для других ошибок показываем общее сообщение
        toast({
          title: "❌ Ошибка при отклонении запроса",
          description:
            error instanceof APIError
              ? error.message
              : error instanceof Error
                ? error.message
                : "Произошла неизвестная ошибка",
          variant: "destructive",
        });
      }
    },
    [onReject, toast, adminSignOut],
  );

  const renderDesktopRow = useCallback(
    (request: LinkRequest, index: number) => (
      <TableRow key={request.id}>
        <TableCell className="text-center font-medium">{index + 1}</TableCell>
        <TableCell>
          <div className="flex items-center space-x-3">
            <SafeAvatar
              src={request.social?.avatar || null}
              alt={`Аватар ${request.name}`}
              className="w-10 h-10 aspect-square"
              username={request.username}
              gender="MALE"
            />
            <div>
              <div className="font-medium text-foreground">
                {[request.name, request.lastName].filter(Boolean).join(" ")}
              </div>
              <div className="text-sm text-muted-foreground">
                @{request.username}
              </div>
              {request.user_email && (
                <div className="text-xs text-muted-foreground">
                  {request.user_email}
                </div>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell className="text-center">
          <div className="font-medium">
            {request.social_accounts?.[0]?.subscribers
              ? formatSubscribers(request.social_accounts[0].subscribers)
              : formatNumber(request.followers)}
          </div>
          <div className="text-xs text-muted-foreground">подписчиков</div>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <HoldButton
              size="sm"
              variant="default"
              onAction={() => handleApprove(request.request_id, request.name)}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white"
              holdDuration={1000}
            >
              ✓ Одобрить
            </HoldButton>
            <HoldButton
              size="sm"
              variant="destructive"
              onAction={() => handleReject(request.request_id, request.name)}
              disabled={isProcessing}
              holdDuration={1000}
            >
              ✗ Отклонить
            </HoldButton>
          </div>
        </TableCell>
      </TableRow>
    ),
    [handleApprove, handleReject, isProcessing],
  );

  const renderMobileCard = useCallback(
    (request: LinkRequest, index: number) => (
      <div
        key={request.id}
        className="bg-card rounded-lg border p-4 hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-start space-x-3 mb-3">
          <SafeAvatar
            src={request.social?.avatar || null}
            alt={`Аватар ${request.name}`}
            className="w-12 h-12 flex-shrink-0 aspect-square"
            username={request.username}
            gender="MALE"
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-foreground">
              {[request.name, request.lastName].filter(Boolean).join(" ")}
            </div>
            <div className="text-sm text-muted-foreground">
              @{request.username}
            </div>
            {request.user_email && (
              <div className="text-xs text-muted-foreground">
                {request.user_email}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 text-xs mb-4">
          <div className="space-y-1">
            <div className="text-muted-foreground">Подписчиков</div>
            <div className="font-medium text-sm">
              {request.social_accounts?.[0]?.subscribers
                ? formatSubscribers(request.social_accounts[0].subscribers)
                : formatNumber(request.followers)}
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <HoldButton
            size="sm"
            variant="default"
            onAction={() => handleApprove(request.request_id, request.name)}
            disabled={isProcessing}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            holdDuration={1000}
          >
            ✓ Одобрить
          </HoldButton>
          <HoldButton
            size="sm"
            variant="destructive"
            onAction={() => handleReject(request.request_id, request.name)}
            disabled={isProcessing}
            className="flex-1"
            holdDuration={1000}
          >
            ✗ Отклонить
          </HoldButton>
        </div>
      </div>
    ),
    [handleApprove, handleReject, isProcessing],
  );

  return (
    <>
      {/* Desktop Table */}
      <div
        className="hidden md:block border rounded-lg"
        role="region"
        aria-label="Таблица запросов"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">№</TableHead>
              <TableHead className="min-w-[250px]">Блогер</TableHead>
              <TableHead className="text-center min-w-[120px]">
                Подписчиков
              </TableHead>
              <TableHead className="text-center min-w-[200px]">
                Действия
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-muted-foreground">
                      Загрузка запросов...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="text-muted-foreground">
                    Запросы на связывание не найдены
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request, index) => renderDesktopRow(request, index))
            )}
          </TableBody>
        </Table>

        {/* Info */}
        <div className="text-center text-sm text-muted-foreground mt-2 p-2">
          Показано {requests.length} запросов на связывание
        </div>
      </div>

      {/* Mobile Cards */}
      <div
        className="md:hidden space-y-4"
        role="region"
        aria-label="Карточки запросов на связывание"
      >
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground">
                Загрузка запросов...
              </span>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Запросы на связывание не найдены
          </div>
        ) : (
          requests.map((request, index) => renderMobileCard(request, index))
        )}
      </div>
    </>
  );
};

export const AdminLinkRequestsTable = memo(AdminLinkRequestsTableComponent);
