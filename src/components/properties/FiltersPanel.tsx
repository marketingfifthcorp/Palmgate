"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "townhouse", label: "Townhouse" },
  { value: "penthouse", label: "Penthouse" },
  { value: "office", label: "Office" },
  { value: "land", label: "Land" },
] as const;

const BEDS = [
  { value: "", label: "Any" },
  { value: "0", label: "Studio" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5+" },
];

export default function FiltersPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const availability = searchParams.get("availability");
  const condition = searchParams.get("condition");
  const type = searchParams.get("type");
  const beds = searchParams.get("beds");

  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") ?? "");
  const [community, setCommunity] = useState(searchParams.get("community") ?? "");

  function updateParam(key: string, value: string | null) {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    p.delete("page");
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }

  function toggleType(value: string) {
    updateParam("type", type === value ? null : value);
  }

  function applyTextFilters() {
    const p = new URLSearchParams(searchParams.toString());
    if (minPrice) p.set("min_price", minPrice); else p.delete("min_price");
    if (maxPrice) p.set("max_price", maxPrice); else p.delete("max_price");
    if (community) p.set("community", community); else p.delete("community");
    p.delete("page");
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }

  function resetAll() {
    setMinPrice("");
    setMaxPrice("");
    setCommunity("");
    router.replace(pathname, { scroll: false });
  }

  const hasFilters = !!(availability || condition || type || beds ||
    searchParams.get("min_price") || searchParams.get("max_price") || searchParams.get("community"));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-pg-dark text-base">Filters</h2>
        {hasFilters && (
          <button onClick={resetAll} className="text-xs text-pg-gold hover:text-pg-gold-dark transition-colors">
            Reset all
          </button>
        )}
      </div>

      {/* Listing type */}
      <div>
        <p className="text-xs font-semibold text-pg-muted uppercase tracking-wider mb-3">Listing Type</p>
        <div className="space-y-1">
          {[
            { value: null, label: "All Listings" },
            { value: "for_sale", label: "For Sale" },
            { value: "for_rent", label: "For Rent" },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => updateParam("availability", opt.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                availability === opt.value
                  ? "bg-pg-dark text-white font-medium"
                  : "text-pg-body hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <p className="text-xs font-semibold text-pg-muted uppercase tracking-wider mb-3">Condition</p>
        <div className="flex gap-2">
          {[
            { value: null, label: "All" },
            { value: "ready", label: "Ready" },
            { value: "off_plan", label: "Off-Plan" },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => updateParam("condition", opt.value)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                condition === opt.value
                  ? "bg-pg-gold border-pg-gold text-pg-dark"
                  : "border-gray-200 text-pg-body hover:border-pg-gold hover:text-pg-gold"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property type */}
      <div>
        <p className="text-xs font-semibold text-pg-muted uppercase tracking-wider mb-3">Property Type</p>
        <div className="grid grid-cols-2 gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => toggleType(t.value)}
              className={`py-2 px-3 rounded-lg text-sm border transition-colors text-left ${
                type === t.value
                  ? "bg-pg-dark border-pg-dark text-white"
                  : "border-gray-200 text-pg-body hover:border-pg-gold hover:text-pg-gold"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <p className="text-xs font-semibold text-pg-muted uppercase tracking-wider mb-3">Bedrooms</p>
        <div className="flex flex-wrap gap-2">
          {BEDS.map((b) => {
            const isActive = b.value === "" ? !beds : beds === b.value;
            return (
              <button
                key={b.label}
                onClick={() => updateParam("beds", b.value || null)}
                className={`min-w-[40px] py-2 px-3 rounded-lg text-sm border transition-colors ${
                  isActive
                    ? "bg-pg-dark border-pg-dark text-white"
                    : "border-gray-200 text-pg-body hover:border-pg-gold hover:text-pg-gold"
                }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-xs font-semibold text-pg-muted uppercase tracking-wider mb-3">Price Range (AED)</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="flex-1 min-w-0 w-22 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pg-gold"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="flex-1 min-w-0 w-22 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pg-gold"
          />
        </div>
      </div>

      {/* Community */}
      <div>
        <p className="text-xs font-semibold text-pg-muted uppercase tracking-wider mb-3">Community</p>
        <input
          type="text"
          placeholder="e.g. Downtown Dubai"
          value={community}
          onChange={(e) => setCommunity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyTextFilters()}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pg-gold"
        />
      </div>

      <button
        onClick={applyTextFilters}
        className="w-full bg-pg-dark text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-pg-body transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );
}
