import Image from "next/image";
import Link from "next/link";

const MARKETS = [
  {
    country: "Oman",
    city: "Muscat",
    href: "/properties?location=muscat",
    imageUrl: "/images/OMAN.png",
  },
  {
    country: "Zanzibar",
    city: "Stone Town",
    href: "/properties?location=zanzibar",
    imageUrl: "/images/Zanzibar.png",
  },
  {
    country: "Thailand",
    city: "Bangkok",
    href: "/properties?location=bangkok",
    imageUrl: "/images/THAILAND.png",
  },
];

export default function MarketsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-pg-dark">
            Your Doorway To Global Property Investments
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MARKETS.map((m) => (
            <Link
              key={m.country}
              href={m.href}
              className="group relative overflow-hidden rounded-sm aspect-4/3"
            >
              <Image
                src={m.imageUrl}
                alt={m.country}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6">
                <p className="text-white/55 text-[11px] font-medium uppercase tracking-[0.18em] mb-1">
                  {m.city}
                </p>
                <p className="font-heading text-white text-xl font-medium leading-tight">
                  {m.country}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
