import { useState, useCallback, memo } from "react";
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
import { PlatformData } from "@/types/profile";
import {
  Plus,
  Trash2,
  Edit,
  Instagram,
  Youtube,
  MessageCircle,
  Lock,
} from "lucide-react";
import {
  getPlatformIcon,
  getPlatformName,
} from "@/components/icons/PlatformIcons";

interface Platform {
  id: string;
  name: string;
  url: string;
}

interface PlatformManagementProps {
  platforms: Record<string, PlatformData>;
  onPlatformsChange: (platforms: Record<string, PlatformData>) => void;
  hasMaxPlatforms?: boolean;
}

const PlatformManagementComponent = ({
  platforms,
  onPlatformsChange,
  hasMaxPlatforms = false,
}: PlatformManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [newPlatform, setNewPlatform] = useState({
    name: "",
    url: "",
  });

  const availablePlatforms = [
    { id: "instagram", name: "Instagram", icon: Instagram },
    { id: "youtube", name: "YouTube", icon: Youtube },
    { id: "tiktok", name: "TikTok", icon: MessageCircle },
    { id: "telegram", name: "Telegram", icon: MessageCircle },
  ];

  const handleAddPlatform = useCallback(() => {
    if (newPlatform.name && newPlatform.url) {
      const platformId = newPlatform.name.toLowerCase();
      onPlatformsChange({
        ...platforms,
        [platformId]: {
          ...platforms[platformId],
          profile_url: newPlatform.url,
        },
      });
      setNewPlatform({ name: "", url: "" });
      setIsDialogOpen(false);
    }
  }, [newPlatform, platforms, onPlatformsChange]);

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
                  onChange={(e) =>
                    setNewPlatform({ ...newPlatform, url: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Отмена
                </Button>
                <Button
                  onClick={
                    editingPlatform ? handleUpdatePlatform : handleAddPlatform
                  }
                  disabled={
                    !newPlatform.url || (!editingPlatform && !newPlatform.name)
                  }
                >
                  {editingPlatform ? "Сохранить" : "Добавить"}
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
              className="flex items-center justify-between p-2 border rounded"
            >
              <div className="flex items-center space-x-2">
                {getPlatformIcon(platformId)}
                <span>{getPlatformName(platformId)}</span>
                {platformId === "instagram" && (
                  <Lock className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditPlatform(platformId)}
                  disabled={platformId === "instagram"} // Запрещаем редактирование Instagram
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePlatform(platformId)}
                  disabled={platformId === "instagram"} // Prevent deleting the primary platform
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
