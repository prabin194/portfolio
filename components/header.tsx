"use client"

import Link from "next/link"
import { Home, User, BookOpen, Code, Github, Moon, Sun } from 'lucide-react'
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-b border-border">
      <nav className="mx-auto flex h-16 max-w-3xl items-center justify-center gap-6 px-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Home className="h-4 w-4" />
          Home
        </Link>
        <Link 
          href="/about" 
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <User className="h-4 w-4" />
          About
        </Link>
        <Link 
          href="/blog" 
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <BookOpen className="h-4 w-4" />
          Blog
        </Link>
        <Link 
          href="/projects" 
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Code className="h-4 w-4" />
          Projects
        </Link>
        <Link 
          href="https://github.com/prabin194" 
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Github className="h-4 w-4" />
          GitHub
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-2"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </nav>
    </header>
  )
}

