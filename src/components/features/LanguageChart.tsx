import type { LanguageMap } from '@/types/github';

interface LanguageChartProps {
  languages: LanguageMap;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572a5',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00add8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Swift: '#fa7343',
  Kotlin: '#a97bff',
  Dart: '#00b4ab',
  Scala: '#c22d40',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  R: '#198ce7',
  MATLAB: '#e16737',
  Lua: '#000080',
  Perl: '#0298c3',
  CoffeeScript: '#244776',
  Clojure: '#db5855',
  Groovy: '#e69f56',
};

function getColor(lang: string, index: number) {
  if (LANG_COLORS[lang]) return LANG_COLORS[lang];
  const palette = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ef4444','#06b6d4'];
  return palette[index % palette.length];
}

const LanguageChart = ({ languages }: LanguageChartProps) => {
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  const entries = Object.entries(languages)
    .map(([name, bytes]) => ({ name, bytes, pct: (bytes / total) * 100 }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Programming Languages</h3>

      {/* Bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-4 gap-px">
        {entries.map((lang, i) => (
          <div
            key={lang.name}
            style={{ width: `${lang.pct}%`, backgroundColor: getColor(lang.name, i) }}
            title={`${lang.name}: ${lang.pct.toFixed(1)}%`}
            className="transition-all duration-500"
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
        {entries.map((lang, i) => (
          <div key={lang.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: getColor(lang.name, i) }}
              />
              <span className="text-sm text-foreground truncate mono">{lang.name}</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground flex-shrink-0">
              {lang.pct.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageChart;
