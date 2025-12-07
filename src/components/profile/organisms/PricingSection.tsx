import { useCallback, useState } from "react";
import { Card, CardContent, Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Input, Label } from "@/ui-kit";
import { Edit } from "lucide-react";
import { getPlatformIcon, getPlatformName } from "@/components/icons/PlatformIcons";
import { getPlatformField, safeParseFloat } from "@/utils/platform-field-helpers";
import type { EditData, PlatformData } from "@/types/profile";
import type { PlatformType } from "@/types/platform";

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
  const [priceStates, setPriceStates] = useState<
    Record<string, { postPrice: string; storyPrice: string }>
  >({});

  const getPriceState = (platform: string) => {
    if (priceStates[platform]) return priceStates[platform];
    
    const platformKey = platform as PlatformType;
    const priceField = platform === 'youtube' ? "integration_price" : "post_price";
    return {
      postPrice: (formData[getPlatformField(platformKey, priceField)] as string) || "",
      storyPrice: platform === 'instagram' ? (formData[getPlatformField(platformKey, "story_price")] as string) || "" : "",
    };
  };

  const handlePriceEdit = useCallback(
    async (platform: string) => {
      const platformKey = platform as PlatformType;
      const state = priceStates[platform] || getPriceState(platform);

      const saveData: Partial<EditData> = {};
      if (platform === 'youtube') {
        saveData[getPlatformField(platformKey, "integration_price")] = state.postPrice;
      } else {
        saveData[getPlatformField(platformKey, "post_price")] = state.postPrice;
        if (platform === 'instagram' && state.storyPrice) {
          saveData[getPlatformField(platformKey, "story_price")] = state.storyPrice;
        }
      }
      
      await onSave(saveData);
      setPriceStates({});
      onEditingSectionChange(null);
    },
    [onSave, onEditingSectionChange, priceStates],
  );

  return (
    <Card className="relative">
      <CardContent className="p-4 sm:p-5">
        <h3 className="font-semibold mb-4 sm:mb-5 text-sm sm:text-base">Цены</h3>
        <div className="space-y-3 sm:space-y-4">
          {Object.entries(availablePlatforms)
            .sort(([a], [b]) => {
              if (a === "instagram") return -1;
              if (b === "instagram") return 1;
              return a.localeCompare(b);
            })
            .map(([platform, stats]) => (
            <div key={platform} className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                  {getPlatformIcon(platform)}
                </span>
                <span className="text-xs sm:text-sm truncate">{getPlatformName(platform)}</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
                  <div className="text-right">
                  <div className="text-xs sm:text-sm font-medium whitespace-nowrap">
                    {platform === 'youtube' ? (stats.integrationPrice || 0) : (stats.price || 0)} BYN
                  </div>
                  {stats.storyPrice > 0 && platform === 'instagram' && (
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
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
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                      <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        Редактировать цены {getPlatformName(platform)}
                      </DialogTitle>
                      <DialogDescription>
                        {platform === 'youtube' 
                          ? `Текущая цена: ${stats.integrationPrice || stats.price || 0} BYN`
                          : `Текущая цена: ${stats.price || 0} BYN${platform === 'instagram' && stats.storyPrice > 0 ? `, Stories: ${stats.storyPrice} BYN` : ''}`}
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
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={getPriceState(platform).postPrice}
                            onChange={(e) =>
                              setPriceStates((prev) => ({
                                ...prev,
                                [platform]: { ...getPriceState(platform), postPrice: e.target.value },
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
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={getPriceState(platform).postPrice}
                              onChange={(e) =>
                                setPriceStates((prev) => ({
                                  ...prev,
                                  [platform]: { ...getPriceState(platform), postPrice: e.target.value },
                                }))
                              }
                              placeholder="Введите цену"
                            />
                          </div>
                          {platform === 'instagram' && (
                            <div>
                              <Label htmlFor={`${platform}_story_price`}>
                                Цена за stories (BYN)
                              </Label>
                              <Input
                                id={`${platform}_story_price`}
                                type="number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={getPriceState(platform).storyPrice}
                                onChange={(e) =>
                                  setPriceStates((prev) => ({
                                    ...prev,
                                    [platform]: { ...getPriceState(platform), storyPrice: e.target.value },
                                  }))
                                }
                                placeholder="Введите цену"
                              />
                            </div>
                          )}
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

export const PricingSection = PricingSectionComponent;
