"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Check } from "lucide-react";

const TABS = [
  { label: "Ready",      conditionKey: "condition", conditionVal: "ready"    },
  { label: "Off Plan",   conditionKey: "condition", conditionVal: "off_plan" },
  { label: "Commercial", conditionKey: "type",      conditionVal: "office"   },
];

export default function PropertiesShowTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const condition = searchParams.get("condition");
  const type = searchParams.get("type");

  function isActive(tab: (typeof TABS)[number]) {
    if (tab.conditionKey === "condition") return condition === tab.conditionVal;
    return type === tab.conditionVal;
  }

  function toggle(tab: (typeof TABS)[number]) {
    const p = new URLSearchParams(searchParams.toString());
    const active = isActive(tab);
    if (active) {
      p.delete(tab.conditionKey);
    } else {
      p.set(tab.conditionKey, tab.conditionVal);
      // clear the other key to avoid conflicting filters
      if (tab.conditionKey === "condition") p.delete("type");
      else p.delete("condition");
    }
    p.delete("page");
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-[12px] text-pg-muted mr-1">Show:</span>
      {TABS.map((tab) => {
        const active = isActive(tab);
        return (
          <button
            key={tab.label}
            onClick={() => toggle(tab)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
              active
                ? "bg-pg-dark text-white border-pg-dark"
                : "border-gray-200 text-pg-muted hover:border-pg-dark hover:text-pg-dark"
            }`}
          >
            {active && <Check size={10} strokeWidth={3} />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
