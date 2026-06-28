"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";

const LABELS: Record<string, (v: string) => string> = {
  availability: (v) => (v === "for_sale" ? "For Sale" : "For Rent"),
  condition: (v) => (v === "off_plan" ? "Off-Plan" : "Ready"),
  type: (v) => v.charAt(0).toUpperCase() + v.slice(1),
  beds: (v) => (v === "0" ? "Studio" : `${v} Bed${v !== "1" ? "s" : ""}`),
  min_price: (v) => `Min AED ${parseInt(v).toLocaleString()}`,
  max_price: (v) => `Max AED ${parseInt(v).toLocaleString()}`,
  community: (v) => v,
};

const FILTER_KEYS = ["availability", "condition", "type", "beds", "min_price", "max_price", "community"];

export default function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const active = FILTER_KEYS
    .filter((key) => searchParams.has(key))
    .map((key) => {
      const val = searchParams.get(key)!;
      return { key, label: LABELS[key]?.(val) ?? val };
    });

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
    <div className="flex flex-wrap items-center gap-2">
      {active.map(({ key, label }) => (
        <span
          key={key}
          className="inline-flex items-center gap-1.5 bg-white border border-pg-gold/60 text-pg-dark text-xs font-medium px-3 py-1.5 rounded-full"
        >
          {label}
          <button onClick={() => remove(key)} className="text-pg-muted hover:text-pg-gold transition-colors">
            <X size={11} />
          </button>
        </span>
      ))}
      {active.length > 1 && (
        <button onClick={clearAll} className="text-xs text-pg-muted hover:text-pg-gold transition-colors underline underline-offset-2">
          Clear all
        </button>
      )}
    </div>
  );
}
