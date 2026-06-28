const STATS = [
  { value: "500+", label: "Premium Properties" },
  { value: "50+", label: "Partner Developers" },
  { value: "AED 2B+", label: "Transaction Value" },
  { value: "1,000+", label: "Happy Clients" },
];

export default function StatsBar() {
  return (
    <section className="bg-pg-dark py-12">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-start ${
                i > 0 ? "md:border-l md:border-white/10 md:pl-10" : ""
              }`}
            >
              <span className="font-heading font-bold text-4xl md:text-[44px] text-pg-gold leading-none">
                {stat.value}
              </span>
              <span className="text-[13px] text-white/50 mt-2 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
