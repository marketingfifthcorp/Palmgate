"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";

const LABELS: Record<string, (v: string) => string> = {
  availability: (v) => (v === "for_sale" ? "For Sale" : "For Rent"),
  condition:    (v) => (v === "off_plan" ? "Off-Plan" : "Ready"),
  type:         (v) => v.charAt(0).toUpperCase() + v.slice(1),
  beds:         (v) => (v === "0" ? "Studio" : `${v}+ Beds`),
  baths:        (v) => `${v}+ Baths`,
  min_price:    (v) => `From OMR ${parseInt(v).toLocaleString()}`,
  max_price:    (v) => `Up to OMR ${parseInt(v).toLocaleString()}`,
  min_size:     (v) => `Min ${parseInt(v).toLocaleString()} sqft`,
  max_size:     (v) => `Max ${parseInt(v).toLocaleString()} sqft`,
  community:    (v) => v,
  amenities:    (v) => v.split(",").join(", "),
};

const FILTER_KEYS = [
  "availability", "condition", "type", "beds", "baths",
  "min_price", "max_price", "min_size", "max_size", "community", "amenities",
];

export default function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const active = FILTER_KEYS
    .filter((key) => searchParams.has(key))
    .map((key) => ({ key, label: LABELS[key]?.(searchParams.get(key)!) ?? searchParams.get(key)! }));

  if (active.length === 0) return null;

  function remove(key: string) {
    const p = new URLSearchParams(searchParams.toString());
    p.delete(key);
    p.delete("page");
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }

  function clearAll() {
    router.replace(pathname, { scroll: false });
  }

  return (
    <div className="border-t border-gray-50 max-w-7xl mx-auto px-6 py-2">
      <div className="flex flex-wrap items-center gap-2">
        {active.map(({ key, label }) => (
          <span
            key={key}
            className="inline-flex items-center gap-1.5 bg-pg-dark/5 border border-pg-dark/15 text-pg-dark text-[12px] font-medium px-3 py-1 rounded-full"
          >
            {label}
            <button
              onClick={() => remove(key)}
              className="text-pg-muted hover:text-pg-dark transition-colors"
              aria-label={`Remove ${label} filter`}
            >
              <X size={11} />
            </button>
          </span>
        ))}
        <button
          onClick={clearAll}
          className="text-[12px] text-pg-muted hover:text-pg-gold transition-colors underline underline-offset-2"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
