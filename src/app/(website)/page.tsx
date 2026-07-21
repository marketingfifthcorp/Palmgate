import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import OffPlanSection from "@/components/home/OffPlanSection";
import MortgageSection from "@/components/home/MortgageSection";
import MarketsSection from "@/components/home/MarketsSection";
import ExclusivePropertiesSection from "@/components/home/ExclusivePropertiesSection";
import PrivateOfficeSection from "@/components/home/PrivateOfficeSection";
import PropertyTypesGrid from "@/components/home/PropertyTypesGrid";
import ForAgentsSection from "@/components/home/ForAgentsSection";
import ServicesSection from "@/components/home/ServicesSection";
import CTASection from "@/components/home/CTASection";
import NewsSection from "@/components/home/NewsSection";

export const metadata: Metadata = {
  title: "Palmgate — Luxury Real Estate in Dubai",
  description:
    "Discover premium properties in Dubai. Buy, sell, and invest in luxury apartments, villas, and off-plan developments with Palmgate — your trusted real estate partner.",
  openGraph: {
    title: "Palmgate — Luxury Real Estate in Dubai",
    description:
      "Discover premium properties in Dubai. Buy, sell, and invest in luxury apartments, villas, and off-plan developments with Palmgate.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* <StatsBar /> */}
      <OffPlanSection />
      <MarketsSection />
      <ExclusivePropertiesSection />
      <PrivateOfficeSection />
      <PropertyTypesGrid />
      <MortgageSection />
      <ForAgentsSection />
      <ServicesSection />
      <CTASection />
      <NewsSection />
    </>
  );
}
