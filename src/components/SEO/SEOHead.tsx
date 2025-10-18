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
}

const SEOHead = ({
  title = "Zorki7 - Рейтинг блогеров Беларуси",
  description = "Найдите лучших блогеров Беларуси для рекламы. Рейтинг по подписчикам, ценам и охватам. Instagram, TikTok, YouTube, Telegram.",
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
  image = "/og-image.jpg",
  url = "https://zorki7.com",
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noindex = false,
  nofollow = false,
  canonical,
}: SEOHeadProps) => {
  const fullTitle = title.includes("Zorki7") ? title : `${title} | Zorki7`;
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
      <meta name="author" content={author || "Zorki7 Team"} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="ru" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Zorki7" />
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

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@zorki7" />
      <meta name="twitter:creator" content="@zorki7" />

      {/* Additional SEO */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="apple-mobile-web-app-title" content="Zorki7" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === "article" ? "Article" : "WebSite",
          name: fullTitle,
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
            name: "Zorki7",
            url: "https://zorki7.com",
            logo: {
              "@type": "ImageObject",
              url: "https://zorki7.com/logo.png",
            },
          },
          datePublished: publishedTime,
          dateModified: modifiedTime,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
          },
          keywords: allKeywords,
          inLanguage: "ru",
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
