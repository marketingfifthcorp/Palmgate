import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPublicUrl } from "@/lib/supabase/storage";
import { OFF_PLAN_LISTINGS } from "@/lib/off-plan-data";
import OffPlanPaginatedCards, { type OffPlanItem } from "./OffPlanPaginatedCards";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop&auto=format";

function formatPrice(price: number | null, currency: string | null): string {
  if (!price) return "On Request";
  const cur = currency ?? "OMR";
  if (price >= 1_000_000) return `${cur} ${(price / 1_000_000).toFixed(2)}M`;
  if (price >= 1_000) return `${cur} ${(price / 1_000).toFixed(0)}K`;
  return `${cur} ${price.toLocaleString()}`;
}

function formatHandover(date: string | null): string {
  if (!date) return "TBA";
  const d = new Date(date);
  return `Q${Math.ceil((d.getMonth() + 1) / 3)} ${d.getFullYear()}`;
}

function formatBeds(beds: number | null, baths: number | null): string {
  if (beds == null) return "TBA";
  if (beds === 0) return "Studio";
  if (baths != null && baths > beds) return `${beds}–${baths} BR`;
  return `${beds} BR`;
}

async function OffPlanSectionData() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("id, slug, title, price, currency, bedrooms, bathrooms, type, completion_date, community, emirate, developer, featured, availability, property_images(storage_path, alt, is_primary)")
    .eq("condition", "off_plan")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(9);

  let items: OffPlanItem[];

  type ImageRow = { storage_path: string; alt: string | null; is_primary: boolean };
  type ProjectRow = {
    id: string; slug: string; title: string; price: number | null; currency: string | null;
    bedrooms: number | null; bathrooms: number | null; type: string | null;
    completion_date: string | null; community: string | null; emirate: string | null;
    developer: string | null; featured: boolean | null; availability: string | null;
    property_images: ImageRow[];
  };

  if (!error && data && data.length > 0) {
    items = (data as unknown as ProjectRow[]).map((p) => {
      const primary = p.property_images?.find((img) => img.is_primary) ?? p.property_images?.[0];
      const tags: string[] = [];
      if (p.featured) tags.push("EXCLUSIVE");
      if (p.availability === "for_sale") tags.push("FOR SALE");
      return {
        key: p.id,
        href: `/off-plan/${p.slug}`,
        title: p.title,
        types: p.type ?? "Residential",
        developer: p.developer ?? "",
        location: p.community ?? p.emirate ?? "Oman",
        startingPrice: formatPrice(p.price, p.currency),
        bedrooms: formatBeds(p.bedrooms, p.bathrooms),
        handover: formatHandover(p.completion_date),
        tags,
        imageUrl: primary ? getPublicUrl(primary.storage_path) : FALLBACK_IMAGE,
      };
    });
  } else {
    items = OFF_PLAN_LISTINGS.map((p) => ({
      key: p.slug,
      href: "/off-plan",
      title: p.title,
      types: p.types,
      developer: p.developer,
      location: p.location,
      startingPrice: p.startingPrice,
      bedrooms: p.bedrooms,
      handover: p.handover,
      tags: p.tags,
      imageUrl: p.imageUrl,
    }));
  }

  return <OffPlanPaginatedCards items={items} />;
}

function OffPlanSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col rounded-sm overflow-hidden">
          <div className="aspect-3/2 bg-gray-200" />
          <div className="p-4 flex flex-col gap-2.5">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
            <div className="mt-3 h-14 bg-gray-100 rounded" />
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="h-9 bg-gray-200 rounded-sm" />
              <div className="h-9 bg-gray-100 rounded-sm" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OffPlanSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-x-0 top-[70%] -translate-y-1/2 pointer-events-none select-none">
        <Image
          src="/images/bg.png"
          alt=""
          width={1920}
          height={400}
          className="w-full h-auto"
          aria-hidden
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-pg-dark">
            Exclusive Properties From Developers
          </h2>
          <Link
            href="/off-plan"
            className="hidden md:flex items-center gap-2 text-[13px] font-semibold text-pg-dark hover:text-pg-gold transition-colors whitespace-nowrap"
          >
            See All Developments <ChevronRight size={14} />
          </Link>
        </div>

        <Suspense fallback={<OffPlanSkeleton />}>
          <OffPlanSectionData />
        </Suspense>
      </div>
    </section>
  );
}
