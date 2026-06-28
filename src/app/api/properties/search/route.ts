import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PropertyAvailability, PropertyCondition, PropertyType } from "@/types/database";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const type = searchParams.get("type") as PropertyType | null;
  const availability = searchParams.get("availability") as PropertyAvailability | null;
  const condition = searchParams.get("condition") as PropertyCondition | null;
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const beds = searchParams.get("beds");
  const community = searchParams.get("community");
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "12"), 50);
  const offset = (page - 1) * limit;

  try {
    const supabase = await createClient();

    let query = supabase
      .from("properties")
      .select("*, property_images!inner(storage_path, alt, is_primary, width, height)", {
        count: "exact",
      })
      .eq("published", true)
      .eq("property_images.is_primary", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) query = query.eq("type", type);
    if (availability) query = query.eq("availability", availability);
    if (condition) query = query.eq("condition", condition);
    if (minPrice) query = query.gte("price", parseFloat(minPrice));
    if (maxPrice) query = query.lte("price", parseFloat(maxPrice));
    if (beds) query = query.eq("bedrooms", parseInt(beds));
    if (community) query = query.ilike("community", `%${community}%`);
    if (q) query = query.textSearch("fts", q, { type: "websearch" });

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        pages: Math.ceil((count ?? 0) / limit),
      },
    });
  } catch (err) {
    console.error("[/api/properties/search]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
