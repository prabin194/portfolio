import { getBlogs } from "@/lib/mdUtils"
import { BlogFilter, BlogItem } from "@/components/blog-filter"

export default async function BlogPage() {
  const blogYears = await getBlogs()

  const posts: BlogItem[] = blogYears.flatMap((yearGroup) =>
    yearGroup.posts.map((post) => ({
      ...post,
      year: yearGroup.year,
    }))
  )

  return (
    <div className="space-y-12">
      <h1 className="text-4xl font-bold">Blog</h1>
      <BlogFilter posts={posts} />
    </div>
  )
}
