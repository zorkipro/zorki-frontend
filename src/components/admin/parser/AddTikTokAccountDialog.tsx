import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/ui-kit";
import { Input } from "@/ui-kit";
import { Label } from "@/ui-kit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui-kit";
import { Plus, Loader2 } from "lucide-react";
import type { ParserAccount } from "@/api/types";

interface AddTikTokAccountDialogProps {
  onAddAccount: (token: string, name: string, credits: number) => Promise<void>;
  disabled?: boolean;
  existingAccounts?: ParserAccount[]; // Для определения следующего номера токена
}

export const AddTikTokAccountDialog: React.FC<AddTikTokAccountDialogProps> = ({
  onAddAccount,
  disabled = false,
  existingAccounts = [],
}) => {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [credits, setCredits] = useState<string>("100");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Вычисляем следующее название токена на основе существующих аккаунтов
  const getNextTokenName = useMemo(() => {
    const tokenPattern = /^Token\s+(\d+)$/i;
    const numbers: number[] = [];
    
    existingAccounts.forEach(account => {
      if (account.identifier) {
        const match = account.identifier.match(tokenPattern);
        if (match) {
          numbers.push(parseInt(match[1], 10));
        }
      }
    });
    
    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    return `Token ${maxNumber + 1}`;
  }, [existingAccounts]);

  // Автозаполнение названия при открытии диалога
  useEffect(() => {
    if (open && !name) {
      setName(getNextTokenName);
    }
  }, [open, getNextTokenName, name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim() || !name.trim() || !credits.trim()) {
      setError("Заполните все поля");
      return;
    }

    // Validate token format (20-50 chars)
    if (token.trim().length < 20 || token.trim().length > 50) {
      setError("Токен должен содержать от 20 до 50 символов");
      return;
    }

    // Validate name length (2-40 chars)
    if (name.trim().length < 2 || name.trim().length > 40) {
      setError("Название должно содержать от 2 до 40 символов");
      return;
    }

    // Validate credits (must be a positive number)
    const creditsNum = parseInt(credits.trim(), 10);
    if (isNaN(creditsNum) || creditsNum < 0) {
      setError("Кредиты должны быть положительным числом");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await onAddAccount(token.trim(), name.trim(), creditsNum);
      
      // Only reset form and close dialog on success
      setToken("");
      setName("");
      setCredits("100");
      setOpen(false);
      
    } catch (error) {
      // Error is handled by the parent component via toast
      // Don't close dialog on error - let user try again
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      setOpen(newOpen);
      if (!newOpen) {
        // Reset form when closing
        setToken("");
        setName("");
        setCredits("100");
        setError(null);
      } else {
        // При открытии автозаполняем название
        setName(getNextTokenName);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          size="sm"
          disabled={disabled}
          className="flex items-center space-x-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Добавить TikTok</span>
          <span className="sm:hidden">Добавить TT</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <span className="text-xl sm:text-2xl">🎵</span>
            <span>Добавить TikTok сессию</span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            Введите TikTok API токен, название сессии и количество кредитов для парсинга данных. Получите API токен в TikTok Developer Portal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название сессии</Label>
            <Input
              id="name"
              type="text"
              placeholder="TikTok API Key 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              maxLength={40}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              От 2 до 40 символов. Используется для идентификации сессии.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="token">API Токен</Label>
            <Input
              id="token"
              type="text"
              placeholder="your_tiktok_api_token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={loading}
              autoComplete="off"
              className="font-mono text-sm"
              minLength={20}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">
              TikTok API токен должен содержать от 20 до 50 символов
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="credits">Кредиты</Label>
            <Input
              id="credits"
              type="number"
              placeholder="100"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              disabled={loading}
              min="0"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Количество доступных кредитов для парсинга (по умолчанию: 100)
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={loading || !token.trim() || !name.trim() || !credits.trim()}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Добавление...
                </>
              ) : (
                "Добавить сессию"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
