import React from "react";
import { Button } from "@/ui-kit";
import { 
  Construction, 
  Clock, 
  ExternalLink,
  Github,
  MessageCircle 
} from "lucide-react";

interface PlatformNotAvailableMessageProps {
  platform: "YOUTUBE" | "TIKTOK";
}

export const PlatformNotAvailableMessage: React.FC<PlatformNotAvailableMessageProps> = ({
  platform,
}) => {
  const getPlatformInfo = () => {
    switch (platform) {
      case "YOUTUBE":
        return {
          name: "YouTube",
          icon: "📺",
          description: "Управление YouTube аккаунтами для парсинга",
          features: [
            "Добавление YouTube каналов",
            "Мониторинг активности",
            "Управление API ключами",
            "Статистика парсинга"
          ],
          docs: "https://developers.google.com/youtube/v3",
          status: "В разработке"
        };
      case "TIKTOK":
        return {
          name: "TikTok",
          icon: "🎵",
          description: "Управление TikTok аккаунтами для парсинга",
          features: [
            "Добавление TikTok аккаунтов",
            "Мониторинг активности",
            "Управление токенами доступа",
            "Статистика парсинга"
          ],
          docs: "https://developers.tiktok.com/",
          status: "Планируется"
        };
      default:
        return {
          name: "Платформа",
          icon: "🔗",
          description: "Управление аккаунтами для парсинга",
          features: [],
          docs: "",
          status: "Неизвестно"
        };
    }
  };

  const platformInfo = getPlatformInfo();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon and Title */}
      <div className="mb-6">
        <div className="text-6xl mb-4">{platformInfo.icon}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {platformInfo.name} - {platformInfo.status}
        </h2>
        <p className="text-gray-600 max-w-md">
          {platformInfo.description}
        </p>
      </div>

      {/* Status Badge */}
      <div className="mb-8">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
          <Clock className="w-4 h-4 mr-2" />
          {platformInfo.status}
        </div>
      </div>

      {/* Features Preview */}
      <div className="mb-8 max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Планируемые возможности:
        </h3>
        <ul className="text-left space-y-2">
          {platformInfo.features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={() => {
            // Open GitHub issues or contact form
            window.open("https://github.com/your-repo/issues", "_blank");
          }}
          className="flex items-center space-x-2"
        >
          <Github className="w-4 h-4" />
          <span>Сообщить о проблеме</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {
            // Open contact form or email
            window.open("mailto:support@example.com?subject=Feature Request: " + platformInfo.name, "_blank");
          }}
          className="flex items-center space-x-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Запросить функцию</span>
        </Button>
      </div>

      {/* Documentation Link */}
      {platformInfo.docs && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            Документация API:
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(platformInfo.docs, "_blank")}
            className="flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{platformInfo.name} API Docs</span>
          </Button>
        </div>
      )}

      {/* Development Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg max-w-lg">
        <div className="flex items-center justify-center mb-2">
          <Construction className="w-5 h-5 text-gray-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">
            Информация для разработчиков
          </span>
        </div>
        <p className="text-xs text-gray-600">
          Для реализации поддержки {platformInfo.name} необходимо:
        </p>
        <ul className="text-xs text-gray-600 mt-2 text-left">
          <li>• Добавить эндпоинты в backend API</li>
          <li>• Реализовать аутентификацию через {platformInfo.name}</li>
          <li>• Создать UI компоненты для управления аккаунтами</li>
          <li>• Добавить мониторинг и статистику</li>
        </ul>
      </div>
    </div>
  );
};
