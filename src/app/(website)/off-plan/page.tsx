import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPublicUrl } from "@/lib/supabase/storage";
import OffPlanFilterBar from "@/components/off-plan/OffPlanFilterBar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Off-Plan Projects | Palmgate",
  description: "Discover off-plan developments in Oman through Palmgate.",
};

type SP = Record<string, string | string[] | undefined>;

function str(params: SP, key: string): string | undefined {
  const v = params[key];
  return typeof v === "string" ? v : v?.[0];
}

function formatPrice(price: number | null, currency: string | null): string {
  if (!price) return "On Request";
  const cur = currency ?? "OMR";
  if (price >= 1_000_000) return `${cur} ${(price / 1_000_000).toFixed(2)}M`;
  if (price >= 1_000)     return `${cur} ${(price / 1_000).toFixed(0)}K`;
  return `${cur} ${price.toLocaleString()}`;
}

function formatHandover(date: string | null): string {
  if (!date) return "TBA";
  const d = new Date(date);
  return d.toLocaleDateString("en-OM", { month: "short", year: "numeric" });
}

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  price: number | null;
  currency: string | null;
  bedrooms: number | null;
  type: string | null;
  completion_date: string | null;
  community: string | null;
  emirate: string | null;
  developer: string | null;
  featured: boolean | null;
  availability: string | null;
  property_images: { storage_path: string; alt: string | null; is_primary: boolean }[];
};

export default async function OffPlanPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const params    = await searchParams;
  const q         = str(params, "q");
  const developer = str(params, "developer");
  const sort      = str(params, "sort") ?? "";

  const supabase = await createClient();

  // Get unique developers for filter dropdown
  const { data: devRows } = await supabase
    .from("properties")
    .select("developer")
    .eq("condition", "off_plan")
    .eq("published", true)
    .not("developer", "is", null);

  const developers = [...new Set((devRows ?? []).map((r) => r.developer as string).filter(Boolean))].sort();

  // Main query
  let query = supabase
    .from("properties")
    .select(
      "id, slug, title, price, currency, bedrooms, type, completion_date, community, emirate, developer, featured, availability, property_images(storage_path, alt, is_primary)"
    )
    .eq("condition", "off_plan")
    .eq("published", true);

  if (q) {
    query = query.or(`title.ilike.%${q}%,community.ilike.%${q}%,developer.ilike.%${q}%,emirate.ilike.%${q}%`);
  }
  if (developer) {
    query = query.eq("developer", developer);
  }

  switch (sort) {
    case "price_asc":  query = query.order("price", { ascending: true }); break;
    case "price_desc": query = query.order("price", { ascending: false }); break;
    case "handover":   query = query.order("completion_date", { ascending: true, nullsFirst: false }); break;
    default:
      query = query.order("featured", { ascending: false }).order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  const projects = (error ? [] : (data ?? [])) as unknown as ProjectRow[];

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-18">

        {/* ── Sticky filter bar ── */}
        <Suspense fallback={<div className="h-14 border-b border-gray-100 bg-white" />}>
          <OffPlanFilterBar developers={developers} />
        </Suspense>

        {/* ── Results ── */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-[15px] font-semibold text-pg-dark">
              Off-Plan Developments in Oman
            </h1>
            <span className="text-[13px] text-pg-muted">
              {projects.length} {projects.length === 1 ? "result" : "results"}
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-24">
              <h3 className="font-sans font-bold uppercase tracking-wide text-pg-dark text-xl mb-2">
                No developments found
              </h3>
              <p className="text-pg-muted text-sm">Try adjusting your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => {
                const primary = p.property_images?.find((img) => img.is_primary) ?? p.property_images?.[0];
                const imageUrl = primary ? getPublicUrl(primary.storage_path) : null;
                const location = p.community ?? p.emirate ?? "Oman";
                const tags: string[] = [];
                if (p.featured)                       tags.push("FEATURED");
                if (p.availability === "for_sale")    tags.push("FOR SALE");

                return (
                  <Link
                    key={p.id}
                    href={`/off-plan/${p.slug}`}
                    className="group flex flex-col bg-white overflow-hidden rounded-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={primary?.alt ?? p.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-linear-to-br from-slate-700 to-slate-900" />
                      )}
                      {tags.length > 0 && (
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-[10px] font-semibold px-2 py-1 ${
                                tag === "FEATURED"
                                  ? "bg-pg-gold text-white"
                                  : "bg-sky-500 text-white"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-1 p-4">
                      <p className="text-xl font-bold text-pg-dark mb-1 leading-tight">
                        {formatPrice(p.price, p.currency)}
                      </p>

                      <p className="text-[13px] text-pg-muted mb-2 capitalize">
                        {p.type ?? "Residential"}{p.completion_date ? ` · Handover ${formatHandover(p.completion_date)}` : ""}
                      </p>

                      <div className="flex items-center gap-1 mb-4">
                        <MapPin size={12} className="text-pg-muted shrink-0" />
                        <span className="text-[13px] text-pg-muted truncate">{location}</span>
                      </div>

                      <div className="mt-auto flex items-center gap-4 text-[12px] text-pg-muted">
                        {p.bedrooms != null && (
                          <span className="flex items-center gap-1">
                            <BedDouble size={13} className="shrink-0" />
                            {p.bedrooms === 0 ? "Studio" : `${p.bedrooms} BR`}
                          </span>
                        )}
                        {p.completion_date && (
                          <span className="flex items-center gap-1">
                            <Calendar size={13} className="shrink-0" />
                            {formatHandover(p.completion_date)}
                          </span>
                        )}
                        {p.developer && (
                          <span className="ml-auto text-[11px] font-medium text-pg-dark truncate max-w-25">
                            {p.developer}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
