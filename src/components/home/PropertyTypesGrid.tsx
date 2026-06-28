import Link from "next/link";
import Image from "next/image";

const TYPES = [
  {
    label: "Studios",
    href: "/properties?type=apartment&beds=0",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=600&fit=crop&auto=format",
  },
  {
    label: "Apartments",
    href: "/properties?type=apartment",
    imageUrl: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&h=600&fit=crop&auto=format",
  },
  {
    label: "Villas",
    href: "/properties?type=villa",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=600&fit=crop&auto=format",
  },
  {
    label: "Townhouses",
    href: "/properties?type=townhouse",
    imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=600&fit=crop&auto=format",
  },
  {
    label: "Penthouses",
    href: "/properties?type=penthouse",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=600&fit=crop&auto=format",
  },
  {
    label: "Serviced Apts",
    href: "/properties?type=apartment",
    imageUrl: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&h=600&fit=crop&auto=format",
  },
  {
    label: "Commercial",
    href: "/properties?type=office",
    imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=600&fit=crop&auto=format",
  },
  {
    label: "Duplexes",
    href: "/properties?type=townhouse",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=600&fit=crop&auto=format",
  },
];

export default function PropertyTypesGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-pg-dark uppercase tracking-wide">
              Explore Properties By Type
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
