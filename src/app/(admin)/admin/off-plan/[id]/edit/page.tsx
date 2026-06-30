import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PropertyForm from "@/components/admin/PropertyForm";
import PropertyImageUploader from "@/components/admin/PropertyImageUploader";
import OffPlanUnitEditor from "@/components/admin/OffPlanUnitEditor";
import OffPlanFaqsEditor from "@/components/admin/OffPlanFaqsEditor";
import OffPlanBrochureUploader from "@/components/admin/OffPlanBrochureUploader";
import { updateProperty, saveOffPlanExtras } from "@/app/(admin)/admin/actions";
import type { OffPlanExtras, OffPlanUnit, OffPlanFAQ } from "@/types/database";

type Params = Promise<{ id: string }>;

export default async function EditOffPlanPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: images }] = await Promise.all([
    supabase.from("properties").select("*").eq("id", id).eq("condition", "off_plan").single(),
    supabase
      .from("property_images")
      .select("id, storage_path, alt, is_primary, display_order")
      .eq("property_id", id)
      .order("is_primary", { ascending: false })
      .order("display_order"),
  ]);

  if (!project) notFound();

  async function action(data: Parameters<typeof updateProperty>[1]) {
    "use server";
    return updateProperty(id, data);
  }

  async function extrasAction(extras: OffPlanExtras) {
    "use server";
    return saveOffPlanExtras(id, extras);
  }

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
        <h1 className="font-heading font-semibold text-2xl text-pg-dark">Edit Off-Plan Project</h1>
        <p className="text-pg-muted text-sm mt-0.5">{project.title}</p>
      </div>

      <div className="space-y-8 max-w-3xl">

        {/* ── 1. Hero & Gallery Images ────────────────────────────────────── */}
        <div className="space-y-1">
          <p className="text-[11px] text-pg-muted uppercase tracking-widest font-semibold px-1">
            Images — the &ldquo;Cover&rdquo; image is the hero shown at the top of the project page
          </p>
          <PropertyImageUploader
            propertyId={id}
            initialImages={(images ?? []) as never}
          />
        </div>

        {/* ── 2. Brochure PDF ─────────────────────────────────────────────── */}
        <OffPlanBrochureUploader
          propertyId={id}
          initialPath={(project.brochure_path as string | null) ?? null}
          onSave={extrasAction}
        />

        {/* ── 3. Basic project info (title, price, developer, payment plan, location) */}
        <PropertyForm
          initial={project as never}
          action={action}
          redirectTo="/admin/off-plan"
          defaultCondition="off_plan"
        />

        {/* ── 4. Unit Types ───────────────────────────────────────────────── */}
        <OffPlanUnitEditor
          propertyId={id}
          initialUnits={(project.unit_types as OffPlanUnit[] | null) ?? []}
          onSave={extrasAction}
        />

        {/* ── 5. FAQs ─────────────────────────────────────────────────────── */}
        <OffPlanFaqsEditor
          initialFaqs={(project.faqs as OffPlanFAQ[] | null) ?? []}
          onSave={extrasAction}
        />

      </div>
    </div>
  );
}
