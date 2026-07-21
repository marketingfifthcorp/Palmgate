import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BarChart2, Megaphone, KeyRound, Scale, MessageSquare, ShieldCheck } from "lucide-react";
import SellWithUsForm from "@/components/forms/SellWithUsForm";
import CtaBannerWithModal from "@/components/sell-with-us/CtaBannerWithModal";

export const metadata: Metadata = {
  title: "Sell With Us | Palmgate",
  description:
    "Get the best value for your property in Dubai. Palmgate provides market consultation, premium marketing exposure, and expert negotiation to maximise your return.",
};

const FEATURES = [
  {
    icon: BarChart2,
    title: "Accurate Property Consultation",
    desc: "We provide a precise, data-backed assessment of your property's worth, ensuring a competitive yet profitable listing price.",
  },
  {
    icon: Megaphone,
    title: "Premium Marketing Exposure",
    desc: "From professional photography to targeted digital campaigns, we ensure your property stands out in a crowded market.",
  },
  {
    icon: KeyRound,
    title: "Access to Serious Buyers",
    desc: "Leverage our exclusive network of pre-qualified buyers and international investors actively seeking luxury Dubai real estate.",
  },
  {
    icon: Scale,
    title: "Professional Negotiation",
    desc: "Our experienced brokers handle all negotiations, fiercely advocating for your interests to secure the most favourable terms.",
  },
  {
    icon: MessageSquare,
    title: "Clear Communication",
    desc: "Stay informed at every step. We provide regular updates, viewing feedback, and market insights throughout the selling process.",
  },
  {
    icon: ShieldCheck,
    title: "End-to-End Support",
    desc: "From initial consultation to final paperwork and handover, we manage the complexities, making the sale seamless and stress-free.",
  },
];

const STEPS = [
  { num: "01", title: "Property Review",       desc: "Initial consultation and detailed walkthrough to understand your property's unique selling points." },
  { num: "02", title: "Market Consultation",      desc: "Comprehensive analysis of recent sales and market trends to establish a competitive asking price." },
  { num: "03", title: "Marketing Launch",      desc: "Execution of a bespoke marketing strategy, including professional media, digital campaigns, and targeted outreach." },
  { num: "04", title: "Buyer Viewings",        desc: "Coordination and hosting of private viewings with pre-qualified buyers to showcase the property." },
  { num: "05", title: "Offers & Negotiation", desc: "Expert handling of all offers, providing strategic advice to negotiate the best possible terms and price." },
  { num: "06", title: "Closing Support",       desc: "Assistance with legal paperwork, coordinating with conveyancers, and ensuring a smooth transition to the new owner." },
];

export default function SellWithUsPage() {
  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[600px] lg:h-[680px] flex items-center overflow-hidden">
        <Image
          src="/images/sell-with-us-hero.png"
          alt="Sell your property with Palmgate"
          fill
          priority
          className="object-cover"
        />
        {/* Gradient overlay — heavier on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-24 pb-16">
          <p className="text-white/70 text-[11px] font-semibold uppercase tracking-[0.2em] mb-5">
            Sell Your Property With Confidence
          </p>
          <h1 className="font-heading font-semibold text-white text-4xl md:text-5xl lg:text-[60px] leading-[1.05] mb-6 max-w-xl">
            Get the Best Value for Your Property
          </h1>
          <p className="text-white/75 text-[15px] leading-relaxed mb-10 max-w-md">
            Selling a premium property in Dubai requires more than just a listing. It demands targeted
            marketing, access to a curated network of high-net-worth buyers, and expert negotiation to
            ensure you achieve the optimal return on your investment.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#consultation-form"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-pg-dark text-[13px] font-semibold uppercase tracking-wider rounded hover:bg-white/90 transition-colors"
            >
              Get a Free Consultation
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-white/50 text-white text-[13px] font-semibold uppercase tracking-wider rounded hover:border-white transition-colors"
            >
              Speak to an Advisor
            </Link>
          </div>
        </div>
      </section>

      {/* ── A BETTER WAY TO SELL ─────────────────────────────────── */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading font-semibold text-3xl md:text-4xl text-pg-dark mb-4 leading-tight">
              A Better Way to Sell Your Property
            </h2>
            <p className="text-pg-body text-[15px] leading-relaxed">
              We don&apos;t just list properties; we strategically position them in the market. Our tailored
              approach ensures your asset is presented to the right audience, maximizing both value and efficiency.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-pg-dark" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-pg-dark text-[15px] mb-2 leading-snug">
                    {title}
                  </p>
                  <p className="text-pg-muted text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE JOURNEY ──────────────────────────────────────────── */}
      <section
        className="py-20"
        style={{
          background: "#FAFAF8",
          borderTop: "1px dashed rgba(0,0,0,0.12)",
          borderBottom: "1px dashed rgba(0,0,0,0.12)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pg-muted mb-2">
              The Journey
            </p>
            <h2 className="font-heading font-semibold text-3xl md:text-4xl text-pg-dark leading-tight">
              How We Help You Sell
            </h2>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {STEPS.map((step) => (
              <div key={step.num}>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-heading font-bold text-pg-dark text-sm">{step.num}</span>
                  <span className="font-heading font-semibold text-pg-dark text-[15px]">{step.title}</span>
                </div>
                <p className="text-pg-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER + MODAL ────────────────────────────────────── */}
      <CtaBannerWithModal />

      {/* ── CONTACT FORM ──────────────────────────────────────────── */}
      <section className="bg-[#F4F4F2] py-20" id="consultation-form">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_580px] gap-12 items-start">

            {/* Left: massive headline */}
            <div className="flex items-start pt-4">
              <h2 className="font-heading font-bold text-pg-dark leading-[0.92] text-[80px] md:text-[110px] lg:text-[130px] xl:text-[160px] uppercase">
                Let&apos;s<br />Get In<br />Touch
              </h2>
            </div>

            {/* Right: form */}
            <div>
              <SellWithUsForm />
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
