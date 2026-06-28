"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "newsletter", name: email.split("@")[0], email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-sm text-pg-gold font-medium">
        You&apos;re subscribed — watch your inbox!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full md:w-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="flex-1 md:w-72 bg-white/10 border border-white/20 rounded-l-md px-4 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:border-pg-gold"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-pg-gold text-pg-dark font-semibold px-5 py-2.5 text-sm rounded-r-md hover:bg-pg-gold-dark transition-colors whitespace-nowrap disabled:opacity-70"
      >
        {status === "loading" ? "…" : "Subscribe"}
      </button>
      {status === "error" && (
        <p className="absolute mt-10 text-xs text-red-400">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
