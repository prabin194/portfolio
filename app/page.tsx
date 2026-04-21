import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Github, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getFeaturedProjects, getLatestBlog, getProjects } from "@/lib/mdUtils"

export default async function Home() {
  const blogPosts = await getLatestBlog()
  const featuredProjects = await getFeaturedProjects()
  const allProjects = await getProjects()
  const yearsOfExperience = new Date().getFullYear() - 2019

  const proofItems = [
    { label: "Years building software", value: `${yearsOfExperience}+` },
    { label: "Open-source projects", value: `${allProjects.length}` },
    { label: "Published articles", value: `${blogPosts.length}+` },
  ]

  return (
    <div className="space-y-20">
      <section className="grid gap-12 xl:gap-16 lg:grid-cols-[1.3fr_0.95fr] lg:items-center">
        <div className="max-w-4xl">
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
            Software developer focused on products, APIs, and useful developer tools
          </Badge>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            I build practical software and write clearly about how it works.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            I&apos;m Prabin, a developer from Nepal building web products with Laravel, Next.js, TypeScript, and mobile-friendly interfaces.
            My strongest work turns messy product requirements into maintainable systems and straightforward user flows.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              View featured work
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="mailto:hello@prabin194.com"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
            >
              Contact me
              <Mail className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/prabin194"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
            >
              GitHub
              <Github className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {proofItems.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-card/60 p-4">
                <div className="text-2xl font-semibold tracking-tight">{item.value}</div>
                <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="mx-auto w-full max-w-2xl overflow-hidden border-border bg-card/70 lg:max-w-none">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Image
                src="/portfilo.jpeg"
                alt="Profile mascot"
                width={84}
                height={84}
                className="rounded-2xl"
                priority
              />
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                  What I&apos;m building
                </p>
                <p className="text-base leading-7 text-foreground">
                  Backend architecture, developer tooling, and products shaped around real Nepali workflows.
                </p>
              </div>
            </div>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Shipping reusable open-source packages such as a Bikram Sambat date picker and Nepali text tooling.</li>
              <li>Writing implementation-focused articles on Laravel architecture, APIs, auth, and testing.</li>
              <li>Building products with a bias for maintainability, clean contracts, and straightforward UX.</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Featured Projects</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A few projects that best show how I think about product, architecture, and useful tools.
            </p>
          </div>
          <Link href="/projects" className="text-sm text-primary hover:underline">
            See all projects
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {featuredProjects.map((project) => (
            <Card key={project.id} className="border-border bg-card/70">
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  {project.language && (
                    <Badge variant="secondary">{project.language}</Badge>
                  )}
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{project.description}</p>
                {project.impact && (
                  <p className="mt-4 text-sm leading-6 text-foreground">{project.impact}</p>
                )}
                {project.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                  {project.homepage && (
                    <Link href={project.homepage} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      Live demo
                    </Link>
                  )}
                  {project.repo && (
                    <Link href={`https://github.com/${project.repo}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      Source code
                    </Link>
                  )}
                  {project.vpatUrl && (
                    <Link href={project.vpatUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      {project.vpatLabel ?? "VPAT"}
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Latest Posts</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Notes on Laravel architecture, API design, auth flows, and building maintainable products.
            </p>
          </div>
          <Link href="/blog" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-6 space-y-4">
          {blogPosts.map((post) => (
            <Link
              key={post.title}
              href={`/articles/${post.year}/${post.slug}`}
              className="block rounded-2xl border border-transparent px-3 py-3 transition-colors hover:border-border hover:bg-card/40"
            >
              <div className="flex items-center justify-between gap-4">
                <span>{post.title}</span>
                <span className="shrink-0 text-sm text-primary">{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card/60 p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Let&apos;s work together</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">
          Need a developer who can build, structure, and explain the work?
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          I&apos;m most useful on product builds that need solid backend thinking, clear frontend implementation, and a strong bias toward maintainable code.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="mailto:hello@prabin194.com"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Email me
            <Mail className="h-4 w-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
          >
            More about me
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
