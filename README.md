# Prabin Paudel — Personal Site

A minimal, fast personal website built with Next.js (App Router), Tailwind, and a content-first workflow. The site is split into three pillars:

- **Writing** — Blog posts are markdown files under `@content/blogs`, grouped by year. They render as static pages with safe, sanitized HTML.
- **Projects** — Each project is a markdown file in `@content/projects`. A sync script pulls all of my public, non-fork GitHub repositories into this folder and keeps stars/updated dates in sync while preserving my custom descriptions.
- **About** — Biography, tools, and contact links.

## Highlights
- **Content in git**: All posts/projects live as markdown alongside the code; no CMS dependency.
- **GitHub-aware projects**: Run `npm run sync:github` to refresh project metadata from GitHub. Add `repo: "owner/name"` in frontmatter to link cards to the repo.
- **Dark/light theme**: Theme toggle with `next-themes`, focus-visible outlines, and a skip link for accessibility.
- **Responsive nav**: Mobile menu auto-closes on navigation; `aria-current` for active links.
- **Safe rendering**: Markdown is sanitized before injection to prevent XSS.

## Structure
- `app/` — Pages (Home, Blog index, Article route, Projects, About) plus layout and global styles.
- `@content/` — Markdown sources:
  - `blogs/<year>/*.md`
  - `projects/*.md`
- `lib/` — Content helpers and utilities.
- `scripts/` — `sync-github-projects.js` to mirror GitHub repos into content.

## Usage
- View site locally: `npm run dev`
- Refresh project data from GitHub: `npm run sync:github` (set `GITHUB_TOKEN` to avoid rate limits)

## Contact
- GitHub: https://github.com/prabin194
- Email: hello@prabin194.com
