import { useState, useCallback, memo } from "react";
import { Button } from "@/ui-kit";
import { Input } from "@/ui-kit";
import { Label } from "@/ui-kit";
import { Badge } from "@/ui-kit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui-kit";
import { PlatformData } from "@/types/profile";
import {
  Plus,
  Trash2,
  Edit,
  Instagram,
  Youtube,
  MessageCircle,
  Lock,
  Clock,
} from "lucide-react";
import {
  getPlatformIcon,
  getPlatformName,
} from "@/components/icons/PlatformIcons";
import { useSocialLinking } from "@/hooks/useSocialLinking";
import { 
  extractTelegramUsername, 
  extractYoutubeChannel,
  validatePlatformUrl,
  getPlatformUrlExamples,
  getPlatformHints 
} from "@/utils/platformUrlParsers";

interface Platform {
  id: string;
  name: string;
  url: string;
}

interface PlatformManagementProps {
  platforms: Record<string, PlatformData>;
  onPlatformsChange: (platforms: Record<string, PlatformData>) => void;
  hasMaxPlatforms?: boolean;
  bloggerId?: number; // ID блогера для API запросов
}

const PlatformManagementComponent = ({
  platforms,
  onPlatformsChange,
  hasMaxPlatforms = false,
  bloggerId,
}: PlatformManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [newPlatform, setNewPlatform] = useState({
    name: "",
    url: "",
  });
  const [urlError, setUrlError] = useState<string | null>(null);

  // Хук для работы с API связывания платформ
  const { requestTgLink, requestYtLink, loading: apiLoading } = useSocialLinking();

  const availablePlatforms = [
    { id: "instagram", name: "Instagram", icon: Instagram },
    { id: "youtube", name: "YouTube", icon: Youtube },
    { id: "tiktok", name: "TikTok", icon: MessageCircle },
    { id: "telegram", name: "Telegram", icon: MessageCircle },
  ];

  const handleAddPlatform = useCallback(async () => {
    if (!newPlatform.name || !newPlatform.url) {
      setUrlError("Заполните все поля");
      return;
    }

    if (!bloggerId) {
      setUrlError("ID блогера не найден");
      return;
    }

    const numericBloggerId = Number(bloggerId);
    if (isNaN(numericBloggerId) || numericBloggerId <= 0) {
      setUrlError("Неверный ID блогера");
      return;
    }

    // Валидация URL
    const platformType = newPlatform.name.toLowerCase();
    if (!validatePlatformUrl(newPlatform.url, platformType as 'telegram' | 'youtube')) {
      setUrlError(`Неверный формат URL для ${getPlatformName(platformType)}`);
      return;
    }

    setUrlError(null);

    try {
      const platformId = newPlatform.name.toLowerCase();
      
      // Оптимистичное добавление платформы
      const optimisticPlatform: PlatformData = {
        username: platformType === 'telegram' 
          ? extractTelegramUsername(newPlatform.url)
          : newPlatform.url,
        profile_url: newPlatform.url,
        subscribers: 0,
        er: 0,
        reach: 0,
        price: 0,
        storyReach: 0,
        storyPrice: 0,
        isPending: true, // Флаг "на модерации"
      };

      onPlatformsChange({
        ...platforms,
        [platformId]: optimisticPlatform,
      });

      // Отправка API запроса
      if (platformType === 'telegram') {
        const username = extractTelegramUsername(newPlatform.url);
        console.log('🔍 Telegram request data:', { bloggerId: numericBloggerId, username, url: newPlatform.url });
        await requestTgLink(numericBloggerId, { username });
      } else if (platformType === 'youtube') {
        const channel = extractYoutubeChannel(newPlatform.url);
        console.log('🔍 YouTube request data:', { bloggerId: numericBloggerId, channel, url: newPlatform.url });
        await requestYtLink(numericBloggerId, { channel });
      }

      // Очистка формы и закрытие диалога
      setNewPlatform({ name: "", url: "" });
      setIsDialogOpen(false);
    } catch (error) {
      // Откат изменений при ошибке
      const platformId = newPlatform.name.toLowerCase();
      const revertedPlatforms = { ...platforms };
      delete revertedPlatforms[platformId];
      onPlatformsChange(revertedPlatforms);
      
      setUrlError(error instanceof Error ? error.message : "Ошибка добавления платформы");
    }
  }, [newPlatform, platforms, onPlatformsChange, bloggerId, requestTgLink, requestYtLink]);

  const handleEditPlatform = useCallback(
    (platformId: string) => {
      setEditingPlatform(platformId);
      setNewPlatform({
        name: platformId,
        url: platforms[platformId]?.profile_url || "",
      });
      setIsDialogOpen(true);
    },
    [platforms],
  );

  const handleUpdatePlatform = useCallback(() => {
    if (editingPlatform && newPlatform.url) {
      onPlatformsChange({
        ...platforms,
        [editingPlatform]: {
          ...platforms[editingPlatform],
          profile_url: newPlatform.url,
        },
      });
      setEditingPlatform(null);
      setNewPlatform({ name: "", url: "" });
      setIsDialogOpen(false);
    }
  }, [editingPlatform, newPlatform, platforms, onPlatformsChange]);

  const handleDeletePlatform = useCallback(
    (platformId: string) => {
      const newPlatforms = { ...platforms };
      delete newPlatforms[platformId];
      onPlatformsChange(newPlatforms);
    },
    [platforms, onPlatformsChange],
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Платформы</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingPlatform(null);
                setNewPlatform({ name: "", url: "" });
              }}
              disabled={hasMaxPlatforms}
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPlatform
                  ? "Редактировать платформу"
                  : "Добавить платформу"}
              </DialogTitle>
              <DialogDescription>
                {editingPlatform
                  ? "Обновите информацию о платформе"
                  : "Добавьте новую платформу для отслеживания метрик"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {editingPlatform ? (
                <div>
                  <Label>Платформа</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getPlatformIcon(editingPlatform)}
                    <span>{getPlatformName(editingPlatform)}</span>
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="platform">Платформа</Label>
                  <select
                    id="platform"
                    className="w-full p-2 border rounded"
                    value={newPlatform.name}
                    onChange={(e) =>
                      setNewPlatform({ ...newPlatform, name: e.target.value })
                    }
                  >
                    <option value="">Выберите платформу</option>
                    {availablePlatforms
                      .filter((platform) => !platforms[platform.id])
                      .sort((a, b) => {
                        // Instagram всегда первый
                        if (a.id === "instagram") return -1;
                        if (b.id === "instagram") return 1;
                        // Остальные в алфавитном порядке
                        return a.name.localeCompare(b.name);
                      })
                      .map((platform) => (
                        <option key={platform.id} value={platform.id}>
                          {platform.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              <div>
                <Label htmlFor="url">Ссылка на профиль</Label>
                <Input
                  id="url"
                  value={newPlatform.url}
                  onChange={(e) => {
                    setNewPlatform({ ...newPlatform, url: e.target.value });
                    setUrlError(null); // Очищаем ошибку при изменении
                  }}
                  placeholder="https://..."
                  className={urlError ? "border-red-500" : ""}
                />
                {urlError && (
                  <p className="text-sm text-red-500 mt-1">{urlError}</p>
                )}
                {newPlatform.name && (
                  <div className="mt-2 space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Примеры:</p>
                      <div className="text-xs text-gray-400 space-y-1">
                        {getPlatformUrlExamples(newPlatform.name.toLowerCase()).map((example, index) => (
                          <div key={index}>• {example}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 mb-1">Важно:</p>
                      <div className="text-xs text-blue-500 space-y-1">
                        {getPlatformHints(newPlatform.name.toLowerCase()).map((hint, index) => (
                          <div key={index}>• {hint}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setUrlError(null);
                    setNewPlatform({ name: "", url: "" });
                  }}
                  disabled={apiLoading}
                >
                  Отмена
                </Button>
                <Button
                  onClick={
                    editingPlatform ? handleUpdatePlatform : handleAddPlatform
                  }
                  disabled={
                    apiLoading ||
                    !newPlatform.url || 
                    (!editingPlatform && !newPlatform.name) ||
                    !!urlError
                  }
                >
                  {apiLoading 
                    ? "Добавление..." 
                    : editingPlatform 
                      ? "Сохранить" 
                      : "Добавить"
                  }
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {Object.keys(platforms)
          .sort((a, b) => {
            // Instagram всегда первый
            if (a === "instagram") return -1;
            if (b === "instagram") return 1;
            // Остальные в алфавитном порядке
            return a.localeCompare(b);
          })
          .map((platformId) => (
            <div
              key={platformId}
              className={`flex items-center justify-between p-2 border rounded ${
                platforms[platformId]?.isPending ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                {getPlatformIcon(platformId)}
                <span>{getPlatformName(platformId)}</span>
                {platformId === "instagram" && (
                  <Lock className="w-3 h-3 text-muted-foreground" />
                )}
                {platforms[platformId]?.isPending && (
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    На модерации
                  </Badge>
                )}
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditPlatform(platformId)}
                  disabled={platformId === "instagram" || platforms[platformId]?.isPending}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePlatform(platformId)}
                  disabled={platformId === "instagram" || platforms[platformId]?.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export const PlatformManagement = memo(PlatformManagementComponent);
