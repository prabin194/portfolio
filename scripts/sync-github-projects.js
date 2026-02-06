#!/usr/bin/env node

/**
 * Sync public, non-fork GitHub repos into @content/projects.
 * Creates files when missing; updates stars/description/date when changed.
 *
 * Set GITHUB_TOKEN for higher rate limits.
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const USERNAME = "prabin194";
const CONTENT_DIR = path.join(process.cwd(), "@content/projects");

async function fetchRepos() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-sync-script",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100&type=owner&sort=updated`,
    { headers }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub fetch failed: ${res.status} ${res.statusText} ${body}`);
  }

  const data = await res.json();
  return data
    .filter((repo) => repo && repo.fork === false && repo.visibility === "public")
    .map((repo) => ({
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || "",
      language: repo.language,
      stars: repo.stargazers_count,
      homepage: repo.homepage,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      htmlUrl: repo.html_url,
    }));
}

function ensureContentDir() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
}

function buildFrontmatter(repo, descriptionOverride) {
  const description = descriptionOverride ?? repo.description ?? "";
  const safeDescription = description.replace(/"/g, '\\"');
  const tags = repo.language ? `"${repo.language}"` : "";
  return `---\n` +
    `title: "${repo.name}"\n` +
    `description: "${safeDescription}"\n` +
    `date: "${repo.createdAt.slice(0, 10)}"\n` +
    `updated: "${repo.updatedAt.slice(0, 10)}"\n` +
    `stars: ${repo.stars}\n` +
    `language: "${repo.language || ""}"\n` +
    `tags: [${tags}]\n` +
    `repo: "${repo.fullName}"\n` +
    (repo.homepage ? `homepage: "${repo.homepage}"\n` : "") +
    `---\n\n` +
    `## About\n\n${repo.description || "No description provided."}\n\n` +
    `- GitHub: ${repo.htmlUrl}\n` +
    (repo.homepage ? `- Live: ${repo.homepage}\n` : "");
}

function upsertRepo(repo) {
  const filePath = path.join(CONTENT_DIR, `${repo.name}.md`);

  // If we already have a human-written description and GitHub's is empty,
  // preserve the existing text.
  let existingDescription = "";
  if (fs.existsSync(filePath)) {
    const current = fs.readFileSync(filePath, "utf8");
    const parsed = matter(current);
    existingDescription = parsed.data?.description || "";
  }

  const effectiveDescription = repo.description || existingDescription || "";

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, buildFrontmatter(repo, effectiveDescription), "utf8");
    return { status: "created", filePath };
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const parsed = matter(fileContent);
  const data = parsed.data || {};

  const needsUpdate =
    data.stars !== repo.stars ||
    data.description !== effectiveDescription ||
    data.repo !== repo.fullName ||
    data.language !== repo.language ||
    data.date !== repo.createdAt.slice(0, 10) ||
    data.updated !== repo.updatedAt.slice(0, 10);

  if (!needsUpdate) {
    return { status: "skipped", filePath };
  }

  fs.writeFileSync(filePath, buildFrontmatter(repo, effectiveDescription), "utf8");
  return { status: "updated", filePath };
}

async function main() {
  ensureContentDir();
  const repos = await fetchRepos();

  const results = { created: 0, updated: 0, skipped: 0 };
  for (const repo of repos) {
    const { status } = upsertRepo(repo);
    results[status] += 1;
  }

  console.log(
    `Sync complete. Created: ${results.created}, Updated: ${results.updated}, Unchanged: ${results.skipped}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
