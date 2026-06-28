"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

const OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "featured";

  function handleChange(value: string) {
    const p = new URLSearchParams(searchParams.toString());
    p.set("sort", value);
    p.delete("page");
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }

  return (
    <select
      value={sort}
      onChange={(e) => handleChange(e.target.value)}
      className="ml-auto border border-gray-200 bg-white rounded-sm px-3 py-2 text-sm text-pg-body focus:outline-none focus:border-pg-gold cursor-pointer shrink-0"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
