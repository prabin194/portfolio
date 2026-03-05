import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms and Conditions | Prabin Paudel",
  description: "Terms and conditions for prabin194.com.np.",
}

export default function TermsAndConditionsPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-4xl font-bold">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground">Last updated: March 5, 2026</p>
      </section>

      <section className="space-y-6 text-muted-foreground">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Acceptance of Terms</h2>
          <p>
            By using this website, you agree to these terms and applicable laws.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Content Use</h2>
          <p>
            Unless stated otherwise, all original content on this site is owned by the site author. You may reference or
            share content with proper credit and a link to the source.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">No Warranty</h2>
          <p>
            Content is provided for general information only. While care is taken for accuracy, no guarantee is made that all
            information is complete, current, or error-free.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Limitation of Liability</h2>
          <p>
            The site owner is not responsible for damages arising from use of this website, including reliance on content or
            access to third-party links.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Changes to Terms</h2>
          <p>
            These terms may be updated periodically. Continued use of the website after updates means you accept the revised
            terms.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          <p>
            Questions about these terms can be sent using the contact details on the <Link href="/about" className="text-primary hover:underline">About page</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}
