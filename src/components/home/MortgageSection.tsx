import Link from "next/link";
import Image from "next/image";

export default function MortgageSection() {
  return (
    <section className="grid md:grid-cols-[1fr_1.3fr]">
      {/* Left: dark content */}
      <div className="bg-pg-dark text-white flex flex-col justify-center px-10 py-16 md:px-16 lg:px-20 order-2 md:order-1">
        <p className="text-white/40 text-[11px] font-medium uppercase tracking-[0.18em] mb-6">
          Land &amp; Investment
        </p>
        <h2 className="font-heading font-medium text-3xl md:text-4xl lg:text-[46px] leading-[1.1] mb-5">
          Looking to buy or sell land?
        </h2>
        <p className="text-white/45 text-[14px] leading-relaxed mb-10 max-w-md">
          From prime plots in emerging communities to fully serviced land in established
          neighbourhoods — our specialists match you with the right opportunity at the right price.
        </p>
        <div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-7 py-2.5 border border-pg-gold text-pg-gold text-[13px] font-medium hover:bg-pg-gold hover:text-white transition-colors"
          >
            Fill the Form
          </Link>
        </div>
      </div>

      {/* Right: white panel with sketch illustration */}
      <div className="bg-white flex items-center justify-center min-h-80 md:min-h-130 order-1 md:order-2 overflow-hidden">
        <div className="relative w-full h-full min-h-80 md:min-h-130">
          <Image
            src="/images/home-1.png"
            alt="Muscat cityscape illustration"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
