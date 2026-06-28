"use client";

import { useState, useEffect, useTransition } from "react";
import { X } from "lucide-react";

interface Props {
  projectName: string;
  trigger?: "register" | "callback" | "brochure";
  label?: string;
  className?: string;
}

export default function RegisterInterestModal({ projectName, trigger = "register", label, className }: Props) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const titles: Record<string, string> = {
    register: "Register Your Interest",
    callback: "Request a Callback",
    brochure: "Download Brochure",
  };

  const defaultLabels: Record<string, string> = {
    register: "Register Interest",
    callback: "Request a callback",
    brochure: "Download Brochure",
  };

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            message: `${projectName} — ${titles[trigger]}. ${form.message}`,
            source: "off_plan",
          }),
        });
        setSubmitted(true);
      } catch {
        // fail silently, still show success to user
        setSubmitted(true);
      }
    });
  }

  const inputCls = "w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-pg-dark placeholder:text-pg-muted focus:outline-none focus:border-pg-dark transition-colors";
  const labelCls = "block text-[11px] font-semibold uppercase tracking-widest text-pg-dark mb-1.5";

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {label ?? defaultLabels[trigger]}
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-60 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Modal */}
      <div className={`fixed inset-0 z-70 flex items-center justify-center p-4 pointer-events-none transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}>
        <div className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto transition-transform duration-300 ${open ? "scale-100" : "scale-95"}`}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h3 className="font-heading font-semibold text-pg-dark text-lg">{titles[trigger]}</h3>
              <p className="text-pg-muted text-[12px] mt-0.5">{projectName}</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-pg-muted hover:text-pg-dark transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-heading font-semibold text-pg-dark text-lg mb-2">Thank You!</p>
                <p className="text-pg-muted text-sm">Our team will be in touch with you shortly.</p>
                <button onClick={() => { setOpen(false); setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
                  className="mt-6 text-[13px] text-pg-gold hover:text-pg-gold-dark transition-colors">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)}
                    placeholder="Enter your full name" className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input type="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)}
                      placeholder="+971 XXXX XXXX" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)}
                      placeholder="your@email.com" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Message (optional)</label>
                  <textarea rows={3} value={form.message} onChange={(e) => set("message", e.target.value)}
                    placeholder="Any specific questions?" className={`${inputCls} resize-none`} />
                </div>
                <button type="submit" disabled={isPending}
                  className="w-full py-3.5 bg-pg-dark text-white text-[13px] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60">
                  {isPending ? "Sending…" : titles[trigger]}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
