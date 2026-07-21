import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPublicUrl } from "@/lib/supabase/storage";
import { WHATSAPP_NUMBER } from "@/lib/off-plan-data";
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
                  <div key={p.id} className="flex flex-col bg-transparent rounded-sm overflow-hidden">
                    {/* Image */}
                    <Link href={`/off-plan/${p.slug}`} className="relative block aspect-3/2 overflow-hidden group">
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
                              className={`text-[10px] font-semibold px-2 py-1 rounded-sm ${
                                tag === "FEATURED" ? "bg-pg-gold text-white" : "bg-sky-500 text-white"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>

                    {/* Card body */}
                    <div className="flex flex-col flex-1 p-4">
                      <h3 className="font-sans font-bold text-pg-dark text-base uppercase tracking-wide leading-tight mb-1">
                        {p.title}
                      </h3>
                      <p className="text-pg-body text-sm mb-1 capitalize">{p.type ?? "Residential"}</p>
                      {p.developer && <p className="text-pg-muted text-xs mb-1">{p.developer}</p>}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 mb-4 group/loc w-fit"
                      >
                        <MapPin size={11} className="text-pg-muted shrink-0" />
                        <span className="text-xs text-pg-muted group-hover/loc:underline">{location}</span>
                      </a>

                      {/* Stats bar */}
                      <div className="mt-auto border rounded-sm border-gray-800 divide-x divide-gray-800 py-2 grid grid-cols-3 text-center mb-3">
                        <div className="px-2.5">
                          <p className="text-[10px] text-pg-muted mb-0.5">Starting Price</p>
                          <p className="text-xs font-semibold text-pg-dark">{formatPrice(p.price, p.currency)}</p>
                        </div>
                        <div className="px-2.5">
                          <p className="text-[10px] text-pg-muted mb-0.5">Bedrooms</p>
                          <p className="text-xs font-semibold text-pg-dark">
                            {p.bedrooms != null ? (p.bedrooms === 0 ? "Studio" : `${p.bedrooms} BR`) : "TBA"}
                          </p>
                        </div>
                        <div className="px-2.5">
                          <p className="text-[10px] text-pg-muted mb-0.5">Handover</p>
                          <p className="text-xs font-semibold text-pg-dark">{formatHandover(p.completion_date)}</p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi, I am interested in ${p.title}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs font-semibold py-2.5 rounded-sm hover:bg-[#1ebe5d] transition-colors"
                        >
                          <svg viewBox="0 0 32 32" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M16 0C7.163 0 0 7.163 0 16c0 2.836.74 5.5 2.035 7.818L0 32l8.385-2.012A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.07 22.514c-.334.94-1.956 1.796-2.685 1.91-.686.107-1.553.152-2.505-.158-.578-.19-1.32-.443-2.27-.868-3.996-1.727-6.606-5.76-6.804-6.027-.198-.267-1.615-2.148-1.615-4.098s1.02-2.91 1.382-3.307c.362-.397.79-.497 1.054-.497.264 0 .528.002.76.014.244.012.57-.093.893.68.333.795 1.13 2.745 1.229 2.943.1.198.165.43.033.694-.133.265-.199.43-.396.661-.198.232-.416.518-.594.696-.198.198-.404.413-.174.81.23.397 1.023 1.688 2.197 2.734 1.508 1.34 2.78 1.754 3.177 1.952.397.199.628.166.858-.1.231-.265.99-1.155 1.254-1.552.264-.397.528-.33.89-.199.362.132 2.308 1.088 2.705 1.287.397.198.661.297.76.463.099.166.099.963-.235 1.903z" />
                          </svg>
                          WhatsApp
                        </a>
                        <Link
                          href={`/off-plan/${p.slug}`}
                          className="flex items-center justify-center text-xs font-semibold text-pg-dark border border-pg-dark py-2.5 rounded-sm hover:bg-pg-dark hover:text-white transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
