import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/ui-kit";
import { LoadingSpinner } from "@/ui-kit/components";
import { useBloggerProfile } from "@/hooks/useBloggerProfile";
import { BloggerProfileHeader } from "@/components/blogger-profile/BloggerProfileHeader";
import { BloggerProfileTabs } from "@/components/blogger-profile/BloggerProfileTabs";
import { BloggerProfilePricing } from "@/components/blogger-profile/BloggerProfilePricing";

export const BloggerProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { blogger, loading, error } = useBloggerProfile(username);

  if (loading) return <LoadingSpinner fullScreen text="Загрузка профиля..." />;
  if (!blogger) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Блогер не найден</h1>
        <Button onClick={() => navigate("/")}>Вернуться к рейтингу</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BloggerProfileHeader blogger={blogger} onBack={() => navigate("/")} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <BloggerProfileTabs blogger={blogger} />
          </div>
          <div>
            <BloggerProfilePricing blogger={blogger} />
          </div>
        </div>
      </div>
    </div>
  );
};
