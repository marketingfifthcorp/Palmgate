"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-pg-dark flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-3xl text-white">Palmgate</h1>
          <p className="text-white/40 text-sm mt-1">Admin Portal</p>
        </div>
        <div className="bg-white rounded-2xl p-8">
          <h2 className="font-heading font-semibold text-pg-dark text-xl mb-6">Sign In</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-pg-body mb-1.5">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-pg-body focus:outline-none focus:border-pg-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-pg-body mb-1.5">Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-pg-body focus:outline-none focus:border-pg-gold transition-colors"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pg-gold text-pg-dark font-semibold py-3 rounded-lg hover:bg-pg-gold-dark transition-colors text-sm mt-1 disabled:opacity-70"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
        <p className="text-center text-white/30 text-xs mt-6">
          <a href="/" className="hover:text-white/60 transition-colors">← Back to site</a>
        </p>
      </div>
    </div>
  );
}
