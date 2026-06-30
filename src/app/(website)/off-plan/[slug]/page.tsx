import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import {
  Waves, Dumbbell, Coffee, Heart, UtensilsCrossed, TreePine, Baby,
  Car, Bell, Shield, Wind, Eye, Sparkles, Flower2, Wifi, Check,
  Monitor, Calendar, MapPin, Building2,
  Cpu, Umbrella, Trophy, Film, Activity, Flame, BookOpen, Bike,
  PawPrint, ShoppingBag, Thermometer,
  type LucideIcon,
} from "lucide-react";
import FaqAccordion from "@/components/off-plan/FaqAccordion";
import RegisterInterestModal from "@/components/off-plan/RegisterInterestModal";
import PropertyMap from "@/components/properties/PropertyMap";
import { createClient } from "@/lib/supabase/server";
import { getPublicUrl } from "@/lib/supabase/storage";
import type { OffPlanUnit, OffPlanFAQ } from "@/types/database";

type Params = Promise<{ slug: string }>;

// ── Amenity icon map ────────────────────────────────────────────────────────
const AMENITY_MAP: Array<{ keywords: string[]; icon: LucideIcon }> = [
  { keywords: ["pool", "swimming"],                                icon: Waves },
  { keywords: ["gym", "fitness"],                                  icon: Dumbbell },
  { keywords: ["sauna"],                                           icon: Thermometer },
  { keywords: ["spa", "wellness"],                                 icon: Heart },
  { keywords: ["dining", "restaurant", "food"],                    icon: UtensilsCrossed },
  { keywords: ["cafe", "coffee"],                                  icon: Coffee },
  { keywords: ["retail", "shop", "mall", "market"],                icon: ShoppingBag },
  { keywords: ["terrace", "landscape", "park"],                    icon: TreePine },
  { keywords: ["playground", "children", "kids"],                  icon: Baby },
  { keywords: ["parking", "garage"],                               icon: Car },
  { keywords: ["concierge", "reception", "lobby"],                 icon: Bell },
  { keywords: ["security", "guard"],                               icon: Shield },
  { keywords: ["balcony"],                                         icon: Wind },
  { keywords: ["view", "golf"],                                    icon: Eye },
  { keywords: ["upgraded", "premium", "finishes"],                 icon: Sparkles },
  { keywords: ["private garden", "garden", "flower"],              icon: Flower2 },
  { keywords: ["wifi", "internet", "broadband"],                   icon: Wifi },
  { keywords: ["smart"],                                           icon: Cpu },
  { keywords: ["beach", "waterfront", "marina", "sea access"],     icon: Umbrella },
  { keywords: ["tennis", "squash", "racquet", "padel"],            icon: Trophy },
  { keywords: ["cinema", "theater", "theatre", "movie", "screen"], icon: Film },
  { keywords: ["jogging", "running", "cycling", "bicycle", "bike"],icon: Activity },
  { keywords: ["bbq", "barbecue", "grill", "outdoor kitchen"],     icon: Flame },
  { keywords: ["library", "reading room", "study"],                icon: BookOpen },
  { keywords: ["bicycle", "bike path", "cycling track"],           icon: Bike },
  { keywords: ["pet", "dog friendly", "animal"],                   icon: PawPrint },
  { keywords: ["rooftop", "roof deck", "sky lounge"],              icon: Building2 },
];
function amenityIcon(a: string): LucideIcon {
  const n = a.toLowerCase().replace(/_/g, " ");
  return AMENITY_MAP.find(({ keywords }) => keywords.some((k) => n.includes(k)))?.icon ?? Check;
}
function amenityLabel(a: string) {
  return a.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("title, description, developer")
    .eq("slug", slug)
    .eq("condition", "off_plan")
    .single();

  if (!data) return { title: "Off-Plan Project | Palmgate" };
  return {
    title: `${data.title} | Off-Plan | Palmgate`,
    description: data.description ?? `Discover ${data.title} — an exclusive off-plan development by ${data.developer ?? "a top developer"} available through Palmgate.`,
  };
}

