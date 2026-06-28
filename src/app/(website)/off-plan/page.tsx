"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Calendar, Search, SlidersHorizontal } from "lucide-react";
import { OFF_PLAN_LISTINGS, WHATSAPP_NUMBER } from "@/lib/off-plan-data";

const DEVELOPERS = [...new Set(OFF_PLAN_LISTINGS.map((p) => p.developer))];

const TAG_CHIP_STYLES: Record<string, string> = {
  "HIGH ROI":  "bg-emerald-500 text-white",
  "FOR SALE":  "bg-sky-500 text-white",
  "EXCLUSIVE": "bg-pg-gold text-white",
};

export default function OffPlanPage() {
  const [q, setQ] = useState("");
  const [developer, setDeveloper] = useState("");

  const filtered = useMemo(() => {
    return OFF_PLAN_LISTINGS.filter((p) => {
      const matchQ = !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.location.toLowerCase().includes(q.toLowerCase());
      const matchDev = !developer || p.developer === developer;
      return matchQ && matchDev;
    });
  }, [q, developer]);

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-18">

        {/* ── Sticky filter bar ── */}
        <div className="sticky top-18 z-40 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center h-14 gap-3">

              {/* Search */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Search size={14} className="text-pg-muted shrink-0" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Project name or location"
                  className="w-full text-[13px] text-pg-body placeholder:text-pg-muted focus:outline-none bg-transparent"
                />
              </div>

              <span className="h-5 w-px bg-gray-200 shrink-0" />

              {/* Developer */}
              <div className="flex items-center gap-1 shrink-0">
                <select
                  value={developer}
                  onChange={(e) => setDeveloper(e.target.value)}
                  className="text-[13px] text-pg-dark bg-transparent focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="">All Developers</option>
                  {DEVELOPERS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <span className="h-5 w-px bg-gray-200 shrink-0" />

              {/* Filters count badge */}
              <button className="flex items-center gap-1.5 text-[13px] font-medium text-pg-dark hover:text-pg-gold transition-colors shrink-0 whitespace-nowrap">
                <SlidersHorizontal size={14} />
                More Filters
              </button>
            </div>
          </div>

          {/* Tag chip row */}
          <div className="border-t border-gray-50 max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-2 h-10 overflow-x-auto">
              {["HIGH ROI", "EXCLUSIVE", "FOR SALE"].map((tag) => (
                <button
                  key={tag}
                  className="shrink-0 px-4 py-1 rounded-full text-[12px] font-medium border border-gray-200 text-pg-muted hover:border-pg-dark hover:text-pg-dark transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Results toolbar ── */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center gap-3 mr-auto">
              <h1 className="text-[15px] font-semibold text-pg-dark">
                Off-Plan Developments
              </h1>
              <span className="text-[13px] text-pg-muted">
                {filtered.length} {filtered.length === 1 ? "result" : "results"}
              </span>
            </div>

            <select className="text-[13px] text-pg-dark bg-transparent focus:outline-none cursor-pointer border border-gray-200 rounded-sm px-3 py-2">
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Handover Date</option>
            </select>
          </div>

          {/* ── Grid ── */}
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <h3 className="font-sans font-bold uppercase tracking-wide text-pg-dark text-xl mb-2">
                No developments found
              </h3>
              <p className="text-pg-muted text-sm">Try adjusting your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <Link
                  key={p.slug}
                  href={`/off-plan/${p.slug}`}
                  className="group flex flex-col bg-white overflow-hidden rounded-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="relative aspect-4/3 overflow-hidden">
                    <Image
                      src={p.imageUrl}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {p.tags.length > 0 && (
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-[10px] font-semibold px-2 py-1 ${TAG_CHIP_STYLES[tag] ?? "bg-white text-pg-dark"}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-4">
                    {/* Price */}
                    <p className="text-xl font-bold text-pg-dark mb-1 leading-tight">
                      {p.startingPrice}
                    </p>

                    {/* Type · Handover */}
                    <p className="text-[13px] text-pg-muted mb-2">
                      {p.types} · Handover {p.handover}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-1 mb-4">
                      <MapPin size={12} className="text-pg-muted shrink-0" />
                      <span className="text-[13px] text-pg-muted truncate">{p.location}</span>
                    </div>

                    {/* Stats row */}
                    <div className="mt-auto flex items-center gap-4 text-[12px] text-pg-muted">
                      <span className="flex items-center gap-1">
                        <BedDouble size={13} className="shrink-0" />
                        {p.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="shrink-0" />
                        {p.handover}
                      </span>
                      <span className="ml-auto text-[11px] font-medium text-pg-dark">
                        {p.developer}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
