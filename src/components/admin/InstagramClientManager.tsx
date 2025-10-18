// ============================================
// Instagram Client Management Component
// ============================================
// Компонент для управления Instagram клиентом
// Используется админами для настройки Instagram аккаунтов
// ============================================

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Alert,
  AlertDescription,
} from "@/ui-kit";
import {
  Instagram,
  User,
  Key,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useInstagramClient } from "@/hooks/admin/useInstagramClient";

interface InstagramClientManagerProps {
  className?: string;
}

export const InstagramClientManager: React.FC<InstagramClientManagerProps> = ({
  className,
}) => {
  const { loading, error, isAuthorized, login, clearError, reset } =
    useInstagramClient();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      return;
    }

    try {
      await login({
        username: username.trim(),
        password: password.trim(),
      });

      if (isAuthorized) {
        // Успешная авторизация
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      // Ошибка обрабатывается в хуке
    }
  };

  const handleReset = () => {
    reset();
    setUsername("");
    setPassword("");
    clearError();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Instagram className="w-5 h-5 text-pink-500" />
          <span>Instagram Клиент</span>
        </CardTitle>
        <CardDescription>
          Настройка Instagram аккаунта для парсинга данных
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Статус */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Авторизация:</span>
            {isAuthorized ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>

        {/* Ошибка */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Форма логина */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Имя пользователя</Label>
            <Input
              id="username"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={loading || !username || !password}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Авторизация...
                </>
              ) : (
                "Авторизовать"
              )}
            </Button>

            {isAuthorized && (
              <Button type="button" variant="outline" onClick={handleReset}>
                Сбросить
              </Button>
            )}
          </div>
        </form>

        {/* Успешное завершение */}
        {isAuthorized && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Instagram аккаунт успешно настроен и готов к использованию!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
