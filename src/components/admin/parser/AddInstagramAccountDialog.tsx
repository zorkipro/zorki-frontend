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

interface AddInstagramAccountDialogProps {
  onAddAccount: (username: string, password: string) => Promise<void>;
  disabled?: boolean;
}

export const AddInstagramAccountDialog: React.FC<AddInstagramAccountDialogProps> = ({
  onAddAccount,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError("Заполните все поля");
      return;
    }

    // Validate username format (basic Instagram username validation)
    const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/;
    if (!usernameRegex.test(username)) {
      setError("Username должен содержать только буквы, цифры, точки и подчеркивания (1-30 символов)");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await onAddAccount(username.trim(), password);
      
      // Only reset form and close dialog on success
      setUsername("");
      setPassword("");
      setOpen(false);
      
    } catch (error) {
      // Error is handled by the parent component via toast
      console.error("Error adding Instagram account:", error);
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
        setUsername("");
        setPassword("");
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
          <span className="hidden sm:inline">Добавить Instagram</span>
          <span className="sm:hidden">Добавить IG</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <span className="text-xl sm:text-2xl">📸</span>
            <span>Добавить Instagram аккаунт</span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            Введите данные Instagram аккаунта для парсинга. Убедитесь, что аккаунт активен и имеет доступ к API.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground">@</span>
              <Input
                id="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-8"
                disabled={loading}
                autoComplete="username"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Без символа @, только буквы, цифры, точки и подчеркивания
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
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
              disabled={loading || !username.trim() || !password.trim()}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Добавление...
                </>
              ) : (
                "Добавить аккаунт"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
