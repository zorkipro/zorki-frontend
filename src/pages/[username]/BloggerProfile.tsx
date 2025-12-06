import {useParams, useNavigate, useLocation} from "react-router-dom";
import {useMemo} from "react";
import { Button } from "@/ui-kit";
import { LoadingSpinner } from "@/ui-kit/components";
import { useBloggerProfile } from "@/hooks/useBloggerProfile.ts";
import { BloggerProfileHeader } from "@/components/blogger-profile/BloggerProfileHeader.tsx";
import { BloggerProfileTabs } from "@/components/blogger-profile/BloggerProfileTabs.tsx";
import { BloggerProfilePricing } from "@/components/blogger-profile/BloggerProfilePricing.tsx";
import SEOHead from "@/components/SEO/SEOHead.tsx";
import { useBloggerSEO } from "@/hooks/useBloggerSEO.ts";
import { BloggerStructuredData } from "@/components/SEO/BloggerStructuredData.tsx";
import { BloggerHiddenSEO } from "@/components/SEO/BloggerHiddenSEO.tsx";

const BloggerProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // Получаем bloggerId только из state (для обычных переходов)
  const bloggerId = location.state?.bloggerId ?? undefined;
  // Use the optimized hook
  const { blogger, loading, error } = useBloggerProfile({username, id: Number(bloggerId)});

  // Генерируем SEO данные для блогера
  const seoData = useBloggerSEO(blogger);

  if (loading) {
    return <LoadingSpinner fullScreen text="Загрузка профиля..." />;
  }

  if (error || !blogger) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SEOHead
          title="Блогер не найден | Zorki.pro"
          description="Профиль блогера не найден на платформе Zorki.pro"
          noindex={true}
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Блогер не найден</h1>
          <Button onClick={() => navigate("/")}>Вернуться к рейтингу</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...seoData} />
      {/* Расширенный Structured Data для лучшей индексации */}
      <BloggerStructuredData blogger={blogger} seoData={seoData} />
      {/* Скрытый SEO-контент (виден поисковикам, скрыт от пользователей) */}
      <BloggerHiddenSEO
        name={blogger.name}
        firstName={seoData.firstName}
        lastName={seoData.lastName}
        allNames={seoData.allNames || []}
        allUsernames={seoData.allUsernames || []}
        platformName={seoData.platformName}
        category={seoData.category}
      />
      {/* Header */}
      <BloggerProfileHeader blogger={blogger} onBack={() => navigate("/")} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Stats - 3 columns */}
          <div className="lg:col-span-3">
            <BloggerProfileTabs blogger={blogger} />
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


export default BloggerProfile;