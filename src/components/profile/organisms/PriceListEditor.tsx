import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui-kit";
import { Input } from "@/ui-kit";
import { FormField } from "@/ui-kit";
import { Separator } from "@/ui-kit";
import { Instagram, Youtube, Music, Send } from "lucide-react";

interface PriceData {
  instagram?: {
    postPrice: string;
    storyPrice: string;
  };
  youtube?: {
    price: string;
  };
  tiktok?: {
    price: string;
  };
  telegram?: {
    price: string;
  };
}

interface PriceListEditorProps {
  prices: PriceData;
  onPriceChange: (
    platform: keyof PriceData,
    field: string,
    value: string,
  ) => void;
  disabled?: boolean;
}

const PriceListEditorComponent = ({
  prices,
  onPriceChange,
  disabled = false,
}: PriceListEditorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Прайс-лист</span>
        </CardTitle>
        <CardDescription>
          Настройте цены для всех ваших платформ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instagram Pricing */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Instagram className="h-4 w-4 text-pink-500" />
            <h3 className="text-sm font-medium">Instagram</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
            <FormField
              label="Цена за пост"
              description="Стоимость публикации в BYN"
            >
              <Input
                type="number"
                value={prices.instagram?.postPrice || ""}
                onChange={(e) =>
                  onPriceChange("instagram", "postPrice", e.target.value)
                }
                placeholder="0"
                disabled={disabled}
              />
            </FormField>
            <FormField
              label="Цена за сторис"
              description="Стоимость stories в BYN"
            >
              <Input
                type="number"
                value={prices.instagram?.storyPrice || ""}
                onChange={(e) =>
                  onPriceChange("instagram", "storyPrice", e.target.value)
                }
                placeholder="0"
                disabled={disabled}
              />
            </FormField>
          </div>
        </div>

        <Separator />

        {/* YouTube Pricing */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Youtube className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-medium">YouTube</h3>
          </div>
          <div className="pl-6">
            <FormField
              label="Цена интеграции"
              description="Стоимость размещения рекламы в BYN"
            >
              <Input
                type="number"
                value={prices.youtube?.price || ""}
                onChange={(e) =>
                  onPriceChange("youtube", "price", e.target.value)
                }
                placeholder="0"
                disabled={disabled}
              />
            </FormField>
          </div>
        </div>

        <Separator />

        {/* TikTok Pricing */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Music className="h-4 w-4 text-black" />
            <h3 className="text-sm font-medium">TikTok</h3>
          </div>
          <div className="pl-6">
            <FormField
              label="Цена интеграции"
              description="Стоимость размещения рекламы в BYN"
            >
              <Input
                type="number"
                value={prices.tiktok?.price || ""}
                onChange={(e) =>
                  onPriceChange("tiktok", "price", e.target.value)
                }
                placeholder="0"
                disabled={disabled}
              />
            </FormField>
          </div>
        </div>

        <Separator />

        {/* Telegram Pricing */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Send className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-medium">Telegram</h3>
          </div>
          <div className="pl-6">
            <FormField
              label="Цена публикации"
              description="Стоимость размещения в канале в BYN"
            >
              <Input
                type="number"
                value={prices.telegram?.price || ""}
                onChange={(e) =>
                  onPriceChange("telegram", "price", e.target.value)
                }
                placeholder="0"
                disabled={disabled}
              />
            </FormField>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PriceListEditor = memo(PriceListEditorComponent);
