import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

function detectSiteUrl() {
  const direct =
    process.env.SITE_URL ||
    process.env.PUBLIC_SITE_URL ||
    process.env.VITE_SITE_URL ||
    process.env.VITE_PUBLIC_SITE_URL ||
    "";

  if (direct) return String(direct).replace(/\/+$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`.replace(/\/+$/, "");
  if (process.env.URL) return String(process.env.URL).replace(/\/+$/, "");

  // Fallback (change if you have a canonical domain)
  return "https://travelai-deals.com";
}

function readGuideLinks() {
  const guidesFile = path.join(repoRoot, "src", "data", "guides.js");
  if (!fs.existsSync(guidesFile)) return [];
  const content = fs.readFileSync(guidesFile, "utf8");

  const links = [];
  const linkRe = /link:\s*"([^"]+)"/g;
  let m;
  while ((m = linkRe.exec(content))) {
    const link = m[1];
    if (link && link.startsWith("/")) links.push(link);
  }
  return links;
}

function uniqueSorted(arr) {
  return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));
}

function toAbsolute(baseUrl, p) {
  if (/^https?:\/\//i.test(p)) return p;
  if (!p.startsWith("/")) return `${baseUrl}/${p}`;
  return `${baseUrl}${p}`;
}

function writeRobotsTxt(baseUrl) {
  const robotsPath = path.join(repoRoot, "public", "robots.txt");
  const robots = [
    "# https://www.robotstxt.org/robotstxt.html",
    "User-agent: *",
    "Disallow: /admin-dashboard",
    "Disallow: /user-profile",
    "Disallow: /reset-password",
    "Disallow: /login",
    "Disallow: /register",
    "Disallow: /search-offers/favorites",
    "Disallow: /checkout-success",
    "Disallow: /checkout-cancel",
    "",
    `Sitemap: ${baseUrl}/sitemap.xml`,
    "",
  ].join("\n");

  fs.writeFileSync(robotsPath, robots, "utf8");
}

function writeSitemapXml(baseUrl, paths) {
  const sitemapPath = path.join(repoRoot, "public", "sitemap.xml");
  const lastmod = new Date().toISOString().slice(0, 10);

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((p) => {
      const loc = toAbsolute(baseUrl, p);
      const changefreq = p.startsWith("/guides/") ? "monthly" : "weekly";
      const priority = p === "/" ? "1.0" : p.startsWith("/guides/") ? "0.8" : "0.7";
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n");
    }),
    "</urlset>",
    "",
  ].join("\n");

  fs.writeFileSync(sitemapPath, xml, "utf8");
}

const baseUrl = detectSiteUrl();

const staticPaths = [
  "/",
  "/search-offers",
  "/ai-chat-interface",
  "/flights",
  "/hotels",
  "/car-rental",
  "/esim",
  "/activities",
  "/contact",
  "/privacy-policy",
  "/terms-and-conditions",
  "/cookie-policy",
  "/affiliate-disclosure",
  "/guides/destinations-2025",
  "/guides/cheap-tickets",
  "/guides/hotel-booking",
];

const guideLinks = readGuideLinks();
const allPaths = uniqueSorted([...staticPaths, ...guideLinks]);

writeRobotsTxt(baseUrl);
writeSitemapXml(baseUrl, allPaths);

console.log(`[seo] robots.txt + sitemap.xml generated (baseUrl=${baseUrl})`);

