import { createClient } from "@/lib/supabase/server";
import LeadStatusSelect from "@/components/admin/LeadStatusSelect";
import type { LeadStatus, LeadSource } from "@/types/database";
import Link from "next/link";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ status?: string; source?: string }>;

const SOURCE_LABELS: Record<string, string> = {
  contact_form: "Contact Form",
  property_inquiry: "Property Inquiry",
  sell_with_us: "Sell With Us",
  newsletter: "Newsletter",
};

const STATUS_STYLE: Record<LeadStatus, string> = {
  new: "bg-blue-50 text-blue-600 border-blue-100",
  contacted: "bg-yellow-50 text-yellow-700 border-yellow-100",
  qualified: "bg-green-50 text-green-700 border-green-100",
  lost: "bg-gray-100 text-gray-500 border-gray-200",
};

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "lost"];

export default async function AdminLeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const { status: statusFilter, source: sourceFilter } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("leads")
    .select("id, name, email, phone, source, status, message, created_at")
    .order("created_at", { ascending: false });

  if (statusFilter && STATUSES.includes(statusFilter as LeadStatus)) {
    query = query.eq("status", statusFilter as LeadStatus);
  }
  if (sourceFilter) {
    query = query.eq("source", sourceFilter as LeadSource);
  }

  const { data: leads } = await query;

  function filterLink(params: Record<string, string | undefined>) {
    const sp = new URLSearchParams();
    const merged = { status: statusFilter, source: sourceFilter, ...params };
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

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href={filterLink({ status: undefined })}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
            !statusFilter
              ? "bg-pg-dark text-white border-pg-dark"
              : "border-gray-200 text-pg-muted hover:border-gray-300"
          }`}
        >
          All statuses
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={filterLink({ status: s })}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors capitalize ${
              statusFilter === s
                ? "bg-pg-dark text-white border-pg-dark"
                : "border-gray-200 text-pg-muted hover:border-gray-300"
            }`}
          >
            {s}
          </Link>
        ))}
        <span className="w-px bg-gray-200 mx-1" />
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
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-pg-muted uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-pg-muted uppercase tracking-wider hidden md:table-cell">
                  Source
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-pg-muted uppercase tracking-wider hidden lg:table-cell">
                  Message
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-pg-muted uppercase tracking-wider hidden sm:table-cell">
                  Date
                </th>
                <th className="px-4 py-3.5 text-xs font-semibold text-pg-muted uppercase tracking-wider text-left">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-pg-dark">{lead.name}</p>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-xs text-pg-muted hover:text-pg-gold transition-colors"
                    >
                      {lead.email}
                    </a>
                    {lead.phone && (
                      <p className="text-xs text-pg-muted mt-0.5">{String(lead.phone)}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-xs text-pg-muted">
                      {SOURCE_LABELS[String(lead.source)] ?? String(lead.source)}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell max-w-xs">
                    <p className="text-xs text-pg-muted truncate">
                      {lead.message ? String(lead.message).slice(0, 80) : "—"}
                    </p>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-xs text-pg-muted">
                      {new Date(String(lead.created_at)).toLocaleDateString("en-AE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <LeadStatusSelect
                      id={String(lead.id)}
                      status={lead.status as LeadStatus}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center">
          <p className="font-heading font-semibold text-pg-dark mb-1">No leads found</p>
          <p className="text-pg-muted text-sm">
            {statusFilter || sourceFilter ? "Try removing filters." : "Leads will appear here once submitted."}
          </p>
        </div>
      )}
    </div>
  );
}
