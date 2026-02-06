const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prabin194.com.np";

const staticRoutes = [
  "",
  "/about",
  "/blog",
  "/projects",
];

export async function GET() {
  const pages = staticRoutes.map((path) => `${SITE_URL}${path}`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
