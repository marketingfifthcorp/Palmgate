import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { LeadSource } from "@/types/database";

const SUBJECT_MAP: Record<LeadSource, string> = {
  contact_form:      "New Contact Form Submission",
  property_inquiry:  "New Property Inquiry",
  sell_with_us:      "New Seller Inquiry",
  newsletter:        "New Newsletter Subscription",
  off_plan_inquiry:  "New Off-Plan Interest",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, name, email, phone, message, property_id } = body;

    if (!source || !name || !email) {
      return NextResponse.json(
        { error: "source, name, and email are required" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { error } = await supabase.from("leads").insert({
      source,
      name,
      email,
      phone: phone || null,
      message: message || null,
      property_id: property_id || null,
      status: "new",
    });

    if (error) throw error;

    // Email sending will be wired up when Resend key is configured
    // const { Resend } = await import("resend");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ ... });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[/api/leads]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
