import type { Improvement } from '@/types/github';

interface ImprovementsProps {
  improvements: Improvement[];
}

const priorityConfig = {
  high: { label: 'High', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  medium: { label: 'Medium', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  low: { label: 'Low', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
};

const categoryIcons: Record<string, string> = {
  Documentation: '📝',
  DevOps: '⚙️',
  'Code Quality': '🔍',
  Testing: '🧪',
  Legal: '⚖️',
  Security: '🔒',
  'Developer Experience': '🛠️',
  Visibility: '👁️',
  'Project Management': '📋',
};

const Improvements = ({ improvements }: ImprovementsProps) => {
  if (improvements.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <div className="text-3xl mb-2">🎉</div>
        <p className="text-sm font-semibold text-foreground">Great shape!</p>
        <p className="text-xs text-muted-foreground mt-1">No major improvements detected for this repository.</p>
      </div>
    );
  }

  const sorted = [...improvements].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Suggested Improvements</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Recommendations to enhance this project</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground mono">
          {improvements.length} found
        </span>
      </div>
      <div className="divide-y divide-border">
        {sorted.map((imp, i) => {
          const { label, className } = priorityConfig[imp.priority];
          const icon = categoryIcons[imp.category] || '💡';
          return (
            <div key={i} className="px-4 py-3.5 hover:bg-secondary/20 transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 leading-tight">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{imp.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${className}`}>
                      {label}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      {imp.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{imp.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Improvements;
