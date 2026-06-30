"use client";

import { useState } from "react";
import { Plus, Trash2, ImageIcon, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getPublicUrl, BUCKET } from "@/lib/supabase/storage";
import type { OffPlanUnit, OffPlanExtras } from "@/types/database";

const UNIT_TYPES = [
  "Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom",
  "4 Bedroom", "5 Bedroom", "Penthouse", "Duplex", "Villa",
];

function unitCountForType(type: string): number {
  const match = type.match(/^(\d+)\s*Bedroom/i);
  if (match) return parseInt(match[1], 10);
  if (type === "Duplex") return 2;
  return 1;
}

interface UnitItem {
  id: string;
  title: string;
  description: string;
  image_path: string;
}

interface UnitGroup {
  groupId: string;
  type: string;
  items: UnitItem[];
}

function emptyItem(): UnitItem {
  return { id: crypto.randomUUID(), title: "", description: "", image_path: "" };
}

function toGroups(units: OffPlanUnit[]): UnitGroup[] {
  const groups: UnitGroup[] = [];
  for (const u of units) {
    const last = groups[groups.length - 1];
    if (last && last.type === u.type) {
      last.items.push({ id: u.id, title: u.title, description: u.description, image_path: u.image_path });
    } else {
      groups.push({
        groupId: crypto.randomUUID(),
        type: u.type,
        items: [{ id: u.id, title: u.title, description: u.description, image_path: u.image_path }],
      });
    }
  }
  return groups;
}

function fromGroups(groups: UnitGroup[]): OffPlanUnit[] {
  return groups.flatMap((g) =>
    g.items.map((item) => ({
      id: item.id,
      type: g.type,
      title: item.title,
      description: item.description,
      image_path: item.image_path,
    }))
  );
}

interface Props {
  propertyId: string;
  initialUnits: OffPlanUnit[];
  onSave: (extras: OffPlanExtras) => Promise<{ error?: string }>;
}

const input = "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-pg-body placeholder:text-pg-muted focus:outline-none focus:border-pg-gold transition-colors";
const lbl = "block text-xs font-medium text-pg-body mb-1.5";

