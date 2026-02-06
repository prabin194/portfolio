import Link from "next/link"
import { Star, Github } from 'lucide-react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProjects } from '@/lib/mdUtils';

type Project = {
  id: string;
  contentHtml: string;
  description: string;
  title: string;
  date: string;
  updated?: string;
  stars?: number; 
  repo?: string;
  homepage?: string;
  language?: string;
  tags?: string[];
};

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
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Projects</h1>
      
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
                    className="hover:text-primary"
                  >
                    {project?.title}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{project?.description}</p>
                {project?.contentHtml && (
                  <div
                    className="prose prose-invert mt-3 text-sm"
                    dangerouslySetInnerHTML={{ __html: project.contentHtml }}
                  />
                )}
                {Array.isArray(project.tags) && project.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={`${project.id}-tag-${tag}`} variant="secondary" className="bg-muted text-foreground">
                        {tag}
                      </Badge>
                    ))}
                  </div>
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
                {project.language && (
                  <Badge variant="secondary" className="bg-muted text-foreground">
                    {project.language}
                  </Badge>
                )}
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
