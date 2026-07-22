"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PropertyFormData } from "@/app/(admin)/admin/actions";
import type { PropertyType, PropertyAvailability, PropertyCondition, PropertyRow } from "@/types/database";
import AgentPhotoUploader from "@/components/admin/AgentPhotoUploader";

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
  action: (data: PropertyFormData) => Promise<{ error?: string; id?: string }>;
  redirectTo?: string;
  defaultCondition?: PropertyCondition;
  propertyId?: string;
  onSaveAgentPhoto?: (path: string | null) => Promise<{ error?: string }>;
  extraSections?: React.ReactNode;
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
  year_built: string;
  floor_number: string;
  parking_spaces: string;
  has_terrace: boolean;
  location_name: string;
  community: string;
  emirate: string;
  lat: string;
  lng: string;
  developer: string;
  completion_date: string;
  plan_down: string;
  plan_during: string;
  plan_handover: string;
  amenities: string[];
  agent_name: string;
  agent_title: string;
  agent_phone: string;
  featured: boolean;
  published: boolean;
};

const AMENITY_OPTIONS = [
  "Swimming Pool",
  "Gym & Fitness",
  "Balcony",
  "Parking",
  "Concierge",
  "24/7 Security",
  "Water View",
  "Golf Course View",
  "Private Garden",
  "Children's Playground",
  "Landscaped Terrace",
  "Wellness & Spa",
  "Dining Destinations",
  "Community Retail",
  "Upgraded Finishes",
  "Smart Home",
  "Beach Access",
  "Tennis Court",
];

