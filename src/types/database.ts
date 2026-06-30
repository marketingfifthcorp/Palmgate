// ============================================================
// Palmgate Database Types
// Replace this file with: npx supabase gen types typescript --local
// once Supabase project is set up
// ============================================================

export type PropertyType =
  | "apartment"
  | "villa"
  | "townhouse"
  | "penthouse"
  | "office"
  | "land";

export type PropertyAvailability = "for_sale" | "for_rent";
export type PropertyCondition = "ready" | "off_plan";

export type LeadSource =
  | "contact_form"
  | "property_inquiry"
  | "sell_with_us"
  | "newsletter"
  | "off_plan_inquiry";

export type LeadStatus = "new" | "contacted" | "qualified" | "lost";

export interface PaymentPlan {
  down: number;
  during: number;
  handover: number;
}

export interface OffPlanUnit {
  id: string;
  type: string;        // "Studio", "1 Bedroom", "2 Bedroom", etc.
  title: string;
  description: string;
  image_path: string;  // Supabase storage path
}

export interface OffPlanFAQ {
  question: string;
  answer: string;
}

export interface OffPlanExtras {
  brochure_path?: string | null;
  unit_types?: OffPlanUnit[] | null;
  faqs?: OffPlanFAQ[] | null;
}

// Row types (what comes back from SELECT)
export interface PropertyRow {
  id: string;
  slug: string;
  title: string;
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
  has_terrace: boolean | null;
  location_name: string | null;
  community: string | null;
  emirate: string;
  lat: number | null;
  lng: number | null;
  developer: string | null;
  completion_date: string | null;
  payment_plan: PaymentPlan | null;
  amenities: string[];
  brochure_path: string | null;
  unit_types: OffPlanUnit[] | null;
  faqs: OffPlanFAQ[] | null;
  agent_name: string | null;
  agent_title: string | null;
  agent_phone: string | null;
  agent_photo_path: string | null;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyImageRow {
  id: string;
  property_id: string;
  storage_path: string;
  alt: string | null;
  is_primary: boolean;
  display_order: number;
  width: number | null;
  height: number | null;
}

export interface LeadRow {
  id: string;
  source: LeadSource;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  property_id: string | null;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface SiteContentRow {
  key: string;
  value: string;
  updated_at: string;
}

// Convenience aliases
export type Property = PropertyRow;
export type PropertyImage = PropertyImageRow;
export type Lead = LeadRow;
export type SiteContent = SiteContentRow;
export type PropertyWithImage = Property & { property_images: PropertyImage[] };

// ============================================================
// Supabase Database generic — must match GenericSchema shape
// ============================================================

type Rel = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type T<Row extends Record<string, unknown>, Insert extends Record<string, unknown>, Update extends Record<string, unknown>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Rel[];
};

type PropertyInsert = {
  id?: string;
  slug: string;
  title: string;
  description?: string | null;
  type: PropertyType;
  availability: PropertyAvailability;
  condition: PropertyCondition;
  price: number;
  currency?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area_sqft?: number | null;
  year_built?: number | null;
  floor_number?: number | null;
  parking_spaces?: number | null;
  has_terrace?: boolean | null;
  location_name?: string | null;
  community?: string | null;
  emirate?: string;
  lat?: number | null;
  lng?: number | null;
  developer?: string | null;
  completion_date?: string | null;
  payment_plan?: PaymentPlan | null;
  amenities?: string[];
  agent_name?: string | null;
  agent_title?: string | null;
  agent_phone?: string | null;
  agent_photo_path?: string | null;
  featured?: boolean;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
};

type PropertyUpdate = Partial<PropertyInsert>;

type PropertyImageInsert = {
  id?: string;
  property_id: string;
  storage_path: string;
  alt?: string | null;
  is_primary?: boolean;
  display_order?: number;
  width?: number | null;
  height?: number | null;
};

type LeadInsert = {
  id?: string;
  source: LeadSource;
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  property_id?: string | null;
  status?: LeadStatus;
  created_at?: string;
  updated_at?: string;
};

export type Database = {
  public: {
    Tables: {
      properties: T<PropertyRow & Record<string, unknown>, PropertyInsert & Record<string, unknown>, PropertyUpdate & Record<string, unknown>>;
      property_images: T<PropertyImageRow & Record<string, unknown>, PropertyImageInsert & Record<string, unknown>, Partial<PropertyImageInsert> & Record<string, unknown>>;
      leads: T<LeadRow & Record<string, unknown>, LeadInsert & Record<string, unknown>, Partial<LeadInsert> & Record<string, unknown>>;
      site_content: T<SiteContentRow & Record<string, unknown>, SiteContentRow & Record<string, unknown>, Partial<SiteContentRow> & Record<string, unknown>>;
    };
    Views: Record<string, { Row: Record<string, unknown>; Relationships: Rel[] }>;
    Functions: Record<string, { Args: Record<string, unknown>; Returns: unknown }>;
    Enums: {
      property_type: PropertyType;
      property_availability: PropertyAvailability;
      property_condition: PropertyCondition;
      lead_source: LeadSource;
      lead_status: LeadStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
