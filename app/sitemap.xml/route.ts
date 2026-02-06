import fs from "fs";
import path from "path";
import matter from "gray-matter";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prabin194.com.np";
const CONTENT_DIR = path.join(process.cwd(), "@content");

type UrlEntry = { loc: string; lastmod?: string };

function getStaticRoutes(): UrlEntry[] {
  const routes = ["", "/about", "/blog", "/projects"];
  return routes.map((r) => ({ loc: `${SITE_URL}${r}` }));
}

function getBlogRoutes(): UrlEntry[] {
  const blogDir = path.join(CONTENT_DIR, "blogs");
  if (!fs.existsSync(blogDir)) return [];

  const years = fs
    .readdirSync(blogDir)
    .filter((y) => /^\d{4}$/.test(y));

  const entries: UrlEntry[] = [];

  for (const year of years) {
    const yearPath = path.join(blogDir, year);
    const files = fs
      .readdirSync(yearPath)
      .filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const filePath = path.join(yearPath, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);
      const slug = file.replace(".md", "");
      entries.push({
        loc: `${SITE_URL}/articles/${year}/${slug}`,
        lastmod: data.date,
      });
    }
  }

  return entries;
}

function getProjectRoutes(): UrlEntry[] {
  const projectsDir = path.join(CONTENT_DIR, "projects");
  if (!fs.existsSync(projectsDir)) return [];

  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".md"));
  if (files.length === 0) return [];

  // Projects page is static; include as aggregate entry
  return [{ loc: `${SITE_URL}/projects` }];
}

export async function GET() {
  const urls = [
    ...getStaticRoutes(),
    ...getProjectRoutes(),
    ...getBlogRoutes(),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}
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
