"use client";

import { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import Link from "next/link";
import LeadStatusSelect from "./LeadStatusSelect";
import type { LeadStatus } from "@/types/database";

const SOURCE_LABELS: Record<string, string> = {
  contact_form:     "Contact Form",
  property_inquiry: "Property Inquiry",
  off_plan_inquiry: "Off-Plan Inquiry",
  sell_with_us:     "Sell With Us",
  newsletter:       "Newsletter",
};

const STATUS_STYLE: Record<LeadStatus, string> = {
  new:       "bg-blue-50 text-blue-600 border-blue-100",
  contacted: "bg-yellow-50 text-yellow-700 border-yellow-100",
  qualified: "bg-green-50 text-green-700 border-green-100",
  lost:      "bg-gray-100 text-gray-500 border-gray-200",
};

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  status: string;
  message: string | null;
  created_at: string;
  property_id: string | null;
};

type PropertyInfo = { title: string; slug: string };

// Off-plan messages: "ProjectName — RequestType. UserMessage"
function parseOffPlanMessage(message: string | null): { project: string | null; body: string | null } {
  if (!message) return { project: null, body: null };
  const dashIdx = message.indexOf(" — ");
  if (dashIdx === -1) return { project: null, body: message };
  const project = message.slice(0, dashIdx);
  const rest    = message.slice(dashIdx + 3);
  const dotIdx  = rest.indexOf(". ");
  const body    = dotIdx !== -1 ? rest.slice(dotIdx + 2).trim() || null : rest.trim() || null;
  return { project, body };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" });
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-pg-muted mb-0.5">{label}</p>
      <p className="text-sm text-pg-dark">{value}</p>
    </div>
  );
}

interface Props {
  leads: Lead[];
  propertyMap?: Record<string, PropertyInfo>;
}

export default function LeadsTable({ leads, propertyMap = {} }: Props) {
  const [selected, setSelected] = useState<Lead | null>(null);

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-pg-muted uppercase tracking-wider">Contact</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-pg-muted uppercase tracking-wider hidden md:table-cell">Source</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-pg-muted uppercase tracking-wider hidden lg:table-cell">Unit / Property</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-pg-muted uppercase tracking-wider hidden lg:table-cell">Message</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-pg-muted uppercase tracking-wider hidden sm:table-cell">Date</th>
              <th className="px-4 py-3.5 text-xs font-semibold text-pg-muted uppercase tracking-wider text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leads.map((lead) => {
              const isOffPlan = lead.source === "off_plan_inquiry";
              const { project, body } = isOffPlan
                ? parseOffPlanMessage(lead.message)
                : { project: null, body: lead.message };
              const linkedProperty = lead.property_id ? propertyMap[lead.property_id] : null;

              return (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-pg-dark">{lead.name}</p>
                    <a href={`mailto:${lead.email}`} className="text-xs text-pg-muted hover:text-pg-gold transition-colors">
                      {lead.email}
                    </a>
                    {lead.phone && <p className="text-xs text-pg-muted mt-0.5">{lead.phone}</p>}
                  </td>

                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-xs text-pg-muted">{SOURCE_LABELS[lead.source] ?? lead.source}</span>
                  </td>

                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-xs text-pg-muted">{linkedProperty?.title ?? project ?? "—"}</span>
                  </td>

                  <td className="px-4 py-4 hidden lg:table-cell max-w-50">
                    {lead.message ? (
                      <button
                        onClick={() => setSelected(lead)}
                        className="text-xs text-pg-muted hover:text-pg-dark hover:underline text-left truncate block max-w-50 cursor-pointer"
                      >
                        {(body ?? lead.message).slice(0, 60)}
                        {(body ?? lead.message).length > 60 ? "…" : ""}
                      </button>
                    ) : (
                      <span className="text-xs text-pg-muted">—</span>
                    )}
                  </td>

                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-xs text-pg-muted">{formatDate(lead.created_at)}</span>
                  </td>

                  <td className="px-4 py-4">
                    <LeadStatusSelect id={lead.id} status={lead.status as LeadStatus} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Full-detail popup */}
      {selected && (() => {
        const isOffPlan = selected.source === "off_plan_inquiry";
        const { project, body } = isOffPlan
          ? parseOffPlanMessage(selected.message)
          : { project: null, body: selected.message };
        const linkedProperty = selected.property_id ? propertyMap[selected.property_id] : null;

        return (
          <>
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h3 className="font-heading font-semibold text-pg-dark">Lead Details</h3>
                  <button onClick={() => setSelected(null)} className="text-pg-muted hover:text-pg-dark transition-colors">
                    <X size={18} />
                  </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                  <Row label="Name"   value={selected.name} />
                  <Row label="Email"  value={selected.email} />
                  {selected.phone && <Row label="Phone" value={selected.phone} />}
                  <Row label="Source" value={SOURCE_LABELS[selected.source] ?? selected.source} />

                  {/* Listing link — shown when lead came from a specific property page */}
                  {linkedProperty ? (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-pg-muted mb-0.5">
                        Listing
                      </p>
                      <Link
                        href={`/off-plan/${linkedProperty.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-pg-gold hover:underline"
                      >
                        {linkedProperty.title}
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                  ) : project ? (
                    <Row label="Unit / Property" value={project} />
                  ) : null}

                  <Row label="Date" value={formatDate(selected.created_at)} />

                  {(body || selected.message) && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-pg-muted mb-1">Message</p>
                      <p className="text-sm text-pg-dark leading-relaxed whitespace-pre-wrap">
                        {body ?? selected.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        );
      })()}
    </>
  );
}
