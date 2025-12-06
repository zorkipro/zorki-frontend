import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
  // Дополнительные поля для Person schema
  firstName?: string;
  lastName?: string;
  allNames?: string[];
  allUsernames?: string[];
  sameAs?: string[];
  platformName?: string;
  followers?: number;
  category?: string;
}

const SEOHead = ({
  title = "Zorki.pro - Рейтинг блогеров Беларуси",
  description = "Платформа, где бренды находят блогеров. Всё удобно и бесплатно.",
  keywords = [
    "блогеры беларуси",
    "рейтинг блогеров",
    "инфлюенсеры",
    "реклама в инстаграм",
    "реклама в тикток",
    "реклама в ютуб",
    "реклама в телеграм",
    "маркетинг",
    "продвижение",
    "сотрудничество с блогерами",
  ],
  image = "https://zorki.pro/og-image.jpg",
  url = "https://zorki.pro",
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noindex = false,
  nofollow = false,
  canonical,
  // Person schema дополнительные поля
  firstName,
  lastName,
  allNames = [],
  allUsernames = [],
  sameAs = [],
  platformName,
  followers,
  category,
}: SEOHeadProps) => {
  const fullTitle = title.includes("Zorki") ? title : `${title} | Zorki.pro`;
  const fullDescription =
    description.length > 160
      ? description.substring(0, 157) + "..."
      : description;

  const allKeywords = [...keywords, ...tags].join(", ");

  const robots = [
    noindex ? "noindex" : "index",
    nofollow ? "nofollow" : "follow",
  ].join(", ");

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={allKeywords} />
      <meta name="robots" content={robots} />
      <meta name="author" content={author || "Zorki.pro Team"} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="ru" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

      {/* Canonical URL - всегда устанавливаем для избежания дублей */}
      <link rel="canonical" href={canonical || url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image.startsWith("http") ? image : `https://zorki.pro${image}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Zorki.pro" />
      <meta property="og:locale" content="ru_RU" />

      {/* Article specific */}
      {type === "article" && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Profile specific */}
      {type === "profile" && author && (
        <>
          <meta property="profile:first_name" content={author.split(" ")[0] || author} />
          {author.includes(" ") && (
            <meta property="profile:last_name" content={author.split(" ").slice(1).join(" ")} />
          )}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image.startsWith("http") ? image : `https://zorki.pro${image}`} />
      <meta name="twitter:site" content="@zorki_pro" />
      <meta name="twitter:creator" content="@zorki_pro" />

      {/* Additional SEO */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="apple-mobile-web-app-title" content="Zorki.pro" />

      {/* Structured Data - WebSite/Article/Person */}
      <script type="application/ld+json">
        {JSON.stringify(
          type === "profile" && author
            ? {
                "@context": "https://schema.org",
                "@type": "Person",
                name: author,
                givenName: firstName || undefined,
                familyName: lastName || undefined,
                alternateName: allNames.length > 1 ? allNames.slice(1) : undefined,
                url: url,
                image: image,
                description: fullDescription,
                sameAs: sameAs.length > 0 ? sameAs : [url],
                knowsAbout: tags.length > 0 ? tags : keywords,
                jobTitle: platformName ? `${platformName} блогер` : "Блогер",
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
                // Дополнительные поля для лучшей индексации
                ...(followers ? { audience: {
                  "@type": "Audience",
                  audienceType: "Подписчики",
                  geographicArea: {
                    "@type": "Country",
                    name: "Беларусь",
                  },
                }} : {}),
                ...(category ? { knowsAbout: [...(tags.length > 0 ? tags : keywords), category] } : {}),
              }
            : type === "article"
            ? {
                "@context": "https://schema.org",
                "@type": "Article",
                headline: fullTitle,
                description: fullDescription,
                url: url,
                image: image,
                author: author
                  ? {
                      "@type": "Person",
                      name: author,
                    }
                  : undefined,
                publisher: {
                  "@type": "Organization",
                  "@id": "https://zorki.pro/#organization",
                  name: "Zorki.pro",
                  alternateName: "Zorki",
                  url: "https://zorki.pro",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://zorki.pro/logo.svg",
                    width: 512,
                    height: 512,
                  },
                },
                datePublished: publishedTime,
                dateModified: modifiedTime,
                keywords: allKeywords,
                inLanguage: "ru",
              }
            : {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Zorki.pro",
                alternateName: "Zorki",
                description: fullDescription,
                url: url,
                image: image,
                publisher: {
                  "@type": "Organization",
                  "@id": "https://zorki.pro/#organization",
                  name: "Zorki.pro",
                  alternateName: "Zorki",
                  url: "https://zorki.pro",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://zorki.pro/logo.svg",
                    width: 512,
                    height: 512,
                  },
                },
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://zorki.pro/?search={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
                keywords: allKeywords,
                inLanguage: "ru",
              }
        )}
      </script>
      
      {/* Organization Schema для логотипа в Google Search (только для главной страницы) */}
      {type === "website" && url === "https://zorki.pro" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://zorki.pro/#organization",
            name: "Zorki.pro",
            alternateName: "Zorki",
            url: "https://zorki.pro",
            logo: {
              "@type": "ImageObject",
              url: "https://zorki.pro/logo.svg",
              width: 512,
              height: 512,
            },
            description: "Платформа для поиска и сотрудничества с блогерами Беларуси",
            sameAs: [
              "https://zorki.pro",
            ],
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
