"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, ChevronDown } from "lucide-react";

type Tab = "buy" | "rent" | "commercial" | "off-plan";

const TABS: { key: Tab; label: string }[] = [
  { key: "buy", label: "Buy" },
  { key: "rent", label: "Rent" },
  { key: "commercial", label: "Commercial" },
  { key: "off-plan", label: "Off Plan" },
];

export default function Hero() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("buy");
  const [q, setQ] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (tab === "off-plan") {
      params.set("condition", "off_plan");
    } else if (tab === "commercial") {
      params.set("type", "office");
    } else {
      params.set("availability", `for_${tab}`);
    }
    if (q) params.set("q", q);
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <section className="relative h-screen min-h-[700px] flex flex-col justify-end overflow-hidden bg-stone-950">
      {/*
        Background photo
        scale-[X]   — zoom level (1.0 = full cover, lower = wider/less cropped)
        objectPosition — focus point: "X% Y%" where 0%=left/top, 50%=center, 100%=right/bottom
      */}
      <Image
        src="/images/hero.png"
        alt="Luxury property Dubai"
        fill
        priority
        className="object-cover scale-[1] origin-center"
        style={{ objectPosition: "20% 50%" }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />

      {/* Content */}
      <div className="relative z-10 py-14 px-6  flex flex-col justify-center ">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
          <div className="w-full max-w-2xl">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] text-white font-medium leading-[1.05] mb-8">
            Find your place.
          </h1>

          {/* Search widget */}
          <div>
            {/* Tabs — float above box, content-width, curved top corners, gapped */}
            <div className="flex gap-1.5">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`px-5 py-2.5 text-[13px] font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                    tab === t.key
                      ? "bg-white text-pg-dark"
                      : "bg-pg-gold text-white hover:bg-pg-gold-dark"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Search box — top-left corner is square when Buy is active so it merges with the tab */}
            <div
              className={`bg-white overflow-hidden shadow-md ${
                tab === "buy" ? "rounded-b-lg rounded-tr-lg" : "rounded-lg"
              }`}
            >
              <form onSubmit={handleSearch} className="flex items-center px-4 py-3.5 gap-3">
                <Search size={16} className="text-pg-muted shrink-0" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Community or building"
                  className="w-full text-[13px] text-pg-body placeholder:text-pg-muted focus:outline-none"
                />
                <button
                  type="button"
                  className="shrink-0 flex items-center gap-1 text-[13px] font-medium text-pg-body px-3 py-1.5 hover:text-pg-dark transition-colors whitespace-nowrap"
                >
                  Filters
                  <ChevronDown size={13} />
                </button>
                <button
                  type="submit"
                  className="shrink-0 w-9 h-9 rounded-full bg-pg-dark flex items-center justify-center hover:bg-pg-body transition-colors"
                  aria-label="Search"
                >
                  <Search size={15} className="text-white" />
                </button>
              </form>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
