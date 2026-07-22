"use client";

import { useState, useEffect, useRef } from "react";
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

// How many seconds of the clip to use for the scroll animation
const CLIP_SECONDS = 7;

function mapRange(v: number, a: number, b: number, c: number, d: number): number {
  return c + (d - c) * Math.max(0, Math.min(1, (v - a) / (b - a)));
}

export default function Hero() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("buy");
  const [q, setQ] = useState("");
  const [videoReady, setVideoReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const uiRef       = useRef<HTMLDivElement>(null);
  const hintRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const el    = containerRef.current;
      const video = videoRef.current;
      if (!el) return;

      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const p = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / scrollable));

      // Scrub the video to the exact frame for this scroll position.
      if (video && video.readyState >= 2) {
        video.currentTime = p * CLIP_SECONDS;
      }

      // Ease-out curve makes the UI reveal feel natural rather than mechanical
      const eased = (t: number) => 1 - Math.pow(1 - t, 2);
      const uiP = eased(mapRange(p, 0.76, 0.98, 0, 1));

      // Hero UI (heading + search) slides up from below — wider window, eased
      if (uiRef.current) {
        uiRef.current.style.opacity   = String(uiP);
        uiRef.current.style.transform = `translateY(${(1 - uiP) * 36}px)`;
      }

      // Scroll hint disappears the moment scrolling starts
      if (hintRef.current) {
        hintRef.current.style.opacity = String(mapRange(p, 0, 0.05, 1, 0));
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // set initial state on mount

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (tab === "off-plan") params.set("condition", "off_plan");
    else if (tab === "commercial") params.set("type", "office");
    else params.set("availability", `for_${tab}`);
    if (q) params.set("q", q);
    router.push(`/properties?${params.toString()}`);
  }

  return (
    // 250 vh section — the inner sticky div stays pinned while 150 vh of scroll drives the animation
    <div ref={containerRef} style={{ height: "250vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-stone-950">

        {/* ── Poster image: shown while video is downloading ────────────────
            Uses the pure satellite frame (no baked UI), so the first thing
            visitors see is the clean overhead view.
        ──────────────────────────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: videoReady ? 0 : 1 }}
        >
          <Image
            src="/images/hero-f1.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        {/* ── Scroll-driven video ───────────────────────────────────────────
            preload="auto" ensures the full clip buffers quickly so every
            seek is instant. The video never auto-plays — we drive currentTime
            manually. muted + playsInline are required for mobile browsers.
        ──────────────────────────────────────────────────────────────────── */}
        <video
          ref={videoRef}
          src="/videos/hero-clip.mp4"
          preload="auto"
          muted
          playsInline
          onCanPlayThrough={() => setVideoReady(true)}
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
          style={{ opacity: videoReady ? 1 : 0 }}
        />

        {/* ── Top letterbox gradient ────────────────────────────────────────
            Masks the baked-in navbar that's part of the original video footage
            and gives our transparent Palmgate navbar a dark ground to sit on.
        ──────────────────────────────────────────────────────────────────── */}
        <div className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-black via-black/60 to-transparent pointer-events-none" />

        {/* ── Bottom gradient ───────────────────────────────────────────────
            Keeps the heading and search widget legible against any frame.
        ──────────────────────────────────────────────────────────────────── */}
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

        {/* ── Hero UI: heading + search widget ──────────────────────────────
            Invisible during the cinematic descent, then slides up from the
            bottom as the final city scene settles into place.
        ──────────────────────────────────────────────────────────────────── */}
        <div
          ref={uiRef}
          className="absolute inset-x-0 bottom-0 z-10 py-14 px-6"
          style={{ opacity: 0, transform: "translateY(36px)", willChange: "opacity, transform" }}
        >
          <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
            <div className="w-full max-w-2xl">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] text-white font-medium leading-[1.05] mb-8">
                Find Your Place.
              </h1>

              <div>
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

        {/* ── Scroll hint ────────────────────────────────────────────────────
            Visible only at rest (progress = 0). Fades out immediately when
            the user starts scrolling.
        ──────────────────────────────────────────────────────────────────── */}
        <div
          ref={hintRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 pointer-events-none select-none"
        >
          <span className="text-white/50 text-[11px] tracking-[0.28em] uppercase font-medium">
            Scroll to explore
          </span>
          <svg
            width="16" height="28" viewBox="0 0 16 28"
            fill="none" className="animate-bounce" aria-hidden="true"
          >
            <rect x="1" y="1" width="14" height="22" rx="7"
              stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
            <ellipse cx="8" cy="7" rx="2" ry="3"
              fill="white" fillOpacity="0.5" />
          </svg>
        </div>

      </div>
    </div>
  );
}
