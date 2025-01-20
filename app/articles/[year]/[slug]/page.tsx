import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Calendar } from "lucide-react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface ArticlePageProps {
  params: {
    year: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: { params: { year: string; slug: string } }): Promise<Metadata> {
  const filePath = path.join(process.cwd(), "@content/blogs", params.year, `${params.slug}.md`);
  
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
  const { year, slug } = params;

  const filePath = path.join(process.cwd(), "@content/blogs", year, `${slug}.md`);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    if (!data?.title) {
      notFound();
    }

    const metadata = await generateMetadata({ params });

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
        </div>
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </div>
    );
  } catch (error) {
    console.error("Error reading or parsing the file:", error);
    notFound();
  }
}
