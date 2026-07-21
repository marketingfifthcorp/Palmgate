"use client";

import { useState, useTransition } from "react";
import { MapPin } from "lucide-react";

const PROPERTY_TYPES = ["Apartment", "Villa", "Townhouse", "Penthouse", "Office", "Retail", "Land"];
const CONTACT_TIMES  = ["Morning", "Afternoon", "Evening", "Weekend"];

const inputCls =
  "w-full h-[52px] border border-gray-200 rounded-lg px-4 text-[14px] text-pg-dark placeholder:text-pg-muted bg-white focus:outline-none focus:border-pg-dark transition-colors";
const labelCls =
  "block text-[11px] font-semibold tracking-[0.1em] text-pg-dark uppercase mb-1.5";

export default function SellWithUsForm() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted]    = useState(false);
  const [error, setError]            = useState("");
  const [contactTime, setContactTime] = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", email: "", propertyType: "", propertySize: "", location: "",
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const message = [
      form.propertyType && `Property Type: ${form.propertyType}`,
      form.propertySize && `Size: ${form.propertySize} SQ.FT.`,
      form.location     && `Location: ${form.location}`,
      contactTime       && `Preferred Contact Time: ${contactTime}`,
    ].filter(Boolean).join("\n");

    startTransition(async () => {
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, message, source: "sell_with_us" }),
        });
        if (!res.ok) throw new Error();
        setSubmitted(true);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <p className="font-heading font-semibold text-xl text-pg-dark mb-2">Thank You!</p>
        <p className="text-pg-muted text-sm leading-relaxed">
          One of our specialists will contact you shortly with a personalised market evaluation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full Name */}
      <div>
        <label className={labelCls}>Full Name</label>
        <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)}
          placeholder="Enter your full name" className={inputCls} />
      </div>

      {/* Phone + Email */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Phone Number</label>
          <input type="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)}
            placeholder="+968 XXXX XXXX" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Email Address</label>
          <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)}
            placeholder="example@luxe.com" className={inputCls} />
        </div>
      </div>

      {/* Property Type + Size */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Property Type</label>
          <select value={form.propertyType} onChange={(e) => set("propertyType", e.target.value)}
            className={`${inputCls} appearance-none cursor-pointer`}>
            <option value="">Villa</option>
            {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Property Size</label>
          <div className="relative">
            <input type="number" min="0" value={form.propertySize} onChange={(e) => set("propertySize", e.target.value)}
              placeholder="e.g. 5,000" className={`${inputCls} pr-16`} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-pg-muted font-medium pointer-events-none">
              SQ. FT.
            </span>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className={labelCls}>Location</label>
        <div className="relative">
          <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-pg-muted pointer-events-none" />
          <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)}
            placeholder="Search District or Neighborhood" className={`${inputCls} pl-10`} />
        </div>
      </div>

      {/* Preferred Contact Time */}
      <div>
        <label className={labelCls}>Preferred Contact Time</label>
        <div className="grid grid-cols-4 gap-2">
          {CONTACT_TIMES.map((t) => (
            <button key={t} type="button" onClick={() => setContactTime(contactTime === t ? "" : t)}
              className={`py-2.5 rounded-lg text-[13px] font-medium border transition-colors ${
                contactTime === t
                  ? "bg-pg-dark text-white border-pg-dark"
                  : "border-gray-200 text-pg-body hover:border-pg-dark hover:text-pg-dark"
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-[13px]">{error}</p>}

      <button type="submit" disabled={isPending}
        className="w-full h-14 bg-pg-dark text-white text-[14px] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60">
        {isPending ? "Sending…" : "Get a Free Consultation"}
      </button>
    </form>
  );
}
