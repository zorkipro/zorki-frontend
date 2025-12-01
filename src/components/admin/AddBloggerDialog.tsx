import React, { useState } from "react";
import { Button } from "@/ui-kit";
import { Input } from "@/ui-kit";
import { Label } from "@/ui-kit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui-kit";
import { Plus, AlertCircle, CheckCircle } from "lucide-react";
import { useInstagramClientStatus } from "@/hooks/admin/useInstagramClientStatus";
import { InstagramClientSetupDialog } from "./InstagramClientSetupDialog";
import { extractInstagramUsername } from "@/utils/platformUrlParsers";

interface AddBloggerDialogProps {
  onAddBlogger: (username: string) => Promise<void>;
}

export const AddBloggerDialog: React.FC<AddBloggerDialogProps> = ({
  onAddBlogger,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [instagramUsername, setInstagramUsername] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const {
    isActive,
    isLoading: statusLoading,
    error: statusError,
    refresh,
  } = useInstagramClientStatus();

  const handleSubmit = async () => {
    setIsProcessing(true);
    setProcessingStatus("Создание блогера...");

    try {
      // Извлекаем username из URL, если это ссылка
      const extractedUsername = extractInstagramUsername(instagramUsername);
      await onAddBlogger(extractedUsername);
      setProcessingStatus("Блогер успешно создан!");
      setIsOpen(false);
      setInstagramUsername("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ошибка при создании блогера";
      setProcessingStatus(errorMessage);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingStatus("");
      }, 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Добавить блогера
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить нового блогера</DialogTitle>
          <DialogDescription>
            Введите Instagram username блогера для добавления в систему
          </DialogDescription>
        </DialogHeader>

        {/* Статус Instagram клиента */}
        {!statusLoading && (
          <div
            className={`p-3 rounded-lg border flex items-center justify-between ${
              isActive
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center space-x-2">
              {isActive ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <div className="text-sm">
                {isActive ? (
                  <span>Instagram клиент активен</span>
                ) : (
                  <div>
                    <div className="font-medium">
                      Instagram клиент недоступен
                    </div>
                    {statusError && (
                      <div className="text-xs mt-1">{statusError}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {!isActive && <InstagramClientSetupDialog onSuccess={refresh} />}
          </div>
        )}

        {!isProcessing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="instagram_username">Instagram Username</Label>
              <Input
                id="instagram_username"
                value={instagramUsername}
                onChange={(e) => setInstagramUsername(e.target.value.trim())}
                placeholder="Например: elena_fitness_coach или https://instagram.com/elena_fitness_coach"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && instagramUsername.trim()) {
                    handleSubmit();
                  }
                }}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Можно ввести username или полную ссылку Instagram. Система автоматически загрузит данные блогера.
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setInstagramUsername("");
                }}
              >
                Отмена
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!instagramUsername.trim() || !isActive}
              >
                Продолжить
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">{processingStatus}</p>
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
