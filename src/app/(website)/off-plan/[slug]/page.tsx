import type { Metadata } from "next";
import Image from "next/image";
import {
  Waves, Dumbbell, Coffee, Heart, UtensilsCrossed, TreePine, Baby,
  Monitor, Calendar, MapPin, Building2,
} from "lucide-react";
import FaqAccordion from "@/components/off-plan/FaqAccordion";
import RegisterInterestModal from "@/components/off-plan/RegisterInterestModal";
import PropertyMap from "@/components/properties/PropertyMap";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} | Off-Plan | Palmgate`,
    description: `Discover ${name} — an exclusive off-plan development available through Palmgate.`,
  };
}

const AMENITIES = [
  { icon: Waves,            label: "Swimming Pool" },
  { icon: Baby,             label: "Children's Playgrounds" },
  { icon: Dumbbell,         label: "Gym & Fitness Studio" },
  { icon: Coffee,           label: "Community Retail & Cafes" },
  { icon: Heart,            label: "Wellness Care" },
  { icon: UtensilsCrossed,  label: "Dining Destinations" },
  { icon: TreePine,         label: "Landscaped Terraces" },
];

const UNITS = [
  {
    type: "Studio",
    title: "Lorem ipsum dolor sit amet consectetur.",
    desc: "Lorem ipsum dolor sit amet consectetur. Rhoncus feugiat sit dui pulvinar convallis cursus mattis risus. Maecenas semper ullamcorper mi placerat. Ultrices sem amet ultrices urna ultricies diam. Eget purus volutpat lorem et dignissim. Ti sit erat mi tortor leo. Mauris eget tincidunt faucibus nunc. Pulvinar sed tempor nulla. Velit maecenas residentia residum et adipiscing subunter.",
    image: "/images/off-plan-3.png",
    align: "left" as const,
  },
  {
    type: "1 Bedroom",
    title: "Lorem ipsum dolor sit amet consectetur.",
    desc: "Lorem ipsum dolor sit amet consectetur. Id dui habitant in pulvinar convallis cursus mattis risus. Maecenas semper ullamcorper mi placerat. Ultrices urna nec ultricies diam. Eget purus volutpat lorem et dignissim. Ti sit erat mi tortor leo. Mauris eget tincidunt faucibus nunc. Pulvinar sed tincidunt nulla. Velit maecenas residentia et adipiscing subunter.",
    image: "/images/off-plan-4.png",
    align: "right" as const,
  },
];

const FAQS = [
  {
    question: "What is Project?",
    answer: "Project is a premium off-plan residential development offering a curated selection of studios and one-bedroom apartments with world-class amenities and stunning views.",
  },
  {
    question: "Where is Project located?",
    answer: "Project is strategically located in one of Dubai's most sought-after communities, offering easy access to key business districts, retail, and leisure destinations.",
  },
  {
    question: "What types of properties are available at Project?",
    answer: "Project offers studios and one-bedroom apartments, each thoughtfully designed with high-quality finishes, open-plan layouts, and premium fixtures throughout.",
  },
  {
    question: "What amenities can residents enjoy?",
    answer: "Residents have access to a resort-style swimming pool, fully equipped gym, children's playground, landscaped terraces, dining destinations, and dedicated wellness facilities.",
  },
  {
    question: "Why consider Project as an investment?",
    answer: "Dubai's real estate market offers some of the world's strongest rental yields with zero income tax. Project's prime location, quality finishes, and developer reputation make it an excellent investment opportunity.",
  },
];

export default async function OffPlanDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const projectName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative h-[520px] md:h-[620px] flex flex-col items-center justify-center overflow-hidden">
        <Image
          src="/images/off-plan-hero.jpg"
          alt={projectName}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 text-center px-6">
          <h1 className="font-heading font-semibold text-white text-4xl md:text-5xl mb-2 leading-tight">
            {projectName}
          </h1>
          <p className="text-white/70 text-[13px] tracking-wide mb-12">by: Developer Name</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <RegisterInterestModal
              projectName={projectName}
              trigger="register"
              className="px-7 py-3 bg-white text-pg-dark text-[13px] font-semibold hover:bg-white/90 transition-colors"
            />
            <RegisterInterestModal
              projectName={projectName}
              trigger="brochure"
              className="px-7 py-3 bg-white/20 border border-white/50 text-white text-[13px] font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
            />
            <RegisterInterestModal
              projectName={projectName}
              trigger="callback"
              className="px-7 py-3 bg-white/20 border border-white/50 text-white text-[13px] font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      {/* ── OVERVIEW ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <p className="text-pg-body text-[15px] leading-relaxed max-w-3xl mx-auto text-center mb-12">
            Lorem ipsum dolor sit amet consectetur. Ultrices malesuada est aliquam vehicula arcu. Elementum pretium non quisque urna. Lorem ipsum dolor sit amet consectetur. Id dui habitant nibh turpis hendrerit. Mauris eget tincidunt odio consectetur. Et aliquet felis mauris tristique ipsum. Facilisi lorem ipsum quam eget dignissim. It sit dolui sit amet dote. Purus in eros consecteteur ultrices. Nunc in turpis. Consequat dolor. Diam id turpis lorem.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
            {[
              { Icon: Monitor,   label: "Prices from",      value: "AED 500,000" },
              { Icon: Calendar,  label: "Handover Date",    value: "Q1 2026" },
              { Icon: MapPin,    label: "Location",         value: "Location" },
              { Icon: Building2, label: "Development Type", value: "Studios and 1 bedroom apartments" },
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

          <div className="grid grid-cols-2 gap-2 h-[480px] md:h-[560px]">
            <div className="grid grid-rows-2 gap-2">
              <div className="relative overflow-hidden">
                <Image src="/images/off-plan-1.png" alt="Development view" fill className="object-cover" />
              </div>
              <div className="relative overflow-hidden">
                <Image src="/images/off-plan-2.png" alt="Development exterior" fill className="object-cover" />
              </div>
            </div>
            <div className="relative overflow-hidden">
              <Image src="/images/off-plan-3.png" alt="Development interior" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-white text-[11px] font-semibold uppercase tracking-[0.2em] leading-loose">
                  Designed with heritage<br />
                  community,<br />
                  and contemporary island living<br />
                  in<br />
                  mind
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AMENITIES ────────────────────────────────────────────── */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-heading font-semibold text-pg-dark text-2xl md:text-3xl text-center mb-12">
            World class amenities
          </h2>
          <div className="flex flex-wrap items-start justify-center gap-8 md:gap-10">
            {AMENITIES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 w-20 text-center">
                <div className="w-12 h-12 flex items-center justify-center">
                  <Icon size={24} className="text-pg-dark" strokeWidth={1.5} />
                </div>
                <span className="text-[11px] text-pg-muted leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UNIT TYPES ───────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {UNITS.map((unit) => (
            <div
              key={unit.type}
              className={`grid md:grid-cols-2 gap-10 items-center ${
                unit.align === "right" ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pg-muted mb-4">
                  {unit.type}
                </p>
                <h3 className="font-heading font-semibold text-pg-dark text-2xl md:text-3xl leading-tight mb-5">
                  {unit.title}
                </h3>
                <p className="text-pg-muted text-[14px] leading-relaxed mb-8 max-w-md">
                  {unit.desc}
                </p>
                <RegisterInterestModal
                  projectName={`${unit.type} at Project`}
                  trigger="register"
                  label="Register Interest"
                  className="inline-flex items-center gap-2 border border-pg-dark text-pg-dark text-[11px] font-semibold uppercase tracking-widest px-6 py-3 hover:bg-pg-dark hover:text-white transition-colors"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image src={unit.image} alt={`${unit.type} interior`} fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PAYMENT PLAN ─────────────────────────────────────────── */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-heading font-semibold text-pg-dark text-2xl md:text-3xl text-center mb-10">
            Payment plan
          </h2>
          <div className="flex justify-center gap-6 max-w-lg mx-auto">
            <div className="flex-1 border border-gray-200 rounded-sm p-8 text-center bg-white">
              <p className="font-heading font-bold text-pg-dark text-4xl mb-2">35%</p>
              <p className="text-[12px] uppercase tracking-widest text-pg-muted">During construction</p>
            </div>
            <div className="flex-1 border border-gray-200 rounded-sm p-8 text-center bg-white">
              <p className="font-heading font-bold text-pg-dark text-4xl mb-2">65%</p>
              <p className="text-[12px] uppercase tracking-widest text-pg-muted">On handover</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ'S ────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-heading font-semibold text-pg-dark text-2xl md:text-3xl text-center mb-10">
            FAQ&apos;s
          </h2>
          <FaqAccordion faqs={FAQS} />
        </div>
      </section>

      {/* ── MAP ──────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-heading font-semibold text-pg-dark text-2xl md:text-3xl text-center mb-10">
            Location
          </h2>
          <div className="h-[450px]">
            <PropertyMap lat={23.5880} lng={58.3829} title={projectName} />
          </div>
        </div>
      </section>

    </div>
  );
}
