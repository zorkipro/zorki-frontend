import React, { useState } from "react";
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
import { Plus, Loader2, Eye, EyeOff } from "lucide-react";

interface AddYouTubeAccountDialogProps {
  onAddAccount: (token: string, name: string) => Promise<void>;
  disabled?: boolean;
}

export const AddYouTubeAccountDialog: React.FC<AddYouTubeAccountDialogProps> = ({
  onAddAccount,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim() || !name.trim()) {
      setError("Заполните все поля");
      return;
    }

    // Validate token format (YouTube API key format: AIza[0-9A-Za-z_-]{30,35})
    const tokenRegex = /^AIza[0-9A-Za-z_\-]{30,35}$/;
    if (!tokenRegex.test(token.trim())) {
      setError("Токен должен начинаться с 'AIza' и содержать 35-40 символов");
      return;
    }

    // Validate name length (2-40 chars)
    if (name.trim().length < 2 || name.trim().length > 40) {
      setError("Название должно содержать от 2 до 40 символов");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await onAddAccount(token.trim(), name.trim());
      
      // Only reset form and close dialog on success
      setToken("");
      setName("");
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
        setError(null);
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
          <span className="hidden sm:inline">Добавить YouTube</span>
          <span className="sm:hidden">Добавить YT</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <span className="text-xl sm:text-2xl">📺</span>
            <span>Добавить YouTube сессию</span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            Введите YouTube API ключ и название сессии для парсинга данных. Получите API ключ в Google Cloud Console.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название сессии</Label>
            <Input
              id="name"
              type="text"
              placeholder="YouTube API Key 1"
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
            <Label htmlFor="token">API Ключ</Label>
            <div className="relative">
              <Input
                id="token"
                type={showToken ? "text" : "password"}
                placeholder="AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={loading}
                autoComplete="off"
                className="font-mono text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowToken(!showToken)}
                disabled={loading}
              >
                {showToken ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              YouTube API ключ начинается с "AIza" и содержит 35-40 символов
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
              disabled={loading || !token.trim() || !name.trim()}
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

