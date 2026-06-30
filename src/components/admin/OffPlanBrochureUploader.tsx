"use client";

import { useState } from "react";
import { FileText, UploadCloud, X, Loader2, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getPublicUrl, BUCKET } from "@/lib/supabase/storage";
import type { OffPlanExtras } from "@/types/database";

interface Props {
  propertyId: string;
  initialPath: string | null;
  onSave: (extras: OffPlanExtras) => Promise<{ error?: string }>;
}

export default function OffPlanBrochureUploader({ propertyId, initialPath, onSave }: Props) {
  const [path,      setPath]      = useState<string | null>(initialPath);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState("");
  const [saved,     setSaved]     = useState(false);

  async function handleFile(file: File) {
    if (!file.type.includes("pdf") && !file.name.endsWith(".pdf")) {
      setError("Please upload a PDF file.");
      return;
    }
    setUploading(true);
    setError("");
    const supabase = createClient();
    const storagePath = `${propertyId}/brochure.pdf`;
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, { upsert: true, contentType: "application/pdf" });
    if (uploadErr) {
      setError(uploadErr.message);
      setUploading(false);
      return;
    }
    // Save the path to the DB
    const result = await onSave({ brochure_path: storagePath });
    setUploading(false);
    if (result.error) { setError(result.error); return; }
    setPath(storagePath);
    setSaved(true);
  }

  async function handleRemove() {
    const result = await onSave({ brochure_path: null });
    if (!result.error) { setPath(null); setSaved(false); }
    else setError(result.error);
  }

  return (
    <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
      <div>
        <h3 className="font-heading font-semibold text-pg-dark text-sm uppercase tracking-wider">
          Brochure (PDF)
        </h3>
        <p className="text-xs text-pg-muted mt-0.5">
          Uploaded here becomes the downloadable brochure on the project page.
        </p>
      </div>

      {path ? (
        <div className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-3 bg-gray-50/50">
          <FileText size={20} className="text-pg-gold shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-pg-dark truncate">brochure.pdf</p>
            {saved && <p className="text-[11px] text-green-600">Saved ✓</p>}
          </div>
          <a
            href={getPublicUrl(path)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pg-muted hover:text-pg-dark transition-colors"
            title="Preview"
          >
            <ExternalLink size={14} />
          </a>
          <button
            type="button"
            onClick={handleRemove}
            className="text-pg-muted hover:text-red-500 transition-colors"
            title="Remove"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-10 cursor-pointer transition-colors hover:border-pg-gold/50 hover:bg-pg-gold/5 ${uploading ? "opacity-60 pointer-events-none" : "border-gray-200"}`}>
          {uploading ? (
            <Loader2 size={24} className="animate-spin text-pg-muted" />
          ) : (
            <UploadCloud size={24} className="text-pg-muted" />
          )}
          <p className="text-sm font-medium text-pg-dark">
            {uploading ? "Uploading…" : "Upload PDF brochure"}
          </p>
          <p className="text-xs text-pg-muted">Drag & drop or click — PDF only</p>
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </label>
      )}

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
          {error}
        </p>
      )}
    </section>
  );
}
