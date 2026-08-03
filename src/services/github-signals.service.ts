/**
 * @fileOverview Capa 1 — GitHub Signals Service.
 * Sin IA, sin parsers, interactúa directamente con GitHub REST API v3.
 * Extrae datos del perfil del usuario, estadísticas de repositorios y señales estructurales.
 */

import type { GithubRepo, RepoSignals } from '../types/github.types';

const GITHUB_API_BASE = 'https://api.github.com';

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'NEXTAPE-GitHub-Engine',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export const GithubSignalsService = {
  /**
   * 1. getUserRepos(username): GET /users/{username}/repos
   * Filtra forks sin commits propios y ordena por actividad reciente (`pushed_at`).
   */
  async getUserRepos(username: string): Promise<GithubRepo[]> {
    const res = await fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?sort=pushed&per_page=30`, {
      headers: getHeaders(),
    });

    if (!res.ok) {
      if (res.status === 404) throw new Error(`Usuario de GitHub '${username}' no encontrado.`);
      throw new Error(`Error en GitHub API (${res.status}): ${res.statusText}`);
    }

    const data: Array<Record<string, unknown>> = await res.json();

    const repos: GithubRepo[] = data
      .filter((repo) => !repo.fork) // filtra repositorios forkeados
      .map((repo) => ({
        name: String(repo.name),
        fullName: String(repo.full_name),
        owner: String((repo.owner as Record<string, unknown>)?.login ?? username),
        isForked: Boolean(repo.fork),
        pushedAt: repo.pushed_at ? String(repo.pushed_at) : null,
        stargazersCount: Number(repo.stargazers_count ?? 0),
        sizeKB: Number(repo.size ?? 0),
        language: repo.language ? String(repo.language) : null,
      }));

    return repos;
  },

  /**
   * 2. getRepoSignals(owner, repo):
   * Extract languages, lastCommitSHA, commitFrequency (últimos 90 días), hasTests, hasCI, hasReadme, etc.
   */
  async getRepoSignals(owner: string, repo: string): Promise<RepoSignals> {
    const headers = getHeaders();

    // GET /repos/{owner}/{repo} para detalles generales
    const repoRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) {
      throw new Error(`No se pudo obtener información del repositorio ${owner}/${repo}`);
    }
    const repoData = await repoRes.json();

    // GET /repos/{owner}/{repo}/languages
    const langRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`, { headers });
    const languages: Record<string, number> = langRes.ok ? await langRes.json() : {};

    // GET /repos/{owner}/{repo}/commits (últimos 90 días)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const commitsRes = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?since=${ninetyDaysAgo}&per_page=100`,
      { headers },
    );
    let lastCommitSHA = '';
    let commitFrequency90d = 0;

    if (commitsRes.ok) {
      const commits = await commitsRes.json();
      if (Array.isArray(commits) && commits.length > 0) {
        lastCommitSHA = commits[0].sha ?? '';
        commitFrequency90d = commits.length;
      }
    }

    // Git Tree / Contenidos para buscar hasTests, hasCI, hasReadme
    const treeRes = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${lastCommitSHA || 'HEAD'}?recursive=1`,
      { headers },
    );

    let hasTests = false;
    let hasCI = false;
    let hasReadme = false;
    let readmeLength = 0;

    if (treeRes.ok) {
      const treeData = await treeRes.json();
      const tree: Array<{ path: string; size?: number }> = treeData.tree ?? [];

      for (const item of tree) {
        const pathLower = item.path.toLowerCase();
        if (
          pathLower.includes('.test.') ||
          pathLower.includes('.spec.') ||
          pathLower.includes('__tests__/')
        ) {
          hasTests = true;
        }
        if (pathLower.startsWith('.github/workflows/')) {
          hasCI = true;
        }
        if (pathLower === 'readme.md') {
          hasReadme = true;
          readmeLength = item.size ?? 0;
        }
      }
    }

    return {
      owner,
      repo,
      lastCommitSHA,
      commitFrequency90d,
      languages,
      hasTests,
      hasCI,
      hasReadme,
      readmeLength,
      sizeKB: Number(repoData.size ?? 0),
      stargazersCount: Number(repoData.stargazers_count ?? 0),
    };
  },

  /**
   * Descarga archivos de código fuente central (máx 8 archivos de TS/TSX) para análisis por el Engine.
   */
  async fetchCentralSourceFiles(
    owner: string,
    repo: string,
    commitSHA: string,
  ): Promise<Array<{ filename: string; content: string }>> {
    const headers = getHeaders();
    const treeRes = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${commitSHA || 'HEAD'}?recursive=1`,
      { headers },
    );

    if (!treeRes.ok) return [];

    const treeData = await treeRes.json();
    const tree: Array<{ path: string; type: string; url: string; size?: number }> = treeData.tree ?? [];

    // Filtrar archivos TypeScript/TSX relevantes
    const candidateFiles = tree
      .filter((item) => {
        if (item.type !== 'blob') return false;
        const p = item.path.toLowerCase();
        return (
          (p.endsWith('.ts') || p.endsWith('.tsx')) &&
          !p.endsWith('.d.ts') &&
          !p.includes('node_modules/') &&
          !p.includes('dist/') &&
          !p.includes('.next/')
        );
      })
      .slice(0, 8); // seleccionar hasta 8 archivos candidatos

    const fetchedFiles: Array<{ filename: string; content: string }> = [];

    for (const file of candidateFiles) {
      try {
        const fileRes = await fetch(
          `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${file.path}?ref=${commitSHA}`,
          { headers },
        );
        if (fileRes.ok) {
          const fileData = await fileRes.json();
          if (fileData.content && fileData.encoding === 'base64') {
            const decodedContent = Buffer.from(fileData.content, 'base64').toString('utf8');
            fetchedFiles.push({ filename: file.path, content: decodedContent });
          }
        }
      } catch (err) {
        console.warn(`[github-signals] Error obteniendo ${file.path}:`, err);
      }
    }

    return fetchedFiles;
  },
};
