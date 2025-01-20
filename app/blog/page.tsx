import Link from "next/link"
import { getBlogs } from "@/lib/mdUtils"

interface BlogPost {
  title: string
  slug: string
  date: string
}

interface BlogYear {
  year: string
  posts: BlogPost[]
}


export default async function BlogPage() {
  const blogPosts = await getBlogs()

  return (
    <div className="space-y-12">
      <h1 className="text-4xl font-bold">Blog</h1>

      {blogPosts.map((yearGroup) => (
        <section key={yearGroup.year} className="space-y-4">
          <h2 className="text-2xl font-bold">{yearGroup.year}</h2>
          <div className="space-y-2">
            {yearGroup.posts.map((post) => (
              <div key={post.slug} className="flex items-center justify-between group">
                <Link
                  href={`/articles/${yearGroup.year}/${post.slug}`}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {post.title}
                </Link>
                <span className="text-primary text-sm tabular-nums">
                  {post.date}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

