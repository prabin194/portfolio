"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, BookOpen, Code, Github, Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: User },
    { href: "/blog", label: "Blog", icon: BookOpen },
    { href: "/projects", label: "Projects", icon: Code },
    { href: "https://github.com/prabin194", label: "GitHub", icon: Github },
  ]

  // Close mobile menu on navigation change for accessibility
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href.startsWith("http")) return false
    if (href === "/") return pathname === "/"
    return pathname?.startsWith(href)
  }

  return (
    <header className="border-b border-border">
      <nav className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
        {/* Title */}
        <div className="text-lg font-semibold lg:hidden">
          Prabin
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-6">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`flex items-center gap-2 text-sm transition-colors hover:text-foreground focus-visible:outline-none ${
                isActive(href)
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>

        {/* Right Side: Hamburger + Dark Mode Toggle */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Theme"
              className="focus-visible:outline-none"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            className="sm:hidden"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed top-0 left-0 z-50 h-screen w-screen bg-background p-6 transition-transform duration-300 ease-in-out sm:hidden">
            {/* Close Icon */}
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label="Close Menu"
                className="focus-visible:outline-none"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Menu Links */}
            <ul className="flex flex-col items-center gap-6">
              {links.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive(href) ? "page" : undefined}
                    className={`flex items-center gap-2 text-sm transition-colors hover:text-foreground focus-visible:outline-none ${
                      isActive(href)
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
