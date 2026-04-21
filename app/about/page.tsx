import Link from "next/link"
import { ArrowUpRight, Github, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const strengths = [
  {
    title: "Backend architecture",
    description: "I enjoy shaping APIs, auth flows, action-based service layers, and backend code that stays understandable as products grow.",
  },
  {
    title: "Product-minded implementation",
    description: "I care about the experience around the code too: forms, edge cases, operational safety, and interfaces that feel straightforward.",
  },
  {
    title: "Writing and teaching",
    description: "A lot of my work turns into articles, package docs, or internal patterns. Clear explanation is part of the engineering work.",
  },
]

const stack = [
  {
    category: "Build with",
    items: [
      { name: "React.js", description: "Interfaces and component systems" },
      { name: "TypeScript", description: "Typed frontend and tooling" },
      { name: "Vue", description: "Interactive web applications" },
      { name: "Laravel", description: "APIs and backend systems" },
      { name: "Next.js", description: "Web products and content sites" },
      { name: "React Native", description: "Mobile-friendly product work" },
    ]
  },
  {
    category: "Care about",
    items: [
      { name: "Maintainability", description: "Clear contracts and structure" },
      { name: "Reliability", description: "Edge cases, testing, safe writes" },
      { name: "Usability", description: "Practical interfaces with less friction" },
      { name: "Communication", description: "Writing that explains decisions" },
    ]
  }
]

export default function AboutPage() {
  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-4xl font-bold">About me</h1>
        <div className="mt-6 space-y-4 text-muted-foreground">
          <p>
            I&apos;m Prabin, a software developer from Nepal. I&apos;ve been building software professionally since 2019 and making websites since 2017.
          </p>
          <p>
            My strongest work sits between product thinking and engineering discipline: backend architecture, developer-facing tooling, and web interfaces that stay clear as complexity grows.
          </p>
          <p>
            This site is where I publish project work, implementation notes, and articles about the systems I build. Check out the{" "}
            <Link href="/blog" className="text-primary hover:underline">
              blog
            </Link>
            , or take a look at the{" "}
            <Link href="/projects" className="text-primary hover:underline">
              projects
            </Link>{" "}
            page to see a highlight of my open-source work.
          </p>
          <p>
            I like shipping useful things, especially where local context matters. That includes tools for Nepali users, reusable packages, and content that helps other developers avoid repeated mistakes.
          </p>
          <p>
            If you&apos;re building something and need a developer who can structure the backend, implement the frontend, and explain the tradeoffs clearly, email me at{" "}
            <Link href="mailto:hello@prabin194.com" className="text-primary hover:underline">
              hello@prabin194.com
            </Link>.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="https://github.com/prabin194"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            GitHub
          </Link>
          <Link
            href="mailto:hello@prabin194.com"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
            Email
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold">What I bring</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {strengths.map((strength) => (
            <Card key={strength.title} className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">{strength.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{strength.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold">How I work</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {stack.map((category) => (
            <Card key={category.category} className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.items.map((item) => (
                    <li key={item.name} className="flex justify-between text-sm">
                      <span className="text-white">{item.name}</span>
                      <span className="text-muted-foreground">{item.description}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card/60 p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Work with me</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">I build products with clear architecture and practical UX.</h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          I&apos;m especially useful when a project needs both implementation depth and someone who can keep the structure understandable for the next stage of growth.
        </p>
        <Link
          href="mailto:hello@prabin194.com"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          Start a conversation
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  )
}
