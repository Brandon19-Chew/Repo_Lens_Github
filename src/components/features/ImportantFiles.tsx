import type { ImportantFile } from '@/types/github';

interface ImportantFilesProps {
  files: ImportantFile[];
}

const ImportantFiles = ({ files }: ImportantFilesProps) => {
  if (files.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Important Files</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Key configuration and entry point files</p>
      </div>
      <div className="divide-y divide-border">
        {files.map(file => (
          <div key={file.path} className="flex items-start gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors">
            <span className="text-lg flex-shrink-0 leading-tight">{file.icon}</span>
            <div className="min-w-0">
              <p className="text-sm mono text-green font-medium truncate">{file.path}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{file.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImportantFiles;
