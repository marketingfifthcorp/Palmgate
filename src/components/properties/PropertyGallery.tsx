"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";

interface GalleryImage {
  url: string;
  thumbnailUrl: string;
  alt: string;
  width?: number;
  height?: number;
}

interface Props {
  images: GalleryImage[];
  title: string;
}

const GRADIENTS = [
  "from-slate-300 to-slate-500",
  "from-sky-300 to-blue-600",
  "from-emerald-300 to-teal-600",
];

export default function PropertyGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const hasImages = images.length > 0;
  const current = images[active];

  function prev() {
    setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  }
  function next() {
    setActive((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  return (
    <>
      {/* Main image */}
      <div className="relative w-full bg-gray-100" style={{ height: "clamp(300px, 55vh, 560px)" }}>
        {hasImages ? (
          <Image
            src={current.url}
            alt={current.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[0]}`} />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Photo count + expand */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          {hasImages && (
            <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
              {active + 1} / {images.length}
            </span>
          )}
          {hasImages && (
            <button
              onClick={() => setLightbox(true)}
              className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="View fullscreen"
            >
              <Expand size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-6 py-3 bg-gray-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === active ? "border-pg-gold" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img.thumbnailUrl || img.url} alt={img.alt} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && hasImages && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <button
            onClick={prev}
            className="absolute left-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="relative w-full max-w-5xl max-h-[85vh] aspect-video mx-16">
            <Image
              src={current.url}
              alt={current.alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button
            onClick={next}
            className="absolute right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={22} />
          </button>
          <span className="absolute bottom-6 text-white/60 text-sm">
            {active + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  );
}
