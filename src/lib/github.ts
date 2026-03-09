import type { RepoInfo, TreeResponse, LanguageMap, ImportantFile, Improvement, FileNode, TreeItem } from '@/types/github';

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const cleaned = url.trim().replace(/\.git$/, '');
    const patterns = [
      /^https?:\/\/github\.com\/([^/]+)\/([^/]+)/,
      /^github\.com\/([^/]+)\/([^/]+)/,
      /^([^/]+)\/([^/]+)$/,
    ];
    for (const pattern of patterns) {
      const match = cleaned.match(pattern);
      if (match) {
        return { owner: match[1], repo: match[2] };
      }
    }
    return null;
  } catch {
    return null;
  }
}

const BASE = 'https://api.github.com';

async function ghFetch(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub API error: ${res.status}`);
  }
  return res.json();
}

export async function fetchRepoInfo(owner: string, repo: string): Promise<RepoInfo> {
  return ghFetch(`/repos/${owner}/${repo}`);
}

export async function fetchLanguages(owner: string, repo: string): Promise<LanguageMap> {
  return ghFetch(`/repos/${owner}/${repo}/languages`);
}

export async function fetchTree(owner: string, repo: string, branch: string): Promise<TreeResponse> {
  return ghFetch(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
}

export function buildFileTree(items: TreeItem[]): FileNode[] {
  const root: FileNode[] = [];
  const map: Record<string, FileNode> = {};

  // Sort: directories first, then files
  const sorted = [...items].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'tree' ? -1 : 1;
    return a.path.localeCompare(b.path);
  });

  for (const item of sorted) {
    const parts = item.path.split('/');
    const name = parts[parts.length - 1];
    const node: FileNode = {
      name,
      path: item.path,
      type: item.type,
      children: item.type === 'tree' ? [] : undefined,
    };
    map[item.path] = node;

    if (parts.length === 1) {
      root.push(node);
    } else {
      const parentPath = parts.slice(0, -1).join('/');
      const parent = map[parentPath];
      if (parent && parent.children) {
        parent.children.push(node);
      }
    }
  }

  return root;
}

export function detectImportantFiles(tree: TreeItem[]): ImportantFile[] {
  const paths = tree.map(t => t.path.toLowerCase());
  const result: ImportantFile[] = [];

  const checks: Array<{ patterns: string[]; reason: string; icon: string }> = [
    { patterns: ['readme.md', 'readme.txt', 'readme'], reason: 'Project documentation and overview', icon: '📄' },
    { patterns: ['package.json'], reason: 'Node.js dependencies and scripts', icon: '📦' },
    { patterns: ['requirements.txt', 'pyproject.toml', 'setup.py', 'pipfile'], reason: 'Python dependencies', icon: '🐍' },
    { patterns: ['dockerfile', 'docker-compose.yml', 'docker-compose.yaml'], reason: 'Container configuration', icon: '🐳' },
    { patterns: ['.github/workflows'], reason: 'CI/CD pipeline configuration', icon: '⚙️' },
    { patterns: ['vite.config.ts', 'vite.config.js', 'webpack.config.js'], reason: 'Build tool configuration', icon: '🔧' },
    { patterns: ['tailwind.config.ts', 'tailwind.config.js'], reason: 'Tailwind CSS configuration', icon: '🎨' },
    { patterns: ['tsconfig.json'], reason: 'TypeScript compiler configuration', icon: '🔷' },
    { patterns: ['.env.example', '.env.sample'], reason: 'Environment variable template', icon: '🔑' },
    { patterns: ['license', 'license.md', 'license.txt'], reason: 'Project license', icon: '⚖️' },
    { patterns: ['contributing.md'], reason: 'Contributor guidelines', icon: '🤝' },
    { patterns: ['src/main.tsx', 'src/main.ts', 'src/index.tsx', 'src/index.ts', 'src/app.tsx', 'src/app.ts'], reason: 'Application entry point', icon: '🚀' },
    { patterns: ['go.mod', 'go.sum'], reason: 'Go module configuration', icon: '🐹' },
    { patterns: ['cargo.toml'], reason: 'Rust package configuration', icon: '🦀' },
    { patterns: ['pom.xml', 'build.gradle', 'build.gradle.kts'], reason: 'Java/Kotlin build configuration', icon: '☕' },
    { patterns: ['composer.json'], reason: 'PHP dependency management', icon: '🐘' },
    { patterns: ['.eslintrc.js', '.eslintrc.json', '.eslintrc.ts', 'eslint.config.js'], reason: 'Code linting configuration', icon: '🔍' },
    { patterns: ['jest.config.js', 'jest.config.ts', 'vitest.config.ts'], reason: 'Test framework configuration', icon: '🧪' },
  ];

  for (const check of checks) {
    for (const pattern of check.patterns) {
      const found = tree.find(t => t.path.toLowerCase() === pattern || t.path.toLowerCase().startsWith(pattern));
      if (found) {
        result.push({ path: found.path, reason: check.reason, icon: check.icon });
        break;
      }
    }
  }

  return result.slice(0, 10);
}

export function generateImprovements(
  repo: RepoInfo,
  tree: TreeItem[],
  languages: LanguageMap
): Improvement[] {
  const improvements: Improvement[] = [];
  const paths = tree.map(t => t.path.toLowerCase());
  const hasFile = (patterns: string[]) => patterns.some(p => paths.some(path => path.includes(p)));

  if (!hasFile(['readme.md', 'readme.txt'])) {
    improvements.push({
      title: 'Add a README file',
      description: 'A comprehensive README helps contributors understand the project purpose, installation steps, and usage examples.',
      priority: 'high',
      category: 'Documentation',
    });
  }

  if (!hasFile(['.github/workflows', '.travis.yml', 'circle.yml', 'jenkinsfile'])) {
    improvements.push({
      title: 'Set up CI/CD pipeline',
      description: 'Automate testing and deployment with GitHub Actions or similar tools to catch issues early and streamline releases.',
      priority: 'high',
      category: 'DevOps',
    });
  }

  if (!hasFile(['.eslintrc', 'eslint.config', '.prettierrc', 'prettier.config'])) {
    improvements.push({
      title: 'Add code linting & formatting',
      description: 'Enforce consistent code style with ESLint and Prettier to improve readability and reduce code review friction.',
      priority: 'medium',
      category: 'Code Quality',
    });
  }

  if (!hasFile(['test', 'spec', '__tests__', '.test.', '.spec.'])) {
    improvements.push({
      title: 'Add test coverage',
      description: 'No test files detected. Adding unit and integration tests improves reliability and prevents regressions.',
      priority: 'high',
      category: 'Testing',
    });
  }

  if (!hasFile(['license', 'licence'])) {
    improvements.push({
      title: 'Add a software license',
      description: 'Without a license, others cannot legally use or contribute to your project. Consider MIT, Apache 2.0, or GPL.',
      priority: 'medium',
      category: 'Legal',
    });
  }

  if (!hasFile(['contributing.md', 'contributing.txt'])) {
    improvements.push({
      title: 'Add CONTRIBUTING guidelines',
      description: 'Provide clear instructions for how others can contribute, including coding standards, PR process, and issue templates.',
      priority: 'medium',
      category: 'Documentation',
    });
  }

  if (!hasFile(['.env.example', '.env.sample', '.env.template'])) {
    improvements.push({
      title: 'Add .env.example template',
      description: 'Share required environment variable keys (without values) so contributors know what config they need to set up.',
      priority: 'medium',
      category: 'Developer Experience',
    });
  }

  if (!hasFile(['dockerfile', 'docker-compose'])) {
    improvements.push({
      title: 'Add Docker support',
      description: 'Containerizing the app ensures consistent environments and makes it easier to deploy and onboard new contributors.',
      priority: 'low',
      category: 'DevOps',
    });
  }

  if (!hasFile(['.gitignore'])) {
    improvements.push({
      title: 'Add a .gitignore file',
      description: 'Prevent sensitive files, build artifacts, and local config from being accidentally committed to the repository.',
      priority: 'high',
      category: 'Security',
    });
  }

  if (repo.open_issues_count > 20) {
    improvements.push({
      title: 'Triage open issues',
      description: `${repo.open_issues_count} open issues detected. Triaging and labeling them will help prioritize work and welcome contributors.`,
      priority: 'medium',
      category: 'Project Management',
    });
  }

  if (!hasFile(['changelog', 'changelog.md', 'history.md'])) {
    improvements.push({
      title: 'Add a CHANGELOG',
      description: 'Document notable changes for each release to help users understand what has changed and when.',
      priority: 'low',
      category: 'Documentation',
    });
  }

  if (repo.description === null || repo.description === '') {
    improvements.push({
      title: 'Add a repository description',
      description: 'A concise description helps people quickly understand what your project does when browsing GitHub.',
      priority: 'low',
      category: 'Visibility',
    });
  }

  return improvements.slice(0, 8);
}

export function detectProjectType(languages: LanguageMap, tree: TreeItem[]): string {
  const paths = tree.map(t => t.path.toLowerCase());
  const topLang = Object.keys(languages)[0]?.toLowerCase() || '';

  if (paths.some(p => p.includes('package.json'))) {
    if (paths.some(p => p.includes('next.config'))) return 'Next.js Application';
    if (paths.some(p => p.includes('vite.config'))) return 'Vite Application';
    if (paths.some(p => p.includes('gatsby-config'))) return 'Gatsby Site';
    if (paths.some(p => p.includes('angular.json'))) return 'Angular Application';
    if (paths.some(p => p.includes('nuxt.config'))) return 'Nuxt.js Application';
    if (paths.some(p => p.includes('svelte.config'))) return 'SvelteKit Application';
    if (paths.some(p => p.includes('remix'))) return 'Remix Application';
    return 'Node.js Project';
  }
  if (paths.some(p => p.includes('requirements.txt') || p.includes('pyproject.toml'))) {
    if (paths.some(p => p.includes('manage.py'))) return 'Django Application';
    if (paths.some(p => p.includes('app.py') || p.includes('wsgi.py'))) return 'Flask Application';
    if (paths.some(p => p.includes('fastapi') || p.includes('uvicorn'))) return 'FastAPI Service';
    return 'Python Project';
  }
  if (paths.some(p => p.includes('go.mod'))) return 'Go Module';
  if (paths.some(p => p.includes('cargo.toml'))) return 'Rust Crate';
  if (paths.some(p => p.includes('pom.xml'))) return 'Maven Java Project';
  if (paths.some(p => p.includes('build.gradle'))) return 'Gradle Project';
  if (paths.some(p => p.includes('composer.json'))) return 'PHP Composer Project';
  if (paths.some(p => p.includes('.gemspec') || p.includes('gemfile'))) return 'Ruby Gem';

  if (topLang === 'typescript' || topLang === 'javascript') return 'JavaScript/TypeScript Project';
  if (topLang === 'python') return 'Python Project';
  if (topLang === 'java') return 'Java Project';
  if (topLang === 'c#') return 'C# / .NET Project';
  if (topLang === 'rust') return 'Rust Project';
  if (topLang === 'go') return 'Go Project';

  return 'Software Repository';
}

export function detectTechStack(languages: LanguageMap, tree: TreeItem[]): string[] {
  const paths = tree.map(t => t.path.toLowerCase());
  const stack: string[] = [];

  if (paths.some(p => p.includes('react'))) stack.push('React');
  else if (paths.some(p => p.includes('angular.json'))) stack.push('Angular');
  else if (paths.some(p => p.includes('svelte'))) stack.push('Svelte');
  else if (paths.some(p => p.includes('vue'))) stack.push('Vue.js');

  if (paths.some(p => p.includes('next.config'))) stack.push('Next.js');
  if (paths.some(p => p.includes('vite.config'))) stack.push('Vite');
  if (paths.some(p => p.includes('tailwind.config'))) stack.push('Tailwind CSS');
  if (paths.some(p => p.includes('tsconfig'))) stack.push('TypeScript');
  if (paths.some(p => p.includes('docker'))) stack.push('Docker');
  if (paths.some(p => p.includes('.github/workflows'))) stack.push('GitHub Actions');
  if (paths.some(p => p.includes('jest.config') || p.includes('vitest.config'))) stack.push('Testing');
  if (paths.some(p => p.includes('prisma'))) stack.push('Prisma');
  if (paths.some(p => p.includes('graphql'))) stack.push('GraphQL');
  if (paths.some(p => p.includes('supabase'))) stack.push('Supabase');
  if (paths.some(p => p.includes('firebase'))) stack.push('Firebase');

  // Add top languages
  Object.keys(languages).slice(0, 3).forEach(lang => {
    if (!stack.some(s => s.toLowerCase() === lang.toLowerCase())) {
      stack.push(lang);
    }
  });

  return [...new Set(stack)].slice(0, 8);
}
