"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type Interest = "Buy" | "Sell" | "Rent" | "Invest";

const INTERESTS: Interest[] = ["Buy", "Sell", "Rent", "Invest"];

const AREAS = [
  "Muscat Hills",
  "Al Mouj (The Wave)",
  "Shatti Al Qurum",
  "Madinat Al Sultan Qaboos",
  "Al Khuwair",
  "Bausher",
  "Qurum",
  "Muttrah",
  "Salalah",
  "Duqm",
];

const BUDGETS = [
  "Under OMR 50K",
  "OMR 50K – 100K",
  "OMR 100K – 200K",
  "OMR 200K – 500K",
  "OMR 500K+",
];

interface Props {
  initialLand?: boolean;
}

export default function CTASection({ initialLand = false }: Props) {
  const [interest, setInterest] = useState<Interest>("Buy");
  const [landChecked, setLandChecked] = useState(initialLand);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* Left: copy */}
          <div className="md:pt-4">
            <p className="text-pg-muted text-[11px] font-semibold uppercase tracking-[0.2em] mb-5">
              Get in Touch
            </p>
            <h2 className="font-heading font-medium text-4xl md:text-5xl leading-[1.05] text-pg-dark mb-6">
              Looking to buy, sell, or invest in property?
            </h2>
            <p className="text-pg-body text-[15px] leading-relaxed mb-8 max-w-sm">
              Tell us what you&apos;re looking for and our team will help you find
              the right opportunity in Oman. Whether you&apos;re searching for a home,
              listing a property, or exploring investment options, we&apos;re here
              to guide you.
            </p>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
              <span className="text-[13px] text-pg-muted">
                Our team will get back to you within 24 hours.
              </span>
            </div>
          </div>

          {/* Right: form card */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-14 gap-4 text-center">
                <CheckCircle2 size={44} className="text-emerald-500" />
                <h3 className="font-heading text-xl text-pg-dark">Thank you!</h3>
                <p className="text-pg-muted text-sm">We&apos;ll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name */}
                <div>
                  <label className="block text-[11px] font-semibold text-pg-dark uppercase tracking-wide mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-pg-body placeholder:text-pg-muted focus:outline-none focus:border-pg-dark transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-semibold text-pg-dark uppercase tracking-wide mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-pg-body placeholder:text-pg-muted focus:outline-none focus:border-pg-dark transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[11px] font-semibold text-pg-dark uppercase tracking-wide mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-pg-body placeholder:text-pg-muted focus:outline-none focus:border-pg-dark transition-colors"
                  />
                </div>

                {/* Interest radios + Land checkbox */}
                <div>
                  <label className="block text-[11px] font-semibold text-pg-dark uppercase tracking-wide mb-2.5">
                    I&apos;m Interested In
                  </label>
                  <div className="flex gap-5 flex-wrap">
                    {INTERESTS.map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="interest"
                          value={opt}
                          checked={interest === opt}
                          onChange={() => setInterest(opt)}
                          className="accent-pg-dark w-4 h-4"
                        />
                        <span className="text-[13px] text-pg-body">{opt}</span>
                      </label>
                    ))}
                    {/* Land — circle toggle matching radio look */}
                    <label
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setLandChecked((v) => !v)}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${landChecked ? "border-pg-dark" : "border-gray-400"}`}>
                        {landChecked && <span className="w-2 h-2 rounded-full bg-pg-dark block" />}
                      </span>
                      <span className="text-[13px] text-pg-body">Land &amp; Investment</span>
                    </label>
                  </div>
                </div>

                {/* Area + Budget */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-pg-dark uppercase tracking-wide mb-1.5">
                      Preferred Area
                    </label>
                    <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-pg-muted focus:outline-none focus:border-pg-dark transition-colors bg-white">
                      <option value="">Select preferred area</option>
                      {AREAS.map((a) => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-pg-dark uppercase tracking-wide mb-1.5">
                      Budget Range
                    </label>
                    <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-pg-muted focus:outline-none focus:border-pg-dark transition-colors bg-white">
                      <option value="">Select budget range</option>
                      {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] font-semibold text-pg-dark uppercase tracking-wide mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us more about your needs..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-pg-body placeholder:text-pg-muted focus:outline-none focus:border-pg-dark transition-colors resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-pg-dark text-white text-[13px] font-semibold py-3.5 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Submit Enquiry <ArrowRight size={14} />
                </button>

                <p className="text-center text-[11px] text-pg-muted">
                  🔒 Your information is secure and confidential.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
