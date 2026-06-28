import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Square, MapPin, ArrowRight, Phone } from "lucide-react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getPublicUrl } from "@/lib/supabase/storage";
import PropertyMap from "@/components/properties/PropertyMap";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://palmgate.ae";
const WHATSAPP_NUMBER = "971000000000";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: property } = await supabase
    .from("properties")
    .select("title, description, price, currency, community, emirate, property_images(storage_path, is_primary)")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!property) return { title: "Property Not Found" };

  const primaryImage = (property.property_images as unknown as { storage_path: string; is_primary: boolean }[] | null)
    ?.find((img) => img.is_primary);
  const ogImage = primaryImage ? getPublicUrl(primaryImage.storage_path) : undefined;

  const location = [property.community, property.emirate].filter(Boolean).join(", ");
  const price = new Intl.NumberFormat("en-AE", { style: "decimal" }).format(Number(property.price));
  const description =
    property.description ??
    `${property.title} — ${location}. ${property.currency} ${price}.`;

  return {
    title: property.title,
    description: String(description).slice(0, 155),
    openGraph: {
      title: property.title,
      description: String(description).slice(0, 155),
      url: `${BASE_URL}/properties/${slug}`,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: property.title }] : [],
      type: "website",
    },
    alternates: { canonical: `${BASE_URL}/properties/${slug}` },
  };
}

