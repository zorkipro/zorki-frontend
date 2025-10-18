import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui-kit";
import { Button } from "@/ui-kit";
import { Link } from "react-router-dom";
import { Instagram, Edit } from "lucide-react";
import { ClientBloggerInfo } from "@/api/types";

interface DashboardPlatformCardProps {
  userBlogger: ClientBloggerInfo | null;
  displayName: string;
  profileStatusInfo: {
    color: string;
    text: string;
  } | null;
}

export const DashboardPlatformCard = ({
  userBlogger,
  displayName,
  profileStatusInfo,
}: DashboardPlatformCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление профилем</CardTitle>
        <CardDescription>Ваш Instagram профиль и метрики</CardDescription>
      </CardHeader>
      <CardContent>
        {userBlogger ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Instagram className="w-8 h-8 text-pink-500" />
                <div>
                  <h3 className="font-semibold">{displayName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Статус:{" "}
                    {userBlogger.verificationStatus === "APPROVED"
                      ? "Одобрен"
                      : userBlogger.verificationStatus === "PENDING"
                        ? "На рассмотрении"
                        : userBlogger.verificationStatus === "REJECTED"
                          ? "Отклонен"
                          : "Неизвестно"}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${profileStatusInfo?.color}`}
                    ></div>
                    <span className="text-xs text-muted-foreground">
                      {profileStatusInfo?.text}
                    </span>
                  </div>
                </div>
              </div>
              <Link to="/profile-setup">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Настроить профиль
                </Button>
              </Link>
            </div>

            {userBlogger.verificationStatus === "PENDING" && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">
                  Требуется верификация
                </h4>
                <p className="text-sm text-yellow-700">
                  Отредактируйте ваш профиль и следуйте инструкциям для
                  верификации.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Добавьте свой Instagram username для начала работы.
            </p>
            <Link to="/profile-setup">
              <Button>
                <Instagram className="w-4 h-4 mr-2" />
                Добавить Instagram
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
