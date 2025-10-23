import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { getBloggerProfilePath } from "@/config/routes.ts";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui-kit";
import { Alert, AlertDescription } from "@/ui-kit";
import { LoadingSpinner } from "@/ui-kit/components";

// Components
import { BloggerInfo } from "@/components/profile/BloggerInfo.tsx";
import { VerificationNotice } from "@/components/profile/VerificationNotice.tsx";
import { ProfileHeader } from "@/components/profile/ProfileHeader.tsx";
import { PlatformProfileForm } from "@/components/profile/organisms/PlatformProfileForm.tsx";
import { PricingSection } from "@/components/profile/organisms/PricingSection.tsx";
import { CooperationTermsSection } from "@/components/profile/CooperationTermsSection.tsx";

// Hooks
import { useProfileEditor } from "@/hooks/profile/useProfileEditor.ts";
import { useScreenshotManager } from "@/hooks/profile/useScreenshotManager.ts";

// Utils
import { formatNumber } from "@/utils/formatters.ts";

export const ProfileEditor = () => {
  const { user, bloggerInfo } = useAuth();
  const navigate = useNavigate();

  // Use the comprehensive useProfileEditor hook instead of duplicate state
  const {
    profile,
    loading,
    saving,
    error,
    formData,
    availablePlatforms,
    activeTab,
    editingSection,
    updateFormData,
    handleSave,
    setActiveTab,
    setEditingSection,
    setAvailablePlatforms,
    hasDrafts,
  } = useProfileEditor();

  // Use the fixed useScreenshotManager hook with platform support
  const {
    screenshots,
    uploading: uploadingScreenshot,
    loading: loadingScreenshots,
    error: screenshotError,
    uploadScreenshot,
    uploadMultipleScreenshots,
    deleteScreenshot,
  } = useScreenshotManager(
    profile?.id,
    activeTab === "settings"
      ? "instagram"
      : (activeTab as "instagram" | "tiktok" | "youtube" | "telegram"),
    true, // isEditorPage = true для страницы редактирования
  );

  // Handle screenshot upload with proper file validation and platform support
  const handleScreenshotUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (!files || !profile?.id || !user?.id) {
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
        // Ошибка загрузки скриншотов
      } finally {
        event.target.value = "";
      }
    },
    [profile?.id, user?.id, uploadScreenshot, uploadMultipleScreenshots],
  );

  if (loading) {
    return <LoadingSpinner fullScreen text="Загрузка профиля..." />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Профиль не найден</CardTitle>
            <CardDescription>
              Запрашиваемый профиль не существует или у вас нет доступа к нему.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                На главную
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ProfileHeader
        profile={profile}
        formData={formData}
        onBack={() => {
          navigate("/");
        }}
        onFormDataChange={updateFormData}
        editingSection={editingSection}
        onEditingSectionChange={setEditingSection}
        handleSave={handleSave}
        saving={saving}
      />

      {/* Success/Error Messages */}
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
          {/* Main Stats - 3 columns */}
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
              bloggerId={profile?.id ? parseInt(profile.id, 10) : undefined}
              isVerified={profile?.verificationStatus === "APPROVED"}
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
              setAvailablePlatforms={setAvailablePlatforms}
            />

            <BloggerInfo
              formData={formData}
              editingSection={editingSection}
              onEditingChange={setEditingSection}
              onSave={handleSave}
              saving={saving}
            />

            <CooperationTermsSection
              cooperationConditions={formData.cooperation_conditions || ""}
              editingSection={editingSection}
              saving={saving}
              onEditingSectionChange={setEditingSection}
              onSave={handleSave}
            />

            <VerificationNotice
              profileStatus={
                profile?.verificationStatus === "APPROVED"
                  ? "verified"
                  : "unverified"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
