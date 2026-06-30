import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PropertyForm from "@/components/admin/PropertyForm";
import PropertyImageUploader from "@/components/admin/PropertyImageUploader";
import { updateProperty, saveAgentPhoto } from "@/app/(admin)/admin/actions";

type Params = Promise<{ id: string }>;

export default async function EditPropertyPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: property }, { data: images }] = await Promise.all([
    supabase.from("properties").select("*").eq("id", id).single(),
    supabase
      .from("property_images")
      .select("id, storage_path, alt, is_primary, display_order")
      .eq("property_id", id)
      .order("is_primary", { ascending: false })
      .order("display_order"),
  ]);

  if (!property) notFound();

  async function action(data: Parameters<typeof updateProperty>[1]) {
    "use server";
    return updateProperty(id, data);
  }

  async function agentPhotoAction(path: string | null) {
    "use server";
    return saveAgentPhoto(id, path);
  }

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
        <h1 className="font-heading font-semibold text-2xl text-pg-dark">Edit Property</h1>
        <p className="text-pg-muted text-sm mt-0.5">{property.title}</p>
      </div>
      <div className="space-y-8">
        <PropertyImageUploader
          propertyId={id}
          initialImages={(images ?? []) as never}
        />
        <PropertyForm
          initial={property as never}
          action={action}
          propertyId={id}
          onSaveAgentPhoto={agentPhotoAction}
        />
      </div>
    </div>
  );
}
