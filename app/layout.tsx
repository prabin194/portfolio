import type { Metadata } from "next"
import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import "./globals.css"

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
            <main id="main-content" className="mx-auto max-w-3xl px-6 py-12">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
