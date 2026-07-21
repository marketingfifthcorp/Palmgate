import { createClient } from "@/lib/supabase/server";
import LeadsTable from "@/components/admin/LeadsTable";
import type { LeadSource } from "@/types/database";
import Link from "next/link";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ source?: string }>;

const SOURCE_LABELS: Record<string, string> = {
  contact_form:     "Contact Form",
  property_inquiry: "Property Inquiry",
  off_plan_inquiry: "Off-Plan Inquiry",
  sell_with_us:     "Sell With Us",
  newsletter:       "Newsletter",
};

export default async function AdminLeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const { source: sourceFilter } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("leads")
    .select("id, name, email, phone, source, status, message, created_at, property_id")
    .order("created_at", { ascending: false });

  if (sourceFilter) {
    query = query.eq("source", sourceFilter as LeadSource);
  }

  const { data: leads } = await query;

  // Batch-fetch property info for any leads that have a property_id
  const propertyIds = [...new Set((leads ?? []).map((l) => l.property_id).filter(Boolean))] as string[];
  let propertyMap: Record<string, { title: string; slug: string }> = {};
  if (propertyIds.length > 0) {
    const { data: props } = await supabase
      .from("properties")
      .select("id, title, slug")
      .in("id", propertyIds);
    if (props) {
      propertyMap = Object.fromEntries(props.map((p) => [p.id, { title: p.title, slug: p.slug }]));
    }
  }

  function filterLink(params: Record<string, string | undefined>) {
    const sp = new URLSearchParams();
    const merged = { source: sourceFilter, ...params };
    Object.entries(merged).forEach(([k, v]) => { if (v) sp.set(k, v); });
    const s = sp.toString();
    return `/admin/leads${s ? `?${s}` : ""}`;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-pg-dark">Leads</h1>
          <p className="text-pg-muted text-sm mt-0.5">{leads?.length ?? 0} results</p>
        </div>
      </div>

      {/* Source filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href={filterLink({ source: undefined })}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
            !sourceFilter
              ? "bg-pg-dark text-white border-pg-dark"
              : "border-gray-200 text-pg-muted hover:border-gray-300"
          }`}
        >
          All sources
        </Link>
        {Object.entries(SOURCE_LABELS).map(([key, label]) => (
          <Link
            key={key}
            href={filterLink({ source: key })}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              sourceFilter === key
                ? "bg-pg-dark text-white border-pg-dark"
                : "border-gray-200 text-pg-muted hover:border-gray-300"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {leads && leads.length > 0 ? (
        <LeadsTable
          leads={leads as Parameters<typeof LeadsTable>[0]["leads"]}
          propertyMap={propertyMap}
        />
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center">
          <p className="font-heading font-semibold text-pg-dark mb-1">No leads found</p>
          <p className="text-pg-muted text-sm">
            {sourceFilter ? "Try removing filters." : "Leads will appear here once submitted."}
          </p>
        </div>
      )}
    </div>
  );
}
