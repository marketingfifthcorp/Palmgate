"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PropertyFormData } from "@/app/(admin)/admin/actions";
import type { PropertyType, PropertyAvailability, PropertyCondition, PropertyRow } from "@/types/database";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface Props {
  initial?: PropertyRow;
  action: (data: PropertyFormData) => Promise<{ error?: string }>;
  redirectTo?: string;
}

type F = {
  title: string;
  slug: string;
  description: string;
  type: PropertyType;
  availability: PropertyAvailability;
  condition: PropertyCondition;
  price: string;
  currency: string;
  bedrooms: string;
  bathrooms: string;
  area_sqft: string;
  location_name: string;
  community: string;
  emirate: string;
  developer: string;
  completion_date: string;
  plan_down: string;
  plan_during: string;
  plan_handover: string;
  amenities: string;
  featured: boolean;
  published: boolean;
};

function fromRow(row?: PropertyRow): F {
  return {
    title: row?.title ?? "",
    slug: row?.slug ?? "",
    description: row?.description ?? "",
    type: row?.type ?? "apartment",
    availability: row?.availability ?? "for_sale",
    condition: row?.condition ?? "ready",
    price: row?.price?.toString() ?? "",
    currency: row?.currency ?? "AED",
    bedrooms: row?.bedrooms?.toString() ?? "",
    bathrooms: row?.bathrooms?.toString() ?? "",
    area_sqft: row?.area_sqft?.toString() ?? "",
    location_name: row?.location_name ?? "",
    community: row?.community ?? "",
    emirate: row?.emirate ?? "Dubai",
    developer: row?.developer ?? "",
    completion_date: row?.completion_date ?? "",
    plan_down: row?.payment_plan?.down?.toString() ?? "",
    plan_during: row?.payment_plan?.during?.toString() ?? "",
    plan_handover: row?.payment_plan?.handover?.toString() ?? "",
    amenities: row?.amenities?.join(", ") ?? "",
    featured: row?.featured ?? false,
    published: row?.published ?? false,
  };
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-pg-body placeholder:text-pg-muted focus:outline-none focus:border-pg-gold transition-colors";

const labelClass = "block text-xs font-medium text-pg-body mb-1.5";

export default function PropertyForm({ initial, action, redirectTo = "/admin/properties" }: Props) {
  const [f, setF] = useState<F>(() => fromRow(initial));
  const [slugManual, setSlugManual] = useState(!!initial);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function set(field: keyof F, value: string | boolean) {
    setF((prev) => ({ ...prev, [field]: value }));
  }

  function handleTitle(v: string) {
    set("title", v);
    if (!slugManual) set("slug", slugify(v));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const isOffPlan = f.condition === "off_plan";
    const paymentPlan =
      isOffPlan && f.plan_down && f.plan_during && f.plan_handover
        ? {
            down: parseFloat(f.plan_down),
            during: parseFloat(f.plan_during),
            handover: parseFloat(f.plan_handover),
          }
        : null;

    const data: PropertyFormData = {
      title: f.title,
      slug: f.slug,
      description: f.description || null,
      type: f.type,
      availability: f.availability,
      condition: f.condition,
      price: parseFloat(f.price) || 0,
      currency: f.currency,
      bedrooms: f.bedrooms ? parseInt(f.bedrooms) : null,
      bathrooms: f.bathrooms ? parseInt(f.bathrooms) : null,
      area_sqft: f.area_sqft ? parseFloat(f.area_sqft) : null,
      location_name: f.location_name || null,
      community: f.community || null,
      emirate: f.emirate || "Dubai",
      developer: isOffPlan ? (f.developer || null) : null,
      completion_date: isOffPlan ? (f.completion_date || null) : null,
      payment_plan: paymentPlan,
      amenities: f.amenities
        ? f.amenities.split(",").map((a) => a.trim()).filter(Boolean)
        : [],
      featured: f.featured,
      published: f.published,
    };

    const result = await action(data);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  const isOffPlan = f.condition === "off_plan";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Core */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
        <h3 className="font-heading font-semibold text-pg-dark text-sm uppercase tracking-wider">
          Basic Info
        </h3>
        <div>
          <label className={labelClass}>Title *</label>
          <input
            type="text" required value={f.title}
            onChange={(e) => handleTitle(e.target.value)}
            placeholder="e.g. Luxury 2BR in Dubai Marina"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Slug *</label>
          <input
            type="text" required value={f.slug}
            onChange={(e) => { setSlugManual(true); set("slug", e.target.value); }}
            placeholder="luxury-2br-dubai-marina"
            className={inputClass + " font-mono text-xs"}
          />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            rows={5} value={f.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Property description..."
            className={inputClass + " resize-none"}
          />
        </div>
      </section>

      {/* Classification */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
        <h3 className="font-heading font-semibold text-pg-dark text-sm uppercase tracking-wider">
          Classification
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Type *</label>
            <select value={f.type} onChange={(e) => set("type", e.target.value)} className={inputClass + " bg-white"}>
              {(["apartment","villa","townhouse","penthouse","office","land"] as PropertyType[]).map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Availability *</label>
            <select value={f.availability} onChange={(e) => set("availability", e.target.value)} className={inputClass + " bg-white"}>
              <option value="for_sale">For Sale</option>
              <option value="for_rent">For Rent</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Condition *</label>
            <select value={f.condition} onChange={(e) => set("condition", e.target.value as PropertyCondition)} className={inputClass + " bg-white"}>
              <option value="ready">Ready</option>
              <option value="off_plan">Off-Plan</option>
            </select>
          </div>
        </div>
      </section>

      {/* Pricing & Size */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
        <h3 className="font-heading font-semibold text-pg-dark text-sm uppercase tracking-wider">
          Pricing & Size
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Price *</label>
            <input type="number" required value={f.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="2500000" min="0"
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <input type="text" value={f.currency}
              onChange={(e) => set("currency", e.target.value)}
              placeholder="AED" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Bedrooms</label>
            <input type="number" value={f.bedrooms}
              onChange={(e) => set("bedrooms", e.target.value)}
              placeholder="2" min="0"
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Bathrooms</label>
            <input type="number" value={f.bathrooms}
              onChange={(e) => set("bathrooms", e.target.value)}
              placeholder="2" min="0"
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Area (sqft)</label>
            <input type="number" value={f.area_sqft}
              onChange={(e) => set("area_sqft", e.target.value)}
              placeholder="1200" min="0"
              className={inputClass} />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
        <h3 className="font-heading font-semibold text-pg-dark text-sm uppercase tracking-wider">
          Location
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Location Name</label>
            <input type="text" value={f.location_name}
              onChange={(e) => set("location_name", e.target.value)}
              placeholder="e.g. Marina Walk, Tower B"
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Community</label>
            <input type="text" value={f.community}
              onChange={(e) => set("community", e.target.value)}
              placeholder="e.g. Dubai Marina"
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Emirate</label>
            <input type="text" value={f.emirate}
              onChange={(e) => set("emirate", e.target.value)}
              placeholder="Dubai" className={inputClass} />
          </div>
        </div>
      </section>

      {/* Off-plan extras */}
      {isOffPlan && (
        <section className="bg-white border border-pg-gold/20 rounded-2xl p-6 space-y-5">
          <h3 className="font-heading font-semibold text-pg-dark text-sm uppercase tracking-wider">
            Off-Plan Details
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Developer</label>
              <input type="text" value={f.developer}
                onChange={(e) => set("developer", e.target.value)}
                placeholder="e.g. Emaar" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Completion Date</label>
              <input type="date" value={f.completion_date}
                onChange={(e) => set("completion_date", e.target.value)}
                className={inputClass} />
            </div>
          </div>
          <div>
            <p className={labelClass}>Payment Plan (%)</p>
            <div className="grid grid-cols-3 gap-3">
              {(["plan_down", "plan_during", "plan_handover"] as const).map((key, i) => (
                <div key={key}>
                  <p className="text-[11px] text-pg-muted mb-1">
                    {["Down Payment", "During Construction", "On Handover"][i]}
                  </p>
                  <input type="number" value={f[key]}
                    onChange={(e) => set(key, e.target.value)}
                    placeholder="20" min="0" max="100"
                    className={inputClass} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Amenities */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
        <h3 className="font-heading font-semibold text-pg-dark text-sm uppercase tracking-wider">
          Amenities
        </h3>
        <div>
          <label className={labelClass}>Amenities (comma-separated)</label>
          <textarea
            rows={3} value={f.amenities}
            onChange={(e) => set("amenities", e.target.value)}
            placeholder="Pool, Gym, Parking, Concierge, Balcony"
            className={inputClass + " resize-none"}
          />
        </div>
      </section>

      {/* Visibility */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6">
        <h3 className="font-heading font-semibold text-pg-dark text-sm uppercase tracking-wider mb-4">
          Visibility
        </h3>
        <div className="flex gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={f.published}
              onChange={(e) => set("published", e.target.checked)}
              className="w-4 h-4 accent-pg-gold rounded" />
            <span className="text-sm text-pg-body">Published</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={f.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="w-4 h-4 accent-pg-gold rounded" />
            <span className="text-sm text-pg-body">Featured</span>
          </label>
        </div>
      </section>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-pg-gold text-pg-dark font-semibold px-8 py-3 rounded-lg hover:bg-pg-gold-dark transition-colors text-sm disabled:opacity-70"
        >
          {loading ? "Saving…" : initial ? "Save Changes" : "Create Property"}
        </button>
        <button
          type="button"
          onClick={() => router.push(redirectTo)}
          className="border border-gray-200 text-pg-muted font-medium px-6 py-3 rounded-lg hover:border-gray-300 hover:text-pg-body transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
