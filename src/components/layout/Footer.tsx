"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const LINKS = {
  Services: [
    { label: "Residential", href: "/properties?availability=for_sale" },
    { label: "Commercial", href: "/properties?type=office" },
    { label: "Off Plan Developments", href: "/off-plan" },
    { label: "Holiday Homes", href: "/holiday-homes" },
    { label: "Mortgage Services", href: "/mortgages" },
    { label: "Property Management", href: "/property-management" },
  ],
  About: [
    { label: "Meet The Team", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Latest News", href: "/insights" },
  ],
};

const SOCIAL = [
  {
    label: "Facebook",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-white ">

      {/* Top row: newsletter (left) + link columns (right) */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-[2fr_3fr] gap-12 ">
        {/* Newsletter */}
        <div>
          <p className="text-pg-dark font-semibold text-lg mb-1">Stay in the loop</p>
          <p className="text-pg-muted text-sm mb-6">
            Sign up to our weekly newsletter for market updates
          </p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              required
              placeholder="Email Address*"
              className="flex-1 bg-pg-dark text-white text-sm px-4 py-3 rounded-sm placeholder:text-white/50 focus:outline-none"
            />
            <button
              type="submit"
              className="w-11 h-11 bg-pg-dark text-white rounded-sm flex items-center justify-center hover:bg-pg-body transition-colors shrink-0"
            >
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8">
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold text-pg-muted mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-pg-body hover:text-pg-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Middle row: logo (left) + social icons (right) */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between ">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.svg"
            alt="Palmgate"
            width={180}
            height={44}
            className="h-10 w-auto brightness-[0.65]"
          />
        </Link>
        <div className="flex items-center gap-5">
          {SOCIAL.map(({ svg, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="text-pg-dark hover:text-pg-gold transition-colors"
            >
              {svg}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom: legal + copyright + disclaimer */}
      <div className="max-w-7xl mx-auto px-6 pt-3 pb-9">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-pg-muted mb-1">
          <Link href="/complaints" className="hover:text-pg-dark transition-colors">
            Complaints Procedure
          </Link>
          <span>|</span>
          <Link href="/terms" className="hover:text-pg-dark transition-colors">
            Terms &amp; Conditions
          </Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-pg-dark transition-colors">
            Privacy &amp; Cookies
          </Link>
        </div>
        <p className="text-xs text-pg-muted mb-4">Copyright © Palmgate</p>
        <p className="text-xs text-pg-muted/70 max-w-xl leading-relaxed">
          Palmgate Real Estate is a registered real estate brokerage in the Sultanate of Oman.
          All listings, prices, and availability are subject to change without notice. Information
          provided on this website is for general purposes only and does not constitute legal,
          financial, or investment advice.
        </p>
      </div>

    </footer>
  );
}
