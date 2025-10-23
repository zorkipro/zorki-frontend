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
import { Plus, Loader2, ArrowLeft, ArrowRight } from "lucide-react";

interface AddTelegramAccountDialogProps {
  onAddAccount: (phone: string, apiHash: string, apiId: number) => Promise<void>;
  onConfirmAccount: (phone: string, code: string) => Promise<void>;
  disabled?: boolean;
}

type DialogStep = "credentials" | "confirmation";

export const AddTelegramAccountDialog: React.FC<AddTelegramAccountDialogProps> = ({
  onAddAccount,
  onConfirmAccount,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<DialogStep>("credentials");
  
  // Step 1: Credentials
  const [phone, setPhone] = useState("");
  const [apiHash, setApiHash] = useState("");
  const [apiId, setApiId] = useState("");
  
  // Step 2: Confirmation
  const [confirmationCode, setConfirmationCode] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim() || !apiHash.trim() || !apiId.trim()) {
      setError("Заполните все поля");
      return;
    }

    // Validate phone format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      setError("Введите корректный номер телефона");
      return;
    }

    // Validate API Hash (32 characters)
    if (apiHash.length !== 32) {
      setError("API Hash должен содержать ровно 32 символа");
      return;
    }

    // Validate API ID (number)
    const apiIdNum = parseInt(apiId);
    if (isNaN(apiIdNum) || apiIdNum < 100000 || apiIdNum > 999999999) {
      setError("API ID должен быть числом от 100000 до 999999999");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await onAddAccount(phone.trim(), apiHash.trim(), apiIdNum);
      
      // Move to confirmation step
      setStep("confirmation");
      
    } catch (error) {
      // Error is handled by the parent component via toast
      console.error("Error adding Telegram account:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!confirmationCode.trim()) {
      setError("Введите код подтверждения");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await onConfirmAccount(phone.trim(), confirmationCode.trim());
      
      // Only reset form and close dialog on success
      resetForm();
      setOpen(false);
      
    } catch (error) {
      // Error is handled by the parent component via toast
      console.error("Error confirming Telegram account:", error);
      // Don't close dialog on error - let user try again
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep("credentials");
    setPhone("");
    setApiHash("");
    setApiId("");
    setConfirmationCode("");
    setError(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      setOpen(newOpen);
      if (!newOpen) {
        resetForm();
      }
    }
  };

  const handleBackToCredentials = () => {
    if (!loading) {
      setStep("credentials");
      setConfirmationCode("");
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
          className="flex items-center space-x-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Добавить Telegram</span>
          <span className="sm:hidden">Добавить TG</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <span className="text-xl sm:text-2xl">✈️</span>
            <span>
              {step === "credentials" 
                ? "Добавить Telegram аккаунт" 
                : "Подтвердить Telegram аккаунт"
              }
            </span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            {step === "credentials" 
              ? "Введите данные Telegram аккаунта. Код подтверждения будет отправлен на указанный номер."
              : `Код подтверждения отправлен на номер ${phone}. Введите его для завершения настройки.`
            }
          </DialogDescription>
        </DialogHeader>

        {step === "credentials" ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Номер телефона</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                autoComplete="tel"
              />
              <p className="text-xs text-muted-foreground">
                Введите номер в международном формате
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiHash">API Hash</Label>
              <Input
                id="apiHash"
                type="text"
                placeholder="32-символьный хеш"
                value={apiHash}
                onChange={(e) => setApiHash(e.target.value)}
                disabled={loading}
                maxLength={32}
              />
              <p className="text-xs text-muted-foreground">
                Получите в @BotFather при создании приложения
              </p>
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
                min={100000}
                max={999999999}
              />
              <p className="text-xs text-muted-foreground">
                Получите в @BotFather при создании приложения
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
                disabled={loading || !phone.trim() || !apiHash.trim() || !apiId.trim()}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    Отправить код
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={handleConfirmationSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirmationCode">Код подтверждения</Label>
              <Input
                id="confirmationCode"
                type="text"
                placeholder="12345"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                disabled={loading}
                maxLength={15}
                autoComplete="one-time-code"
              />
              <p className="text-xs text-muted-foreground">
                Введите код из SMS или Telegram
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
                onClick={handleBackToCredentials}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
              <Button
                type="submit"
                disabled={loading || !confirmationCode.trim()}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Подтверждение...
                  </>
                ) : (
                  "Подтвердить"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