export default async function PropertyDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: property, error } = await supabase
    .from("properties")
    .select("*, property_images(id, storage_path, alt, is_primary, display_order, width, height)")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !property) notFound();

  type ImageRow = {
    id: string; storage_path: string; alt: string | null;
    is_primary: boolean; display_order: number;
    width: number | null; height: number | null;
  };

  const images = [...((property.property_images as unknown as ImageRow[]) ?? [])].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return (a.display_order ?? 0) - (b.display_order ?? 0);
  });

  const heroImage = images[0];
  const heroUrl = heroImage ? getPublicUrl(heroImage.storage_path) : null;

  const galleryImages = images.map((img) => ({
    url: getPublicUrl(img.storage_path),
    alt: img.alt ?? property.title,
  }));

  const priceFormatted = new Intl.NumberFormat("en-AE", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(property.price);

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I am interested in ${property.title}`
  )}`;

  const location = [property.community, property.location_name, property.emirate]
    .filter(Boolean)
    .join(", ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description ?? undefined,
    url: `${BASE_URL}/properties/${slug}`,
    offers: { "@type": "Offer", price: property.price, priceCurrency: property.currency ?? "AED" },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.community ?? property.emirate,
      addressRegion: property.emirate,
      addressCountry: "AE",
    },
  };

  const otherDetails = [
    { label: "Property Type", value: property.type ? property.type.charAt(0).toUpperCase() + property.type.slice(1) : "--" },
    { label: "Square Footage", value: property.area_sqft ? property.area_sqft.toLocaleString() : "--" },
    { label: "Year Built", value: "--" },
    { label: "Floor Number", value: "--" },
    { label: "Parking", value: "--" },
    { label: "Terrace", value: "--" },
  ];

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Info bar ── */}
      <div className="pt-20 border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="font-semibold text-pg-dark">{property.title}</span>
                {location && (
                  <span className="text-pg-muted">, {location}</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                {property.availability && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                    + Active
                  </span>
                )}
                {property.availability && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-sm bg-white text-pg-dark border border-gray-200 uppercase tracking-wide">
                    {property.availability === "for_sale" ? "For Sale" : "For Rent"}
                  </span>
                )}
                {property.condition === "off_plan" && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-sm bg-violet-50 text-violet-700 border border-violet-200 uppercase tracking-wide">
                    Off-Plan
                  </span>
                )}
              </div>
            </div>
          </div>
          <Link href="/properties" className="text-pg-muted hover:text-pg-dark transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Hero image ── */}
      <div className="relative w-full bg-gray-100" style={{ height: "clamp(300px, 55vh, 560px)" }}>
        {heroUrl ? (
          <Image
            src={heroUrl}
            alt={heroImage?.alt ?? property.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-500" />
        )}

        {/* Schedule Viewing button */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-pg-dark text-white text-[12px] font-semibold px-5 py-2.5 hover:bg-pg-body transition-colors shadow-lg"
          >
            Schedule Viewing <ArrowRight size={13} />
          </a>
          {/* Share */}
          <button className="w-9 h-9 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
          {/* Favourite */}
          <button className="w-9 h-9 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Price + Specs ── */}
      <div className="max-w-screen-xl mx-auto px-6 py-8 border-b border-gray-100">
        <p className="font-sans font-bold text-4xl md:text-5xl text-pg-dark mb-6">
          {property.currency} {priceFormatted}
        </p>
        <div className="flex flex-wrap gap-10">
          {property.bedrooms != null && (
            <div className="flex items-center gap-2 text-pg-muted text-sm">
              <Bed size={16} />
              <span>{property.bedrooms === 0 ? "Studio" : `${property.bedrooms} Beds`}</span>
            </div>
          )}
          {property.bathrooms != null && (
            <div className="flex items-center gap-2 text-pg-muted text-sm">
              <Bath size={16} />
              <span>{property.bathrooms} Baths</span>
            </div>
          )}
          {property.area_sqft != null && (
            <div className="flex items-center gap-2 text-pg-muted text-sm">
              <Square size={16} />
              <span>{property.area_sqft.toLocaleString()} SqFt</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2 text-pg-muted text-sm">
              <MapPin size={16} />
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Agent + Content ── */}
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-[220px_1fr] gap-12 lg:gap-20">

          {/* Agent card */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-square bg-gray-100 rounded-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gray-200" />
            </div>
            <div>
              <p className="font-semibold text-pg-dark text-sm">Person Name</p>
              <p className="text-pg-muted text-[12px]">Associate Partner</p>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-gray-200 text-pg-dark text-[12px] font-medium px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                <svg viewBox="0 0 32 32" fill="currentColor" className="w-3.5 h-3.5 text-[#25D366]">
                  <path d="M16 0C7.163 0 0 7.163 0 16c0 2.836.74 5.5 2.035 7.818L0 32l8.385-2.012A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.07 22.514c-.334.94-1.956 1.796-2.685 1.91-.686.107-1.553.152-2.505-.158-.578-.19-1.32-.443-2.27-.868-3.996-1.727-6.606-5.76-6.804-6.027-.198-.267-1.615-2.148-1.615-4.098s1.02-2.91 1.382-3.307c.362-.397.79-.497 1.054-.497.264 0 .528.002.76.014.244.012.57-.093.893.68.333.795 1.13 2.745 1.229 2.943.1.198.165.43.033.694-.133.265-.199.43-.396.661-.198.232-.416.518-.594.696-.198.198-.404.413-.174.81.23.397 1.023 1.688 2.197 2.734 1.508 1.34 2.78 1.754 3.177 1.952.397.199.628.166.858-.1.231-.265.99-1.155 1.254-1.552.264-.397.528-.33.89-.199.362.132 2.308 1.088 2.705 1.287.397.198.661.297.76.463.099.166.099.963-.235 1.903z" />
                </svg>
                Whatsapp
              </a>
              <a
                href={`tel:+${WHATSAPP_NUMBER}`}
                className="inline-flex items-center gap-2 border border-gray-200 text-pg-dark text-[12px] font-medium px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                <Phone size={13} />
                Call us
              </a>
            </div>
          </div>

          {/* Amenities + Description */}
          <div>
            {/* Amenity chips */}
            {property.amenities?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-gray-100">
                {property.amenities.map((amenity: string) => (
                  <span
                    key={amenity}
                    className="text-[12px] text-pg-dark border border-gray-200 px-3 py-1 hover:bg-gray-50 cursor-default"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {property.description && (
              <div className="space-y-4">
                {property.description.split("\n\n").map((para: string, i: number) => (
                  <p key={i} className="text-pg-body text-[14px] leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Other Details ── */}
      <div className="max-w-screen-xl mx-auto px-6 pb-12">
        <h2 className="text-3xl md:text-4xl text-pg-dark mb-8">
          <span className="font-semibold">Other</span>{" "}
          <span className="font-light font-heading italic">Details</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6 border-t border-gray-100 pt-8">
          {otherDetails.map(({ label, value }) => (
            <div key={label}>
              <p className="text-[11px] uppercase tracking-widest text-pg-muted font-medium mb-1">{label}</p>
              <p className="text-[14px] font-medium text-pg-dark">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Photo gallery ── */}
      {galleryImages.length > 0 && (
        <div className="max-w-screen-xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2" style={{ gridAutoRows: "220px" }}>
            {/* First image: full width */}
            {galleryImages[0] && (
              <div className="col-span-2 md:col-span-3 relative overflow-hidden">
                <Image
                  src={galleryImages[0].url}
                  alt={galleryImages[0].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 90vw"
                  className="object-cover"
                />
              </div>
            )}
            {/* Remaining images */}
            {galleryImages.slice(1).map((img, i) => (
              <div
                key={i}
                className={`relative overflow-hidden ${
                  i === 0 ? "row-span-2" : ""
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 30vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ── Map ── */}
      {property.lat != null && property.lng != null && (
        <div className="max-w-screen-xl mx-auto px-6 pb-16">
          <div className="h-[450px]">
            <PropertyMap lat={property.lat} lng={property.lng} title={property.title} />
          </div>
        </div>
      )}
    </div>
  );
}
