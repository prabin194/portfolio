"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

export type BlogItem = {
  title: string
  slug: string
  date: string
  year: string
  tags: string[]
}

function groupByYear(items: BlogItem[]) {
  return items.reduce<Record<string, BlogItem[]>>((acc, item) => {
    acc[item.year] = acc[item.year] || []
    acc[item.year].push(item)
    return acc
  }, {})
}

export function BlogFilter({ posts }: { posts: BlogItem[] }) {
  const allTags = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => p.tags?.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [posts])

  const allYears = useMemo(() => {
    const set = new Set(posts.map((p) => p.year))
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [posts])

  const [tag, setTag] = useState<string>("All")
  const [year, setYear] = useState<string>("All")
  const [search, setSearch] = useState<string>("")

  const filtered = useMemo(() => {
    return posts
      .filter((p) => (year === "All" ? true : p.year === year))
      .filter((p) => (tag === "All" ? true : p.tags?.includes(tag)))
      .filter((p) =>
        search
          ? p.title.toLowerCase().includes(search.trim().toLowerCase())
          : true
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [posts, tag, year, search])

  const grouped = useMemo(() => groupByYear(filtered), [filtered])

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="tag-filter">
            Filter by tag
          </label>
          <select
            id="tag-filter"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm min-w-[160px]"
          >
            <option value="All">All tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="year-filter">
            Filter by year
          </label>
          <select
            id="year-filter"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm min-w-[120px]"
          >
            <option value="All">All years</option>
            {allYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <input
          type="search"
          placeholder="Search posts"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-48 rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      {Object.keys(grouped)
        .sort((a, b) => Number(b) - Number(a))
        .map((yr) => (
          <section key={yr} className="space-y-4">
            <h2 className="text-2xl font-bold">{yr}</h2>
            <div className="space-y-2">
              {grouped[yr].map((post) => (
                <div
                  key={`${yr}-${post.slug}`}
                  className="flex items-start justify-between gap-4 rounded-lg px-2 py-2"
                >
                  <div className="space-y-1">
                    <Link
                      href={`/articles/${yr}/${post.slug}`}
                      className="text-foreground hover:text-green-400 transition-colors"
                    >
                      {post.title}
                    </Link>
                    {post.tags?.length ? (
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {post.tags.map((t) => (
                          <span
                            key={`${post.slug}-${t}`}
                            className="rounded-full border border-border px-2 py-0.5"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <span className="text-primary text-sm tabular-nums whitespace-nowrap pt-1">
                    {post.date}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">No posts match your filters.</p>
      )}
    </div>
  )
}
