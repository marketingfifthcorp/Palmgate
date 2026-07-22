"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

export type ExclusiveItem = {
  key: string;
  href: string;
  title: string;
  location: string;
  emirate: string;
  fromPrice: string;
  tags: string[];
  imageUrl: string;
};

export default function ExclusiveCarousel({ items }: { items: ExclusiveItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]") as HTMLElement | null;
    const cardWidth = card ? card.offsetWidth + 16 : 400;
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
    setPage((p) => Math.max(0, Math.min(items.length - 1, p + dir)));
  };

  return (
    <>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {items.map((p) => (
          <Link
            key={p.key}
            data-card
            href={p.href}
            className="group relative shrink-0 w-[calc(33.333%-11px)] min-w-[260px] aspect-[7/4] rounded-sm overflow-hidden snap-start"
          >
            <Image
              src={p.imageUrl}
              alt={p.title}
              fill
              sizes="(max-width: 768px) 90vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

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

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-pg-muted">
          {String(page + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-3">
          <div className="hidden md:block w-48 h-px bg-gray-300 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-pg-dark transition-all duration-300"
              style={{ width: `${((page + 1) / items.length) * 100}%` }}
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
            disabled={page >= items.length - 1}
            className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-pg-dark transition-colors disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
