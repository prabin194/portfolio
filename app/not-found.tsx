import Link from "next/link"
import { ArrowLeft, Home, Sparkles } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-6">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border/70 bg-card/70 backdrop-blur-sm p-10 shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-primary to-primary/60" />
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold">Lost in the garden</h1>
        <p className="mt-3 text-muted-foreground">
          This page doesn’t exist—or it wandered off. Let’s get you back to familiar paths.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft className="h-4 w-4 rotate-180" />
            Read the blog
          </Link>
        </div>
      </div>
    </div>
  )
}
