import { Helmet } from "react-helmet-async";
import type { Blogger } from "@/types/blogger";

interface BloggerStructuredDataProps {
  blogger: Blogger;
  seoData: {
    url: string;
    image: string;
    description: string;
    firstName?: string;
    lastName?: string;
    allNames?: string[];
    allUsernames?: string[];
    sameAs?: string[];
    platformName?: string;
    followers?: number;
    category?: string;
    keywords?: string[];
  };
}

/**
 * Расширенный Structured Data для страницы блогера
 * Оптимизирован для поиска по имени, фамилии и никнейму
 */
export const BloggerStructuredData = ({ blogger, seoData }: BloggerStructuredDataProps) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: blogger.name,
    givenName: seoData.firstName || undefined,
    familyName: seoData.lastName || undefined,
    alternateName: seoData.allNames && seoData.allNames.length > 1 
      ? seoData.allNames.slice(1) 
      : undefined,
    url: seoData.url,
    image: seoData.image,
    description: seoData.description,
    sameAs: seoData.sameAs && seoData.sameAs.length > 0 
      ? seoData.sameAs 
      : [seoData.url],
    jobTitle: seoData.platformName 
      ? `${seoData.platformName} блогер` 
      : "Блогер",
    worksFor: {
      "@type": "Organization",
      name: "Zorki.pro",
      url: "https://zorki.pro",
    },
    affiliation: {
      "@type": "Organization",
      name: "Zorki.pro",
      url: "https://zorki.pro",
    },
    knowsAbout: seoData.keywords || [],
    ...(seoData.followers ? {
      audience: {
        "@type": "Audience",
        audienceType: "Подписчики",
        audienceSize: {
          "@type": "QuantitativeValue",
          value: seoData.followers,
        },
        geographicArea: {
          "@type": "Country",
          name: "Беларусь",
        },
      },
    } : {}),
    ...(seoData.category ? {
      knowsAbout: [...(seoData.keywords || []), seoData.category],
    } : {}),
  };

  // Удаляем undefined поля
  const cleanData = JSON.parse(JSON.stringify(structuredData));

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(cleanData)}
      </script>
    </Helmet>
  );
};
