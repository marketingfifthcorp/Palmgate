import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPublicUrl } from "@/lib/supabase/storage";
import ExclusiveCarousel, { type ExclusiveItem } from "./ExclusiveCarousel";

const FALLBACK_EXCLUSIVE: ExclusiveItem[] = [
  {
    key: "f1",
    href: "/properties",
    title: "Sky Penthouse — Downtown Dubai",
    location: "Downtown Dubai", emirate: "Dubai", fromPrice: "AED 42M",
    tags: ["EXCLUSIVE", "FOR SALE"],
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=1100&fit=crop&auto=format",
  },
  {
    key: "f2",
    href: "/properties",
    title: "Signature Beachfront Villa",
    location: "Palm Jumeirah", emirate: "Dubai", fromPrice: "AED 28.5M",
    tags: ["EXCLUSIVE", "FOR SALE"],
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&h=1100&fit=crop&auto=format",
  },
  {
    key: "f3",
    href: "/properties",
    title: "Grand Mansion — Emirates Hills",
    location: "Emirates Hills", emirate: "Dubai", fromPrice: "AED 68M",
    tags: ["EXCLUSIVE"],
    imageUrl: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=900&h=1100&fit=crop&auto=format",
  },
  {
    key: "f4",
    href: "/properties",
    title: "3-Bedroom Residence — DIFC",
    location: "DIFC", emirate: "Dubai", fromPrice: "AED 9.8M",
    tags: ["EXCLUSIVE", "FOR SALE"],
    imageUrl: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=900&h=1100&fit=crop&auto=format",
  },
];

function formatPrice(price: number | null, currency: string | null): string {
  if (!price) return "On Request";
  const cur = currency ?? "OMR";
  if (price >= 1_000_000) return `${cur} ${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `${cur} ${(price / 1_000).toFixed(0)}K`;
  return `${cur} ${price.toLocaleString()}`;
}

async function ExclusivePropertiesData() {
  type ImageRow = { storage_path: string; alt: string | null; is_primary: boolean };
  type PropRow = {
    id: string; slug: string; title: string; price: number | null; currency: string | null;
    community: string | null; emirate: string; type: string | null; availability: string | null;
    property_images: ImageRow[];
  };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("id, slug, title, price, currency, community, emirate, type, availability, property_images(storage_path, alt, is_primary)")
    .eq("featured", true)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  let items: ExclusiveItem[];

  if (!error && data && data.length > 0) {
    items = (data as unknown as PropRow[]).map((p) => {
      const primary = p.property_images?.find((img) => img.is_primary) ?? p.property_images?.[0];
      const tags: string[] = ["EXCLUSIVE"];
      if (p.availability === "for_sale") tags.push("FOR SALE");
      if (p.availability === "for_rent") tags.push("FOR RENT");
      return {
        key: p.id,
        href: `/properties/${p.slug}`,
        title: p.title,
        location: p.community ?? p.emirate,
        emirate: p.emirate,
        fromPrice: formatPrice(p.price, p.currency),
        tags,
        imageUrl: primary ? getPublicUrl(primary.storage_path) : FALLBACK_EXCLUSIVE[0].imageUrl,
      };
    });
  } else {
    items = FALLBACK_EXCLUSIVE;
  }

  return <ExclusiveCarousel items={items} />;
}

function ExclusiveSkeleton() {
  return (
    <div className="flex gap-4 animate-pulse">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="shrink-0 w-[calc(33.333%-11px)] min-w-65 aspect-7/4 rounded-sm bg-gray-200"
        />
      ))}
    </div>
  );
}

export default function ExclusivePropertiesSection() {
  return (
    <section className="py-28 bg-[#f7f6f3]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-pg-dark">
            Exclusive Properties From Top Developers
          </h2>
          <Link
            href="/properties?availability=for_sale"
            className="hidden md:flex items-center gap-2 text-[13px] font-semibold text-pg-dark hover:text-pg-gold transition-colors whitespace-nowrap"
          >
            View All Properties <ChevronRight size={14} />
          </Link>
        </div>

        <Suspense fallback={<ExclusiveSkeleton />}>
          <ExclusivePropertiesData />
        </Suspense>
      </div>
    </section>
  );
}
