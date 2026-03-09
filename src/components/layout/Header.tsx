import { Github } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Github className="w-4 h-4 text-green" />
          </div>
          <span className="font-semibold text-foreground tracking-tight">
            Repo<span className="text-green">Lens</span>
          </span>
        </a>
        <nav className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
