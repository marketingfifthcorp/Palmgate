import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SERVICES = [
  {
    key: "buy",
    label: "Buy",
    body: "Buy smarter with expert agents backed by mortgage, legal, and appraisal pros — dialed in to get you the best deal, fast. We've done this over 10,000 times, and we know what wins.",
  },
  {
    key: "sell",
    label: "Sell",
    body: "Sell fast, sell high. Your listing gets pro staging, strategic pricing, constant open houses, and agents who never stop working until the right buyer signs.",
  },
  {
    key: "rent",
    label: "Rent",
    body: "Access hidden rentals before they hit the market through agents who know every landlord in town. With decades of UAE experience, we unlock the best properties first.",
  },
  {
    key: "invest",
    label: "Invest",
    body: "Dubai offers some of the world's strongest rental yields and zero income tax. Our investment team identifies high-ROI opportunities tailored to your goals.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header row */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 items-end">
          <div>
            <p className="text-pg-muted text-[11px] font-semibold uppercase tracking-[0.2em]">
              Services
            </p>
          </div>
          <div>
            <h2 className="font-heading font-medium text-4xl md:text-5xl lg:text-[58px] text-pg-dark leading-[1.0]">
              How Palmgate{" "}
              <span className="text-pg-muted">Can Help You</span>
            </h2>
          </div>
        </div>

        {/* Service rows */}
        <div className="divide-y divide-gray-100">
          {SERVICES.map(({ key, label, body }) => (
            <div
              key={key}
              className="grid md:grid-cols-[0.8fr_3fr] gap-8 items-center py-10 group"
            >
              {/* Left: circle + description */}
              <div className="flex items-start gap-5">
                <span className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0 mt-0.5 group-hover:border-pg-gold transition-colors" />
                <p className="text-pg-body text-[12px] leading-relaxed">{body}</p>
              </div>

              {/* Right: large label — centered */}
              <div className="flex items-center justify-center">
                <span className="font-heading font-medium text-6xl md:text-7xl lg:text-[150px] text-pg-dark leading-none group-hover:text-pg-gold transition-colors duration-300">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 pt-10 border-t border-gray-100">
          <h3 className="font-heading font-medium text-3xl md:text-4xl text-pg-dark leading-[1.1] mb-6 max-w-lg">
            Our certified agents guide you through every stage of real estate
          </h3>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-pg-dark hover:text-pg-gold transition-colors"
          >
            Get Started with PG <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
