import type { Metadata } from "next";
import Image from "next/image";
import WhatSetsApartAccordion from "@/components/about/WhatSetsApartAccordion";

export const metadata: Metadata = {
  title: "About Us | Palmgate",
  description:
    "Learn about Palmgate — Oman's trusted real estate partner. Our mission is moving you forward in real estate through trust, expertise, and personalised service.",
};

const OMAN_STATS = [
  {
    stat: "3,165 km",
    desc: "of Arabian Sea coastline — Oman's most undervalued asset",
  },
  {
    stat: "ITO",
    desc: "Integrated Tourism Zones open to foreign freehold ownership",
  },
  {
    stat: "10-yr",
    desc: "Resident visa available to qualifying property investors",
  },
];

const TEAM = [
  { name: "Lorem ipsum", role: "Founder and Chief Executive Officer", image: "/images/about-team-1.png" },
  { name: "Lorem ipsum", role: "Chief Operating Officer",             image: "/images/about-team-2.png" },
  { name: "Lorem ipsum", role: "Chief Financial Officer",            image: "/images/about-team-3.png" },
  { name: "Lorem ipsum", role: "Chief of Staff",                     image: "/images/about-team-4.png" },
  { name: "Lorem ipsum", role: "Agent Success Manager",              image: "/images/about-team-1.png" },
];

const CORE_VALUES = [
  { label: "Positive Culture",      image: "/images/about-1.png" },
  { label: "Honesty and Integrity", image: "/images/about-2.png" },
  { label: "Respect and Empathy",   image: "/images/about-team-1.png" },
  { label: "Embracing Change",      image: "/images/about-team-2.png" },
  { label: "Exceptional Service",   image: "/images/about-team-3.png" },
];

