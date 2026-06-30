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

const BED_OPTIONS = [
  { label: "Studio", value: "0" },
  { label: "1+",     value: "1" },
  { label: "2+",     value: "2" },
  { label: "3+",     value: "3" },
  { label: "4+",     value: "4" },
  { label: "5+",     value: "5" },
];
const BATH_OPTIONS = [
  { label: "1+", value: "1" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
  { label: "4+", value: "4" },
];
const AMENITY_LIST = [
  { label: "Swimming Pool",    value: "Swimming Pool" },
  { label: "Gym & Fitness",    value: "Gym & Fitness" },
  { label: "Balcony",          value: "Balcony" },
  { label: "Water View",       value: "Water View" },
  { label: "Golf Course View", value: "Golf Course View" },
  { label: "Private Garden",   value: "Private Garden" },
  { label: "Beach Access",     value: "Beach Access" },
  { label: "Smart Home",       value: "Smart Home" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

// The parent passes a changing `key` when the modal opens so this component
// remounts fresh — no effect needed to sync URL params into state.
export default function PropertiesFilterModal({ isOpen, onClose, total }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const sp       = useSearchParams();

  // State is initialised directly from URL params on every mount (key-driven remount)
  const [type,      setType]      = useState(sp.get("type") ?? "");
  const [minPrice,  setMinPrice]  = useState(sp.get("min_price") ?? "");
  const [maxPrice,  setMaxPrice]  = useState(sp.get("max_price") ?? "");
  const [minSize,   setMinSize]   = useState(sp.get("min_size") ?? "");
  const [maxSize,   setMaxSize]   = useState(sp.get("max_size") ?? "");
  const [beds,      setBeds]      = useState(sp.get("beds") ?? "");
  const [baths,     setBaths]     = useState(sp.get("baths") ?? "");
  const [condition, setCondition] = useState(sp.get("condition") ?? "");
  const [amenities, setAmenities] = useState<string[]>(
    (sp.get("amenities") ?? "").split(",").filter(Boolean)
  );

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function apply() {
    const p = new URLSearchParams(sp.toString());
    const set = (k: string, v: string) => v ? p.set(k, v) : p.delete(k);
    set("type",      type);
    set("min_price", minPrice);
    set("max_price", maxPrice);
    set("min_size",  minSize);
    set("max_size",  maxSize);
    set("beds",      beds);
    set("baths",     baths);
    set("condition", condition);
    amenities.length ? p.set("amenities", amenities.join(",")) : p.delete("amenities");
    p.delete("page");
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
    onClose();
  }

  function reset() {
    setType(""); setMinPrice(""); setMaxPrice("");
    setMinSize(""); setMaxSize(""); setBeds("");
    setBaths(""); setCondition(""); setAmenities([]);
  }

  function toggleAmenity(value: string) {
    setAmenities((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );
  }

  const pill     = "px-4 py-2 rounded-full text-[13px] font-medium border transition-colors cursor-pointer";
  const on       = "bg-pg-dark text-white border-pg-dark";
  const off      = "border-gray-200 text-pg-body hover:border-pg-dark hover:text-pg-dark";
  const toggleCls = "flex-1 py-2.5 rounded-lg text-[13px] font-medium border transition-colors";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-60 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-70 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
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
                  className={`${pill} ${type === value ? on : off}`}>
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* Price Range */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-pg-muted mb-3">Price Range (OMR)</p>
            <div className="flex items-center gap-3">
              <input type="number" placeholder="Min" value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-pg-dark" />
              <span className="text-pg-muted shrink-0">—</span>
              <input type="number" placeholder="Max" value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-pg-dark" />
            </div>
          </section>

          {/* Size */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-pg-muted mb-3">Size (sq. ft.)</p>
            <div className="flex items-center gap-3">
              <input type="number" placeholder="Min" value={minSize}
                onChange={(e) => setMinSize(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-pg-dark" />
              <span className="text-pg-muted shrink-0">—</span>
              <input type="number" placeholder="Max" value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-pg-dark" />
            </div>
          </section>

          {/* Bedrooms */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-pg-muted mb-3">Bedrooms</p>
            <div className="flex flex-wrap gap-2">
              {BED_OPTIONS.map(({ label, value }) => (
                <button key={value} onClick={() => setBeds(beds === value ? "" : value)}
                  className={`${pill} ${beds === value ? on : off}`}>
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
                  className={`${pill} ${baths === value ? on : off}`}>
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* Status */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-pg-muted mb-3">Status</p>
            <div className="flex gap-2">
              {[{ label: "Ready", value: "ready" }, { label: "Off Plan", value: "off_plan" }].map(
                ({ label, value }) => (
                  <button key={value} onClick={() => setCondition(condition === value ? "" : value)}
                    className={`${toggleCls} ${condition === value ? `${on}` : `${off}`}`}>
                    {label}
                  </button>
                )
              )}
            </div>
          </section>

          {/* Amenities */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-pg-muted mb-3">Amenities</p>
            <div className="grid grid-cols-2 gap-3">
              {AMENITY_LIST.map(({ label, value }) => {
                const checked = amenities.includes(value);
                return (
                  <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                    <button type="button" onClick={() => toggleAmenity(value)}
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        checked ? "bg-pg-dark border-pg-dark" : "border-gray-300 group-hover:border-pg-dark"
                      }`}>
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
            Reset
          </button>
          <button onClick={apply}
            className="flex-1 py-3 bg-pg-dark text-white text-[13px] font-semibold rounded-lg hover:opacity-90 transition-opacity">
            Show{total > 0 ? ` ${total.toLocaleString()} Results` : " Results"}
          </button>
        </div>
      </div>
    </>
  );
}
