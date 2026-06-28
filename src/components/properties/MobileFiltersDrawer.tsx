"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import FiltersPanel from "./FiltersPanel";

export default function MobileFiltersDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-4 py-2 text-sm font-medium text-pg-body hover:border-pg-gold hover:text-pg-gold transition-colors shrink-0"
      >
        <SlidersHorizontal size={15} />
        Filters
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Close filters"
          />
          <div className="relative ml-auto w-80 max-w-full h-full bg-white overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-semibold text-pg-dark">Filters</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-pg-muted hover:text-pg-dark transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <FiltersPanel />
          </div>
        </div>
      )}
    </>
  );
}
