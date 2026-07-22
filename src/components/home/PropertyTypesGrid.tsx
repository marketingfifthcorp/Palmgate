import Link from "next/link";
import Image from "next/image";

const TYPES = [
  {
    label: "Studios",
    href: "/properties?type=apartment&beds=0",
    imageUrl: "/images/studio-home.png",
  },
  {
    label: "Apartments",
    href: "/properties?type=apartment",
    imageUrl: "/images/apartment-home.png",
  },
  {
    label: "Villas",
    href: "/properties?type=villa",
    imageUrl: "/images/villas-home.png",
  },
  {
    label: "Townhouses",
    href: "/properties?type=townhouse",
    imageUrl: "/images/town-home.png",
  },
  {
    label: "Penthouses",
    href: "/properties?type=penthouse",
    imageUrl: "/images/pent-home.png",
  },
  {
    label: "Serviced Apts",
    href: "/properties?type=apartment",
    imageUrl: "/images/serviced-home.png",
  },
  {
    label: "Commercial",
    href: "/properties?type=office",
    imageUrl: "/images/commercial-home.png",
  },
  {
    label: "Duplexes",
    href: "/properties?type=townhouse",
    imageUrl: "/images/duplexes-home.png",
  },
];

export default function PropertyTypesGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-pg-dark">
              Explore Properties by Type
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TYPES.map((type) => (
            <Link
              key={type.label}
              href={type.href}
              className="group relative aspect-square overflow-hidden rounded-sm"
            >
              <Image
                src={type.imageUrl}
                alt={type.label}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4">
                <p className="font-sans font-bold text-white uppercase tracking-wider text-sm">
                  {type.label}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
