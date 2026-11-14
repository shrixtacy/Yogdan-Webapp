// Document management — upload, preview, rename, categorize, delete
import { useState, useRef } from 'react';
import { Plus, Lock, Upload, Image } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { DocumentCard } from '../../components/ui/DocumentCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/index';
import { cn } from '../../lib/utils';

const CATEGORIES = ['All', 'Prescription', 'Blood test / CBC', 'Imaging report', 'Vaccination record', 'Donation certificate', 'Medical report', 'Other'];

function UploadSheet({ onClose, onUpload }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Other');
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setName(file.name.replace(/\.[^.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (ev) => setPreview({ url: ev.target.result, type: file.type, raw: file });
    reader.readAsDataURL(file);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-[440px] rounded-t-[32px] bg-white px-5 pb-8 pt-5 shadow-phone">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Upload document</h2>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-full border border-border text-muted hover:bg-accent">✕</button>
        </div>

        {/* File picker */}
        <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={handleFile} />
        {!preview ? (
          <div className="space-y-3">
            <button type="button" onClick={() => fileRef.current.click()}
              className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/50 text-muted hover:border-primary/40 hover:bg-accent/40 transition-colors">
              <Upload className="size-7" />
              <p className="text-sm font-semibold">Tap to choose a file</p>
              <p className="text-xs">PDF, image or document</p>
            </button>
          </div>
        ) : (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border bg-white p-3">
            {preview.type?.startsWith('image/') ? (
              <img src={preview.url} alt="preview" className="size-14 rounded-xl object-cover" />
            ) : (
              <div className="grid size-14 place-items-center rounded-xl bg-accent text-primary">
                <Upload className="size-6" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{preview.raw.name}</p>
              <p className="text-xs text-muted">{(preview.raw.size / 1024).toFixed(0)} KB</p>
            </div>
            <button type="button" onClick={() => setPreview(null)} className="text-xs text-muted hover:text-primary">Remove</button>
          </div>
        )}

        <div className="mt-4 space-y-3">
          <Input id="docName" label="Document name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter a name" />
          <div>
            <p className="mb-1.5 text-sm font-semibold text-ink">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                <button key={c} type="button" onClick={() => setCategory(c)}
                  className={cn('rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                    category === c ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted')}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <Button
            disabled={!name.trim()}
            onClick={() => {
              onUpload({
                name: name.trim(),
                category,
                type: preview?.type ?? 'application/octet-stream',
                url: preview?.url ?? null,
                uploadedAt: new Date().toISOString(),
                verificationStatus: 'unverified',
                processingStatus: 'queued',
                ocrNote: 'Document queued for secure OCR analysis. Review extracted details before saving them to your health history.',
              });
              onClose();
            }}
          >Save document</Button>
        </div>
      </div>
    </div>
  );
}

function RenameModal({ doc, onSave, onClose }) {
  const [name, setName] = useState(doc.name);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-[380px] rounded-3xl bg-white px-5 py-6 shadow-phone">
        <h2 className="mb-4 text-lg font-bold text-ink">Rename document</h2>
        <Input id="rename" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        <div className="mt-4 flex gap-2">
          <Button onClick={() => { onSave(name); onClose(); }}>Save</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ doc, onClose }) {
  const isImage = doc.type?.startsWith('image/');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-[440px] p-4">
        {isImage && doc.url ? (
          <img src={doc.url} alt={doc.name} className="w-full rounded-2xl" />
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-10 text-center">
            <Upload className="size-10 text-muted" />
            <p className="font-semibold text-ink">{doc.name}</p>
            <p className="text-xs text-muted">Preview not available for this file type.</p>
          </div>
        )}
        <button type="button" onClick={onClose}
          className="mt-4 w-full rounded-2xl bg-white py-3 text-sm font-semibold text-ink hover:bg-accent">
          Close
        </button>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const { documents, addDocument, deleteDocument, renameDocument } = useStore();
  const store = useStore();
  const [catFilter, setCatFilter] = useState('All');
  const [showUpload, setShowUpload] = useState(false);
  const [renaming, setRenaming] = useState(null);
  const [previewing, setPreviewing] = useState(null);

  const docs = Array.isArray(documents) ? documents : [];
  const visible = docs.filter((d) => catFilter === 'All' || d.category === catFilter);

  function addDoc(doc) {
    addDocument(doc);
  }

  function deleteDoc(id) {
    if (!window.confirm('Delete this document? This cannot be undone.')) return;
    deleteDocument(id);
  }

  function renameDoc(id, name) {
    renameDocument(id, name);
  }

  return (
    <AppShell>
      <ScreenHeader
        title="Documents"
        back="/profile"
        right={
          <button type="button" onClick={() => setShowUpload(true)}
            className="grid size-9 place-items-center rounded-full bg-gradient-crimson text-white shadow-crimson">
            <Plus className="size-4" />
          </button>
        }
      />

      {/* Privacy notice */}
      <div className="mx-5 mb-2 flex items-center gap-2 rounded-2xl bg-secondary/60 px-4 py-2.5 text-xs text-muted">
        <Lock className="size-3.5 shrink-0 text-muted" />
        All documents are private by default. They are never shown publicly.
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-3">
        {CATEGORIES.map((c) => (
          <button key={c} type="button" onClick={() => setCatFilter(c)}
            className={cn('rounded-full border px-3 py-1.5 text-xs font-semibold shrink-0 transition-colors',
              catFilter === c ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted hover:border-primary/40')}>
            {c}
          </button>
        ))}
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-4 space-y-3">
        {visible.length === 0 ? (
          <EmptyState
            icon={<Image className="size-7" />}
            title="No documents yet"
            description="Upload blood group reports, donation certificates or other health documents."
            action={
              <Button size="sm" onClick={() => setShowUpload(true)}>
                <Upload className="size-4" /> Upload a document
              </Button>
            }
          />
        ) : (
          visible.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onDelete={deleteDoc}
              onRename={(d) => setRenaming(d)}
              onPreview={(d) => setPreviewing(d)}
            />
          ))
        )}
      </div>

      {showUpload && <UploadSheet onClose={() => setShowUpload(false)} onUpload={addDoc} />}
      {renaming && <RenameModal doc={renaming} onSave={(name) => renameDoc(renaming.id, name)} onClose={() => setRenaming(null)} />}
      {previewing && <PreviewModal doc={previewing} onClose={() => setPreviewing(null)} />}
    </AppShell>
  );
}
