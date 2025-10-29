import { memo, useCallback, useState, useEffect } from "react";
import { Card, CardContent } from "@/ui-kit";
import { Button } from "@/ui-kit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui-kit";
import { Input } from "@/ui-kit";
import { Label } from "@/ui-kit";
import { Edit } from "lucide-react";
import {
  getPlatformIcon,
  getPlatformName,
} from "@/components/icons/PlatformIcons";
import type { EditData, PlatformData } from "@/types/profile";

interface PricingSectionProps {
  availablePlatforms: Record<string, PlatformData>;
  formData: EditData;
  editingSection: string | null;
  onEditingSectionChange: (section: string | null) => void;
  onSave: (data: Partial<EditData>) => void;
  saving: boolean;
  setAvailablePlatforms?: (fn: (prev: Record<string, PlatformData>) => Record<string, PlatformData>) => void;
}

const PricingSectionComponent = ({
  availablePlatforms,
  formData,
  editingSection,
  onEditingSectionChange,
  onSave,
  saving,
  setAvailablePlatforms,
}: PricingSectionProps) => {
  // Состояние для полей редактирования цен
  const [priceStates, setPriceStates] = useState<
    Record<string, { postPrice: string; storyPrice: string }>
  >({});

  // Инициализируем состояние при изменении formData
  useEffect(() => {
    const newStates: Record<string, { postPrice: string; storyPrice: string }> =
      {};
    Object.keys(availablePlatforms).forEach((platform) => {
      if (platform === 'youtube') {
        const integrationPriceField = `${platform}_integration_price` as keyof EditData;
        newStates[platform] = {
          postPrice: (formData[integrationPriceField] as string) || "",
          storyPrice: "", // Для YouTube stories не используется
        };
      } else {
        const postPriceField = `${platform}_post_price` as keyof EditData;
        const storyPriceField = `${platform}_story_price` as keyof EditData;
        newStates[platform] = {
          postPrice: (formData[postPriceField] as string) || "",
          storyPrice: (formData[storyPriceField] as string) || "",
        };
      }
    });
    setPriceStates(newStates);
  }, [formData, availablePlatforms]);

  const handlePriceEdit = useCallback(
    async (platform: string) => {
      if (platform === 'youtube') {
        const integrationPriceField = `${platform}_integration_price` as keyof EditData;
        const newPrice = priceStates[platform]?.postPrice || "";
        
        try {
          await onSave({
            [integrationPriceField]: newPrice,
          });
          
          // Обновляем локальное состояние availablePlatforms
          if (setAvailablePlatforms) {
            setAvailablePlatforms((prev) => ({
              ...prev,
              [platform]: {
                ...prev[platform],
                integrationPrice: parseFloat(newPrice) || 0,
                price: parseFloat(newPrice) || 0, // Для YouTube price и integrationPrice одинаковые
              },
            }));
          }
          
          onEditingSectionChange(null);
        } catch (error) {
          // Error already handled by onSave
        }
      } else {
        const postPriceField = `${platform}_post_price` as keyof EditData;
        const storyPriceField = `${platform}_story_price` as keyof EditData;
        const newPostPrice = priceStates[platform]?.postPrice || "";
        const newStoryPrice = priceStates[platform]?.storyPrice || "";

        try {
          await onSave({
            [postPriceField]: newPostPrice,
            [storyPriceField]: newStoryPrice,
          });
          
          // Обновляем локальное состояние availablePlatforms
          if (setAvailablePlatforms) {
            setAvailablePlatforms((prev) => ({
              ...prev,
              [platform]: {
                ...prev[platform],
                price: parseFloat(newPostPrice) || 0,
                storyPrice: parseFloat(newStoryPrice) || 0,
              },
            }));
          }
          
          onEditingSectionChange(null);
        } catch (error) {
          // Error already handled by onSave
        }
      }
    },
    [onSave, onEditingSectionChange, priceStates, setAvailablePlatforms],
  );

  return (
    <Card className="relative">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4 flex items-center space-x-2">
          <span>Цены</span>
        </h3>
        <div className="space-y-4">
          {Object.entries(availablePlatforms).map(([platform, stats]) => (
            <div key={platform} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getPlatformIcon(platform)}
                <span className="text-sm">{getPlatformName(platform)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {platform === 'youtube' ? (stats.integrationPrice || 0) : (stats.price || 0)} BYN
                  </div>
                  {stats.storyPrice > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Stories: {stats.storyPrice} BYN
                    </div>
                  )}
                </div>
                <Dialog
                  open={editingSection === `${platform}_prices`}
                  onOpenChange={(open) =>
                    onEditingSectionChange(open ? `${platform}_prices` : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Редактировать цены {getPlatformName(platform)}
                      </DialogTitle>
                      <DialogDescription>
                        Обновите цены для этой платформы
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {platform === 'youtube' ? (
                        <div>
                          <Label htmlFor={`${platform}_integration_price`}>
                            Цена за интеграцию (BYN)
                          </Label>
                          <Input
                            id={`${platform}_integration_price`}
                            type="number"
                            value={priceStates[platform]?.postPrice || ""}
                            onChange={(e) =>
                              setPriceStates((prev) => ({
                                ...prev,
                                [platform]: {
                                  ...prev[platform],
                                  postPrice: e.target.value,
                                },
                              }))
                            }
                            placeholder="Введите цену"
                          />
                        </div>
                      ) : (
                        <>
                          <div>
                            <Label htmlFor={`${platform}_post_price`}>
                              Цена за пост (BYN)
                            </Label>
                            <Input
                              id={`${platform}_post_price`}
                              type="number"
                              value={priceStates[platform]?.postPrice || ""}
                              onChange={(e) =>
                                setPriceStates((prev) => ({
                                  ...prev,
                                  [platform]: {
                                    ...prev[platform],
                                    postPrice: e.target.value,
                                  },
                                }))
                              }
                              placeholder="Введите цену"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`${platform}_story_price`}>
                              Цена за stories (BYN)
                            </Label>
                            <Input
                              id={`${platform}_story_price`}
                              type="number"
                              value={priceStates[platform]?.storyPrice || ""}
                              onChange={(e) =>
                                setPriceStates((prev) => ({
                                  ...prev,
                                  [platform]: {
                                    ...prev[platform],
                                    storyPrice: e.target.value,
                                  },
                                }))
                              }
                              placeholder="Введите цену"
                            />
                          </div>
                        </>
                      )}
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => onEditingSectionChange(null)}
                        >
                          Отмена
                        </Button>
                        <Button
                          onClick={() => handlePriceEdit(platform)}
                          disabled={saving}
                        >
                          Сохранить
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const PricingSection = memo(PricingSectionComponent);
