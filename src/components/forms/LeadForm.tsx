"use client";

import { useState } from "react";
import type { LeadSource } from "@/types/database";

interface Props {
  source?: LeadSource;
  propertyId?: string;
  propertyTitle?: string;
  className?: string;
}

export default function LeadForm({
  source = "contact_form",
  propertyId,
  propertyTitle,
  className = "",
}: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          message: form.message || (propertyTitle ? `Inquiry about: ${propertyTitle}` : null),
          property_id: propertyId || null,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-2xl mb-2">✓</p>
        <p className="font-heading font-semibold text-pg-dark text-lg">Thank you!</p>
        <p className="text-sm text-pg-muted mt-1">Our team will be in touch within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-pg-body mb-1.5">Full Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="John Smith"
            className="w-full border border-[#DED8CE] bg-white rounded-lg px-3.5 py-2.5 text-sm text-pg-body placeholder:text-pg-muted focus:outline-none focus:border-pg-gold transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-pg-body mb-1.5">Email Address *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="john@example.com"
            className="w-full border border-[#DED8CE] bg-white rounded-lg px-3.5 py-2.5 text-sm text-pg-body placeholder:text-pg-muted focus:outline-none focus:border-pg-gold transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-pg-body mb-1.5">Phone Number</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="+971 50 000 0000"
          className="w-full border border-[#DED8CE] bg-white rounded-lg px-3.5 py-2.5 text-sm text-pg-body placeholder:text-pg-muted focus:outline-none focus:border-pg-gold transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-pg-body mb-1.5">Message</label>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Tell us about your requirements..."
          className="w-full border border-[#DED8CE] bg-white rounded-lg px-3.5 py-2.5 text-sm text-pg-body placeholder:text-pg-muted focus:outline-none focus:border-pg-gold transition-colors resize-none"
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-pg-dark text-white font-semibold py-3 rounded-full hover:bg-pg-body transition-colors text-sm disabled:opacity-70"
      >
        {status === "loading" ? "Sending…" : "Send Inquiry"}
      </button>
      <p className="text-xs text-pg-muted text-center">
        By submitting you agree to our{" "}
        <a href="/privacy" className="underline hover:text-pg-gold">Privacy Policy</a>.
      </p>
    </form>
  );
}
