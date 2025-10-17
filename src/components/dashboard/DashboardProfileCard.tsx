import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui-kit';
import { Label } from '@/ui-kit';
import { Badge } from '@/ui-kit';
import { ClientBloggerInfo, ClientLinkRequestInfo, formatLinkRequestStatus } from '@/api/types';

interface DashboardProfileCardProps {
  userBlogger: ClientBloggerInfo | null;
  userEmail: string | undefined;
  lastLinkRequest: ClientLinkRequestInfo | null; // НОВОЕ ПОЛЕ
}

export const DashboardProfileCard = ({
  userBlogger,
  userEmail,
  lastLinkRequest,
}: DashboardProfileCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Информация профиля</CardTitle>
        <CardDescription>Основная информация о вашем аккаунте</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Email</Label>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
          <div>
            <Label>Полное имя</Label>
            <p className="text-sm text-muted-foreground">
              {userBlogger
                ? `${userBlogger.name || ''} ${userBlogger.lastName || ''}`.trim() || 'Не указано'
                : 'Не указано'}
            </p>
          </div>
          <div>
            <Label>Статус верификации</Label>
            <p className="text-sm text-muted-foreground">
              {userBlogger?.verificationStatus === 'APPROVED'
                ? 'Одобрен'
                : userBlogger?.verificationStatus === 'MODERATION'
                  ? 'На рассмотрении'
                  : userBlogger?.verificationStatus === 'REJECTED'
                    ? 'Отклонен'
                    : 'Не указано'}
            </p>
          </div>

          {/* НОВОЕ ПОЛЕ: Статус последнего запроса на связывание */}
          <div>
            <Label>Последний запрос на связывание</Label>
            {lastLinkRequest ? (
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    lastLinkRequest.status === 'APPROVED'
                      ? 'default'
                      : lastLinkRequest.status === 'REJECTED'
                        ? 'destructive'
                        : 'secondary'
                  }
                  className={
                    lastLinkRequest.status === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : lastLinkRequest.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {formatLinkRequestStatus(lastLinkRequest.status).label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(lastLinkRequest.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Нет запросов</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
