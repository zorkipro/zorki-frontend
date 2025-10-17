import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/ui-kit';
import { Card, CardContent } from '@/ui-kit';
import { Label } from '@/ui-kit';
import { Textarea } from '@/ui-kit';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui-kit';
import { ArrowLeft, AlertCircle, Edit } from 'lucide-react';
import { Alert, AlertDescription } from '@/ui-kit';
import { LoadingSpinner } from '@/ui-kit/components';
import { logError } from '@/utils/logger';

// Импортируем переиспользуемые компоненты
import { BloggerInfo } from '@/components/profile/BloggerInfo';
import { VerificationNotice } from '@/components/profile/VerificationNotice';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PlatformProfileForm } from '@/components/profile/organisms/PlatformProfileForm';
import { PricingSection } from '@/components/profile/organisms/PricingSection';

// Импортируем хук и типы
import { useAdminBloggerEditor } from '@/hooks/admin/useAdminBloggerEditor';
import { useScreenshotManager } from '@/hooks/profile/useScreenshotManager';
import { useAuth } from '@/contexts/AuthContext';
import { formatNumber } from '@/utils/formatters';
import type { Blogger } from '@/types/blogger';

export const AdminBloggerEditor = () => {
  const { user } = useAuth();
  const { username } = useParams();
  const navigate = useNavigate();

  // Используем специализированный хук для админа
  const {
    profile,
    formData,
    loading,
    saving,
    error,
    activeTab,
    editingSection,
    availablePlatforms,
    updateFormData,
    handleSave,
    setActiveTab,
    setEditingSection,
    setAvailablePlatforms,
  } = useAdminBloggerEditor(username);

  // Управление скриншотами
  const {
    screenshots,
    uploading: uploadingScreenshot,
    loading: loadingScreenshots,
    error: screenshotError,
    uploadScreenshot,
    uploadMultipleScreenshots,
    deleteScreenshot,
  } = useScreenshotManager(
    profile?.id?.toString(),
    activeTab === 'settings'
      ? 'instagram'
      : (activeTab as 'instagram' | 'tiktok' | 'youtube' | 'telegram'),
    true
  );

  // Загрузка скриншотов
  const handleScreenshotUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || !profile?.id || !user?.id) {
      logError('Missing required data:', {
        files: !!files,
        profileId: !!profile?.id,
        userId: !!user?.id,
      });
      return;
    }

    try {
      const fileArray = Array.from(files);

      if (fileArray.length === 1) {
        await uploadScreenshot(fileArray[0], user.id);
      } else {
        await uploadMultipleScreenshots(fileArray, user.id);
      }
    } catch (error) {
      logError('Error uploading screenshots:', error);
    } finally {
      event.target.value = '';
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Загрузка профиля..." />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Профиль не найден</h3>
            <p className="text-muted-foreground mb-4">
              Запрашиваемый профиль не существует или у вас нет доступа к нему.
            </p>
            <Button onClick={() => navigate('/admin')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к админке
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Преобразуем данные профиля в формат, ожидаемый ProfileHeader
  const profileForHeader = profile
    ? {
        id: profile.id.toString(),
        name:
          profile.social?.title || profile.name || profile.social?.username || 'Неизвестный блогер',
        handle: profile.social?.username || '',
        avatar: profile.social?.avatar || '',
        promoText: profile.social?.description || '',
        platforms: {
          instagram: profile.social
            ? {
                username: profile.social.username,
                followers: parseInt(profile.social.subscribers || '0'),
                avatar: profile.social.avatar,
                engagementRate: profile.social.er || 0,
              }
            : undefined,
        },
        followers: parseInt(profile.social?.subscribers || '0'),
        postPrice: parseFloat(profile.price?.postPrice || '0'),
        storyPrice: parseFloat(profile.price?.storiesPrice || '0'),
        postReach: parseInt(profile.social?.coverage || '0'),
        storyReach: parseInt(profile.social?.coverage || '0'),
        engagementRate: profile.social?.er || 0,
        gender: profile.genderType?.toLowerCase() as
          | 'мужчина'
          | 'женщина'
          | 'пара'
          | 'паблик'
          | undefined,
        category: '',
        topics: [],
        allowsBarter: false,
        inMartRegistry: false,
        restrictedTopics: [],
        cooperationConditions: '',
        workFormat: '',
        paymentTerms: '',
        contact_url: '',
        verificationStatus: profile.verificationStatus,
      }
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {profileForHeader && (
        <ProfileHeader
          profile={profileForHeader}
          formData={formData}
          hasUnsavedChanges={false}
          onBack={() => navigate('/admin')}
          onFormDataChange={updateFormData}
          editingSection={editingSection}
          onEditingSectionChange={setEditingSection}
          handleSave={handleSave}
          saving={saving}
          setEditingSection={setEditingSection}
        />
      )}

      {/* Error Messages */}
      {error && (
        <div className="container mx-auto px-4 pt-4">
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Form - 3 columns */}
          <div className="lg:col-span-3">
            <PlatformProfileForm
              formData={formData}
              onFormDataChange={updateFormData}
              availablePlatforms={availablePlatforms}
              onAvailablePlatformsChange={setAvailablePlatforms}
              formatNumber={formatNumber}
              activeTab={activeTab}
              onActiveTabChange={setActiveTab}
              editingSection={editingSection}
              onEditingSectionChange={setEditingSection}
              onSave={handleSave}
              saving={saving}
              screenshots={screenshots}
              uploadingScreenshot={uploadingScreenshot}
              loadingScreenshots={loadingScreenshots}
              screenshotError={screenshotError}
              onScreenshotUpload={handleScreenshotUpload}
              onDeleteScreenshot={deleteScreenshot}
            />
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Prices */}
            <PricingSection
              availablePlatforms={availablePlatforms}
              formData={formData}
              editingSection={editingSection}
              onEditingSectionChange={setEditingSection}
              onSave={handleSave}
              saving={saving}
            />

            {/* Blogger Info */}
            <BloggerInfo
              formData={formData}
              editingSection={editingSection}
              onEditingChange={setEditingSection}
              onSave={handleSave}
              saving={saving}
            />

            {/* Cooperation Terms */}
            <Card className="relative">
              <CardContent className="p-4">
                <div className="absolute top-2 right-2">
                  <Dialog
                    open={editingSection === 'cooperation_conditions'}
                    onOpenChange={(open) =>
                      setEditingSection(open ? 'cooperation_conditions' : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Редактировать условия сотрудничества</DialogTitle>
                        <DialogDescription>
                          Обновите условия сотрудничества для профиля
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cooperation_conditions">Условия сотрудничества</Label>
                          <Textarea
                            id="cooperation_conditions"
                            defaultValue={formData.cooperation_conditions}
                            placeholder="Опишите условия сотрудничества..."
                            rows={4}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setEditingSection(null)}>
                            Отмена
                          </Button>
                          <Button
                            onClick={async () => {
                              const textarea = document.getElementById(
                                'cooperation_conditions'
                              ) as HTMLTextAreaElement;
                              try {
                                await handleSave({ cooperation_conditions: textarea.value });
                                setEditingSection(null);
                              } catch (error) {
                                // Ошибка уже обработана в handleSave
                              }
                            }}
                            disabled={saving}
                          >
                            Сохранить
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <h3 className="font-semibold mb-4">Условия сотрудничества</h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {formData.cooperation_conditions ||
                      'Нажмите на иконку редактирования, чтобы добавить условия сотрудничества...'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <VerificationNotice
              profileStatus={profile?.verificationStatus === 'APPROVED' ? 'verified' : 'unverified'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBloggerEditor;
