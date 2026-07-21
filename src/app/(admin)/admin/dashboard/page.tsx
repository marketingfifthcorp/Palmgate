import Link from "next/link";
import { Building2, Users, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus } from "@/types/database";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<LeadStatus, string> = {
  new: "bg-blue-50 text-blue-600",
  contacted: "bg-yellow-50 text-yellow-700",
  qualified: "bg-green-50 text-green-700",
  lost: "bg-gray-100 text-gray-500",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: offPlanTotal },
    { count: offPlanPublished },
    { count: readyTotal },
    { count: readyPublished },
    { count: totalLeads },
    { count: newLeads },
    { data: recentLeads },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("condition", "off_plan"),
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("condition", "off_plan").eq("published", true),
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("condition", "ready"),
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("condition", "ready").eq("published", true),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase
      .from("leads")
      .select("id, name, email, source, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const STATS = [
    {
      label: "Off-Plan Properties",
      value: offPlanTotal ?? 0,
      sub: `${offPlanPublished ?? 0} published`,
      icon: Building2,
      href: "/admin/off-plan",
    },
    {
      label: "Secondary Listings",
      value: readyTotal ?? 0,
      sub: `${readyPublished ?? 0} published`,
      icon: Building2,
      href: "/admin/properties",
    },
    {
      label: "Total Leads",
      value: totalLeads ?? 0,
      sub: `${newLeads ?? 0} new`,
      icon: Users,
      href: "/admin/leads",
    },
    {
      label: "New Leads",
      value: newLeads ?? 0,
      sub: "Awaiting response",
      icon: TrendingUp,
      href: "/admin/leads?status=new",
    },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-heading font-semibold text-2xl text-pg-dark">Dashboard</h1>
        <p className="text-pg-muted text-sm mt-0.5">Welcome back.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, sub, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-pg-gold/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-pg-muted text-xs font-medium mb-2">{label}</p>
                <p className="font-heading font-bold text-3xl text-pg-dark">{value}</p>
                <p className="text-pg-muted text-xs mt-1">{sub}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-pg-gold/10 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-pg-gold" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent leads */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-semibold text-pg-dark">Recent Leads</h2>
          <Link
            href="/admin/leads"
            className="text-xs text-pg-gold hover:text-pg-gold-dark transition-colors font-medium"
          >
            View all →
          </Link>
        </div>
        {recentLeads && recentLeads.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-pg-dark">{lead.name}</p>
                  <p className="text-xs text-pg-muted">
                    {lead.email} · {String(lead.source).replace(/_/g, " ")}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[lead.status as LeadStatus]}`}
                >
                  {String(lead.status)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-pg-muted text-sm text-center py-8">No leads yet.</p>
        )}
      </div>
    </div>
  );
}