function fromRow(row?: PropertyRow): F {
  return {
    title: row?.title ?? "",
    slug: row?.slug ?? "",
    description: row?.description ?? "",
    type: row?.type ?? "apartment",
    availability: row?.availability ?? "for_sale",
    condition: row?.condition ?? "ready",
    price: row?.price?.toString() ?? "",
    currency: row?.currency ?? "OMR",
    bedrooms: row?.bedrooms?.toString() ?? "",
    bathrooms: row?.bathrooms?.toString() ?? "",
    area_sqft: row?.area_sqft?.toString() ?? "",
    year_built: row?.year_built?.toString() ?? "",
    floor_number: row?.floor_number?.toString() ?? "",
    parking_spaces: row?.parking_spaces?.toString() ?? "",
    has_terrace: row?.has_terrace ?? false,
    location_name: row?.location_name ?? "",
    community: row?.community ?? "",
    emirate: row?.emirate ?? "Muscat",
    lat: row?.lat?.toString() ?? "",
    lng: row?.lng?.toString() ?? "",
    developer: row?.developer ?? "",
    completion_date: row?.completion_date ?? "",
    plan_down: row?.payment_plan?.down?.toString() ?? "",
    plan_during: row?.payment_plan?.during?.toString() ?? "",
    plan_handover: row?.payment_plan?.handover?.toString() ?? "",
    amenities: row?.amenities ?? [],
    agent_name: row?.agent_name ?? "",
    agent_title: row?.agent_title ?? "",
    agent_phone: row?.agent_phone ?? "",
    featured: row?.featured ?? false,
    published: row?.published ?? false,
  };
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-pg-body placeholder:text-pg-muted focus:outline-none focus:border-pg-gold transition-colors";

const labelClass = "block text-xs font-medium text-pg-body mb-1.5";

export default function PropertyForm({ initial, action, redirectTo = "/admin/properties", defaultCondition, propertyId, onSaveAgentPhoto, extraSections }: Props) {
  const [f, setF] = useState<F>(() => {
    const base = fromRow(initial);
    if (!initial && defaultCondition) base.condition = defaultCondition;
    return base;
  });
  const [slugManual, setSlugManual] = useState(!!initial);
  const [areaUnit, setAreaUnit] = useState<"sqft" | "sqm">("sqft");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function switchAreaUnit(next: "sqft" | "sqm") {
    if (next === areaUnit) return;
    if (f.area_sqft) {
      const v = parseFloat(f.area_sqft);
      if (!isNaN(v)) {
        const converted = next === "sqm"
          ? (v / 10.7639).toFixed(2)
          : (v * 10.7639).toFixed(0);
        set("area_sqft", converted);
      }
    }
    setAreaUnit(next);
  }

  function set(field: keyof F, value: string | boolean | string[]) {
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
      area_sqft: f.area_sqft
        ? areaUnit === "sqm"
          ? parseFloat(f.area_sqft) * 10.7639
          : parseFloat(f.area_sqft)
        : null,
      year_built:     f.year_built     ? parseInt(f.year_built)     : null,
      floor_number:   f.floor_number   ? parseInt(f.floor_number)   : null,
      parking_spaces: f.parking_spaces ? parseInt(f.parking_spaces) : null,
      has_terrace:    f.has_terrace,
      location_name: f.location_name || null,
      community: f.community || null,
      emirate: f.emirate || "Dubai",
      lat: f.lat ? parseFloat(f.lat) : null,
      lng: f.lng ? parseFloat(f.lng) : null,
      developer: isOffPlan ? (f.developer || null) : null,
      completion_date: isOffPlan ? (f.completion_date || null) : null,
      payment_plan: paymentPlan,
      amenities: f.amenities,
      agent_name:  f.agent_name  || null,
      agent_title: f.agent_title || null,
      agent_phone: f.agent_phone || null,
      featured: f.featured,
      published: f.published,
    };

    const result = await action(data);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    // After creation, go to the edit page so images can be uploaded immediately
    if (result?.id && !initial) {
      router.push(`${redirectTo}/${result.id}/edit`);
    } else {
      router.push(redirectTo);
    }
    router.refresh();
  }

  const isOffPlan = f.condition === "off_plan";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Core */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
        <h3 className="font-heading font-semibold text-pg-dark text-sm">
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
        <h3 className="font-heading font-semibold text-pg-dark text-sm">
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
            <select value={f.availability} onChange={(e) => set("availability", e.target.value)} className={inputClass + " bg-white"}
              disabled={isOffPlan}>
              <option value="for_sale">For Sale</option>
              {!isOffPlan && <option value="for_rent">For Rent</option>}
            </select>
          </div>
          <div>
            <label className={labelClass}>Condition *</label>
            <div className={inputClass + " bg-gray-50 text-pg-muted cursor-not-allowed"}>
              {isOffPlan ? "Off-Plan" : "Ready"}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Size */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
        <h3 className="font-heading font-semibold text-pg-dark text-sm">
          Pricing & Size
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isOffPlan ? "Starting Price *" : "Price *"}</label>
            <input type="number" required value={f.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder={isOffPlan ? "e.g. 95000" : "e.g. 285000"} min="0"
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <input type="text" value={f.currency}
              onChange={(e) => set("currency", e.target.value)}
              placeholder="AED" className={inputClass} />
          </div>
          {isOffPlan ? (
            /* Off-plan: bedroom range (from → to), bathrooms repurposed as max bedrooms, area hidden */
            <div className="sm:col-span-2">
              <label className={labelClass}>Bedrooms Range</label>
              <div className="flex items-center gap-3">
                <input type="number" value={f.bedrooms}
                  onChange={(e) => set("bedrooms", e.target.value)}
                  placeholder="1" min="0" className={inputClass} />
                <span className="text-pg-muted text-sm shrink-0">to</span>
                <input type="number" value={f.bathrooms}
                  onChange={(e) => set("bathrooms", e.target.value)}
                  placeholder="4" min="0" className={inputClass} />
              </div>
              <p className="text-[11px] text-pg-muted mt-1.5">Enter the minimum and maximum bedroom count (e.g. 1 to 4)</p>
            </div>
          ) : (
            <>
              <div>
                <label className={labelClass}>Bedrooms</label>
                <input type="number" value={f.bedrooms}
                  onChange={(e) => set("bedrooms", e.target.value)}
                  placeholder="2" min="0" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Bathrooms</label>
                <input type="number" value={f.bathrooms}
                  onChange={(e) => set("bathrooms", e.target.value)}
                  placeholder="2" min="0" className={inputClass} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={labelClass.replace("mb-1.5", "")}>Area</label>
                  <div className="flex rounded-md border border-gray-200 overflow-hidden text-[11px] font-semibold">
                    <button type="button" onClick={() => switchAreaUnit("sqft")}
                      className={`px-2.5 py-1 transition-colors ${areaUnit === "sqft" ? "bg-pg-dark text-white" : "text-pg-muted hover:text-pg-dark"}`}>
                      sqft
                    </button>
                    <button type="button" onClick={() => switchAreaUnit("sqm")}
                      className={`px-2.5 py-1 transition-colors ${areaUnit === "sqm" ? "bg-pg-dark text-white" : "text-pg-muted hover:text-pg-dark"}`}>
                      sq m
                    </button>
                  </div>
                </div>
                <input type="number" value={f.area_sqft}
                  onChange={(e) => set("area_sqft", e.target.value)}
                  placeholder={areaUnit === "sqft" ? "1200" : "111"} min="0"
                  className={inputClass} />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Property Details */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
        <h3 className="font-heading font-semibold text-pg-dark text-sm">
          Property Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {!isOffPlan && (
            <div>
              <label className={labelClass}>Year Built</label>
              <input type="number" value={f.year_built}
                onChange={(e) => set("year_built", e.target.value)}
                placeholder="e.g. 2021" min="1900" max="2100"
                className={inputClass} />
            </div>
          )}
          {!isOffPlan && (
            <div>
              <label className={labelClass}>Floor Number</label>
              <input type="number" value={f.floor_number}
                onChange={(e) => set("floor_number", e.target.value)}
                placeholder="e.g. 5" min="0"
                className={inputClass} />
            </div>
          )}
          <div>
            <label className={labelClass}>Parking Spaces</label>
            <input type="number" value={f.parking_spaces}
              onChange={(e) => set("parking_spaces", e.target.value)}
              placeholder="e.g. 2" min="0"
              className={inputClass} />
          </div>
          {!isOffPlan && (
            <div className="flex items-center gap-3 pt-5">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={f.has_terrace}
                  onChange={(e) => set("has_terrace", e.target.checked)}
                  className="w-4 h-4 accent-pg-gold rounded" />
                <span className="text-sm text-pg-body">Has Terrace</span>
              </label>
            </div>
          )}
        </div>
      </section>

      {/* Agent Contact */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
        <h3 className="font-heading font-semibold text-pg-dark text-sm">
          Agent Contact
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Agent Name</label>
            <input type="text" value={f.agent_name}
              onChange={(e) => set("agent_name", e.target.value)}
              placeholder="e.g. Ahmed Al Rashid"
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Agent Title</label>
            <input type="text" value={f.agent_title}
              onChange={(e) => set("agent_title", e.target.value)}
              placeholder="e.g. Senior Property Consultant"
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Agent Phone</label>
            <input type="tel" value={f.agent_phone}
              onChange={(e) => set("agent_phone", e.target.value)}
              placeholder="e.g. +968 99 123 456"
              className={inputClass} />
          </div>
        </div>

        {propertyId && onSaveAgentPhoto && (
          <AgentPhotoUploader
            propertyId={propertyId}
            initialPath={(initial?.agent_photo_path as string | null) ?? null}
            onSave={onSaveAgentPhoto}
          />
        )}
      </section>

      {/* Location */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
        <h3 className="font-heading font-semibold text-pg-dark text-sm">
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
            <label className={labelClass}>
              {["apartment", "penthouse", "office"].includes(f.type) ? "Building Name" : "Community"}
            </label>
            <input type="text" value={f.community}
              onChange={(e) => set("community", e.target.value)}
              placeholder={
                ["apartment", "penthouse", "office"].includes(f.type)
                  ? "e.g. Majestic Residences Tower C"
                  : "e.g. Al Mouj (The Wave)"
              }
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Emirate</label>
            <input type="text" value={f.emirate}
              onChange={(e) => set("emirate", e.target.value)}
              placeholder="Dubai" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Latitude</label>
            <input type="number" step="any" value={f.lat}
              onChange={(e) => set("lat", e.target.value)}
              placeholder="25.2048" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Longitude</label>
            <input type="number" step="any" value={f.lng}
              onChange={(e) => set("lng", e.target.value)}
              placeholder="55.2708" className={inputClass} />
          </div>
        </div>
      </section>

      {/* Off-plan extras */}
      {isOffPlan && (
        <section className="bg-white border border-pg-gold/20 rounded-2xl p-6 space-y-5">
          <h3 className="font-heading font-semibold text-pg-dark text-sm">
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

      {extraSections}

      {/* Amenities */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold text-pg-dark text-sm">
            Amenities
          </h3>
          {f.amenities.length > 0 && (
            <span className="text-[11px] text-pg-muted">
              {f.amenities.length} selected
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {AMENITY_OPTIONS.map((opt) => {
            const checked = f.amenities.includes(opt);
            return (
              <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() =>
                    set(
                      "amenities",
                      checked
                        ? f.amenities.filter((a) => a !== opt)
                        : [...f.amenities, opt]
                    )
                  }
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    checked
                      ? "bg-pg-gold border-pg-gold"
                      : "border-gray-300 group-hover:border-pg-gold"
                  }`}
                >
                  {checked && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className={`text-[13px] transition-colors ${checked ? "text-pg-dark font-medium" : "text-pg-body group-hover:text-pg-dark"}`}>
                  {opt}
                </span>
              </label>
            );
          })}
        </div>

        {/* Custom amenity input */}
        <div className="pt-2 border-t border-gray-50">
          <p className={labelClass}>Add custom amenity</p>
          <div className="flex gap-2">
            <input
              type="text"
              id="custom-amenity"
              placeholder="e.g. Rooftop Lounge"
              className={inputClass}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val && !f.amenities.includes(val)) {
                    set("amenities", [...f.amenities, val]);
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById("custom-amenity") as HTMLInputElement;
                const val = input?.value.trim();
                if (val && !f.amenities.includes(val)) {
                  set("amenities", [...f.amenities, val]);
                  input.value = "";
                }
              }}
              className="shrink-0 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-pg-dark hover:border-pg-gold hover:text-pg-gold transition-colors"
            >
              Add
            </button>
          </div>
          {/* Show custom (non-preset) amenities as removable chips */}
          {f.amenities.filter((a) => !AMENITY_OPTIONS.includes(a)).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {f.amenities
                .filter((a) => !AMENITY_OPTIONS.includes(a))
                .map((a) => (
                  <span key={a} className="inline-flex items-center gap-1.5 bg-pg-gold/10 text-pg-dark text-[12px] font-medium px-3 py-1 rounded-full border border-pg-gold/20">
                    {a}
                    <button
                      type="button"
                      onClick={() => set("amenities", f.amenities.filter((x) => x !== a))}
                      className="text-pg-muted hover:text-pg-dark transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Visibility */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6">
        <h3 className="font-heading font-semibold text-pg-dark text-sm mb-4">
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
