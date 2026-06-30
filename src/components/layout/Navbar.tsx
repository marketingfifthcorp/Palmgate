"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Search, User, Globe } from "lucide-react";

const NAV_LINKS = [
  { label: "Listings",     href: "/properties" },
  { label: "Off Plan",     href: "/off-plan" },
  { label: "Sell With Us", href: "/sell-with-us" },
  { label: "Inquire Land", href: "/contact?type=land" },
  { label: "About",        href: "/about" },
  { label: "Contact",      href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const threshold = isHome ? 300 : 4;
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const transparent = isHome && !scrolled;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          transparent
            ? "bg-transparent"
            : "bg-white/95 backdrop-blur-sm shadow-[0_1px_0_0_rgba(0,0,0,0.08)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.svg"
              alt="Palmgate"
              width={140}
              height={36}
              priority
              className={`h-9 w-auto object-contain transition-all duration-500 ${
                transparent ? "brightness-100" : "brightness-[0.65]"
              }`}
            />
          </Link>

          {/* Desktop nav + right actions */}
          <div className="hidden lg:flex items-center gap-6 ml-auto">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[13px] font-medium transition-colors duration-300 ${
                  transparent
                    ? "text-white/85 hover:text-white"
                    : "text-pg-dark/75 hover:text-pg-dark"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <span className={`w-px h-4 transition-colors duration-300 ${transparent ? "bg-white/30" : "bg-gray-200"}`} />

            <Link
              href="/sell-with-us"
              className={`text-[13px] font-medium transition-colors duration-300 whitespace-nowrap ${
                transparent
                  ? "text-white/85 hover:text-white"
                  : "text-pg-dark/75 hover:text-pg-dark"
              }`}
            >
              List your property
            </Link>

            <button
              className={`flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-300 ${
                transparent
                  ? "text-white/85 hover:text-white"
                  : "text-pg-dark/75 hover:text-pg-dark"
              }`}
              aria-label="Select currency"
            >
              <Globe size={14} />
              OMR
              <ChevronDown size={12} />
            </button>

            <button
              className={`transition-colors duration-300 ${
                transparent ? "text-white/85 hover:text-white" : "text-pg-dark/75 hover:text-pg-dark"
              }`}
              aria-label="Search"
            >
              <Search size={17} />
            </button>

            <button
              className={`transition-colors duration-300 ${
                transparent ? "text-white/85 hover:text-white" : "text-pg-dark/75 hover:text-pg-dark"
              }`}
              aria-label="Account"
            >
              <User size={17} />
            </button>

            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className={`transition-colors duration-300 ${
                transparent ? "text-white/85 hover:text-white" : "text-pg-dark/75 hover:text-pg-dark"
              }`}
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Mobile burger */}
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className={`lg:hidden ml-auto transition-colors duration-300 ${
              transparent ? "text-white" : "text-pg-dark"
            }`}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-60 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 z-70 h-full w-75 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-18 border-b border-gray-100">
          <Image
            src="/logo.svg"
            alt="Palmgate"
            width={110}
            height={28}
            className="h-7 w-auto object-contain brightness-[0.65]"
          />
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="text-pg-dark/60 hover:text-pg-dark transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col px-6 py-8 gap-1 flex-1 overflow-y-auto">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[15px] font-medium text-pg-dark py-3 border-b border-gray-50 hover:text-pg-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/sell-with-us"
            onClick={() => setMenuOpen(false)}
            className="text-[15px] font-medium text-pg-dark py-3 border-b border-gray-50 hover:text-pg-gold transition-colors"
          >
            List your property
          </Link>
        </nav>

        <div className="px-6 py-6 border-t border-gray-100 flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-[13px] font-medium text-pg-dark/60 hover:text-pg-dark transition-colors">
            <Globe size={14} />
            OMR
            <ChevronDown size={12} />
          </button>
          <button className="text-pg-dark/60 hover:text-pg-dark transition-colors" aria-label="Search">
            <Search size={17} />
          </button>
          <button className="text-pg-dark/60 hover:text-pg-dark transition-colors" aria-label="Account">
            <User size={17} />
          </button>
        </div>
      </div>
    </>
  );
}
