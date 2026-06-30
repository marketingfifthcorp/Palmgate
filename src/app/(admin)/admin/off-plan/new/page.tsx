import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { createPropertyDraft } from "@/app/(admin)/admin/actions";

export default async function NewOffPlanPage() {
  const { id, error } = await createPropertyDraft("off_plan");

  if (error || !id) {
    return (
      <div className="p-8 max-w-lg">
        <Link
          href="/admin/off-plan"
          className="inline-flex items-center gap-1.5 text-sm text-pg-muted hover:text-pg-dark transition-colors mb-6"
        >
          <ChevronLeft size={14} /> Back to Off-Plan
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex gap-4">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700 text-sm mb-1">Could not create project</p>
            <p className="text-red-600 text-sm">{error ?? "Database not connected."}</p>
            <p className="text-red-500 text-xs mt-2">Check your Supabase credentials in .env.local.</p>
          </div>
        </div>
      </div>
    );
  }

  redirect(`/admin/off-plan/${id}/edit`);
}
