import type { Metadata } from "next"
import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import Link from "next/link"
import "./globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"

const geist = GeistSans

export const metadata: Metadata = {
  title: "Prabin Paudel",
  description: "Software developer, open-source creator, and writer.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentYear = new Date().getFullYear()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <ThemeProvider>
          <a
            href="#main-content"
            className="skip-link"
          >
            Skip to main content
          </a>
          <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main id="main-content" className="mx-auto max-w-3xl px-6 py-12">{children}</main>
            <footer className="border-t border-border">
              <div className="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p>{currentYear} Prabin Paudel. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <Link href="/privacy-policy" className="hover:text-foreground hover:underline">
                    Privacy Policy
                  </Link>
                  <Link href="/terms-and-conditions" className="hover:text-foreground hover:underline">
                    Terms & Conditions
                  </Link>
                </div>
              </div>
            </footer>
          </div>
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
