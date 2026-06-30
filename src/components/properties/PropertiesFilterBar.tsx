"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import PropertiesFilterModal from "./PropertiesFilterModal";
import ActiveFilters from "./ActiveFilters";

const TYPE_LABELS: Record<string, string> = {
  apartment: "Apartment", villa: "Villa", townhouse: "Townhouse",
  penthouse: "Penthouse", land: "Land", office: "Commercial",
};

function formatPriceLabel(min: string, max: string): string {
  if (!min && !max) return "Price";
  const fmt = (v: string) => {
    const n = parseFloat(v);
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return v;
  };
  if (min && max) return `OMR ${fmt(min)} – ${fmt(max)}`;
  if (min) return `From OMR ${fmt(min)}`;
  return `Up to OMR ${fmt(max)}`;
}

function bedsLabel(beds: string): string {
  if (!beds) return "Beds";
  if (beds === "0") return "Studio";
  return `${beds}+ Beds`;
}

interface Props { total: number }

export default function PropertiesFilterBar({ total }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const sp       = useSearchParams();

  const [q, setQ]           = useState(sp.get("q") ?? "");
  const [modalOpen, setModalOpen] = useState(false);
  const [openKey,   setOpenKey]   = useState(0); // increments on each open → remounts modal

  const availability = sp.get("availability") ?? "";
  const type      = sp.get("type") ?? "";
  const minPrice  = sp.get("min_price") ?? "";
  const maxPrice  = sp.get("max_price") ?? "";
  const beds      = sp.get("beds") ?? "";

  // Count active filters that are actually sent to the backend
  const activeCount = [
    type, minPrice, maxPrice, beds,
    sp.get("baths"), sp.get("condition"),
    sp.get("min_size"), sp.get("max_size"),
    sp.get("amenities"),
  ].filter(Boolean).length;

  function updateParam(key: string, value: string) {
    const p = new URLSearchParams(sp.toString());
    value ? p.set(key, value) : p.delete(key);
    p.delete("page");
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParam("q", q);
  }

  function openModal() {
    setOpenKey((k) => k + 1); // remount modal so it reads fresh URL params
    setModalOpen(true);
  }

  const btnCls   = "flex items-center gap-1.5 text-[13px] text-pg-dark hover:text-pg-gold transition-colors whitespace-nowrap shrink-0";
  const activeDot = "inline-block w-1.5 h-1.5 rounded-full bg-pg-gold ml-0.5";

  return (
    <>
      <div className="sticky top-18 z-40 bg-white border-b border-gray-100 shadow-sm">

        {/* Main filter row */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center h-14 gap-3">

            {/* Availability */}
            <div className="flex items-center gap-1 shrink-0">
              <select
                value={availability}
                onChange={(e) => updateParam("availability", e.target.value)}
                className="text-[13px] font-semibold text-pg-dark bg-transparent focus:outline-none cursor-pointer appearance-none"
              >
                <option value="">All</option>
                <option value="for_sale">For Sale</option>
                <option value="for_rent">For Rent</option>
              </select>
              <ChevronDown size={13} className="text-pg-muted shrink-0" />
            </div>

            <span className="h-5 w-px bg-gray-200 shrink-0" />

            {/* Search — submits on Enter */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-0">
              <button type="submit" className="text-pg-muted hover:text-pg-gold transition-colors shrink-0">
                <Search size={14} />
              </button>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Community or building"
                className="w-full text-[13px] text-pg-body placeholder:text-pg-muted focus:outline-none bg-transparent"
              />
            </form>

            <span className="h-5 w-px bg-gray-200 shrink-0" />

            {/* Property Type */}
            <button onClick={openModal} className={btnCls}>
              {type ? <span className="font-medium">{TYPE_LABELS[type] ?? type}</span> : "Property Type"}
              {type && <span className={activeDot} />}
            </button>

            <span className="h-5 w-px bg-gray-200 shrink-0" />

            {/* Price */}
            <button onClick={openModal} className={btnCls}>
              {(minPrice || maxPrice)
                ? <span className="font-medium">{formatPriceLabel(minPrice, maxPrice)}</span>
                : "Price"}
              {(minPrice || maxPrice) && <span className={activeDot} />}
            </button>

            <span className="h-5 w-px bg-gray-200 shrink-0" />

            {/* Beds */}
            <button onClick={openModal} className={btnCls}>
              {beds ? <span className="font-medium">{bedsLabel(beds)}</span> : "Beds"}
              {beds && <span className={activeDot} />}
            </button>

            <span className="h-5 w-px bg-gray-200 shrink-0" />

            {/* More Filters */}
            <button
              onClick={openModal}
              className="flex items-center gap-1.5 text-[13px] font-medium text-pg-dark hover:text-pg-gold transition-colors shrink-0 whitespace-nowrap"
            >
              <SlidersHorizontal size={14} />
              More Filters
              {activeCount > 0 && (
                <span className="ml-0.5 w-4 h-4 rounded-full bg-pg-dark text-white text-[10px] font-bold flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Quick-type chip row */}
        <div className="border-t border-gray-50 max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 h-10 overflow-x-auto">
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <button
                key={value}
                onClick={() => updateParam("type", type === value ? "" : value)}
                className={`shrink-0 px-4 py-1 rounded-full text-[12px] font-medium border transition-colors ${
                  type === value
                    ? "bg-pg-dark text-white border-pg-dark"
                    : "border-gray-200 text-pg-muted hover:border-pg-dark hover:text-pg-dark"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter chips — only renders when filters are applied */}
        <ActiveFilters />

      </div>

      {/* Filter modal — key increments on open so it remounts with fresh URL state */}
      <PropertiesFilterModal
        key={openKey}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        total={total}
      />
    </>
  );
}
