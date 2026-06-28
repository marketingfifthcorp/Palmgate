import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PropertyForm from "@/components/admin/PropertyForm";
import { createProperty } from "@/app/(admin)/admin/actions";

export default function NewPropertyPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-1.5 text-sm text-pg-muted hover:text-pg-dark transition-colors mb-4"
        >
          <ChevronLeft size={14} />
          Back to Properties
        </Link>
        <h1 className="font-heading font-semibold text-2xl text-pg-dark">New Property</h1>
      </div>
      <PropertyForm action={createProperty} />
    </div>
  );
}
