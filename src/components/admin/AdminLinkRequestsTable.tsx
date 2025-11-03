import { useState, useRef, useEffect } from "react";
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
import { formatSubscribers } from "@/utils/formatters";
import { formatNumber } from "@/utils/formatters";
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

interface HoldButtonProps {
  children: React.ReactNode;
  onAction: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
  className?: string;
  size?: "sm" | "default" | "lg";
  holdDuration?: number;
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
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const stopHold = () => {
    setProgress(0);
    startTimeRef.current = null;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const updateProgress = () => {
    if (!startTimeRef.current) return;
    const elapsed = Date.now() - startTimeRef.current;
    const progressPercent = Math.min((elapsed / holdDuration) * 100, 100);
    setProgress(progressPercent);

    if (elapsed >= holdDuration) {
      onAction();
      stopHold();
    } else {
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const startHold = () => {
    if (disabled) return;
    startTimeRef.current = Date.now();
    animationRef.current = requestAnimationFrame(updateProgress);
  };

  useEffect(() => () => animationRef.current && cancelAnimationFrame(animationRef.current), []);

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
      {progress > 0 && (
        <div className="absolute inset-0 bg-white/20" style={{ width: `${progress}%`, transition: "width 0ms linear" }} />
      )}
    </Button>
  );
};

const AdminLinkRequestsTableComponent = ({
  requests,
  loading = false,
  isProcessing = false,
  onApprove,
  onReject,
}: AdminLinkRequestsTableProps) => {
  const { toast } = useToast();

  const handleRequest = async (requestId: number, bloggerName: string, action: "approve" | "reject") => {
    const handler = action === "approve" ? onApprove : onReject;
    if (!handler) return;

    try {
      await handler(requestId);
      toast({
        title: action === "approve" ? "Запрос одобрен" : "Запрос отклонён",
        description: action === "approve" ? `Блогер ${bloggerName} успешно верифицирован` : `Запрос от блогера ${bloggerName} отклонён`,
      });
    } catch (error) {
      const isAuthError = error instanceof APIError && error.isAuthError();
      toast({
        title: isAuthError ? "Ошибка авторизации" : `Ошибка при ${action === "approve" ? "одобрении" : "отклонении"} запроса`,
        description: isAuthError ? "Сессия истекла. Необходимо войти в админку заново." : (error instanceof Error ? error.message : "Произошла неизвестная ошибка"),
        variant: "destructive",
      });
    }
  };

  const renderRequest = (request: LinkRequest, index: number, isMobile: boolean = false) => {
    const name = [request.name, request.lastName].filter(Boolean).join(" ");
    const subscribers = request.social_accounts?.[0]?.subscribers
      ? formatSubscribers(request.social_accounts[0].subscribers)
      : formatNumber(request.followers);

    if (isMobile) {
      return (
        <div key={request.id} className="bg-card rounded-lg border p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-start space-x-3 mb-3">
            <SafeAvatar
              src={request.social_accounts?.[0]?.avatarUrl || null}
              alt={`Аватар ${request.name}`}
              className="w-12 h-12 flex-shrink-0 aspect-square"
              username={request.username}
              gender="MALE"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground">{name}</div>
              <div className="text-sm text-muted-foreground">@{request.username}</div>
              {request.user_email && <div className="text-xs text-muted-foreground">{request.user_email}</div>}
            </div>
          </div>
          <div className="space-y-3 text-xs mb-4">
            <div className="space-y-1">
              <div className="text-muted-foreground">Подписчиков</div>
              <div className="font-medium text-sm">{subscribers}</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <HoldButton
              size="sm"
              variant="default"
              onAction={() => handleRequest(request.request_id, request.name, "approve")}
              disabled={isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              holdDuration={1000}
            >
              ✓ Одобрить
            </HoldButton>
            <HoldButton
              size="sm"
              variant="destructive"
              onAction={() => handleRequest(request.request_id, request.name, "reject")}
              disabled={isProcessing}
              className="flex-1"
              holdDuration={1000}
            >
              ✗ Отклонить
            </HoldButton>
          </div>
        </div>
      );
    }

    return (
      <TableRow key={request.id}>
        <TableCell className="text-center font-medium">{index + 1}</TableCell>
        <TableCell>
          <div className="flex items-center space-x-3">
            <SafeAvatar
              src={request.social_accounts?.[0]?.avatarUrl || null}
              alt={`Аватар ${request.name}`}
              className="w-10 h-10 aspect-square"
              username={request.username}
              gender="MALE"
            />
            <div>
              <div className="font-medium text-foreground">{name}</div>
              <div className="text-sm text-muted-foreground">@{request.username}</div>
              {request.user_email && <div className="text-xs text-muted-foreground">{request.user_email}</div>}
            </div>
          </div>
        </TableCell>
        <TableCell className="text-center">
          <div className="font-medium">{subscribers}</div>
          <div className="text-xs text-muted-foreground">подписчиков</div>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <HoldButton
              size="sm"
              variant="default"
              onAction={() => handleRequest(request.request_id, request.name, "approve")}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white"
              holdDuration={1000}
            >
              ✓ Одобрить
            </HoldButton>
            <HoldButton
              size="sm"
              variant="destructive"
              onAction={() => handleRequest(request.request_id, request.name, "reject")}
              disabled={isProcessing}
              holdDuration={1000}
            >
              ✗ Отклонить
            </HoldButton>
          </div>
        </TableCell>
      </TableRow>
    );
  };


  return (
    <>
      <div className="hidden md:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">№</TableHead>
              <TableHead className="min-w-[250px]">Блогер</TableHead>
              <TableHead className="text-center min-w-[120px]">Подписчиков</TableHead>
              <TableHead className="text-center min-w-[200px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-muted-foreground">Загрузка запросов...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Запросы на связывание не найдены
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request, index) => renderRequest(request, index, false))
            )}
          </TableBody>
        </Table>
        <div className="text-center text-sm text-muted-foreground mt-2 p-2">
          Показано {requests.length} запросов на связывание
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground">Загрузка запросов...</span>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Запросы на связывание не найдены
          </div>
        ) : (
          requests.map((request, index) => renderRequest(request, index, true))
        )}
      </div>
    </>
  );
};

export const AdminLinkRequestsTable = AdminLinkRequestsTableComponent;
