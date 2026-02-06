import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Calendar } from "lucide-react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import sanitizeHtml from "sanitize-html";

export const dynamic = "force-dynamic";

interface ArticlePageParams {
  year: string;
  slug: string;
}

type ArticlePageProps = {
  params: Promise<ArticlePageParams>;
};

export async function generateMetadata({ params }: { params: Promise<ArticlePageParams> }): Promise<Metadata> {
  const { year, slug } = await params;
  const filePath = path.join(process.cwd(), "@content/blogs", year, `${slug}.md`);
  
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    
    return {
      title: data.title || "Untitled Article",
      description: data.description || data.title || "No description provided",
    };
  } catch (error) {
    return {
      title: "Not Found",
      description: "The requested article could not be found",
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { year, slug } = await params;

  if (!year || !slug) {
    notFound();
  }

  const safeYear = String(year);
  const safeSlug = String(slug);

  const filePath = path.resolve(process.cwd(), "@content", "blogs", safeYear, `${safeSlug}.md`);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const processedContent = await remark()
      .use(html)
      .process(content);

    const sanitizedHtml = sanitizeHtml(processedContent.toString());

    if (!data?.title) {
      notFound();
    }

    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{data.title}</h1>
          {data.date && (
            <div className="mt-2 flex items-center text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <time dateTime={data.date}>{data.date}</time>
            </div>
          )}
          {Array.isArray(data.tags) && data.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {data.tags.map((tag: string) => (
                <span
                  key={`${data.slug || slug}-${tag}`}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </div>
    );
  } catch (error) {
    console.error("Error reading or parsing the file:", error);
    notFound();
  }
}
