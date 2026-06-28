"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goTo(page: number) {
    const p = new URLSearchParams(searchParams.toString());
    p.set("page", page.toString());
    router.replace(`${pathname}?${p.toString()}`, { scroll: true });
  }

  function pageNumbers(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (currentPage > 3) pages.push("…");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  }

  const btnBase =
    "w-9 h-9 rounded-lg border text-sm font-medium flex items-center justify-center transition-colors";

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`${btnBase} border-gray-200 hover:border-pg-gold hover:text-pg-gold disabled:opacity-35 disabled:cursor-not-allowed`}
      >
        <ChevronLeft size={16} />
      </button>

      {pageNumbers().map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="w-9 h-9 flex items-center justify-center text-pg-muted text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p as number)}
            className={`${btnBase} ${
              p === currentPage
                ? "bg-pg-dark border-pg-dark text-white"
                : "border-gray-200 text-pg-body hover:border-pg-gold hover:text-pg-gold"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`${btnBase} border-gray-200 hover:border-pg-gold hover:text-pg-gold disabled:opacity-35 disabled:cursor-not-allowed`}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
