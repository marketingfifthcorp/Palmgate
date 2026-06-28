"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-200">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-5 text-left group"
          >
            <span className="text-[15px] font-medium text-pg-dark group-hover:text-pg-gold transition-colors pr-8">
              {faq.question}
            </span>
            <span className="shrink-0 text-pg-muted group-hover:text-pg-gold transition-colors">
              {open === i ? <Minus size={16} /> : <Plus size={16} />}
            </span>
          </button>

          {/* Smooth grid-rows expand trick — no JS height measurement needed */}
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-pg-muted text-[14px] leading-relaxed pb-5">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
