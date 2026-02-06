const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prabin194.com.np";

export async function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
