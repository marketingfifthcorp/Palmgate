import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function ForAgentsSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Full-width image */}
        <div className="relative w-full aspect-video overflow-hidden rounded-sm mb-10">
          <Image
            src="/images/home-3.jpg"
            alt="Palmgate team"
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-cover"
          />
        </div>

        {/* Text + buttons */}
        <div className="max-w-3xl">
          <p className="text-[15px] leading-relaxed mb-8">
            <span className="font-semibold text-pg-dark">
              Our team is as diverse as our clients and as driven as our mission. From experienced
              agents and support staff to forward-thinking leaders,{" "}
            </span>
            <span className="text-pg-muted">
              everyone at Palmgate is united in creating meaningful real estate experiences.
            </span>
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/agents"
              className="inline-flex items-center gap-2 bg-pg-dark text-white text-[13px] font-medium px-6 py-3 hover:bg-pg-body transition-colors"
            >
              Learn More About Our Agents <ArrowRight size={13} />
            </Link>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 border border-pg-dark text-pg-dark text-[13px] font-medium px-6 py-3 hover:bg-pg-dark hover:text-white transition-colors"
            >
              Join Our Team <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
