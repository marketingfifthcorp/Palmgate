import Link from "next/link";
import Image from "next/image";

export default function PrivateOfficeSection() {
  return (
    <section className="grid md:grid-cols-[5fr_6fr] bg-white py-12">
      {/* Left: image as a contained card with padding */}
      <div className="flex items-center px-10 py-10 md:px-14 md:py-14 lg:px-20 lg:py-16">
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm shadow-lg">
          <Image
            src="/images/home-2.png"
            alt="Luxury property in Oman"
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Right: text content */}
      <div className="flex flex-col justify-center px-8 py-10 md:px-10 lg:px-16">
        <h2
          className="font-heading font-semibold text-pg-dark leading-tight mb-6"
          style={{ fontSize: "clamp(22px, 2.6vw, 38px)", letterSpacing: "-0.02em" }}
        >
          Oman&apos;s finest real estate brokerage built to international standards – by people who
          know this country from the inside.
        </h2>
        <p className="text-pg-muted text-[14px] leading-relaxed mb-8 max-w-md">
          We are Palmgate. We were founded on a single conviction: that buyers, sellers, and
          investors in Oman deserve the same calibre of professional advisory that the world&apos;s
          best real estate markets take for granted.
        </p>
        <Link
          href="/about"
          className="inline-flex items-center justify-center self-start px-6 py-2.5 border border-pg-dark text-pg-dark text-[13px] font-medium hover:bg-pg-dark hover:text-white transition-colors"
        >
          Discover more
        </Link>
      </div>
    </section>
  );
}
