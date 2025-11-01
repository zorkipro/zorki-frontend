import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui-kit";
import { TrendingUp, AlertCircle } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { Screenshot } from "@/types/profile";
import {
  getPlatformIcon,
  getPlatformName,
} from "@/components/icons/PlatformIcons";
import { FILE_VALIDATION } from "@/config/validation";

interface ScreenshotDisplayProps {
  platform: string;
  screenshots: Screenshot[];
  loading?: boolean;
  showUploadButton?: boolean;
  onScreenshotUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteScreenshot?: (screenshot: Screenshot) => void;
  uploadingScreenshot?: boolean;
  error?: string;
  isVerified?: boolean;
  createdBy?: string;
}

export const ScreenshotDisplay: React.FC<ScreenshotDisplayProps> = React.memo(
  ({
    platform,
    screenshots,
    loading = false,
    showUploadButton = false,
    onScreenshotUpload,
    onDeleteScreenshot,
    uploadingScreenshot = false,
    error,
    isVerified = true,
    createdBy = "admin",
  }) => {
    const [lightboxIndex, setLightboxIndex] = useState(-1);

    const platformName = getPlatformName(platform);
    const platformIcon = getPlatformIcon(platform);

    // Prepare slides for lightbox
    const slides = screenshots.map((screenshot, index) => ({
      src: screenshot.file_url,
      alt: `Скриншот статистики ${platformName} ${index + 1}`,
      width: 1920,
      height: 1080,
    }));

    const handleDeleteCurrent = () => {
      if (
        lightboxIndex >= 0 &&
        screenshots[lightboxIndex] &&
        onDeleteScreenshot
      ) {
        onDeleteScreenshot(screenshots[lightboxIndex]);
        setLightboxIndex(-1);
      }
    };

    // Don't render the component if there are no screenshots and upload button is disabled
    if (!loading && screenshots.length === 0 && !showUploadButton) {
      return null;
    }

    // Если пользователь не верифицирован и блогер создан пользователем, показываем сообщение
    const shouldShowScreenshots = isVerified || createdBy === "admin";
    const shouldShowHiddenMessage =
      !shouldShowScreenshots && screenshots.length === 0 && !loading;

    return (
      <>
        <Card className="mt-6 border-0 shadow-sm">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex flex-wrap items-center gap-2 sm:gap-3 text-base sm:text-lg">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                {platformIcon}
              </div>
              <span className="flex-1 min-w-0">
                <span className="hidden sm:inline">Скриншоты статистики {platformName}</span>
                <span className="sm:hidden">Скриншоты {platformName}</span>
              </span>
              <div className="flex items-center space-x-2 flex-shrink-0">
                {screenshots.length > 0 && (
                  <span className="text-xs sm:text-sm font-normal text-muted-foreground whitespace-nowrap">
                    {screenshots.length} {screenshots.length === 1 ? "фото" : "фото"}
                  </span>
                )}
                {screenshots.length >= FILE_VALIDATION.MAX_STATS_FILES && (
                  <div className="flex items-center space-x-1 text-amber-600">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-[10px] sm:text-xs">Лимит</span>
                  </div>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Upload Button - only show if enabled */}
            {showUploadButton && onScreenshotUpload && (
              <div className="mb-6">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf"
                  multiple
                  onChange={(e) => {
                    if (onScreenshotUpload) {
                      onScreenshotUpload(e);
                    }
                  }}
                  className="hidden"
                  id={`screenshot-upload-${platform}`}
                  disabled={uploadingScreenshot}
                />
                <label htmlFor={`screenshot-upload-${platform}`}>
                  <div
                    className={`w-full h-12 sm:h-14 border-dashed border-2 border-muted-foreground/25 rounded-md hover:border-primary hover:bg-primary/5 transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 cursor-pointer ${uploadingScreenshot ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="flex items-center space-x-2 sm:space-x-3 px-2">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="font-medium text-sm sm:text-base text-center">
                        {uploadingScreenshot
                          ? "Загрузка..."
                          : `Загрузить скриншоты статистики ${platformName}`}
                      </span>
                      {uploadingScreenshot && (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
                      )}
                    </span>
                  </div>
                </label>
                {/* File format and size info */}
                <div className="mt-2 text-[10px] sm:text-xs text-muted-foreground text-center px-2">
                  <span className="hidden sm:inline">
                    Поддерживаемые форматы: JPEG, PNG, GIF, WebP, PDF • Максимальный размер: 10MB • До {FILE_VALIDATION.MAX_STATS_FILES} файлов для {platformName}
                  </span>
                  <span className="sm:hidden">
                    JPEG, PNG, WebP, PDF • До 10MB • До {FILE_VALIDATION.MAX_STATS_FILES} файлов
                  </span>
                  {screenshots.length > 0 && (
                    <span className="block mt-1">
                      Загружено: {screenshots.length} из {FILE_VALIDATION.MAX_STATS_FILES}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Screenshots Grid */}
            {loading ? (
              // Skeleton loading state
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                      <div className="w-full h-full relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_ease-in-out_infinite]" />
                        <div className="w-full h-full bg-gray-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : screenshots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                {screenshots.map((screenshot, index) => (
                  <div key={`screenshot-${screenshot.id}-${index}`} className="relative group">
                    <div
                      className="w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-all duration-200 border hover:shadow-lg hover:scale-[1.02]"
                      onClick={() => setLightboxIndex(index)}
                    >
                      <img
                        src={screenshot.file_url}
                        alt={`Скриншот статистики ${platformName}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          // Silent - image loading failed
                        }}
                      />
                    </div>
                    {/* Delete button - only show if onDeleteScreenshot is provided */}
                    {onDeleteScreenshot && (
                      <button
                        className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 h-6 w-6 sm:h-8 sm:w-8 p-0 bg-red-500/90 hover:bg-red-600 backdrop-blur-sm rounded sm:rounded-md flex items-center justify-center z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteScreenshot(screenshot);
                        }}
                        aria-label="Удалить скриншот"
                      >
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                    <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-black/70 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm">
                      {index + 1}/{screenshots.length}
                    </div>
                  </div>
                ))}
              </div>
            ) : shouldShowHiddenMessage ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 opacity-50" />
                </div>
                <h3 className="text-lg font-medium mb-2">Скриншоты скрыты</h3>
                <p className="text-sm text-muted-foreground">
                  Скриншоты статистики будут доступны после верификации блогера
                  администратором
                </p>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 opacity-50" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Скриншоты статистики не загружены
                </h3>
                <p className="text-sm text-muted-foreground">
                  {showUploadButton
                    ? `Загрузите скриншоты вашей статистики ${platformName}`
                    : `Скриншоты статистики ${platformName} не загружены`}
                </p>
                {showUploadButton && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Поддерживаемые форматы: JPG, PNG, WebP, PDF (макс. 10MB). 
                    Максимум {FILE_VALIDATION.MAX_STATS_FILES} файлов для {platformName}.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lightbox for Screenshot Viewing */}
        <Lightbox
          open={lightboxIndex >= 0}
          index={lightboxIndex}
          close={() => setLightboxIndex(-1)}
          slides={slides}
          carousel={{
            finite: screenshots.length <= 1,
          }}
          render={{
            buttonPrev: screenshots.length <= 1 ? () => null : undefined,
            buttonNext: screenshots.length <= 1 ? () => null : undefined,
          }}
          controller={{
            closeOnBackdropClick: true,
          }}
          styles={{
            container: {
              backgroundColor: "rgba(0, 0, 0, 0.95)",
            },
          }}
        />

        {/* Custom overlay for delete button when lightbox is open */}
        {lightboxIndex >= 0 && onDeleteScreenshot && (
          <div className="fixed inset-0 z-[9999] pointer-events-none">
            <div className="absolute top-4 right-4 pointer-events-auto">
              <div className="flex items-center space-x-2 bg-black/80 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center space-x-2 text-white text-sm">
                  {platformIcon}
                  <span>
                    Скриншот {lightboxIndex + 1} из {screenshots.length} -{" "}
                    {platformName}
                  </span>
                </div>
                <button
                  onClick={handleDeleteCurrent}
                  className="bg-red-500/90 hover:bg-red-600 text-white border-0 ml-4 px-3 py-1 rounded-md flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Удалить</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
);

ScreenshotDisplay.displayName = "ScreenshotDisplay";
