import Link from "next/link"
import { Star } from 'lucide-react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProjects } from '@/lib/mdUtils';


export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Projects</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card 
            key={project?.title}
            className="bg-card border-border hover:border-primary/20 transition-colors"
          >
            <CardHeader className="space-y-0">
              <div className="flex items-center justify-between">
                <Badge 
                  variant="secondary" 
                  className="bg-emerald-950 text-primary hover:bg-emerald-950"
                >
                  {project?.year}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>{project?.stars}</span>
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="font-medium">{project?.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{project?.description}</p>
              </div>
              <div className="flex gap-3">
               
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

