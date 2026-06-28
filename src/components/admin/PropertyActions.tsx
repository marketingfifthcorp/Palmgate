"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { togglePublished, toggleFeatured, deleteProperty } from "@/app/(admin)/admin/actions";

interface Props {
  id: string;
  published: boolean;
  featured: boolean;
}

export default function PropertyActions({ id, published, featured }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const router = useRouter();

  async function run(fn: () => Promise<void>, key: string) {
    setBusy(key);
    await fn();
    router.refresh();
    setBusy(null);
  }

  return (
    <div className="flex items-center gap-0.5">
      <Link
        href={`/admin/properties/${id}/edit`}
        className="p-1.5 rounded-lg text-pg-muted hover:text-pg-dark hover:bg-gray-100 transition-colors"
        title="Edit"
      >
        <Pencil size={14} />
      </Link>
      <button
        onClick={() => run(() => togglePublished(id, !published), "pub")}
        disabled={busy !== null}
        title={published ? "Unpublish" : "Publish"}
        className="p-1.5 rounded-lg text-pg-muted hover:text-pg-dark hover:bg-gray-100 transition-colors disabled:opacity-40"
      >
        {published ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>
      <button
        onClick={() => run(() => toggleFeatured(id, !featured), "feat")}
        disabled={busy !== null}
        title={featured ? "Unfeature" : "Feature"}
        className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
          featured
            ? "text-pg-gold hover:bg-pg-gold/10"
            : "text-pg-muted hover:text-pg-dark hover:bg-gray-100"
        }`}
      >
        <Star size={14} />
      </button>
      <button
        onClick={() => {
          if (confirm("Delete this property? This cannot be undone.")) {
            run(() => deleteProperty(id), "del");
          }
        }}
        disabled={busy !== null}
        title="Delete"
        className="p-1.5 rounded-lg text-pg-muted hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
