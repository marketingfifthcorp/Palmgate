"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

const EXCLUSIVE = [
  {
    slug: "sky-penthouse-downtown-dubai",
    title: "Sky Penthouse — Downtown Dubai",
    location: "Downtown Dubai",
    emirate: "Dubai",
    fromPrice: "AED 42M",
    tags: ["EXCLUSIVE", "FOR SALE"],
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=1100&fit=crop&auto=format",
  },
  {
    slug: "signature-villa-palm-jumeirah",
    title: "Signature Beachfront Villa",
    location: "Palm Jumeirah",
    emirate: "Dubai",
    fromPrice: "AED 28.5M",
    tags: ["EXCLUSIVE", "FOR SALE"],
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&h=1100&fit=crop&auto=format",
  },
  {
    slug: "emirates-hills-mansion-grand",
    title: "Grand Mansion — Emirates Hills",
    location: "Emirates Hills",
    emirate: "Dubai",
    fromPrice: "AED 68M",
    tags: ["EXCLUSIVE"],
    imageUrl: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=900&h=1100&fit=crop&auto=format",
  },
  {
    slug: "residence-difc-3bed",
    title: "3-Bedroom Residence — DIFC",
    location: "DIFC",
    emirate: "Dubai",
    fromPrice: "AED 9.8M",
    tags: ["EXCLUSIVE", "FOR SALE"],
    imageUrl: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=900&h=1100&fit=crop&auto=format",
  },
];

export default function ExclusivePropertiesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.querySelectorAll("[data-card]");
    const firstCard = cards[0] as HTMLElement | undefined;
    const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 400;
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
    setPage((p) => Math.max(0, Math.min(EXCLUSIVE.length - 1, p + dir)));
  };

  return (
    <section className="py-28 bg-[#f7f6f3]">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-pg-dark">
              Exclusive Properties From Top Developers
            </h2>
          </div>
          <Link
            href="/properties?availability=for_sale"
            className="hidden md:flex items-center gap-2 text-[13px] font-semibold text-pg-dark hover:text-pg-gold transition-colors whitespace-nowrap"
          >
            View All Properties <ChevronRight size={14} />
          </Link>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {EXCLUSIVE.map((p) => (
            <Link
              key={p.slug}
              data-card
              href={`/properties/${p.slug}`}
              className="group relative shrink-0 w-[calc(33.333%-11px)] min-w-[260px] aspect-[7/4] rounded-sm overflow-hidden snap-start"
            >
              <Image
                src={p.imageUrl}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 90vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Tags */}
              <div className="absolute top-4 left-4 flex gap-1.5">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white text-pg-dark text-[11px] font-semibold px-2.5 py-1 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Content */}
              <div className="absolute bottom-0 inset-x-0 p-5">
                <div className="flex items-center gap-1 mb-2">
                  <MapPin size={11} className="text-white/60 shrink-0" />
                  <span className="text-white/60 text-xs">{p.location}, {p.emirate}</span>
                </div>
                <h3 className="font-heading font-bold text-white text-[15px] leading-tight mb-2">
                  {p.title}
                </h3>
                <p className="text-white/70 text-xs">
                  From <span className="font-semibold text-white text-sm">{p.fromPrice}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-pg-muted">
            {String(page + 1).padStart(2, "0")} / {String(EXCLUSIVE.length).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-3">
            <div className="hidden md:block w-48 h-px bg-gray-300 relative overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 bg-pg-dark transition-all duration-300"
                style={{ width: `${((page + 1) / EXCLUSIVE.length) * 100}%` }}
              />
            </div>
            <button
              onClick={() => scroll(-1)}
              disabled={page === 0}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-pg-dark transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll(1)}
              disabled={page >= EXCLUSIVE.length - 1}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-pg-dark transition-colors disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
