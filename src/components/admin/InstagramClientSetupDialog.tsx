import React, { useState } from 'react';
import { Button } from '@/ui-kit';
import { Input } from '@/ui-kit';
import { Label } from '@/ui-kit';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui-kit';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { useInstagramClientManager } from '@/hooks/admin/useInstagramClientManager';

interface InstagramClientSetupDialogProps {
  onSuccess?: () => void;
}

export const InstagramClientSetupDialog: React.FC<InstagramClientSetupDialogProps> = ({
  onSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { loginInstagramClient, isLoading } = useInstagramClientManager();

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      return;
    }

    const success = await loginInstagramClient({
      username: username.trim(),
      password: password.trim(),
    });

    if (success) {
      setIsOpen(false);
      setUsername('');
      setPassword('');
      onSuccess?.();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Настроить Instagram
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Настройка Instagram клиента</DialogTitle>
          <DialogDescription>
            Введите учетные данные Instagram аккаунта для парсинга данных блогеров
          </DialogDescription>
        </DialogHeader>

        {!isLoading ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="ig_username">Instagram Username</Label>
              <Input
                id="ig_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_instagram_username"
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="ig_password">Instagram Password</Label>
              <div className="relative">
                <Input
                  id="ig_password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-sm text-yellow-800">
                <strong>Важно:</strong> Используйте отдельный Instagram аккаунт для парсинга данных.
                Не используйте свой основной аккаунт.
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setUsername('');
                  setPassword('');
                }}
              >
                Отмена
              </Button>
              <Button onClick={handleSubmit} disabled={!username.trim() || !password.trim()}>
                Настроить
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">Настройка Instagram клиента</p>
                <p className="text-sm text-muted-foreground">
                  Это может занять несколько секунд...
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
