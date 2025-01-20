import Link from "next/link"
import { Mail, Github, Twitter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const tools = [
  {
    category: "Development",
    items: [
      { name: "VS Code", description: "Editor" },
      { name: "PHPStrom", description: "Editor" },
      { name: "Terminal", description: "Terminal" },
      { name: "Brave", description: "Browser and dev tools" },
    ]
  },
  {
    category: "Design",
    items: [
      { name: "Figma", description: "Design tool" },
      { name: "Framer", description: "Design tool" },
    ]
  },
  {
    category: "Productivity",
    items: [
      { name: "Github", description: "Issue Tickets" },
      { name: "Notion", description: "Notes and documentation" },
    ]
  },
  {
    category: "Hardware",
    items: [
      { name: "MacBook Pro M3", description: "14-inch, 2023" },
      { name: "Benq PD2705Q", description: "27-inch 2K monitor" },
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
            Hey, I&apos;m Prabin. I&apos;ve been a software developer since 2019, and I&apos;ve been making
            websites since 2017.
          </p>
          <p>
            This is my spot on the web for writing, projects, tutorials, art, and anything else I want
            to put out there. Check out the{" "}
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
            This site has no ads, no affiliate links, no tracking or analytics, no sponsored posts, and
            no paywall. My motivation for this site is to have a space for self-expression and to
            share what I&apos;ve learned with the world. I hope I will inspire others to make their own
            creative corner on the web as well.
          </p>
          <p>
            Feel free to contact me by email at{" "}
            <span className="text-primary">
              hello at prabin194.com
            </span>{" "}
            to say hi!
          </p>
        </div>
        <div className="mt-8 flex gap-4">
          <Link
            href="https://github.com/prabin194"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            GitHub
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Tools</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {tools.map((category) => (
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
    </div>
  )
}

