"use client";

import { useState, useRef, useCallback } from "react";
import { UploadCloud, X, Star, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getPublicUrl, BUCKET } from "@/lib/supabase/storage";
import {
  addPropertyImage,
  deletePropertyImage,
  setPropertyImagePrimary,
} from "@/app/(admin)/admin/actions";

interface ImageRecord {
  id: string;
  storage_path: string;
  alt: string | null;
  is_primary: boolean;
  display_order: number;
}

interface Props {
  propertyId: string;
  initialImages: ImageRecord[];
}

interface UploadingFile {
  name: string;
  progress: "uploading" | "saving" | "error";
  error?: string;
}

export default function PropertyImageUploader({ propertyId, initialImages }: Props) {
  const [images, setImages] = useState<ImageRecord[]>(initialImages);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const fileArr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!fileArr.length) return;

    const supabase = createClient();
    const isPrimaryNeeded = images.length === 0;

    for (let i = 0; i < fileArr.length; i++) {
      const file = fileArr[i];
      const ext = file.name.split(".").pop() ?? "jpg";
      const storagePath = `${propertyId}/${Date.now()}-${i}.${ext}`;

      setUploading((prev) => [...prev, { name: file.name, progress: "uploading" }]);

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, file, { upsert: false });

      if (uploadError) {
        setUploading((prev) =>
          prev.map((u) =>
            u.name === file.name ? { ...u, progress: "error", error: uploadError.message } : u
          )
        );
        continue;
      }

      setUploading((prev) =>
        prev.map((u) => (u.name === file.name ? { ...u, progress: "saving" } : u))
      );

      const result = await addPropertyImage({
        property_id: propertyId,
        storage_path: storagePath,
        alt: file.name.replace(/\.[^.]+$/, ""),
        is_primary: isPrimaryNeeded && i === 0,
        display_order: images.length + i,
      });

      setUploading((prev) => prev.filter((u) => u.name !== file.name));

      if (!result.error && result.id) {
        setImages((prev) => [
          ...prev,
          {
            id: result.id!,
            storage_path: storagePath,
            alt: file.name.replace(/\.[^.]+$/, ""),
            is_primary: isPrimaryNeeded && i === 0,
            display_order: prev.length,
          },
        ]);
      }
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      uploadFiles(e.dataTransfer.files);
    },
    [images.length]
  );

  async function handleDelete(img: ImageRecord) {
    await deletePropertyImage(img.id, img.storage_path);
    setImages((prev) => prev.filter((i) => i.id !== img.id));
  }

  async function handleSetPrimary(img: ImageRecord) {
    await setPropertyImagePrimary(propertyId, img.id);
    setImages((prev) =>
      prev.map((i) => ({ ...i, is_primary: i.id === img.id }))
    );
  }

  return (
    <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
      <h3 className="font-heading font-semibold text-pg-dark text-sm uppercase tracking-wider">
        Images
      </h3>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 py-10 cursor-pointer transition-colors ${
          dragging
            ? "border-pg-gold bg-pg-gold/5"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <UploadCloud size={28} className="text-pg-muted" />
        <p className="text-sm font-medium text-pg-dark">
          {dragging ? "Drop to upload" : "Drag & drop images here"}
        </p>
        <p className="text-xs text-pg-muted">or click to browse — JPG, PNG, WEBP</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      {/* Uploading indicators */}
      {uploading.map((u) => (
        <div key={u.name} className="flex items-center gap-3 text-sm text-pg-muted">
          {u.progress === "error" ? (
            <X size={14} className="text-red-500 shrink-0" />
          ) : (
            <Loader2 size={14} className="animate-spin shrink-0" />
          )}
          <span className="truncate">{u.name}</span>
          <span className="text-xs ml-auto shrink-0">
            {u.progress === "error" ? (
              <span className="text-red-500">{u.error ?? "Upload failed"}</span>
            ) : u.progress === "saving" ? (
              "Saving…"
            ) : (
              "Uploading…"
            )}
          </span>
        </div>
      ))}

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group aspect-4/3 rounded-lg overflow-hidden border border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getPublicUrl(img.storage_path)}
                alt={img.alt ?? "Property image"}
                className="w-full h-full object-cover"
              />

              {/* Cover badge */}
              {img.is_primary && (
                <div className="absolute top-1.5 left-1.5 bg-pg-gold text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm flex items-center gap-1">
                  <Star size={9} fill="white" /> Cover
                </div>
              )}

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                {!img.is_primary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(img)}
                    className="w-full text-[11px] font-semibold bg-white text-pg-dark rounded-md py-1.5 hover:bg-pg-gold hover:text-white transition-colors"
                  >
                    Set as Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(img)}
                  className="w-full text-[11px] font-semibold bg-red-500 text-white rounded-md py-1.5 hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && uploading.length === 0 && (
        <p className="text-xs text-pg-muted text-center">No images yet. Upload one above.</p>
      )}
    </section>
  );
}
