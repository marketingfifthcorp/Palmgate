import type { Metadata } from "next";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Contact Us | Palmgate",
  description:
    "Get in touch with Palmgate's real estate experts. We're here to help you buy, sell, or rent in Oman.",
};

type SP = Promise<{ type?: string }>;

export default async function ContactPage({ searchParams }: { searchParams: SP }) {
  const { type } = await searchParams;
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-18" />
      <CTASection initialLand={type === "land"} />
    </div>
  );
}
