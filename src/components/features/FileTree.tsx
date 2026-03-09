import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File } from 'lucide-react';
import type { FileNode } from '@/types/github';

interface FileTreeNodeProps {
  node: FileNode;
  depth: number;
}

function getFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const icons: Record<string, string> = {
    ts: '🔷', tsx: '⚛️', js: '📜', jsx: '⚛️', json: '📋',
    md: '📄', mdx: '📄', css: '🎨', scss: '🎨', html: '🌐',
    py: '🐍', go: '🐹', rs: '🦀', java: '☕', rb: '💎',
    sh: '⚙️', yml: '⚙️', yaml: '⚙️', toml: '⚙️', env: '🔑',
    dockerfile: '🐳', gitignore: '🚫', lock: '🔒', svg: '🖼️',
    png: '🖼️', jpg: '🖼️', jpeg: '🖼️', gif: '🖼️', ico: '🖼️',
    txt: '📝', pdf: '📑', csv: '📊',
  };
  const nameMap: Record<string, string> = {
    'package.json': '📦', 'package-lock.json': '🔒',
    'dockerfile': '🐳', '.gitignore': '🚫', '.env': '🔑',
    'readme.md': '📖', 'license': '⚖️', 'contributing.md': '🤝',
  };
  return nameMap[name.toLowerCase()] || icons[ext] || '📄';
}

const FileTreeNode = ({ node, depth }: FileTreeNodeProps) => {
  const [open, setOpen] = useState(depth < 1);
  const isDir = node.type === 'tree';
  const indent = depth * 16;

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 py-0.5 px-2 rounded hover:bg-secondary/50 cursor-pointer group transition-colors ${
          isDir ? '' : 'opacity-90'
        }`}
        style={{ paddingLeft: `${8 + indent}px` }}
        onClick={() => isDir && setOpen(o => !o)}
      >
        {isDir ? (
          <>
            <span className="text-muted-foreground w-3.5 h-3.5 flex-shrink-0">
              {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </span>
            {open
              ? <FolderOpen className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              : <Folder className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            }
          </>
        ) : (
          <>
            <span className="w-3.5 flex-shrink-0" />
            <span className="text-xs flex-shrink-0">{getFileIcon(node.name)}</span>
          </>
        )}
        <span className="text-sm mono text-foreground truncate">{node.name}</span>
      </div>

      {isDir && open && node.children && (
        <div>
          {node.children.map(child => (
            <FileTreeNode key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

interface FileTreeProps {
  nodes: FileNode[];
  totalFiles: number;
  truncated: boolean;
}

const FileTree = ({ nodes, totalFiles, truncated }: FileTreeProps) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? nodes : nodes.slice(0, 30);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Project Structure</h3>
        <span className="text-xs text-muted-foreground mono">{totalFiles.toLocaleString()} files</span>
      </div>
      <div className="p-2 max-h-80 overflow-y-auto scrollbar-thin">
        {visible.map(node => (
          <FileTreeNode key={node.path} node={node} depth={0} />
        ))}
        {!showAll && nodes.length > 30 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full text-center text-xs text-primary hover:text-primary/80 py-2 mt-1 transition-colors"
          >
            Show {nodes.length - 30} more root items...
          </button>
        )}
        {truncated && (
          <p className="text-xs text-muted-foreground text-center py-2">
            Tree truncated — repository is very large
          </p>
        )}
      </div>
    </div>
  );
};

export default FileTree;
