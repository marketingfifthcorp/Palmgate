"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { LeadStatus } from "@/types/database";
import { updateLeadStatus } from "@/app/(admin)/admin/actions";

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "lost"];

const STYLE: Record<LeadStatus, string> = {
  new: "border-blue-200 bg-blue-50 text-blue-600",
  contacted: "border-yellow-200 bg-yellow-50 text-yellow-700",
  qualified: "border-green-200 bg-green-50 text-green-700",
  lost: "border-gray-200 bg-gray-100 text-gray-500",
};

export default function LeadStatusSelect({
  id,
  status,
}: {
  id: string;
  status: LeadStatus;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as LeadStatus;
        startTransition(async () => {
          await updateLeadStatus(id, next);
          router.refresh();
        });
      }}
      className={`text-xs font-medium border rounded-full px-2.5 py-1 focus:outline-none transition-opacity cursor-pointer ${STYLE[status]} ${pending ? "opacity-50" : ""}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="capitalize">
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
}
