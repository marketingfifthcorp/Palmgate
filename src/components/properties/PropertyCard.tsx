import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Maximize2 } from "lucide-react";

interface Props {
  slug: string;
  title: string;
  price: number;
  currency?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area_sqft?: number | null;
  community?: string | null;
  emirate?: string;
  developer?: string | null;
  completion_date?: string | null;
  condition?: "ready" | "off_plan";
  availability?: "for_sale" | "for_rent" | null;
  featured?: boolean | null;
  type?: string | null;
  imageUrl?: string;
  imageAlt?: string;
}

function formatPrice(price: number, currency: string) {
  if (!price || price <= 0) return "Price on Request";
  if (price >= 1_000_000) return `${currency} ${(price / 1_000_000).toFixed(2)}M`;
  if (price >= 1_000) return `${currency} ${Math.round(price / 1_000)}K`;
  return `${currency} ${price.toLocaleString()}`;
}

export default function PropertyCard({
  slug,
  title,
  price,
  currency = "OMR",
  bedrooms,
  bathrooms,
  area_sqft,
  community,
  emirate = "Muscat",
  developer,
  completion_date,
  condition = "ready",
  availability,
  featured,
  type,
  imageUrl,
  imageAlt,
}: Props) {
  const tags: string[] = [];
  if (featured) tags.push("EXCLUSIVE");
  if (condition === "off_plan") tags.push("OFF-PLAN");

  const typeLabel = type
    ? type.charAt(0).toUpperCase() + type.slice(1)
    : condition === "off_plan"
    ? "Off-Plan"
    : "Property";

  const availLabel =
    availability === "for_sale"
      ? "For Sale"
      : availability === "for_rent"
      ? "For Rent"
      : condition === "off_plan"
      ? `Handover ${completion_date ?? "TBC"}`
      : "";

  return (
    <Link href={`/properties/${slug}`} className="group flex flex-col bg-white overflow-hidden rounded-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-slate-200 to-slate-400" />
        )}
        {tags.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="bg-white text-pg-dark text-[10px] font-semibold px-2 py-1">
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
          {formatPrice(price, currency)}
        </p>

        {/* Type · Availability */}
        <p className="text-[13px] text-pg-muted mb-2">
          {typeLabel}
          {availLabel ? ` · ${availLabel}` : ""}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1 mb-4">
          <MapPin size={12} className="text-pg-muted shrink-0" />
          <span className="text-[13px] text-pg-muted truncate">{community ?? emirate}</span>
        </div>

        {/* Stats row */}
        <div className="mt-auto flex items-center gap-4 text-[12px] text-pg-muted">
          {bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble size={13} className="shrink-0" />
              {bedrooms === 0 ? "Studio" : bedrooms}
            </span>
          )}
          {bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath size={13} className="shrink-0" />
              {bathrooms}
            </span>
          )}
          {area_sqft != null && (
            <span className="flex items-center gap-1">
              <Maximize2 size={12} className="shrink-0" />
              {area_sqft.toLocaleString()} SQ.FT.
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
