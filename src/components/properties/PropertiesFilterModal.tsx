"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, Check } from "lucide-react";

const PROP_TYPES = [
  { label: "Apartment", value: "apartment" },
  { label: "Villa",     value: "villa" },
  { label: "Townhouse", value: "townhouse" },
  { label: "Penthouse", value: "penthouse" },
  { label: "Land",      value: "land" },
  { label: "Commercial",value: "office" },
];

const BED_OPTIONS  = [{ label: "Studio", value: "0" }, { label: "1", value: "1" }, { label: "2", value: "2" }, { label: "3", value: "3" }, { label: "4", value: "4" }, { label: "5+", value: "5" }];
const BATH_OPTIONS = [{ label: "1", value: "1" }, { label: "2", value: "2" }, { label: "3", value: "3" }, { label: "4+", value: "4" }];
const AMENITY_LIST = ["Balcony", "Water View", "Golf Course View", "Close to Park", "Upgraded", "Private Garden"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

export default function PropertiesFilterModal({ isOpen, onClose, total }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const sp       = useSearchParams();

  const [type,      setType]      = useState("");
  const [minPrice,  setMinPrice]  = useState("");
  const [maxPrice,  setMaxPrice]  = useState("");
  const [minSize,   setMinSize]   = useState("");
  const [maxSize,   setMaxSize]   = useState("");
  const [beds,      setBeds]      = useState("");
  const [baths,     setBaths]     = useState("");
  const [condition, setCondition] = useState("");
  const [ownership, setOwnership] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  // Sync local state from URL each time the modal opens
  useEffect(() => {
    if (!isOpen) return;
    setType(sp.get("type") ?? "");
    setMinPrice(sp.get("min_price") ?? "");
    setMaxPrice(sp.get("max_price") ?? "");
    setMinSize(sp.get("min_size") ?? "");
    setMaxSize(sp.get("max_size") ?? "");
    setBeds(sp.get("beds") ?? "");
    setBaths(sp.get("baths") ?? "");
    setCondition(sp.get("condition") ?? "");
    setOwnership(sp.get("ownership") ?? "");
    setAmenities((sp.get("amenities") ?? "").split(",").filter(Boolean));
  }, [isOpen, sp]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function apply() {
    const p = new URLSearchParams(sp.toString());
    const set = (k: string, v: string) => v ? p.set(k, v) : p.delete(k);
    set("type",       type);
    set("min_price",  minPrice);
    set("max_price",  maxPrice);
    set("min_size",   minSize);
    set("max_size",   maxSize);
    set("beds",       beds);
    set("baths",      baths);
    set("condition",  condition);
    set("ownership",  ownership);
    amenities.length ? p.set("amenities", amenities.join(",")) : p.delete("amenities");
    p.delete("page");
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
    onClose();
  }

  function reset() {
    setType(""); setMinPrice(""); setMaxPrice(""); setMinSize(""); setMaxSize("");
    setBeds(""); setBaths(""); setCondition(""); setOwnership(""); setAmenities([]);
  }

  function toggleAmenity(key: string) {
    setAmenities((prev) => prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]);
  }

  const pill    = "px-4 py-2 rounded-full text-[13px] font-medium border transition-colors cursor-pointer";
  const active  = "bg-pg-dark text-white border-pg-dark";
  const inactive = "border-gray-200 text-pg-body hover:border-pg-dark hover:text-pg-dark";
  const toggle   = "flex-1 py-2.5 rounded-lg text-[13px] font-medium border transition-colors";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-60 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-70 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <h2 className="font-heading font-semibold text-pg-dark text-lg">Filters</h2>
          <button onClick={onClose} className="text-pg-muted hover:text-pg-dark transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">

          {/* Property Type */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-pg-muted mb-3">Property Type</p>
            <div className="flex flex-wrap gap-2">
              {PROP_TYPES.map(({ label, value }) => (
                <button key={value} onClick={() => setType(type === value ? "" : value)}
                  className={`${pill} ${type === value ? active : inactive}`}>
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* Price Range */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-pg-muted mb-3">Price Range (AED)</p>
            <div className="flex items-center gap-3">
              <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                className="flex-1 w-22 border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-pg-dark" />
              <span className="text-pg-muted shrink-0">—</span>
              <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                className="flex-1 w-22 border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-pg-dark" />
            </div>
          </section>

          {/* Size */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-pg-muted mb-3">Size (Sq. Ft.)</p>
            <div className="flex items-center gap-3">
              <input type="number" placeholder="Min Size" value={minSize} onChange={(e) => setMinSize(e.target.value)}
                className="flex-1 w-22 border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-pg-dark" />
              <span className="text-pg-muted shrink-0">—</span>
              <input type="number" placeholder="Max Size" value={maxSize} onChange={(e) => setMaxSize(e.target.value)}
                className="flex-1 w-22 border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-pg-dark" />
            </div>
          </section>

          {/* Bedrooms */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-pg-muted mb-3">Bedrooms</p>
            <div className="flex flex-wrap gap-2">
              {BED_OPTIONS.map(({ label, value }) => (
                <button key={value} onClick={() => setBeds(beds === value ? "" : value)}
                  className={`${pill} ${beds === value ? active : inactive}`}>
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* Bathrooms */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-pg-muted mb-3">Bathrooms</p>
            <div className="flex flex-wrap gap-2">
              {BATH_OPTIONS.map(({ label, value }) => (
                <button key={value} onClick={() => setBaths(baths === value ? "" : value)}
                  className={`${pill} ${baths === value ? active : inactive}`}>
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* Status */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-pg-muted mb-3">Status</p>
            <div className="flex gap-2">
              {[{ label: "Ready", value: "ready" }, { label: "Off Plan", value: "off_plan" }].map(({ label, value }) => (
                <button key={value} onClick={() => setCondition(condition === value ? "" : value)}
                  className={`${toggle} ${condition === value ? "bg-pg-dark text-white border-pg-dark" : "border-gray-200 text-pg-body hover:border-pg-dark hover:text-pg-dark"}`}>
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* Ownership */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-pg-muted mb-3">Ownership</p>
            <div className="flex gap-2">
              {[{ label: "Freehold", value: "freehold" }, { label: "Local", value: "local" }].map(({ label, value }) => (
                <button key={value} onClick={() => setOwnership(ownership === value ? "" : value)}
                  className={`${toggle} ${ownership === value ? "bg-pg-dark text-white border-pg-dark" : "border-gray-200 text-pg-body hover:border-pg-dark hover:text-pg-dark"}`}>
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* Amenities */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-pg-muted mb-3">Amenities</p>
            <div className="grid grid-cols-2 gap-3">
              {AMENITY_LIST.map((label) => {
                const key     = label.toLowerCase().replace(/\s+/g, "_");
                const checked = amenities.includes(key);
                return (
                  <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
                    <button
                      type="button"
                      onClick={() => toggleAmenity(key)}
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        checked ? "bg-pg-dark border-pg-dark" : "border-gray-300 group-hover:border-pg-dark"
                      }`}
                    >
                      {checked && <Check size={10} strokeWidth={3} className="text-white" />}
                    </button>
                    <span className="text-[13px] text-pg-body">{label}</span>
                  </label>
                );
              })}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex gap-3 shrink-0">
          <button onClick={reset}
            className="flex-1 py-3 border border-gray-200 text-[13px] font-semibold text-pg-dark rounded-lg hover:border-pg-dark transition-colors">
            Reset Filters
          </button>
          <button onClick={apply}
            className="flex-1 py-3 bg-pg-dark text-white text-[13px] font-semibold rounded-lg hover:opacity-90 transition-opacity">
            Update{total > 0 ? ` (${total.toLocaleString()} Results)` : " Results"}
          </button>
        </div>
      </div>
    </>
  );
}
