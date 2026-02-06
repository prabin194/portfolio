import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { getLatestBlog } from '@/lib/mdUtils'

export default async function Home() {
  const blogPosts = await getLatestBlog()

  return (
    <div className="space-y-20">
      <section className="flex items-start justify-between">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold">Hey, I&apos;m Prabin</h1>
          <p className="mt-4 text-lg text-zinc-400">
            I&apos;m a software developer who loves making web and mobile application projects and writes about code, design, and more.
            Welcome to you all. 🌱
          </p>
        </div>
        <Image
          src="/portfilo.jpeg"
          alt="Profile mascot"
          width={150}
          height={150}
          className="hidden lg:block rounded-full"
          priority
        />
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest Posts</h2>
          <Link href="/blog" className="text-sm text-emerald-400 hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-6 space-y-4">
          {blogPosts.map((post) => (
            <Link
              key={post.title}
              href={`/articles/${post.year}/${post.slug}`}
              className="block"
            >
              <div className="flex items-center justify-between group">
                <span className="group-hover:text-emerald-400 transition-colors">
                  {post.title}
                </span>
                <span className="text-sm text-emerald-400">
                  {post.date}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
