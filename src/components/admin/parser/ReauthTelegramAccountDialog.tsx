import React, { useState, useEffect } from "react";
import { Button, Input, Label } from "@/ui-kit";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/ui-kit";
import { RefreshCw, Loader2 } from "lucide-react";

interface ReauthTelegramAccountDialogProps {
  accountId: number;
  phone: string;
  onReauth: (accountId: number, phone: string, code: string) => Promise<void>;
  disabled?: boolean;
}

export const ReauthTelegramAccountDialog: React.FC<ReauthTelegramAccountDialogProps> = ({
  accountId,
  phone,
  onReauth,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    if (!open || codeSent) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        await onReauth(accountId, phone, "");
        setCodeSent(true);
      } catch {
        setError("Не удалось отправить запрос на переавторизацию");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, accountId, phone, onReauth, codeSent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationCode.trim()) {
      setError("Введите код подтверждения");
      return;
    }
    if (!codeSent) {
      setError("Сначала нужно отправить запрос на переавторизацию");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onReauth(accountId, phone, confirmationCode.trim());
      setConfirmationCode("");
      setCodeSent(false);
      setOpen(false);
    } catch {
      // Error handled by parent via toast
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (loading) return;
    setOpen(newOpen);
    if (!newOpen) {
      setConfirmationCode("");
      setCodeSent(false);
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={disabled}
          className="h-8 w-8 p-0"
          title="Переавторизовать аккаунт"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <span className="text-xl sm:text-2xl">🔄</span>
            <span>Переавторизация Telegram аккаунта</span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            {codeSent 
              ? `Введите код подтверждения, отправленный на номер ${phone}.`
              : `Отправка запроса на переавторизацию для ${phone}...`
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              type="text"
              value={phone}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Код подтверждения</Label>
            <Input
              id="code"
              type="text"
              placeholder="12345"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value.replace(/\D/g, ""))}
              disabled={loading}
              autoComplete="off"
              autoFocus
              maxLength={15}
            />
            <p className="text-xs text-muted-foreground">
              Код подтверждения отправлен на номер {phone}
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
              disabled={loading || !confirmationCode.trim() || !codeSent}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Переавторизация...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Переавторизовать
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