export default function OffPlanUnitEditor({ propertyId, initialUnits, onSave }: Props) {
  const [groups, setGroups] = useState<UnitGroup[]>(() => toGroups(initialUnits));
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function addGroup() {
    setGroups((prev) => [
      ...prev,
      { groupId: crypto.randomUUID(), type: "Studio", items: [emptyItem()] },
    ]);
    setSaved(false);
  }

  function removeGroup(groupId: string) {
    setGroups((prev) => prev.filter((g) => g.groupId !== groupId));
    setSaved(false);
  }

  function moveGroup(groupId: string, dir: "up" | "down") {
    setGroups((prev) => {
      const idx = prev.findIndex((g) => g.groupId === groupId);
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
    setSaved(false);
  }

  function changeType(groupId: string, newType: string) {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.groupId !== groupId) return g;
        const targetCount = unitCountForType(newType);
        let items = [...g.items];
        while (items.length < targetCount) items.push(emptyItem());
        if (items.length > targetCount) items = items.slice(0, targetCount);
        return { ...g, type: newType, items };
      })
    );
    setSaved(false);
  }

  function updateItem(groupId: string, itemId: string, field: keyof UnitItem, value: string) {
    setGroups((prev) =>
      prev.map((g) =>
        g.groupId !== groupId
          ? g
          : { ...g, items: g.items.map((it) => (it.id === itemId ? { ...it, [field]: value } : it)) }
      )
    );
    setSaved(false);
  }

  async function uploadImage(groupId: string, itemId: string, file: File) {
    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${propertyId}/units/${itemId}.${ext}`;
    const key = `${groupId}:${itemId}`;
    setUploadingKey(key);
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true });
    setUploadingKey(null);
    if (!uploadErr) updateItem(groupId, itemId, "image_path", path);
  }

  async function save() {
    setSaving(true);
    setError("");
    const result = await onSave({ unit_types: fromGroups(groups) });
    setSaving(false);
    if (result.error) setError(result.error);
    else setSaved(true);
  }

  return (
    <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-semibold text-pg-dark text-sm uppercase tracking-wider">
            Unit Types
          </h3>
          <p className="text-xs text-pg-muted mt-0.5">
            Each entry shows alternating left/right on the public page.
          </p>
        </div>
        <button
          type="button"
          onClick={addGroup}
          className="flex items-center gap-1.5 text-sm font-medium text-pg-gold hover:text-pg-gold-dark transition-colors"
        >
          <Plus size={15} />
          Add Unit
        </button>
      </div>

      {groups.length === 0 && (
        <p className="text-sm text-pg-muted text-center py-6 border border-dashed border-gray-200 rounded-xl">
          No unit types yet. Click &ldquo;Add Unit&rdquo; to get started.
        </p>
      )}

      <div className="space-y-5">
        {groups.map((group, gIdx) => (
          <div key={group.groupId} className="border border-gray-100 rounded-xl overflow-hidden">

            {/* ── Group header: single type selector + reorder + delete ── */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50/70 border-b border-gray-100">
              <select
                value={group.type}
                onChange={(e) => changeType(group.groupId, e.target.value)}
                className="w-40 shrink-0 border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-pg-body bg-white focus:outline-none focus:border-pg-gold transition-colors"
              >
                {UNIT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <span className="flex-1 text-[11px] text-pg-muted">
                Shown {gIdx % 2 === 0 ? "content left, image right" : "image left, content right"}
              </span>

              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => moveGroup(group.groupId, "up")}
                  disabled={gIdx === 0}
                  className="p-1.5 text-pg-muted hover:text-pg-dark disabled:opacity-30 transition-colors"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => moveGroup(group.groupId, "down")}
                  disabled={gIdx === groups.length - 1}
                  className="p-1.5 text-pg-muted hover:text-pg-dark disabled:opacity-30 transition-colors"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeGroup(group.groupId)}
                  className="p-1.5 text-pg-muted hover:text-red-500 transition-colors ml-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* ── Sub-items (one per bedroom, auto-generated) ── */}
            <div className="divide-y divide-gray-100">
              {group.items.map((item, iIdx) => (
                <div key={item.id} className="p-4 space-y-4">
                  {group.items.length > 1 && (
                    <p className="text-[11px] font-semibold text-pg-muted uppercase tracking-wider">
                      Layout {iIdx + 1} / {group.items.length}
                    </p>
                  )}

                  <div>
                    <label className={lbl}>Heading</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(group.groupId, item.id, "title", e.target.value)}
                      placeholder="e.g. Open-plan living with stunning views"
                      className={input}
                    />
                  </div>

                  <div>
                    <label className={lbl}>Description</label>
                    <textarea
                      rows={3}
                      value={item.description}
                      onChange={(e) => updateItem(group.groupId, item.id, "description", e.target.value)}
                      placeholder="Describe this unit type..."
                      className={`${input} resize-none`}
                    />
                  </div>

                  <div>
                    <label className={lbl}>Unit Image</label>
                    <div className="flex items-center gap-3">
                      {item.image_path && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getPublicUrl(item.image_path)}
                          alt="unit"
                          className="w-24 h-16 object-cover rounded-lg border border-gray-200 shrink-0"
                        />
                      )}
                      <label
                        className={`flex items-center gap-2 text-sm text-pg-muted hover:text-pg-dark cursor-pointer border border-dashed border-gray-200 rounded-lg px-4 py-2.5 hover:border-gray-300 transition-colors ${
                          uploadingKey === `${group.groupId}:${item.id}` ? "opacity-60 pointer-events-none" : ""
                        }`}
                      >
                        {uploadingKey === `${group.groupId}:${item.id}` ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <ImageIcon size={14} />
                        )}
                        {uploadingKey === `${group.groupId}:${item.id}`
                          ? "Uploading…"
                          : item.image_path
                          ? "Change Image"
                          : "Upload Image"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files?.[0] && uploadImage(group.groupId, item.id, e.target.files[0])
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {groups.length > 0 && (
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-pg-gold text-pg-dark font-semibold px-6 py-2.5 rounded-lg hover:bg-pg-gold-dark transition-colors text-sm disabled:opacity-70"
        >
          {saving ? (
            <><Loader2 size={14} className="animate-spin" /> Saving…</>
          ) : saved ? (
            "✓ Saved"
          ) : (
            "Save Unit Types"
          )}
        </button>
      )}
    </section>
  );
}
