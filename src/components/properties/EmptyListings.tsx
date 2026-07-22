import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";

interface Props {
  heading?: string;
  subtext?: string;
}

export default function EmptyListings({
  heading = "No Properties Listed Yet",
  subtext = "We're curating new listings for this market. In the meantime, get in touch with our team.",
}: Props) {
  return (
    <div className="py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pg-dark/5 mb-5">
        <Building2 size={28} className="text-pg-dark/30" />
      </div>
      <h3 className="font-heading text-2xl md:text-3xl text-pg-dark mb-3">{heading}</h3>
      <p className="text-pg-muted text-[15px] leading-relaxed mb-6 max-w-md mx-auto">{subtext}</p>
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 bg-pg-dark text-white text-[13px] font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
      >
        Contact Our Team <ArrowRight size={14} />
      </Link>
    </div>
  );
}
