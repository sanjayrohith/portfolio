import { NextRequest } from 'next/server';

// Revalidate every 10 minutes
export const revalidate = 600;

type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  topics?: string[];
  fork: boolean;
  stargazers_count: number;
  updated_at: string;
  default_branch: string;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('user') || process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'sanjayrohith';
  const perPage = Math.max(1, Math.min(Number(searchParams.get('per_page') || '12'), 100));
  // Soft clamp to reduce rate-limit risks (client can ask for more, but we cap for API safety)
  const effectivePerPage = Math.min(perPage, 30);
  const maxPages = Math.max(1, Math.min(Number(searchParams.get('max_pages') || '5'), 10));
  // Deprecated: topic filtering. We now return all public repos.
  const onlyTopics: string[] = [];
  const hasToken = Boolean(process.env.GITHUB_TOKEN);

  const ghHeaders = (accept: 'application/vnd.github+json' | 'application/vnd.github.raw') => ({
    Accept: accept,
    'User-Agent': 'sanjayrohith-portfolio-app',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(hasToken ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  });

  try {
  const data: GitHubRepo[] = [];
    if (onlyTopics.length > 0) {
      // Use Search API to fetch repos matching topics for the user
      const topicsQuery = onlyTopics.map((t) => 'topic:' + t).join(' ');
      // Narrow the search to public, non-fork repos owned by the user
      const baseQ = `user:${username} is:public fork:false ${topicsQuery}`.trim();
      // GitHub Search API caps per_page at 100; loop pages up to maxPages
      for (let page = 1; page <= maxPages; page++) {
        const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(baseQ)}&sort=updated&order=desc&per_page=${effectivePerPage}&page=${page}`;
        const searchRes = await fetch(searchUrl, {
          headers: ghHeaders('application/vnd.github+json'),
          next: { revalidate },
        });
        if (!searchRes.ok) {
          // Break on failure (e.g., rate limit); we'll return what we have
          break;
        }
        const searchJson = await searchRes.json();
        const items = (searchJson.items || []) as GitHubRepo[];
        data.push(...items);
        if (items.length < effectivePerPage) break; // last page reached
      }
    } else {
      // Paginate through the user's public repos
      for (let page = 1; page <= maxPages; page++) {
        const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?type=public&sort=updated&per_page=${effectivePerPage}&page=${page}`;
        const res = await fetch(url, {
          headers: ghHeaders('application/vnd.github+json'),
          next: { revalidate },
        });

        if (!res.ok) {
          // Break on failure (e.g., rate limit); we'll return what we have
          break;
        }

  const pageData = (await res.json()) as GitHubRepo[];
        data.push(...pageData);
  if (pageData.length < effectivePerPage) break; // last page reached
      }
    }
    // Ensure uniqueness (when paging), filter out forks, and exclude specific repos by name
    const seen = new Set<number>();
    const filtered = data.filter((r) => {
      const notSeen = !seen.has(r.id);
      if (notSeen) seen.add(r.id);
      const nameLower = (r.name || '').toLowerCase();
      const excluded = nameLower === 'sanjayrohith'.toLowerCase() || nameLower === 'seegpa'.toLowerCase();
      return notSeen && !r.fork && !excluded;
    });

    // Helpers to extract first meaningful image in README
    const BADGE_HOST_HINTS = [
      'shields.io',
      'badgen.net',
      'badge.fury.io',
      'circleci.com',
      'travis-ci',
      'github-readme-stats',
      'komarev.com',
    ];
    const isBadgeLike = (url: string) =>
      BADGE_HOST_HINTS.some((h) => url.includes(h)) || /badge|build|coverage|ci/i.test(url);
    const isSvg = (url: string) => url.toLowerCase().split('?')[0].endsWith('.svg');

  const mdImageRegex = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g; // ![alt](url "title")
  const htmlImgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;

    const normalizeGithubRaw = (u: string): string => {
      try {
        const url = new URL(u, 'https://dummy.base');
        // Strip query like ?raw=1 when determining extension and path
        const pathname = url.pathname;
        // Convert github.com/{o}/{r}/raw/{branch}/{path}
        let m = /^\/([^/]+)\/([^/]+)\/raw\/([^/]+)\/(.+)$/i.exec(pathname);
        if (url.hostname === 'github.com' && m) {
          return `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}/${m[4]}`;
        }
        // Convert github.com/{o}/{r}/blob/{branch}/{path}
        m = /^\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/i.exec(pathname);
        if (url.hostname === 'github.com' && m) {
          return `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}/${m[4]}`;
        }
        // Already a raw or user-images URL
        return u;
      } catch {
        return u;
      }
    };

  const extractImageFromMarkdown = (content: string): string | null => {
      const candidates: string[] = [];
      let m: RegExpExecArray | null;
      while ((m = mdImageRegex.exec(content)) !== null) {
        const u = (m[1] || '').trim();
        if (u) candidates.push(u);
      }
      while ((m = htmlImgRegex.exec(content)) !== null) {
        const u = (m[1] || '').trim();
        if (u) candidates.push(u);
      }
      // Choose the first non-badge, non-SVG, and either relative or approved host
      const pick = candidates.find((u) => {
        const abs = /^https?:\/\//i.test(u) ? normalizeGithubRaw(u) : u;
        if (!/^https?:\/\//i.test(abs)) return true; // relative paths are ok
        try {
          const { hostname } = new URL(abs);
          if (isBadgeLike(abs) || isSvg(abs)) return false;
          return (
            hostname === 'raw.githubusercontent.com' ||
            hostname === 'user-images.githubusercontent.com' ||
            hostname === 'media.githubusercontent.com'
          );
        } catch {
          return false;
        }
      });
      return pick || candidates[0] || null;
    };

  const isAllowedAbsoluteHost = (u: string): boolean => {
      try {
        const { hostname } = new URL(u);
        return (
      hostname === 'raw.githubusercontent.com' ||
      hostname === 'user-images.githubusercontent.com' ||
      hostname === 'media.githubusercontent.com'
        );
      } catch {
        return false;
      }
    };

    // Limit README fetches to avoid rate limiting; others will use OG image
  const MAX_README_FETCHES = Math.min(filtered.length, hasToken ? 50 : 10);
    const withReadmeImages = await Promise.all(
      filtered.map(async (r, idx) => {
        let imageUrl: string | null = null;
        try {
          if (idx < MAX_README_FETCHES) {
            const readmeRes = await fetch(
              `https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(r.name)}/readme`,
              { headers: ghHeaders('application/vnd.github.raw'), next: { revalidate } }
            );
            if (readmeRes.ok) {
              const md = await readmeRes.text();
              const found = extractImageFromMarkdown(md);
              if (found) {
                const absUrl = /^https?:\/\//i.test(found)
                  ? normalizeGithubRaw(found)
                  : `https://raw.githubusercontent.com/${username}/${r.name}/${r.default_branch}/${found.replace(/^\.\//, '').replace(/^\//, '')}`;
                imageUrl = isAllowedAbsoluteHost(absUrl) ? absUrl : null;
              }
            }
          }
        } catch {
          // ignore and fallback
        }

        return {
          id: String(r.id),
          title: r.name,
          description: r.description || 'No description provided.',
          url: r.html_url,
          tags: [r.language || 'Repo', ...(r.topics || [])].slice(0, 3),
          image: imageUrl || `https://opengraph.githubassets.com/1/${username}/${r.name}`,
          updatedAt: r.updated_at,
          stars: r.stargazers_count,
        };
      })
    );

    return new Response(JSON.stringify({ repos: withReadmeImages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' },
    });
  } catch (e) {
    console.error('GitHub repos API failed', e);
    // Graceful fallback: return an empty list to avoid UI error state
    return new Response(JSON.stringify({ repos: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800' },
    });
  }
}
