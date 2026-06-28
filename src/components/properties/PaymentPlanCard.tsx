import type { PaymentPlan } from "@/types/database";

interface Props {
  plan: PaymentPlan;
  price: number;
  currency: string;
}

const SEGMENTS = [
  { key: "down" as const, label: "Down Payment", color: "bg-pg-dark", dot: "bg-pg-dark" },
  { key: "during" as const, label: "During Construction", color: "bg-pg-gold", dot: "bg-pg-gold" },
  { key: "handover" as const, label: "On Handover", color: "bg-gray-200", dot: "bg-gray-300" },
];

export default function PaymentPlanCard({ plan, price, currency }: Props) {
  return (
    <div className="rounded-2xl p-6" style={{ background: "#FFFCF6", border: "1px solid #DED8CE" }}>
      {/* Progress bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-6 gap-0.5">
        {SEGMENTS.map((s) => (
          <div
            key={s.key}
            className={`${s.color} h-full transition-all`}
            style={{ width: `${plan[s.key]}%` }}
          />
        ))}
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {SEGMENTS.map((s) => (
          <div key={s.key} className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className={`w-2 h-2 rounded-full ${s.dot}`} />
              <span className="text-xs text-pg-muted">{s.label}</span>
            </div>
            <p className="font-heading font-semibold text-pg-dark text-2xl">{plan[s.key]}%</p>
            <p className="text-xs text-pg-muted mt-0.5">
              {currency} {Math.round((price * plan[s.key]) / 100).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
