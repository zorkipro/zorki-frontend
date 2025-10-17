import React from 'react';
import { ScreenshotDisplay } from './ScreenshotDisplay';
import type { Screenshot } from '@/types/profile';

interface ScreenshotManagementProps {
  platform: string;
  screenshots: Screenshot[];
  uploadingScreenshot: boolean;
  loading?: boolean;
  error?: string;
  onScreenshotUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteScreenshot: (screenshot: Screenshot) => void;
}

export const ScreenshotManagement: React.FC<ScreenshotManagementProps> = React.memo(
  ({
    platform,
    screenshots,
    uploadingScreenshot,
    loading = false,
    error,
    onScreenshotUpload,
    onDeleteScreenshot,
  }) => {
    return (
      <ScreenshotDisplay
        platform={platform}
        screenshots={screenshots}
        loading={loading}
        showUploadButton={true}
        onScreenshotUpload={onScreenshotUpload}
        onDeleteScreenshot={onDeleteScreenshot}
        uploadingScreenshot={uploadingScreenshot}
        error={error}
      />
    );
  }
);

ScreenshotManagement.displayName = 'ScreenshotManagement';
