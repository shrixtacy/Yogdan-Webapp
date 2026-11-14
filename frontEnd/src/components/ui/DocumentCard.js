// Document management card
import { FileText, Image, Trash2, Edit2, ChevronRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { fmtDate } from '../../lib/yogdan/format';
import { cn } from '../../lib/utils';

export function DocumentCard({ doc, onDelete, onRename, onPreview, className }) {
  const isImage = doc.type?.startsWith('image/') || /\.(png|jpg|jpeg|gif|webp)$/i.test(doc.name);
  return (
    <div className={cn('rounded-3xl border border-border bg-white p-4 shadow-card', className)}>
      <div className="flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
          {isImage ? <Image className="size-5" /> : <FileText className="size-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{doc.name}</p>
          <p className="mt-0.5 text-xs text-muted">{doc.category} · {fmtDate(doc.uploadedAt)}</p>
          <div className="mt-2">
            <StatusBadge status={doc.verificationStatus ?? 'unverified'} />
            {doc.processingStatus === 'queued' && (
              <p className="mt-1 text-[10px] font-semibold text-muted">OCR analysis queued</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
        <button type="button" onClick={() => onPreview?.(doc)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent py-2 text-xs font-semibold text-primary hover:brightness-95">
          <ChevronRight className="size-3.5" /> View
        </button>
        <button type="button" onClick={() => onRename?.(doc)}
          className="grid size-9 place-items-center rounded-xl border border-border bg-white text-muted hover:text-ink">
          <Edit2 className="size-3.5" />
        </button>
        <button type="button" onClick={() => onDelete?.(doc.id)}
          className="grid size-9 place-items-center rounded-xl border border-primary/20 bg-white text-primary hover:bg-accent">
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
