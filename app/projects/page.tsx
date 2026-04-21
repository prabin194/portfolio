import Link from "next/link"
import { ArrowUpRight, Github, Star } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProjects, Project } from "@/lib/mdUtils"

export default async function ProjectsPage() {
  const projects: Project[] = await getProjects();

  const formatDate = (date?: string) =>
    date
      ? new Intl.DateTimeFormat("en", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(new Date(date))
      : "";

  return (
    <div className="space-y-8">
      <section className="max-w-2xl space-y-4">
        <h1 className="text-4xl font-bold">Projects</h1>
        <p className="text-muted-foreground">
          A selection of open-source packages, experiments, and product work. I care most about solving practical problems, keeping architecture understandable, and shipping tools other developers can actually use.
        </p>
      </section>
      
      {projects.length === 0 && (
        <p className="text-sm text-muted-foreground">No projects yet. Check back soon.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card 
            key={project?.id}
            className="bg-card border-border hover:border-primary/20 transition-colors"
          >
            <CardHeader className="space-y-0">
              <div className="flex items-center justify-between">
                <Badge 
                  variant="secondary" 
                  className="bg-emerald-950 text-primary hover:bg-emerald-950"
                >
                  {formatDate(project?.date)}
                </Badge>
                {typeof project?.stars === "number" && (
                  <div className="flex items-center gap-1 text-muted-foreground" title="GitHub stars">
                    <span className="tabular-nums">{project.stars}</span>
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="font-medium">
                  <Link
                    href={project.repo ? `https://github.com/${project.repo}` : "#"}
                    className="inline-flex items-center gap-2 hover:text-primary"
                  >
                    {project?.title}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{project?.description}</p>
                {project.role && (
                  <p className="mt-3 text-sm text-foreground">
                    <span className="font-medium">Role:</span> {project.role}
                  </p>
                )}
                {project.impact && (
                  <p className="mt-2 text-sm leading-6 text-foreground">{project.impact}</p>
                )}
                {project.audience && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Built for {project.audience}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {project.repo && (
                  <Link
                    href={`https://github.com/${project.repo}`}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github className="h-4 w-4" />
                    View repo
                  </Link>
                )}
                {project.vpatUrl && (
                  <Link
                    href={project.vpatUrl}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {project.vpatLabel ?? "VPAT"}
                  </Link>
                )}
                {project.homepage && (
                  <Link
                    href={project.homepage}
                    className="inline-flex items-center gap-1 text-sm text-foreground hover:text-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Live demo
                  </Link>
                )}
                {project.demoPath && (
                  <Link
                    href={project.demoPath}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Try Demo
                  </Link>
                )}
                {project.language && (
                  <Badge variant="secondary" className="bg-muted text-foreground">
                    {project.language}
                  </Badge>
                )}
                {project.tags?.map((tag) => (
                  <Badge key={tag} variant="outline" className="rounded-full">
                    {tag}
                  </Badge>
                ))}
                {project.updated && (
                  <span className="text-xs text-muted-foreground">
                    Updated {formatDate(project.updated)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
