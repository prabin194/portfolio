import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | Prabin Paudel",
  description: "Privacy policy for prabin194.com.np.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: March 5, 2026</p>
      </section>

      <section className="space-y-6 text-muted-foreground">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Overview</h2>
          <p>
            This website shares articles and project updates. It is designed to keep data collection as minimal as possible.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Information Collected</h2>
          <p>
            Personal information is not required to browse this site. If you contact me directly by email, the information
            you provide is used only to respond to your message.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Cookies and Analytics</h2>
          <p>
            This site does not use advertising cookies. Basic performance monitoring may be used to keep the site stable and
            fast, without building personal advertising profiles.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Third-Party Links</h2>
          <p>
            Pages may include links to other websites such as GitHub. Those websites have separate privacy policies and are
            not controlled by this site.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          <p>
            For privacy-related questions, use the contact details on the <Link href="/about" className="text-primary hover:underline">About page</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}
