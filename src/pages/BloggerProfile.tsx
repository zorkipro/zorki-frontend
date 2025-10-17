import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/ui-kit';
import { LoadingSpinner } from '@/ui-kit/components';
import { useBloggerProfile } from '@/hooks/useBloggerProfile';
import { useScreenshotManager } from '@/hooks/profile/useScreenshotManager';
import { BloggerProfileHeader } from '@/components/blogger-profile/BloggerProfileHeader';
import { BloggerProfileTabs } from '@/components/blogger-profile/BloggerProfileTabs';
import { BloggerProfilePricing } from '@/components/blogger-profile/BloggerProfilePricing';

export const BloggerProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  // Use the optimized hook
  const { blogger, loading, error } = useBloggerProfile(username);

  // Use screenshot manager for the current platform
  const {
    screenshots,
    loading: loadingScreenshots,
    error: screenshotError,
  } = useScreenshotManager(
    blogger?.id,
    'instagram' // Default platform for screenshots
  );

  if (loading) {
    return <LoadingSpinner fullScreen text="Загрузка профиля..." />;
  }

  if (error || !blogger) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Блогер не найден</h1>
          <Button onClick={() => navigate('/')}>Вернуться к рейтингу</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <BloggerProfileHeader blogger={blogger} onBack={() => navigate('/')} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Stats - 3 columns */}
          <div className="lg:col-span-3">
            <BloggerProfileTabs
              blogger={blogger}
              screenshots={screenshots}
              loadingScreenshots={loadingScreenshots}
            />
          </div>

          {/* Sidebar - 1 column */}
          <div>
            <BloggerProfilePricing blogger={blogger} />
          </div>
        </div>
      </div>
    </div>
  );
};
