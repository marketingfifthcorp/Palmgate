import type { Metadata } from "next";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Contact Us | Palmgate",
  description:
    "Get in touch with Palmgate's real estate experts. We're here to help you buy, sell, or rent in Oman.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Spacer for fixed navbar */}
      <div className="pt-18" />
      {/* Reuse the same contact section from the homepage */}
      <CTASection />
    </div>
  );
}
