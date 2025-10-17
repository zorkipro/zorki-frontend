// ============================================
// Telegram Client Management Component
// ============================================
// Компонент для управления Telegram клиентом
// Используется админами для настройки Telegram аккаунтов
// ============================================

import React, { useState } from 'react';
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
} from '@/ui-kit';
import { MessageSquare, Phone, Key, Hash, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useTelegramClient } from '@/hooks/admin/useTelegramClient';

interface TelegramClientManagerProps {
  className?: string;
}

export const TelegramClientManager: React.FC<TelegramClientManagerProps> = ({ className }) => {
  const { loading, error, isAuthorized, isVerify, login, confirm, clearError, reset } =
    useTelegramClient();

  const [step, setStep] = useState<'login' | 'confirm'>('login');
  const [phone, setPhone] = useState('');
  const [apiHash, setApiHash] = useState('');
  const [apiId, setApiId] = useState('');
  const [code, setCode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || !apiHash || !apiId) {
      return;
    }

    try {
      await login({
        phone: phone.trim(),
        apiHash: apiHash.trim(),
        apiId: parseInt(apiId, 10),
      });

      if (isAuthorized && !isVerify) {
        setStep('confirm');
      }
    } catch (error) {
      // Ошибка обрабатывается в хуке
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) {
      return;
    }

    try {
      await confirm({
        phone: phone.trim(),
        code: code.trim(),
      });

      if (isAuthorized && isVerify) {
        // Успешное подтверждение
        setStep('login');
        reset();
        setPhone('');
        setApiHash('');
        setApiId('');
        setCode('');
      }
    } catch (error) {
      // Ошибка обрабатывается в хуке
    }
  };

  const handleReset = () => {
    reset();
    setStep('login');
    setPhone('');
    setApiHash('');
    setApiId('');
    setCode('');
    clearError();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <span>Telegram Клиент</span>
        </CardTitle>
        <CardDescription>Настройка Telegram аккаунта для парсинга данных</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Статус */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Авторизация:</span>
            {isAuthorized ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Подтверждение:</span>
            {isVerify ? (
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
        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Номер телефона</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiHash">API Hash</Label>
              <Input
                id="apiHash"
                type="text"
                placeholder="32-символьный API Hash"
                value={apiHash}
                onChange={(e) => setApiHash(e.target.value)}
                disabled={loading}
                required
                minLength={32}
                maxLength={32}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiId">API ID</Label>
              <Input
                id="apiId"
                type="number"
                placeholder="123456789"
                value={apiId}
                onChange={(e) => setApiId(e.target.value)}
                disabled={loading}
                required
                min={100000}
                max={999999999}
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={loading || !phone || !apiHash || !apiId}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Авторизация...
                  </>
                ) : (
                  'Авторизовать'
                )}
              </Button>

              {(isAuthorized || isVerify) && (
                <Button type="button" variant="outline" onClick={handleReset}>
                  Сбросить
                </Button>
              )}
            </div>
          </form>
        )}

        {/* Форма подтверждения */}
        {step === 'confirm' && (
          <form onSubmit={handleConfirm} className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                SMS код отправлен на номер {phone}. Введите код для подтверждения.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="code">Код подтверждения</Label>
              <Input
                id="code"
                type="text"
                placeholder="12345"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={loading}
                required
                maxLength={15}
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={loading || !code}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Подтверждение...
                  </>
                ) : (
                  'Подтвердить'
                )}
              </Button>

              <Button type="button" variant="outline" onClick={() => setStep('login')}>
                Назад
              </Button>
            </div>
          </form>
        )}

        {/* Успешное завершение */}
        {isAuthorized && isVerify && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Telegram аккаунт успешно настроен и готов к использованию!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
