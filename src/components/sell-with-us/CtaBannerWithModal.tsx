"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";
import SellWithUsForm from "@/components/forms/SellWithUsForm";

export default function CtaBannerWithModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── CTA BANNER ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-14">
        <Image
          src="/images/cta.png"
          alt=""
          fill
          className="object-cover"
          aria-hidden
        />
        {/* slight dark veil so text stays readable */}
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="max-w-lg">
            <h2 className="font-heading font-semibold text-white text-2xl md:text-3xl lg:text-[36px] leading-tight mb-3">
              Thinking About Selling Your Property?
            </h2>
            <p className="text-white/70 text-[14px] leading-relaxed">
              Discover the true value of your asset in today&apos;s market. Connect with our luxury
              real estate specialists for a confidential, no-obligation consultation.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="shrink-0 inline-flex items-center gap-2 border border-pg-gold text-pg-gold text-[13px] font-semibold uppercase tracking-widest px-7 py-3.5 hover:bg-pg-gold hover:text-white transition-colors whitespace-nowrap"
          >
            Request Your Free Consultation
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* ── MODAL ──────────────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-60 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Modal card */}
      <div
        className={`fixed inset-0 z-70 flex items-center justify-center p-4 transition-opacity duration-300 pointer-events-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto transition-transform duration-300 ${
            open ? "scale-100" : "scale-95"
          }`}
        >
          {/* Modal header */}
          <div className="bg-[#1C3A5E] px-8 pt-8 pb-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <h3 className="font-heading font-semibold text-white text-2xl leading-tight mb-2">
              Request Your Valuation
            </h3>
            <p className="text-white/65 text-[13px] leading-relaxed">
              Fill in the details below, and one of our luxury property specialists will get in
              touch with a personalised market evaluation.
            </p>
          </div>

          {/* Form body */}
          <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
            <SellWithUsForm />
          </div>
        </div>
      </div>
    </>
  );
}