export default async function OffPlanDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("properties")
    .select("*, property_images(id, storage_path, alt, is_primary, display_order)")
    .eq("slug", slug)
    .eq("condition", "off_plan")
    .eq("published", true)
    .single();

  if (error || !project) notFound();

  type ImgRow = { id: string; storage_path: string; alt: string | null; is_primary: boolean; display_order: number };
  const allImages = ([...(project.property_images as unknown as ImgRow[] ?? [])]).sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return (a.display_order ?? 0) - (b.display_order ?? 0);
  });

  const heroImg   = allImages[0];
  const heroUrl   = heroImg ? getPublicUrl(heroImg.storage_path) : null;
  const gallery   = allImages.slice(1, 4); // up to 3 for the grid

  const units     = (project.unit_types  as OffPlanUnit[]  | null) ?? [];
  const faqs      = (project.faqs        as OffPlanFAQ[]   | null) ?? [];
  const plan      = project.payment_plan as { down: number; during: number; handover: number } | null;
  const amenities = (project.amenities   as string[]       | null) ?? [];
  const brochureUrl = project.brochure_path
    ? getPublicUrl(project.brochure_path as string)
    : undefined;

  const priceFrom = project.price
    ? `${(project.currency as string | null) ?? "OMR"} ${Number(project.price).toLocaleString()}`
    : "On Request";

  const handover = project.completion_date
    ? new Date(project.completion_date as string).toLocaleDateString("en-OM", { month: "long", year: "numeric" })
    : "TBA";

  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-[520px] md:h-[620px] flex flex-col items-center justify-center overflow-hidden">
        {heroUrl ? (
          <Image src={heroUrl} alt={project.title as string} fill priority className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="font-heading font-semibold text-white text-4xl md:text-5xl mb-2 leading-tight">
            {project.title as string}
          </h1>
          {project.developer && (
            <p className="text-white/70 text-[13px] tracking-wide mb-12">
              by {project.developer as string}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <RegisterInterestModal
              projectName={project.title as string}
              trigger="register"
              className="px-7 py-3 bg-white text-pg-dark text-[13px] font-semibold hover:bg-white/90 transition-colors"
            />
            <RegisterInterestModal
              projectName={project.title as string}
              trigger="brochure"
              brochureUrl={brochureUrl}
              className="px-7 py-3 bg-white/20 border border-white/50 text-white text-[13px] font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
            />
            <RegisterInterestModal
              projectName={project.title as string}
              trigger="callback"
              className="px-7 py-3 bg-white/20 border border-white/50 text-white text-[13px] font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      {/* ── OVERVIEW ─────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          {project.description && (
            <p className="text-pg-body text-[15px] leading-relaxed max-w-3xl mx-auto text-center mb-12">
              {project.description as string}
            </p>
          )}

          {/* Key stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
            {[
              { Icon: Monitor,   label: "Prices from",      value: priceFrom },
              { Icon: Calendar,  label: "Handover Date",    value: handover },
              { Icon: MapPin,    label: "Location",         value: (project.community ?? project.emirate ?? "Oman") as string },
              { Icon: Building2, label: "Development Type", value: project.type ? (project.type as string).charAt(0).toUpperCase() + (project.type as string).slice(1) : "Residential" },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center text-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-stone-100 flex items-center justify-center">
                  <Icon size={20} className="text-pg-dark" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-pg-muted font-semibold mb-1">{label}</p>
                  <p className="text-[13px] font-semibold text-pg-dark">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Gallery grid — up to 4 images */}
          {allImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2 h-[480px] md:h-[560px]">
              {/* Left column: 2 stacked */}
              <div className="grid grid-rows-2 gap-2">
                {[gallery[0], gallery[1]].map((img, i) =>
                  img ? (
                    <div key={img.id} className="relative overflow-hidden">
                      <Image src={getPublicUrl(img.storage_path)} alt={img.alt ?? project.title as string}
                        fill className="object-cover" />
                    </div>
                  ) : (
                    <div key={i} className="bg-gray-100" />
                  )
                )}
              </div>
              {/* Right column: tall image with overlay */}
              <div className="relative overflow-hidden">
                {gallery[2] ? (
                  <>
                    <Image src={getPublicUrl(gallery[2].storage_path)} alt={gallery[2].alt ?? project.title as string}
                      fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                      <p className="text-white text-[11px] font-semibold uppercase tracking-[0.2em] leading-loose">
                        {project.title as string}
                      </p>
                    </div>
                  </>
                ) : heroUrl ? (
                  <Image src={heroUrl} alt={project.title as string} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gray-100" />
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── AMENITIES ────────────────────────────────────────── */}
      {amenities.length > 0 && (
        <section className="py-16 bg-stone-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-heading font-semibold text-pg-dark text-2xl md:text-3xl text-center mb-12">
              World class amenities
            </h2>
            <div className="flex flex-wrap items-start justify-center gap-8 md:gap-10">
              {amenities.map((a) => {
                const Icon = amenityIcon(a);
                return (
                  <div key={a} className="flex flex-col items-center gap-2 w-20 text-center">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <Icon size={24} className="text-pg-dark" strokeWidth={1.5} />
                    </div>
                    <span className="text-[11px] text-pg-muted leading-tight">{amenityLabel(a)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── UNIT TYPES ───────────────────────────────────────── */}
      {units.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 space-y-16">
            {units.map((unit, idx) => (
              <div
                key={unit.id}
                className={`grid md:grid-cols-2 gap-10 items-center ${
                  idx % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pg-muted mb-4">
                    {unit.type}
                  </p>
                  {unit.title && (
                    <h3 className="font-heading font-semibold text-pg-dark text-2xl md:text-3xl leading-tight mb-5">
                      {unit.title}
                    </h3>
                  )}
                  {unit.description && (
                    <p className="text-pg-muted text-[14px] leading-relaxed mb-8 max-w-md">
                      {unit.description}
                    </p>
                  )}
                  <RegisterInterestModal
                    projectName={`${unit.type} at ${project.title as string}`}
                    trigger="register"
                    label="Register Interest"
                    className="inline-flex items-center gap-2 border border-pg-dark text-pg-dark text-[11px] font-semibold uppercase tracking-widest px-6 py-3 hover:bg-pg-dark hover:text-white transition-colors"
                  />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                  {unit.image_path ? (
                    <Image
                      src={getPublicUrl(unit.image_path)}
                      alt={`${unit.type} interior`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <span className="text-sm text-pg-muted">No image</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PAYMENT PLAN ─────────────────────────────────────── */}
      {plan && (plan.down || plan.during || plan.handover) && (
        <section className="py-16 bg-stone-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-heading font-semibold text-pg-dark text-2xl md:text-3xl text-center mb-10">
              Payment Plan
            </h2>
            <div className="flex justify-center gap-4 flex-wrap max-w-xl mx-auto">
              {plan.down > 0 && (
                <div className="flex-1 min-w-[120px] border border-gray-200 rounded-sm p-8 text-center bg-white">
                  <p className="font-heading font-bold text-pg-dark text-4xl mb-2">{plan.down}%</p>
                  <p className="text-[12px] uppercase tracking-widest text-pg-muted">Down Payment</p>
                </div>
              )}
              {plan.during > 0 && (
                <div className="flex-1 min-w-[120px] border border-gray-200 rounded-sm p-8 text-center bg-white">
                  <p className="font-heading font-bold text-pg-dark text-4xl mb-2">{plan.during}%</p>
                  <p className="text-[12px] uppercase tracking-widest text-pg-muted">During Construction</p>
                </div>
              )}
              {plan.handover > 0 && (
                <div className="flex-1 min-w-[120px] border border-gray-200 rounded-sm p-8 text-center bg-white">
                  <p className="font-heading font-bold text-pg-dark text-4xl mb-2">{plan.handover}%</p>
                  <p className="text-[12px] uppercase tracking-widest text-pg-muted">On Handover</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ'S ────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="font-heading font-semibold text-pg-dark text-2xl md:text-3xl text-center mb-10">
              FAQ&apos;s
            </h2>
            <FaqAccordion faqs={faqs} />
          </div>
        </section>
      )}

      {/* ── MAP ──────────────────────────────────────────────── */}
      {project.lat && project.lng && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-heading font-semibold text-pg-dark text-2xl md:text-3xl text-center mb-10">
              Location
            </h2>
            <div className="h-[450px]">
              <PropertyMap
                lat={Number(project.lat)}
                lng={Number(project.lng)}
                title={project.title as string}
              />
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
