import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createProperty } from "@/app/(admin)/admin/actions";
import PropertyForm from "@/components/admin/PropertyForm";

export default function NewOffPlanPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/admin/off-plan"
          className="inline-flex items-center gap-1.5 text-sm text-pg-muted hover:text-pg-dark transition-colors mb-4"
        >
          <ChevronLeft size={14} />
          Back to Off-Plan
        </Link>
        <h1 className="font-heading font-semibold text-2xl text-pg-dark">New Off-Plan Project</h1>
        <p className="text-pg-muted text-sm mt-0.5">Fill in the details below, then save to continue with images and unit types.</p>
      </div>

      <PropertyForm
        action={createProperty}
        redirectTo="/admin/off-plan"
        defaultCondition="off_plan"
      />
    </div>
  );
}
