"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  PropertyType, PropertyAvailability, PropertyCondition,
  LeadStatus, PaymentPlan, OffPlanUnit, OffPlanFAQ, OffPlanExtras,
} from "@/types/database";

export interface PropertyFormData {
  title: string;
  slug: string;
  description: string | null;
  type: PropertyType;
  availability: PropertyAvailability;
  condition: PropertyCondition;
  price: number;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  year_built: number | null;
  floor_number: number | null;
  parking_spaces: number | null;
  has_terrace: boolean;
  location_name: string | null;
  community: string | null;
  emirate: string;
  lat: number | null;
  lng: number | null;
  developer: string | null;
  completion_date: string | null;
  payment_plan: PaymentPlan | null;
  amenities: string[];
  agent_name: string | null;
  agent_title: string | null;
  agent_phone: string | null;
  featured: boolean;
  published: boolean;
}


export async function createPropertyDraft(condition: PropertyCondition = "ready"): Promise<{ id?: string; error?: string }> {
  const supabase = createServiceClient();
  const { data: row, error } = await supabase
    .from("properties")
    .insert({
      title: condition === "off_plan" ? "New Off-Plan Project" : "New Property",
      slug: `draft-${Date.now()}`,
      type: "apartment",
      availability: "for_sale",
      condition,
      price: 0,
      currency: "OMR",
      emirate: "Muscat",
      amenities: [],
      published: false,
      featured: false,
    } as never)
    .select("id")
    .single();
  if (error) return { error: error.message };
  return { id: (row as { id: string }).id };
}

export async function createProperty(data: PropertyFormData): Promise<{ error?: string; id?: string }> {
  const supabase = createServiceClient();
  const { data: row, error } = await supabase
    .from("properties")
    .insert(data as never)
    .select("id")
    .single();
  if (error) return { error: error.message };
  revalidatePath("/admin/properties");
  revalidatePath("/admin/off-plan");
  revalidatePath("/properties");
  return { id: (row as { id: string }).id };
}

export async function updateProperty(id: string, data: PropertyFormData): Promise<{ error?: string }> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("properties")
    .update({ ...data, updated_at: new Date().toISOString() } as never)
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  return {};
}

export async function togglePublished(id: string, published: boolean) {
  const supabase = createServiceClient();
  await supabase.from("properties").update({ published }).eq("id", id);
  revalidatePath("/admin/properties");
}

export async function toggleFeatured(id: string, featured: boolean) {
  const supabase = createServiceClient();
  await supabase.from("properties").update({ featured }).eq("id", id);
  revalidatePath("/admin/properties");
}

export async function deleteProperty(id: string): Promise<void> {
  const supabase = createServiceClient();
  await supabase.from("properties").delete().eq("id", id);
  revalidatePath("/admin/properties");
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const supabase = createServiceClient();
  await supabase.from("leads").update({ status }).eq("id", id);
  revalidatePath("/admin/leads");
  revalidatePath("/admin/dashboard");
}

export async function addPropertyImage(data: {
  property_id: string;
  storage_path: string;
  alt?: string;
  is_primary?: boolean;
  display_order?: number;
}): Promise<{ error?: string; id?: string }> {
  const supabase = createServiceClient();
  if (data.is_primary) {
    await supabase
      .from("property_images")
      .update({ is_primary: false })
      .eq("property_id", data.property_id);
  }
  const { data: row, error } = await supabase
    .from("property_images")
    .insert(data as never)
    .select("id")
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/admin/properties`);
  revalidatePath(`/properties`);
  return { id: (row as { id: string }).id };
}

export async function deletePropertyImage(id: string, storagePath: string): Promise<{ error?: string }> {
  const supabase = createServiceClient();
  if (!storagePath.startsWith("http")) {
    await supabase.storage.from("properties").remove([storagePath]);
  }
  const { error } = await supabase.from("property_images").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath(`/admin/properties`);
  revalidatePath(`/properties`);
  return {};
}

export async function saveAgentPhoto(id: string, path: string | null): Promise<{ error?: string }> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("properties")
    .update({ agent_photo_path: path } as never)
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath(`/properties`);
  return {};
}

export async function saveOffPlanExtras(id: string, extras: OffPlanExtras): Promise<{ error?: string }> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("properties")
    .update(extras as never)
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/off-plan");
  revalidatePath("/off-plan");
  return {};
}

export async function setPropertyImagePrimary(propertyId: string, imageId: string): Promise<{ error?: string }> {
  const supabase = createServiceClient();
  await supabase.from("property_images").update({ is_primary: false }).eq("property_id", propertyId);
  const { error } = await supabase.from("property_images").update({ is_primary: true }).eq("id", imageId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/properties`);
  revalidatePath(`/properties`);
  return {};
}
