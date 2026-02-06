export type GitHubRepo = {
  id: number;
  name: string;
  htmlUrl: string;
  description: string | null;
  language: string | null;
  stars: number;
  updatedAt: string;
};

/**
 * Fetch public repos for a given user, excluding forks.
 * Uses unauthenticated requests by default; set GITHUB_TOKEN for higher limits.
 */
export async function getGithubRepos(username: string): Promise<GitHubRepo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-site",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    {
      headers,
      // Revalidate once per hour to keep data reasonably fresh without hammering the API
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch GitHub repos", await res.text());
    return [];
  }

  const data = (await res.json()) as any[];

  return data
    .filter((repo) => repo && repo.fork === false)
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      htmlUrl: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      updatedAt: repo.updated_at,
    }))
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
}
