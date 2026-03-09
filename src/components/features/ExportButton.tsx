import { useState, useRef, useEffect } from 'react';
import { Download, FileText, File, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { downloadMarkdown, downloadPDF } from '@/lib/exportReport';
import type { AnalysisResult } from '@/types/github';

interface ExportButtonProps {
  result: AnalysisResult;
}

const ExportButton = ({ result }: ExportButtonProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<'pdf' | 'md' | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkdown = async () => {
    setOpen(false);
    setLoading('md');
    try {
      downloadMarkdown(result);
      toast.success('Markdown report downloaded');
    } catch {
      toast.error('Failed to generate Markdown report');
    } finally {
      setLoading(null);
    }
  };

  const handlePDF = async () => {
    setOpen(false);
    setLoading('pdf');
    toast.loading('Generating PDF report…', { id: 'pdf-gen' });
    try {
      await downloadPDF(result);
      toast.success('PDF report downloaded', { id: 'pdf-gen' });
    } catch (err) {
      console.error('[ExportButton] PDF error:', err);
      toast.error('Failed to generate PDF report', { id: 'pdf-gen' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        disabled={loading !== null}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-border hover:border-primary/50 text-foreground rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-green" />
        ) : (
          <Download className="w-4 h-4 text-green" />
        )}
        <span>{loading ? 'Exporting…' : 'Export Report'}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-52 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs text-muted-foreground font-medium">Choose export format</p>
          </div>

          <button
            onClick={handleMarkdown}
            className="w-full flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
          >
            <FileText className="w-4 h-4 text-cyan mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Markdown</p>
              <p className="text-xs text-muted-foreground mt-0.5">Formatted .md file with tables</p>
            </div>
          </button>

          <button
            onClick={handlePDF}
            className="w-full flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left border-t border-border"
          >
            <File className="w-4 h-4 text-green mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">PDF</p>
              <p className="text-xs text-muted-foreground mt-0.5">Styled dark-theme PDF report</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
