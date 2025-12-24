/**
 * Fetch README content from a GitHub repository URL
 */
export async function fetchReadmeFromGitHub(url: string): Promise<string> {
  // Parse GitHub URL to extract owner and repo
  const githubMatch = url.match(
    /github\.com\/([^\/]+)\/([^\/]+)/
  );

  if (!githubMatch) {
    throw new Error('Invalid GitHub URL. Expected format: https://github.com/owner/repo');
  }

  const [, owner, repo] = githubMatch;
  const repoName = repo.replace(/\.git$/, '').split('/')[0].split('#')[0].split('?')[0];

  // Try different README filenames
  const readmeFiles = ['README.md', 'readme.md', 'README.MD', 'Readme.md', 'README', 'readme'];

  for (const filename of readmeFiles) {
    try {
      // Use raw.githubusercontent.com for direct access
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repoName}/main/${filename}`;
      const response = await fetch(rawUrl);

      if (response.ok) {
        return await response.text();
      }

      // Try 'master' branch if 'main' doesn't work
      const masterUrl = `https://raw.githubusercontent.com/${owner}/${repoName}/master/${filename}`;
      const masterResponse = await fetch(masterUrl);

      if (masterResponse.ok) {
        return await masterResponse.text();
      }
    } catch {
      // Continue to next filename
      continue;
    }
  }

  // Fallback: use GitHub API
  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/readme`;
    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/vnd.github.raw+json',
        'User-Agent': 'README2Video',
      },
    });

    if (response.ok) {
      return await response.text();
    }
  } catch {
    // API fallback failed
  }

  throw new Error(`Could not find README for ${owner}/${repoName}`);
}

/**
 * Validate if a URL is a valid GitHub repository URL
 */
export function isValidGitHubUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === 'github.com' &&
      parsed.pathname.split('/').filter(Boolean).length >= 2
    );
  } catch {
    return false;
  }
}
