import Link from "next/link";
import Image from "next/image";

const ARTICLES = [
  {
    slug: "dubai-real-estate-market-2025",
    tag: "FEATURED ARTICLE",
    title: "Dubai real estate market hits record high in Q1 2025",
    date: "02 Oct 2025",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=800&fit=crop&auto=format",
  },
  {
    slug: "off-plan-investment-guide",
    tag: "FEATURED ARTICLE",
    title: "The complete guide to off-plan investment in Dubai",
    date: "31 July 2025",
    imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=800&fit=crop&auto=format",
  },
  {
    slug: "palmgate-royal-ascot",
    tag: "FEATURED ARTICLE",
    title: "Palmgate at Royal Ascot — beyond the property",
    date: "03 May 2025",
    imageUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&h=800&fit=crop&auto=format",
  },
];

export default function NewsSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[260px_1fr] gap-12 items-start">

          {/* Left: label + heading + CTA */}
          <div className="flex flex-col gap-6 lg:pt-2">
            <p className="text-pg-muted text-[11px] font-semibold uppercase tracking-[0.2em]">
              News / Media
            </p>
            <h2 className="font-heading font-medium text-3xl text-pg-dark leading-[1.1]">
              Latest news and insights from Palmgate
            </h2>
            <Link
              href="/insights"
              className="self-start border border-pg-dark text-pg-dark text-[11px] font-semibold uppercase tracking-widest px-5 py-2.5 hover:bg-pg-dark hover:text-white transition-colors"
            >
              Explore
            </Link>
          </div>

          {/* Right: article cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ARTICLES.map((article, i) => (
              <Link
                key={article.slug}
                href={`/insights/${article.slug}`}
                className={`group relative overflow-hidden rounded-sm ${
                  i === 1 ? "" : ""
                }`}
                // className={`group relative overflow-hidden rounded-sm ${
                //   i === 1 ? "sm:mt-[-32px]" : ""
                // }`}
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-emerald-500 text-white text-[10px] font-semibold px-2 py-1 uppercase tracking-wide">
                      {article.tag}
                    </span>
                  </div>

                  {/* Bottom text */}
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <p className="text-white text-[13px] font-medium leading-snug mb-2">
                      {article.title}
                    </p>
                    <p className="text-white/60 text-[11px]">{article.date}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
