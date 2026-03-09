import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import RepoInput from '@/components/features/RepoInput';
import RepoStats from '@/components/features/RepoStats';
import LanguageChart from '@/components/features/LanguageChart';
import FileTree from '@/components/features/FileTree';
import ImportantFiles from '@/components/features/ImportantFiles';
import Improvements from '@/components/features/Improvements';
import AnalysisSkeleton from '@/components/features/AnalysisSkeleton';
import ExportButton from '@/components/features/ExportButton';
import {
  fetchRepoInfo,
  fetchLanguages,
  fetchTree,
  buildFileTree,
  detectImportantFiles,
  generateImprovements,
  detectProjectType,
  detectTechStack,
} from '@/lib/github';
import type { AnalysisResult } from '@/types/github';
import heroBanner from '@/assets/hero-banner.jpg';
import { Sparkles, GitBranch, Code2, Lightbulb } from 'lucide-react';

const FEATURES = [
  { icon: GitBranch, label: 'Structure', desc: 'Full file tree visualization' },
  { icon: Code2, label: 'Languages', desc: 'Detect all programming languages' },
  { icon: Sparkles, label: 'Key Files', desc: 'Surface important config & entry points' },
  { icon: Lightbulb, label: 'Suggestions', desc: 'Actionable improvement recommendations' },
];

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentRepo, setCurrentRepo] = useState('');

  const handleAnalyze = useCallback(async (owner: string, repo: string) => {
    const key = `${owner}/${repo}`;
    setLoading(true);
    setResult(null);
    setCurrentRepo(key);

    console.log('[RepoLens] Analyzing:', key);

    try {
      const [repoInfo, languages, treeResp] = await Promise.all([
        fetchRepoInfo(owner, repo),
        fetchLanguages(owner, repo),
        fetchTree(owner, repo, 'HEAD').catch(() => fetchTree(owner, repo, 'main').catch(() => ({ sha: '', url: '', tree: [], truncated: false }))),
      ]);

      console.log('[RepoLens] repo:', repoInfo.full_name, '| files:', treeResp.tree.length);

      const tree = treeResp.tree;
      const fileTree = buildFileTree(tree);
      const importantFiles = detectImportantFiles(tree);
      const improvements = generateImprovements(repoInfo, tree, languages);
      const projectType = detectProjectType(languages, tree);
      const techStack = detectTechStack(languages, tree);

      setResult({
        repo: repoInfo,
        languages,
        tree,
        importantFiles,
        improvements,
        projectType,
        techStack,
      });

      toast.success(`Analysis complete for ${repoInfo.full_name}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to analyze repository';
      console.error('[RepoLens] Error:', msg);
      toast.error(msg.includes('Not Found') ? 'Repository not found. Make sure it\'s public.' : msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fileTree = result ? buildFileTree(result.tree) : [];
  const totalFiles = result ? result.tree.filter(t => t.type === 'blob').length : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero section */}
      {!result && !loading && (
        <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24 overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={heroBanner}
              alt="Hero"
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-green px-4 py-1.5 rounded-full text-sm font-medium mono mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered GitHub Analyzer
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
              Understand any repo<br />
              <span className="text-green">in seconds</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto">
              Paste a GitHub link and get instant insights — project structure, languages, key files, and actionable improvement suggestions.
            </p>

            <RepoInput onAnalyze={handleAnalyze} isLoading={loading} />

            {/* Feature pills */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FEATURES.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="bg-card/60 border border-border rounded-xl p-3.5 text-left backdrop-blur-sm">
                  <Icon className="w-5 h-5 text-green mb-2" />
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results section */}
      {(loading || result) && (
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
          {/* Search bar (compact) */}
          <div className="mb-6 flex items-center gap-4 flex-wrap">
            <RepoInput onAnalyze={handleAnalyze} isLoading={loading} />
          </div>

          {loading && <AnalysisSkeleton />}

          {result && !loading && (
            <div className="space-y-4">
              {/* Export button row */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-xs text-muted-foreground mono">
                  Analysis complete · {result.tree.filter(t => t.type === 'blob').length.toLocaleString()} files scanned
                </p>
                <ExportButton result={result} />
              </div>
              <RepoStats repo={result.repo} projectType={result.projectType} techStack={result.techStack} />
              <LanguageChart languages={result.languages} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FileTree
                  nodes={fileTree}
                  totalFiles={totalFiles}
                  truncated={result.tree.length >= 100000}
                />
                <ImportantFiles files={result.importantFiles} />
              </div>

              <Improvements improvements={result.improvements} />
            </div>
          )}
        </main>
      )}

      <footer className="border-t border-border py-5 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          RepoLens — Powered by the GitHub public API. Works with public repositories only.
        </p>
      </footer>
    </div>
  );
};

export default Index;
