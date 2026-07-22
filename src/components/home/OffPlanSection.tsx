"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { OFF_PLAN_LISTINGS, TAG_STYLES, WHATSAPP_NUMBER } from "@/lib/off-plan-data";

const PAGE_SIZE = 3;

export default function OffPlanSection() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(OFF_PLAN_LISTINGS.length / PAGE_SIZE);
  const items = OFF_PLAN_LISTINGS.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative wave — sits behind the cards */}
      <div className="absolute inset-x-0 top-[70%] -translate-y-1/2 pointer-events-none select-none">
        <Image
          src="/images/bg.png"
          alt=""
          width={1920}
          height={400}
          className="w-full h-auto"
          aria-hidden
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-pg-dark">
            Exculsive Properties From Developers
          </h2>
          <Link
            href="/off-plan"
            className="hidden md:flex items-center gap-2 text-[13px] font-semibold text-pg-dark hover:text-pg-gold transition-colors whitespace-nowrap uppercase tracking-wide"
          >
            See All Developments <ChevronRight size={14} />
          </Link>
        </div>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((p) => (
            <div key={p.slug} className="flex flex-col bg-transparent  rounded-sm overflow-hidden ">
              {/* Image */}
              <Link href={`/off-plan/${p.slug}`} className="relative block aspect-3/2 overflow-hidden group">
                <Image
                  src={p.imageUrl}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Tag chips */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-sm ${TAG_STYLES[tag] ?? "bg-white text-pg-dark"}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>

              {/* Card body */}
              <div className="flex flex-col flex-1 p-4">
                <h3 className="font-heading font-bold text-pg-dark text-base leading-tight mb-1">
                  {p.title}
                </h3>
                <p className="text-pg-body text-sm mb-1">{p.types}</p>
                <p className="text-pg-muted text-xs mb-1">{p.developer}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 mb-4 group/loc w-fit"
                >
                  <MapPin size={11} className="text-pg-muted shrink-0" />
                  <span className="text-xs text-pg-muted group-hover/loc:underline">{p.location}</span>
                </a>

                {/* Stats bar */}
                <div className="mt-auto border  rounded-sm  border-gray-800 divide-x divide-gray-800 py-2  grid grid-cols-3 text-center mb-3">
                  <div className="px-2.5">
                    <p className="text-[10px] text-pg-muted mb-0.5">Starting Price</p>
                    <p className="text-xs font-semibold text-pg-dark">{p.startingPrice}</p>
                  </div>
                  <div className="px-2.5">
                    <p className="text-[10px] text-pg-muted mb-0.5">Bedrooms</p>
                    <p className="text-xs font-semibold text-pg-dark">{p.bedrooms}</p>
                  </div>
                  <div className="px-2.5">
                    <p className="text-[10px] text-pg-muted mb-0.5">Handover</p>
                    <p className="text-xs font-semibold text-pg-dark">{p.handover}</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi, I am interested in ${p.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs font-semibold py-2.5 rounded-sm hover:bg-[#1ebe5d] transition-colors"
                  >
                    <svg viewBox="0 0 32 32" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M16 0C7.163 0 0 7.163 0 16c0 2.836.74 5.5 2.035 7.818L0 32l8.385-2.012A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.07 22.514c-.334.94-1.956 1.796-2.685 1.91-.686.107-1.553.152-2.505-.158-.578-.19-1.32-.443-2.27-.868-3.996-1.727-6.606-5.76-6.804-6.027-.198-.267-1.615-2.148-1.615-4.098s1.02-2.91 1.382-3.307c.362-.397.79-.497 1.054-.497.264 0 .528.002.76.014.244.012.57-.093.893.68.333.795 1.13 2.745 1.229 2.943.1.198.165.43.033.694-.133.265-.199.43-.396.661-.198.232-.416.518-.594.696-.198.198-.404.413-.174.81.23.397 1.023 1.688 2.197 2.734 1.508 1.34 2.78 1.754 3.177 1.952.397.199.628.166.858-.1.231-.265.99-1.155 1.254-1.552.264-.397.528-.33.89-.199.362.132 2.308 1.088 2.705 1.287.397.198.661.297.76.463.099.166.099.963-.235 1.903z" />
                    </svg>
                    WhatsApp
                  </a>
                  <Link
                    href={`/off-plan/${p.slug}`}
                    className="flex items-center justify-center text-xs font-semibold text-pg-dark border border-pg-dark py-2.5 rounded-sm hover:bg-pg-dark hover:text-white transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <span className="text-sm text-pg-muted">
            {String(page * PAGE_SIZE + 1).padStart(2, "0")} /{" "}
            {String(OFF_PLAN_LISTINGS.length).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-3">
            <div className="hidden md:block w-48 h-px bg-gray-200 relative overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 bg-pg-dark transition-all duration-300"
                style={{ width: `${((page + 1) / totalPages) * 100}%` }}
              />
            </div>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-pg-dark transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-pg-dark transition-colors disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