export default function AboutPage() {
  return (
    <div className="bg-white overflow-hidden">

      {/* ── Hero heading ─────────────────────────────────────────── */}
      <section className="pt-36 pb-10 text-center bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h1
            className="font-heading font-bold text-pg-dark leading-none tracking-[-0.04em]"
            style={{ fontSize: "clamp(64px, 9vw, 120px)" }}
          >
            About Us
          </h1>
          <p className="text-pg-body text-[15px] mt-5">
            Our Mission: Moving You Forward in Real Estate
          </p>
        </div>
      </section>

      {/* ── Hero image ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative w-full overflow-hidden rounded-sm" style={{ height: "clamp(280px, 38vw, 580px)" }}>
          <Image
            src="/images/about-hero.png"
            alt="Palmgate team event"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* ── Intro editorial text ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p
          className="font-heading font-medium text-pg-dark leading-tight"
          style={{ fontSize: "clamp(20px, 2.8vw, 42px)", letterSpacing: "-0.02em", lineHeight: "1.15" }}
        >
          Oman is attracting serious capital. Integrated tourism projects, long-term resident
          visas, and a growing expat community are reshaping demand across Muscat and beyond.{" "}
          <span className="text-pg-muted">
            Buyers are arriving from the GCC, from Europe, from across the world — and they are
            looking for someone they can trust with a significant decision in an unfamiliar market.
            That is precisely what Palmgate was built to be.
          </span>
        </p>
      </section>

      {/* ── The Oman Advantage ───────────────────────────────────── */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-heading font-semibold text-pg-dark text-center text-2xl md:text-3xl mb-10">
            The Oman Advantage
          </h2>

          {/* Stat boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
            {OMAN_STATS.map(({ stat, desc }) => (
              <div key={stat} className="border border-gray-200 rounded-sm p-8 text-center">
                <p
                  className="font-heading font-semibold text-pg-dark mb-2"
                  style={{ fontSize: "clamp(24px, 3vw, 40px)", letterSpacing: "-0.02em" }}
                >
                  {stat}
                </p>
                <p className="text-pg-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Body paragraphs */}
          <div
            className="text-pg-dark leading-relaxed space-y-4 max-w-4xl"
            style={{ fontSize: "clamp(15px, 1.6vw, 20px)", lineHeight: "1.7" }}
          >
            <p>
              With deep expertise in the Oman real estate market, we provide access to some of the
              country's most sought-after freehold communities, luxury developments, and investment
              opportunities. Through strong developer relationships and a client-focused approach,
              we help buyers identify properties aligned with both lifestyle goals and long-term
              financial growth.
            </p>
            <p>
              Our team combines local market knowledge with an international outlook, supporting
              clients from Oman and around the world through honest advisory, clear communication,
              and a seamless experience. We understand that purchasing property is a significant
              decision, which is why we prioritize trust, responsiveness, and lasting relationships
              above short-term sales.
            </p>
            <p>
              As Oman continues to grow as one of the region's most attractive and stable investment
              destinations, Palmgate Properties remains committed to helping clients navigate the
              market with confidence — whether for living, investing, or building generational wealth.
            </p>
          </div>
        </div>
      </section>

      {/* ── Who We Are ───────────────────────────────────────────── */}
      <section className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: quote + small image */}
            <div className="flex flex-col gap-10">
              <p
                className="font-heading font-medium leading-tight text-pg-muted"
                style={{ fontSize: "clamp(22px, 3vw, 48px)", letterSpacing: "-0.03em", lineHeight: "1.15" }}
              >
                When your decision matters, work with the people who take it seriously.
              </p>
              <div className="relative w-full overflow-hidden rounded-sm" style={{ height: "clamp(220px, 22vw, 340px)" }}>
                <Image src="/images/about-2.png" alt="Palmgate team" fill className="object-cover" />
              </div>
            </div>

            {/* Right: large image + paragraph */}
            <div className="flex flex-col gap-8">
              <div className="relative w-full overflow-hidden rounded-sm" style={{ height: "clamp(280px, 30vw, 460px)" }}>
                <Image src="/images/about-1.png" alt="Palmgate team outdoors" fill className="object-cover" />
              </div>
              <p className="text-pg-body text-[15px] leading-relaxed">
                At Palmgate Properties, we believe real estate is more than a transaction — it is
                about creating lifestyles, building long-term value, and helping clients make
                confident decisions with clarity and trust. Whether you are searching for a family
                home or seeking high-potential investment opportunities, we guide every step of the
                journey with transparency, professionalism, and personalized service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Sets PalmGate Apart ──────────────────────────────── */}
      <section className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[420px_1fr] gap-16 items-start">
            {/* Left: sticky heading */}
            <div className="lg:sticky top-28">
              <h2
                className="font-heading font-medium leading-none"
                style={{ fontSize: "clamp(32px, 4vw, 64px)", letterSpacing: "-0.04em" }}
              >
                <span className="text-pg-muted">What </span>
                <span className="text-pg-dark">Sets</span>
                <br />
                <span className="text-pg-dark">PalmGate Apart</span>
              </h2>
            </div>

            {/* Right: accordion */}
            <WhatSetsApartAccordion />
          </div>
        </div>
      </section>

      {/* ── Meet the Team ─────────────────────────────────────────── */}
      <section className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="font-heading font-semibold leading-none mb-14"
            style={{ fontSize: "clamp(32px, 4vw, 64px)", letterSpacing: "-0.04em" }}
          >
            <span className="text-pg-muted">Meet the </span>
            <span className="text-pg-dark">Team</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {TEAM.map((member, i) => (
              <div key={i}>
                <div className="relative w-full overflow-hidden rounded-sm mb-4" style={{ aspectRatio: "3/4" }}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <p className="font-heading font-medium text-pg-dark text-[15px] leading-tight mb-1">
                  {member.name}
                </p>
                <p className="text-pg-muted text-[12px] leading-snug">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Core Values ───────────────────────────────────────── */}
      <section className="py-20 border-t border-gray-100">
        <div className="text-center mb-12 px-6">
          <h2
            className="font-heading font-semibold leading-none mb-5"
            style={{ fontSize: "clamp(32px, 4vw, 64px)", letterSpacing: "-0.04em" }}
          >
            <span className="text-pg-muted">Our </span>
            <span className="text-pg-dark">Core Values</span>
          </h2>
          <p className="text-pg-muted text-[14px]">
            Palmgate-certified agents embody the core values that define our company:
          </p>
        </div>

        {/* 5-panel row */}
        <div
          className="flex overflow-x-auto"
          style={{ height: "clamp(380px, 42vw, 600px)" }}
        >
          {CORE_VALUES.map(({ label, image }) => (
            <div
              key={label}
              className="relative shrink-0 overflow-hidden"
              style={{ flex: "1 0 180px", flexShrink: 0 }}
            >
              <Image src={image} alt={label} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-8 left-6 right-6">
                <p className="text-white font-heading font-medium text-[15px] md:text-xl leading-snug">
                  {label.split(" ").map((word, i, arr) => (
                    <span key={i}>
                      {word}
                      {i < arr.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
