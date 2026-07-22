"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, UserCircle2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getPublicUrl, BUCKET } from "@/lib/supabase/storage";

interface Props {
  propertyId: string;
  initialPath: string | null;
  onSave: (path: string | null) => Promise<{ error?: string }>;
}

export default function AgentPhotoUploader({ propertyId, initialPath, onSave }: Props) {
  const [path, setPath]           = useState<string | null>(initialPath);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    setUploading(true);
    setError("");
    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const storagePath = `${propertyId}/agent/photo.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, { upsert: true });
    if (uploadErr) { setError(uploadErr.message); setUploading(false); return; }
    const result = await onSave(storagePath);
    setUploading(false);
    if (result.error) { setError(result.error); return; }
    setPath(storagePath);
  }

  async function handleRemove() {
    const result = await onSave(null);
    if (!result.error) setPath(null);
    else setError(result.error);
  }

  return (
    <section className="bg-white border border-gray-100 rounded-2xl p-6">
      <h3 className="font-heading font-semibold text-pg-dark text-sm mb-4">
        Agent Photo
      </h3>

      <div className="flex items-center gap-5">
        {/* Preview */}
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center border border-gray-200">
          {path ? (
            <Image
              src={getPublicUrl(path)}
              alt="Agent"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserCircle2 size={36} className="text-gray-300" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className={`inline-flex items-center gap-2 text-sm font-medium cursor-pointer border border-dashed border-gray-200 rounded-lg px-4 py-2 hover:border-pg-gold hover:text-pg-gold transition-colors ${uploading ? "opacity-60 pointer-events-none" : "text-pg-muted"}`}>
            {uploading ? <Loader2 size={14} className="animate-spin" /> : null}
            {uploading ? "Uploading…" : path ? "Change Photo" : "Upload Photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>

          {path && (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 text-[12px] text-pg-muted hover:text-red-500 transition-colors"
            >
              <X size={12} /> Remove photo
            </button>
          )}
          <p className="text-[11px] text-pg-muted">Shown on the property listing page next to the agent name.</p>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
          {error}
        </p>
      )}
    </section>
  );
}
