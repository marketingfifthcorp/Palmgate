"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";

interface Props {
  developers: string[];
}

export default function OffPlanFilterBar({ developers }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const sp       = useSearchParams();

  const [q, setQ] = useState(sp.get("q") ?? "");

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

  const developer = sp.get("developer") ?? "";
  const sort      = sp.get("sort") ?? "";

  return (
    <div className="sticky top-18 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center h-14 gap-3">

          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-0">
            <button type="submit" className="text-pg-muted hover:text-pg-gold transition-colors shrink-0">
              <Search size={14} />
            </button>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Project name or location"
              className="w-full text-[13px] text-pg-body placeholder:text-pg-muted focus:outline-none bg-transparent"
            />
          </form>

          {developers.length > 0 && (
            <>
              <span className="h-5 w-px bg-gray-200 shrink-0" />
              <select
                value={developer}
                onChange={(e) => updateParam("developer", e.target.value)}
                className="text-[13px] text-pg-dark bg-transparent focus:outline-none cursor-pointer appearance-none shrink-0"
              >
                <option value="">All Developers</option>
                {developers.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </>
          )}

          <span className="h-5 w-px bg-gray-200 shrink-0" />

          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="text-[13px] text-pg-dark bg-transparent focus:outline-none cursor-pointer appearance-none shrink-0 border border-gray-200 rounded-sm px-3 py-1.5"
          >
            <option value="">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="handover">Handover Date</option>
          </select>
        </div>
      </div>
    </div>
  );
}
