import type { Article, HomePageData } from "@/lib/site-data";
import { siteMeta } from "@/lib/site-data";

function toIsoDate(dateString: string) {
  const value = new Date(dateString);
  return Number.isNaN(value.getTime()) ? dateString : value.toISOString();
}

export function buildSiteSchemas() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteMeta.url}/#organization`,
      name: siteMeta.name,
      url: siteMeta.url,
      description: siteMeta.description,
      email: siteMeta.contactEmail,
      keywords: siteMeta.keywords,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteMeta.url}/#website`,
      url: siteMeta.url,
      name: siteMeta.name,
      description: siteMeta.description,
      inLanguage: "en-US",
      publisher: { "@id": `${siteMeta.url}/#organization` },
      keywords: siteMeta.keywords,
    },
  ];
}

export function buildHomePageSchema(homePageData: HomePageData) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteMeta.url}/#homepage`,
    url: siteMeta.url,
    name: siteMeta.name,
    description: siteMeta.description,
    isPartOf: { "@id": `${siteMeta.url}/#website` },
    about: {
      "@type": "SportsOrganization",
      name: "FC Barcelona",
    },
    hasPart: [
      {
        "@type": "Article",
        headline: homePageData.hero.headline,
        url: `${siteMeta.url}${homePageData.hero.href ?? "/"}`,
      },
      {
        "@type": "CreativeWorkSeries",
        name: "Weekly Dispatch",
        url: `${siteMeta.url}${homePageData.newsletter.ctaHref}`,
      },
      {
        "@type": "CreativeWorkSeries",
        name: "Archive",
        url: `${siteMeta.url}${homePageData.vault.ctaHref}`,
      },
    ],
  };
}

export function buildArticleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteMeta.url}/article/${article.slug}#article`,
    mainEntityOfPage: `${siteMeta.url}/article/${article.slug}`,
    isPartOf: { "@id": `${siteMeta.url}/#website` },
    headline: article.headline,
    description: article.metaDescription ?? article.excerpt,
    articleSection: article.section,
    keywords: article.topics,
    datePublished: toIsoDate(article.date),
    author: {
      "@type": "Organization",
      name: siteMeta.editorialByline,
    },
    publisher: {
      "@id": `${siteMeta.url}/#organization`,
    },
    image: [
      {
        "@type": "ImageObject",
        url: article.heroImage.src,
        caption: article.heroCaption,
        creditText: article.heroCredit,
      },
    ],
  };
}
