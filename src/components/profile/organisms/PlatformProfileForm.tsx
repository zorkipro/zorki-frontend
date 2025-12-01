import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui-kit";
import { PlatformStatsRenderer } from "@/components/profile/PlatformStatsRenderer";
import { ScreenshotManagement } from "@/components/profile/ScreenshotManagement";
import {
  getPlatformIcon,
  getPlatformName,
} from "@/components/icons/PlatformIcons";
import { PlatformManagement } from "@/components/profile/PlatformManagement";
import type { EditData, PlatformData, Screenshot } from "@/types/profile";
import { Settings } from "lucide-react";

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

  // Blogger ID for API requests
  bloggerId?: number;
  isVerified?: boolean; // Статус верификации пользователя
  isAdmin?: boolean; // Флаг для использования админских функций
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
  bloggerId,
  isVerified = false,
  isAdmin = false,
}: PlatformProfileFormProps) => {
  const hasMaxPlatforms = Object.keys(availablePlatforms).length >= 4;

  const sortedPlatforms = Object.entries(availablePlatforms).sort(([a], [b]) => {
    if (a === "instagram") return -1;
    if (b === "instagram") return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <Tabs value={activeTab} onValueChange={onActiveTabChange}>
        <TabsList className="flex w-full overflow-x-auto whitespace-nowrap gap-1 sm:gap-2 mb-6 sm:mb-8 md:grid md:grid-cols-5 md:gap-0 md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {sortedPlatforms.map(([platform]) => (
            <TabsTrigger
              key={platform}
              value={platform}
              className="flex items-center justify-center space-x-1 sm:space-x-2 shrink-0 px-3 sm:px-4 md:px-3 min-w-[60px] sm:min-w-auto flex-1 md:flex-initial"
            >
              <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                {getPlatformIcon(platform)}
              </span>
              <span className="hidden sm:inline text-xs sm:text-sm">
                {getPlatformName(platform)}
              </span>
            </TabsTrigger>
          ))}
          <TabsTrigger
            value="settings"
            className="flex items-center justify-center space-x-1 sm:space-x-2 shrink-0 px-3 sm:px-4 md:px-3 min-w-[60px] sm:min-w-auto flex-1 md:flex-initial"
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span className="hidden sm:inline text-xs sm:text-sm">Настройки</span>
          </TabsTrigger>
        </TabsList>

        {sortedPlatforms.map(([platform, stats]) => (
              <TabsContent
                key={platform}
                value={platform}
                className="space-y-6 sm:space-y-8"
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
                  isPending={stats.isPending}
                  isVerified={isVerified}
                />

                {/* Screenshots Section - только для платформ */}
                <ScreenshotManagement
                  platform={platform}
                  screenshots={stats.screenshots || []}
                  uploadingScreenshot={uploadingScreenshot}
                  loading={loadingScreenshots}
                  error={screenshotError}
                  onScreenshotUpload={onScreenshotUpload}
                  onDeleteScreenshot={onDeleteScreenshot}
                />

              </TabsContent>
            ))}

        <TabsContent value="settings" className="space-y-6 sm:space-y-8">
          <div className="p-4 sm:p-6 border rounded-lg">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Управление платформами</h3>
            {onAvailablePlatformsChange && (
                <PlatformManagement
                  platforms={availablePlatforms}
                  onPlatformsChange={onAvailablePlatformsChange}
                  hasMaxPlatforms={hasMaxPlatforms}
                  bloggerId={bloggerId}
                  onPlatformUpdated={onActiveTabChange}
                  isVerified={isVerified}
                  isAdmin={isAdmin}
                />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const PlatformProfileForm = PlatformProfileFormComponent;
