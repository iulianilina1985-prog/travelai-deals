import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_LANG,
  DEFAULT_LOCALE,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
} from "./siteMeta";
import { toAbsoluteUrl } from "./url";

function truncate(s, max) {
  const text = String(s || "").trim();
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function asArray(v) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

const SEO = ({
  title,
  description,
  image,
  canonicalPath,
  lang = DEFAULT_LANG,
  locale = DEFAULT_LOCALE,
  type = "website",
  noindex = false,
  jsonLd,
}) => {
  const location = useLocation();
  const path = canonicalPath ?? `${location.pathname}${location.search}${location.hash}`;

  const fullTitle = title ? `${title} – ${SITE_NAME}` : DEFAULT_TITLE;
  const metaDescription = truncate(description || DEFAULT_DESCRIPTION, 160);
  const canonicalUrl = toAbsoluteUrl(path || "/");
  const ogImage = toAbsoluteUrl(image || DEFAULT_OG_IMAGE);

  const robotsContent = noindex ? "noindex,nofollow" : "index,follow";

  const jsonLdItems = asArray(jsonLd)
    .filter(Boolean)
    .map((x) => JSON.stringify(x));

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content={robotsContent} />

      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLdItems.map((payload, idx) => (
        <script key={idx} type="application/ld+json">
          {payload}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;

