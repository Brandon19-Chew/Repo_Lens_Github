import { Star, GitFork, Eye, AlertCircle, Scale, Calendar, ExternalLink } from 'lucide-react';
import type { RepoInfo } from '@/types/github';

interface RepoStatsProps {
  repo: RepoInfo;
  projectType: string;
  techStack: string[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatSize(kb: number) {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

const RepoStats = ({ repo, projectType, techStack }: RepoStatsProps) => {
  const stats = [
    { icon: Star, label: 'Stars', value: repo.stargazers_count.toLocaleString(), color: 'text-yellow-400' },
    { icon: GitFork, label: 'Forks', value: repo.forks_count.toLocaleString(), color: 'text-blue-400' },
    { icon: Eye, label: 'Watchers', value: repo.watchers_count.toLocaleString(), color: 'text-cyan' },
    { icon: AlertCircle, label: 'Issues', value: repo.open_issues_count.toLocaleString(), color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-4">
      {/* Repo header */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-start gap-4">
          <img
            src={repo.owner.avatar_url}
            alt={repo.owner.login}
            className="w-12 h-12 rounded-lg border border-border flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h2 className="text-lg font-bold text-foreground leading-tight">{repo.full_name}</h2>
                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-primary/15 text-green border border-primary/20 mono">
                  {projectType}
                </span>
              </div>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border border-border hover:border-primary/40 px-3 py-1.5 rounded-lg"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open
              </a>
            </div>
            {repo.description && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{repo.description}</p>
            )}
            {repo.topics && repo.topics.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {repo.topics.slice(0, 6).map(topic => (
                  <span key={topic} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground mono">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-secondary/50 rounded-lg px-3 py-2.5 flex items-center gap-2.5">
              <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
              <div>
                <div className="text-sm font-semibold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Meta row */}
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Created {formatDate(repo.created_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Updated {formatDate(repo.updated_at)}
          </span>
          {repo.license && (
            <span className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              {repo.license.name}
            </span>
          )}
          <span>Size: {formatSize(repo.size)}</span>
          <span className="capitalize">{repo.visibility}</span>
        </div>
      </div>

      {/* Tech stack */}
      {techStack.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {techStack.map(tech => (
              <span key={tech} className="text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground mono font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoStats;
