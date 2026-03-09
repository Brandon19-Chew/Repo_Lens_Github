export interface RepoInfo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  default_branch: string;
  language: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  owner: {
    login: string;
    avatar_url: string;
  };
  license: {
    name: string;
  } | null;
  topics: string[];
  visibility: string;
}

export interface TreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

export interface TreeResponse {
  sha: string;
  url: string;
  tree: TreeItem[];
  truncated: boolean;
}

export interface LanguageMap {
  [language: string]: number;
}

export interface AnalysisResult {
  repo: RepoInfo;
  languages: LanguageMap;
  tree: TreeItem[];
  importantFiles: ImportantFile[];
  improvements: Improvement[];
  projectType: string;
  techStack: string[];
}

export interface ImportantFile {
  path: string;
  reason: string;
  icon: string;
}

export interface Improvement {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface FileNode {
  name: string;
  path: string;
  type: 'blob' | 'tree';
  children?: FileNode[];
}
