import Link from "next/link"
import { Star, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProjects } from '@/lib/mdUtils';
import { getGithubRepos, GitHubRepo } from "@/lib/github";

type Project = {
  id: string;
  contentHtml: string;
  description: string;
  title: string;
  date: string;
  stars?: number; 
};

export default async function ProjectsPage() {
  const [projects, repos]: [Project[], GitHubRepo[]] = await Promise.all([
    getProjects(),
    getGithubRepos("prabin194"),
  ]);

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
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span>{project.stars}</span>
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="font-medium">{project?.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{project?.description}</p>
                {project?.contentHtml && (
                  <div
                    className="prose prose-invert mt-3 text-sm"
                    dangerouslySetInnerHTML={{ __html: project.contentHtml }}
                  />
                )}
              </div>
              <div className="flex gap-3">
               
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="space-y-3 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Open Source Repos</h2>
          <Link
            href="https://github.com/prabin194?tab=repositories"
            className="text-sm text-primary hover:underline"
          >
            View on GitHub
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {repos.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No repositories found right now. Please try again later.
            </p>
          )}
          {repos.map((repo) => (
            <Card
              key={repo.id}
              className="bg-card border-border hover:border-primary/20 transition-colors"
            >
              <CardHeader className="space-y-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <Link
                      href={repo.htmlUrl}
                      className="inline-flex items-center gap-1 font-medium hover:text-primary"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {repo.name}
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    {repo.description && (
                      <p className="text-sm text-muted-foreground">
                        {repo.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span className="tabular-nums">{repo.stars}</span>
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {repo.language && (
                    <Badge variant="secondary" className="bg-muted text-foreground">
                      {repo.language}
                    </Badge>
                  )}
                  <span>Updated {formatDate(repo.updatedAt)}</span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
