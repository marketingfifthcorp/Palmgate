import Link from "next/link";
import { Plus, Layers } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PropertyActions from "@/components/admin/PropertyActions";

export const dynamic = "force-dynamic";

export default async function AdminOffPlanPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("properties")
    .select("id, title, type, price, currency, community, developer, completion_date, published, featured, created_at")
    .eq("condition", "off_plan")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-pg-dark">Off-Plan Projects</h1>
          <p className="text-pg-muted text-sm mt-0.5">{projects?.length ?? 0} projects</p>
        </div>
        <Link
          href="/admin/off-plan/new"
          className="flex items-center gap-2 bg-pg-gold text-pg-dark font-semibold px-5 py-2.5 rounded-lg hover:bg-pg-gold-dark transition-colors text-sm"
        >
          <Plus size={15} />
          New Project
        </Link>
      </div>

      {projects && projects.length > 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-pg-muted uppercase tracking-wider">Project</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-pg-muted uppercase tracking-wider hidden md:table-cell">Developer</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-pg-muted uppercase tracking-wider hidden lg:table-cell">Price From</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-pg-muted uppercase tracking-wider hidden lg:table-cell">Handover</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-pg-muted uppercase tracking-wider">Status</th>
                <th className="px-4 py-3.5 w-32" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-pg-dark text-sm">{p.title}</p>
                    {p.community && (
                      <p className="text-xs text-pg-muted mt-0.5">{String(p.community)}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-xs text-pg-muted">{String(p.developer ?? "—")}</span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-sm font-medium text-pg-dark">
                      {String(p.currency)} {Number(p.price).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-xs text-pg-muted">
                      {p.completion_date
                        ? new Date(String(p.completion_date)).toLocaleDateString("en-AE", {
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full ${
                          p.published ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                      <span className="text-xs text-pg-muted">
                        {p.published ? "Live" : "Draft"}
                      </span>
                      {p.featured && (
                        <span className="ml-1 text-[10px] font-semibold text-pg-gold bg-pg-gold/10 px-1.5 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <PropertyActions
                      id={String(p.id)}
                      published={Boolean(p.published)}
                      featured={Boolean(p.featured)}
                      editHref={`/admin/off-plan/${p.id}/edit`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center">
          <Layers size={32} className="text-gray-200 mx-auto mb-4" />
          <p className="font-heading font-semibold text-pg-dark mb-1">No off-plan projects yet</p>
          <p className="text-pg-muted text-sm mb-6">Add your first development to get started.</p>
          <Link
            href="/admin/off-plan/new"
            className="inline-flex items-center gap-2 bg-pg-gold text-pg-dark font-semibold px-5 py-2.5 rounded-lg hover:bg-pg-gold-dark transition-colors text-sm"
          >
            <Plus size={15} />
            New Project
          </Link>
        </div>
      )}
    </div>
  );
}
