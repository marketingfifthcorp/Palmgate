import { Suspense } from "react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { getPublicUrl } from "@/lib/supabase/storage";
import type { PropertyType, PropertyAvailability, PropertyCondition } from "@/types/database";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertiesFilterBar from "@/components/properties/PropertiesFilterBar";
import SortSelect from "@/components/properties/SortSelect";
import Pagination from "@/components/properties/Pagination";
import PropertiesShowTabs from "@/components/properties/PropertiesShowTabs";
import { Map } from "lucide-react";

export const metadata: Metadata = {
  title: "Properties | Palmgate",
  description:
    "Browse luxury apartments, villas, townhouses, and off-plan developments across Oman.",
};

type SP = Record<string, string | string[] | undefined>;

function str(params: SP, key: string): string | undefined {
  const v = params[key];
  return typeof v === "string" ? v : v?.[0];
}

function pageTitle(availability?: string | null, condition?: string | null, type?: string | null) {
  const base = "Properties";
  const typeLabel = type ? type.charAt(0).toUpperCase() + type.slice(1) + "s" : base;
  const availLabel =
    availability === "for_sale" ? " for Sale" : availability === "for_rent" ? " for Rent" : "";
  return `${typeLabel}${availLabel} in Oman`;
}

type PropertyRow = {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  community: string | null;
  emirate: string;
  developer: string | null;
  completion_date: string | null;
  condition: "ready" | "off_plan";
  availability: "for_sale" | "for_rent" | null;
  featured: boolean | null;
  type: string | null;
  property_images: { storage_path: string; alt: string | null; is_primary: boolean }[];
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const params = await searchParams;

  const type = str(params, "type") as PropertyType | undefined;
  const availability = str(params, "availability") as PropertyAvailability | undefined;
  const condition = str(params, "condition") as PropertyCondition | undefined;
  const minPrice = str(params, "min_price");
  const maxPrice = str(params, "max_price");
  const beds     = str(params, "beds");
  const baths    = str(params, "baths");
  const minSize  = str(params, "min_size");
  const maxSize  = str(params, "max_size");
  const amenitiesParam = str(params, "amenities");
  const community = str(params, "community");
  const q = str(params, "q");
  const sort = str(params, "sort") ?? "featured";
  const page = Math.max(1, parseInt(str(params, "page") ?? "1"));
  const limit = 12;
  const offset = (page - 1) * limit;

  let properties: PropertyRow[] = [];
  let total = 0;
  let fetchError = false;

  try {
    const supabase = await createClient();

    let query = supabase
      .from("properties")
      .select(
        "id, slug, title, price, currency, bedrooms, bathrooms, area_sqft, community, emirate, developer, completion_date, condition, availability, featured, type, property_images(storage_path, alt, is_primary)",
        { count: "exact" }
      )
      .eq("published", true)
      .range(offset, offset + limit - 1);

    if (type)       query = query.eq("type", type);
    if (availability) query = query.eq("availability", availability);
    if (condition)  query = query.eq("condition", condition);
    if (minPrice)   query = query.gte("price",    parseFloat(minPrice));
    if (maxPrice)   query = query.lte("price",    parseFloat(maxPrice));
    if (beds)       query = query.gte("bedrooms", parseInt(beds));
    if (baths)      query = query.gte("bathrooms", parseInt(baths));
    if (minSize)    query = query.gte("area_sqft", parseFloat(minSize));
    if (maxSize)    query = query.lte("area_sqft", parseFloat(maxSize));
    if (amenitiesParam) {
      const list = amenitiesParam.split(",").filter(Boolean);
      if (list.length) query = query.contains("amenities", list);
    }
    if (community)  query = query.ilike("community", `%${community}%`);
    if (q)          query = query.textSearch("fts", q, { type: "websearch" });

    switch (sort) {
      case "price_asc":  query = query.order("price", { ascending: true }); break;
      case "price_desc": query = query.order("price", { ascending: false }); break;
      case "newest":     query = query.order("created_at", { ascending: false }); break;
      default:
        query = query.order("featured", { ascending: false }).order("created_at", { ascending: false });
    }

    const { data, count, error } = await query;
    if (error) throw error;
    properties = (data ?? []) as unknown as PropertyRow[];
    total = count ?? 0;
  } catch {
    fetchError = true;
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-white">
      {/* Spacer for fixed navbar */}
      <div className="pt-18">

        {/* Sticky filter bar */}
        <Suspense fallback={<div className="h-24 border-b border-gray-100 bg-white" />}>
          <PropertiesFilterBar total={total} />
        </Suspense>

        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* Results toolbar */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {/* Title + count */}
            <div className="flex items-center gap-3 mr-auto">
              <h1 className="text-[15px] font-semibold text-pg-dark">
                {pageTitle(availability, condition, type)}
              </h1>
              {!fetchError && (
                <span className="text-[13px] text-pg-muted">
                  {total.toLocaleString()} {total === 1 ? "result" : "results"}
                </span>
              )}
            </div>

            {/* Show: Ready / Off Plan tabs */}
            <Suspense fallback={null}>
              <PropertiesShowTabs />
            </Suspense>

            {/* Sort */}
            <Suspense fallback={<div className="w-36 h-9 rounded-sm bg-gray-100 animate-pulse" />}>
              <SortSelect />
            </Suspense>

            {/* Map view */}
            <button className="flex items-center gap-1.5 text-[13px] text-pg-dark font-medium hover:text-pg-gold transition-colors">
              <Map size={14} />
              Map View
            </button>
          </div>

          {/* Results grid */}
          {fetchError ? (
            <div className="text-center py-24 text-pg-muted text-sm">
              Unable to load properties. Please try again later.
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-24">
              <h3 className="font-heading font-bold text-pg-dark text-xl mb-2">
                No properties found
              </h3>
              <p className="text-pg-muted text-sm">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => {
                const primary = property.property_images?.find((img) => img.is_primary);
                const imageUrl = primary ? getPublicUrl(primary.storage_path) : undefined;
                return (
                  <PropertyCard
                    key={property.id}
                    slug={property.slug}
                    title={property.title}
                    price={property.price}
                    currency={property.currency}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    area_sqft={property.area_sqft}
                    community={property.community}
                    emirate={property.emirate}
                    developer={property.developer}
                    completion_date={property.completion_date}
                    condition={property.condition}
                    availability={property.availability}
                    featured={property.featured}
                    type={property.type}
                    imageUrl={imageUrl}
                    imageAlt={primary?.alt ?? property.title}
                  />
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10">
              <Suspense fallback={null}>
                <Pagination totalPages={totalPages} currentPage={page} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
