import { useState } from 'react';
import { Search, ArrowRight, Github, Zap } from 'lucide-react';
import { parseGitHubUrl } from '@/lib/github';

interface RepoInputProps {
  onAnalyze: (owner: string, repo: string) => void;
  isLoading: boolean;
}

const EXAMPLES = [
  'facebook/react',
  'vercel/next.js',
  'tailwindlabs/tailwindcss',
  'microsoft/vscode',
];

const RepoInput = ({ onAnalyze, isLoading }: RepoInputProps) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const parsed = parseGitHubUrl(value.trim());
    if (!parsed) {
      setError('Invalid GitHub URL or repo path. Try: owner/repo or https://github.com/owner/repo');
      return;
    }
    onAnalyze(parsed.owner, parsed.repo);
  };

  const handleExample = (example: string) => {
    setValue(example);
    setError('');
    const parsed = parseGitHubUrl(example);
    if (parsed) onAnalyze(parsed.owner, parsed.repo);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex items-center bg-card border rounded-xl overflow-hidden transition-all duration-200 ${
          error ? 'border-destructive' : 'border-border hover:border-primary/50 focus-within:border-primary focus-within:glow-green'
        }`}>
          <div className="pl-4 text-muted-foreground">
            <Github className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={value}
            onChange={e => { setValue(e.target.value); setError(''); }}
            placeholder="Paste a GitHub repo URL or owner/repo..."
            className="flex-1 bg-transparent px-3 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none text-sm mono"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className="m-1.5 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:glow-green"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Analyzing
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Analyze
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-destructive flex items-center gap-1.5">
            <span>⚠</span> {error}
          </p>
        )}
      </form>

      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <span className="text-xs text-muted-foreground">Try:</span>
        {EXAMPLES.map(ex => (
          <button
            key={ex}
            onClick={() => handleExample(ex)}
            disabled={isLoading}
            className="text-xs mono text-muted-foreground hover:text-primary border border-border hover:border-primary/40 px-2.5 py-1 rounded-md transition-colors disabled:opacity-50"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RepoInput;
