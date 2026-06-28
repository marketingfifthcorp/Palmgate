"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { PropertyType, PropertyAvailability, PropertyCondition, LeadStatus, PaymentPlan } from "@/types/database";

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
  location_name: string | null;
  community: string | null;
  emirate: string;
  developer: string | null;
  completion_date: string | null;
  payment_plan: PaymentPlan | null;
  amenities: string[];
  featured: boolean;
  published: boolean;
}

export async function createProperty(data: PropertyFormData): Promise<{ error?: string }> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("properties").insert(data as never);
  if (error) return { error: error.message };
  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  return {};
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
