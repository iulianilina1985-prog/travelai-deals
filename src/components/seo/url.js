export function getSiteUrl() {
  const fromEnv =
    import.meta?.env?.VITE_SITE_URL ||
    import.meta?.env?.VITE_PUBLIC_SITE_URL ||
    import.meta?.env?.VITE_APP_URL ||
    "";

  if (fromEnv) return String(fromEnv).replace(/\/+$/, "");
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "";
}

export function toAbsoluteUrl(pathOrUrl) {
  const s = String(pathOrUrl || "");
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;

  const base = getSiteUrl();
  if (!base) return s;
  if (s.startsWith("/")) return `${base}${s}`;
  return `${base}/${s}`;
}

