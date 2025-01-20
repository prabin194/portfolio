"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email signup
    console.log("Email submitted:", email)
  }

  return (
    <aside className={cn("w-64 border-r p-4", className)}>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">About me</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Software engineer and open-source creator. This is my digital garden. 🌱
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Stay in touch</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get an update when I write something new!
          </p>
          <form onSubmit={handleSubmit} className="mt-4 space-y-2">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Email Signup
            </Button>
          </form>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Some of my favorite posts</h2>
          <ul className="mt-2 space-y-2">
            {[
              "Keyboard accordion",
              "Super Mario memory game",
              "The lore of Animorphs",
              "JavaScript emulator",
              "MVC basics",
            ].map((post) => (
              <li key={post}>
                <Link href="#" className="text-sm hover:underline">
                  {post}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}

