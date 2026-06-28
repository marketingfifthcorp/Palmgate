"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const ITEMS = [
  {
    title: "Agent-Owned and Client-Focused",
    body: "We are brokers who invest in the same market we serve. Every recommendation is made with skin in the game, ensuring your interests always come first.",
  },
  {
    title: "Certified Agents with Local Expertise",
    body: "Our agents hold recognised certifications and deep on-the-ground knowledge of Oman's property landscape, from Muscat communities to coastal developments.",
  },
  {
    title: "Flexible Membership Plans",
    body: "Whether you're a first-time buyer or a seasoned investor, we offer service tiers tailored to your goals — from guided search to full portfolio management.",
  },
  {
    title: "Innovative Tools and Technology",
    body: "From AI-assisted property matching to live market dashboards, we give you the data and tools to make confident, informed decisions faster.",
  },
];

export default function WhatSetsApartAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      {ITEMS.map(({ title, body }, i) => (
        <div
          key={title}
          className="border-t border-gray-100 last:border-b"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-7 text-left group"
          >
            <div className="flex items-center gap-5">
              <span className="text-[13px] text-pg-muted w-6 shrink-0">
                {open === i ? "—" : "—"}
              </span>
              <span
                className="font-heading font-medium text-pg-dark leading-tight group-hover:text-pg-gold transition-colors"
                style={{ fontSize: "clamp(16px, 2vw, 28px)", letterSpacing: "-0.02em" }}
              >
                {title}
              </span>
            </div>
            <span className="text-pg-dark shrink-0 ml-4">
              {open === i ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>

          {/* Smooth accordion */}
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-pg-muted text-[15px] leading-relaxed pl-11 pb-7 max-w-xl">
                {body}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
