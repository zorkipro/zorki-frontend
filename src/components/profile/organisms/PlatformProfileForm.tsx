import { memo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui-kit";
import { PlatformStatsRenderer } from "@/components/profile/PlatformStatsRenderer";
import { ScreenshotManagement } from "@/components/profile/ScreenshotManagement";
import {
  getPlatformIcon,
  getPlatformName,
} from "@/components/icons/PlatformIcons";
import { PlatformManagement } from "@/components/profile/PlatformManagement";
import type { EditData, PlatformData, Screenshot } from "@/types/profile";
import { Settings } from "lucide-react"; // Added Settings icon import

interface PlatformProfileFormProps {
  // Form data
  formData: EditData;
  onFormDataChange: (updates: Partial<EditData>) => void;

  // Platform data
  availablePlatforms: Record<string, PlatformData>;
  onAvailablePlatformsChange?: (
    platforms: Record<string, PlatformData>,
  ) => void;
  formatNumber: (num: number) => string;

  // State management
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
  editingSection: string | null;
  onEditingSectionChange: (section: string | null) => void;
  onSave: (data: Partial<EditData>) => void;
  saving: boolean;
  disabled?: boolean;

  // Screenshot management
  screenshots: Screenshot[];
  uploadingScreenshot: boolean;
  loadingScreenshots: boolean;
  screenshotError: string | null;
  onScreenshotUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteScreenshot: (screenshot: Screenshot) => void;
}

const PlatformProfileFormComponent = ({
  formData,
  onFormDataChange,
  availablePlatforms,
  onAvailablePlatformsChange,
  formatNumber,
  activeTab,
  onActiveTabChange,
  editingSection,
  onEditingSectionChange,
  onSave,
  saving,
  disabled = false,
  screenshots,
  uploadingScreenshot,
  loadingScreenshots,
  screenshotError,
  onScreenshotUpload,
  onDeleteScreenshot,
}: PlatformProfileFormProps) => {
  // Check if we have reached the maximum number of platforms
  const hasMaxPlatforms = availablePlatforms
    ? Object.keys(availablePlatforms).length >= 4
    : false;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={onActiveTabChange}>
        <TabsList className="flex w-full overflow-x-auto whitespace-nowrap gap-1 mb-8 md:grid md:grid-cols-5 md:gap-0">
          {availablePlatforms &&
            Object.entries(availablePlatforms)
              .sort(([a], [b]) => {
                // Instagram всегда первый
                if (a === "instagram") return -1;
                if (b === "instagram") return 1;
                // Остальные в алфавитном порядке
                return a.localeCompare(b);
              })
              .map(([platform, stats]) => (
                <TabsTrigger
                  key={platform}
                  value={platform}
                  className="flex items-center space-x-2 shrink-0 px-6 md:px-3 flex-1 md:flex-initial"
                >
                  {getPlatformIcon(platform)}
                  <span className="hidden sm:inline">
                    {getPlatformName(platform)}
                  </span>
                </TabsTrigger>
              ))}
          <TabsTrigger
            value="settings"
            className="flex items-center space-x-2 shrink-0 px-6 md:px-3 flex-1 md:flex-initial"
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">Настройки</span>
          </TabsTrigger>
        </TabsList>

        {availablePlatforms &&
          Object.entries(availablePlatforms)
            .sort(([a], [b]) => {
              // Instagram всегда первый
              if (a === "instagram") return -1;
              if (b === "instagram") return 1;
              // Остальные в алфавитном порядке
              return a.localeCompare(b);
            })
            .map(([platform, stats]) => (
              <TabsContent
                key={platform}
                value={platform}
                className="space-y-6"
              >
                {/* Platform Statistics */}
                <PlatformStatsRenderer
                  platform={platform}
                  stats={stats}
                  formData={formData}
                  editingSection={editingSection}
                  onEditingChange={onEditingSectionChange}
                  onSave={onSave}
                  saving={saving}
                  formatNumber={formatNumber}
                />

                {/* Screenshots Section - только для платформ */}
                <ScreenshotManagement
                  platform={platform}
                  screenshots={screenshots}
                  uploadingScreenshot={uploadingScreenshot}
                  loading={loadingScreenshots}
                  error={screenshotError}
                  onScreenshotUpload={onScreenshotUpload}
                  onDeleteScreenshot={onDeleteScreenshot}
                />

                {/* Platform-specific Forms */}
                {/* Убираем все формы платформ, так как все поля редактируются в блоке статистик выше */}
              </TabsContent>
            ))}

        <TabsContent value="settings" className="space-y-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-bold mb-4">Управление платформами</h3>
            {onAvailablePlatformsChange && (
              <PlatformManagement
                platforms={availablePlatforms}
                onPlatformsChange={onAvailablePlatformsChange}
                hasMaxPlatforms={hasMaxPlatforms}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const PlatformProfileForm = memo(PlatformProfileFormComponent);
