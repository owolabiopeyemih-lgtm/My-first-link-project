import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ivory-50 overflow-x-hidden">

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center rotate-3">
            <span className="text-white font-bold text-sm -rotate-3">LN</span>
          </div>
          <span className="font-display text-xl text-stone-900">LinkNG</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:block text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors duration-[120ms]"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="btn-primary btn-sm shadow-[0_2px_12px_-2px_rgba(224,106,14,0.35)]"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative px-6 md:px-10 pt-10 pb-28 max-w-7xl mx-auto">
        {/* Background radial glow */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 80% 20%, rgba(242,140,24,0.10) 0%, transparent 65%)",
          }}
        />

        <div className="relative flex flex-col lg:flex-row items-center gap-16">
          {/* Copy */}
          <div className="flex-1 max-w-xl space-y-8">
            {/* Badge */}
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-brand-700 border border-brand-200 bg-brand-50 px-3.5 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                For Nigerian creators
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3 animate-fade-up animation-delay-100">
              <h1 className="text-[3.5rem] sm:text-[4.5rem] leading-[0.95] tracking-tight text-stone-900 font-display">
                One link.<br />
                <em className="not-italic text-brand-600">All your money.</em>
              </h1>
              <p className="text-lg text-stone-500 leading-relaxed max-w-md font-sans">
                Paystack storefronts, WhatsApp orders, bank transfers, Selar products —
                all on a single page. Priced in Naira, not dollars.
              </p>
            </div>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-up animation-delay-200">
              <Link
                href="/signup"
                className="btn-primary text-base px-8 py-3.5 rounded-xl shadow-[0_4px_24px_-4px_rgba(224,106,14,0.45)] hover:shadow-[0_8px_32px_-4px_rgba(224,106,14,0.55)] hover:-translate-y-0.5"
                style={{ transition: "background-color 120ms var(--ease-out-quart), box-shadow 220ms var(--ease-out-quart), transform 200ms var(--ease-spring)" }}
              >
                Claim your link — free
              </Link>
              <Link href="/login" className="btn-secondary text-base px-8 py-3.5 rounded-xl">
                Sign in
              </Link>
            </div>

            {/* Trust line */}
            <p className="text-sm text-stone-400 animate-fade-up animation-delay-300 font-sans">
              No credit card · No forex fees · Your page at{" "}
              <span className="text-brand-600 font-semibold">linkng.co/<em className="not-italic">yourname</em></span>
            </p>

            {/* Logos / social proof strip */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 animate-fade-up animation-delay-400">
              <span className="text-xs text-stone-400 font-medium tracking-wide uppercase">Works with</span>
              {["Paystack", "Selar", "WhatsApp", "OPay", "PalmPay"].map((name) => (
                <span key={name} className="text-xs font-semibold text-stone-400 hover:text-stone-600 transition-colors">
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative shrink-0 animate-fade-up animation-delay-200">
            {/* Floating stat card — top left */}
            <div
              className="absolute -left-10 top-20 bg-white rounded-2xl px-4 py-3 shadow-xl border border-ivory-200 z-20 animate-fade-up animation-delay-300"
              style={{ boxShadow: "0 8px 40px -8px rgba(0,0,0,0.12)" }}
            >
              <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-widest">Today</p>
              <p className="text-2xl font-display text-stone-900 mt-0.5">142</p>
              <p className="text-xs text-stone-500 font-medium">link clicks</p>
            </div>

            {/* Floating stat card — bottom right */}
            <div
              className="absolute -right-6 bottom-24 bg-forest-800 rounded-2xl px-4 py-3 shadow-xl z-20 animate-fade-up animation-delay-400"
              style={{ boxShadow: "0 8px 40px -8px rgba(27,58,45,0.4)" }}
            >
              <p className="text-[10px] text-green-400 font-semibold uppercase tracking-widest">This week</p>
              <p className="text-2xl font-display text-white mt-0.5">₦45k</p>
              <p className="text-xs text-green-300 font-medium">earned via Paystack</p>
            </div>

            {/* Phone shell */}
            <div
              className="relative"
              style={{ width: 288 }}
            >
              {/* Glow behind phone */}
              <div
                className="absolute inset-8 rounded-full blur-3xl opacity-25"
                style={{ background: "radial-gradient(ellipse, #f28c18, #e06a0e)" }}
              />
              {/* Phone body */}
              <div
                className="relative bg-stone-900 rounded-[3rem] p-2.5"
                style={{ boxShadow: "0 32px 80px -12px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.06)" }}
              >
                {/* Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-stone-900 rounded-full z-10" />
                {/* Status bar */}
                <div className="absolute top-5 left-8 right-8 flex justify-between z-10">
                  <span className="text-[9px] text-white/50 font-medium">9:41</span>
                  <span className="text-[9px] text-white/50">●●●</span>
                </div>
                {/* Screen */}
                <div
                  className="rounded-[2.5rem] overflow-hidden"
                  style={{
                    height: 560,
                    background: "linear-gradient(160deg, #fef3c7 0%, #fce7f3 55%, #ede9fe 100%)",
                  }}
                >
                  <div className="flex flex-col items-center pt-16 px-5 gap-3">
                    {/* Avatar */}
                    <div
                      className="w-[70px] h-[70px] rounded-full flex items-center justify-center text-white text-2xl font-display font-bold shadow-lg border-2 border-white"
                      style={{ background: "linear-gradient(135deg, #f97316, #e06a0e)" }}
                    >
                      A
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-sm text-stone-800 font-sans">@adaeze_creates</p>
                      <p className="text-[11px] text-stone-500 font-sans mt-0.5">Content creator · Lagos</p>
                    </div>

                    <div className="w-full space-y-2.5 mt-1">
                      {[
                        { label: "Watch my latest video", bg: "#e06a0e" },
                        { label: "Order via WhatsApp", bg: "#15803d" },
                        { label: "Buy my Lightroom presets", bg: "#e06a0e" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="w-full py-3 px-4 rounded-2xl text-white text-xs font-semibold text-center shadow-sm font-sans"
                          style={{ background: item.bg }}
                        >
                          {item.label}
                        </div>
                      ))}

                      {/* Bank account block */}
                      <div
                        className="w-full py-3 px-4 rounded-2xl text-center font-sans"
                        style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)" }}
                      >
                        <p className="text-[9px] uppercase tracking-widest text-stone-400 font-semibold">Bank transfer</p>
                        <p className="text-lg font-bold font-mono text-stone-800 mt-0.5 tracking-wide">0123 456 7890</p>
                        <p className="text-[10px] text-stone-500">GTBank · Adaeze Obi</p>
                        <p className="text-[9px] text-stone-400 mt-0.5">tap to copy</p>
                      </div>
                    </div>

                    <p className="text-[9px] text-stone-400 mt-2 font-sans">Powered by LinkNG</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider strip ──────────────────────────────────── */}
      <div className="w-full overflow-hidden bg-brand-600 py-3.5 flex gap-0">
        <div className="flex gap-10 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {Array.from({ length: 3 }).flatMap(() =>
            ["Paystack · ", "WhatsApp · ", "Bank Transfer · ", "Selar · ", "OPay · ", "PalmPay · ", "Analytics · ", "Custom Domain · "]
          ).map((item, i) => (
            <span key={i} className="text-sm font-semibold text-white/90 tracking-wide font-sans">{item}</span>
          ))}
        </div>
      </div>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="relative bg-forest-950 grain overflow-hidden">
        <div className="relative px-6 md:px-10 py-24 max-w-7xl mx-auto">
          <div className="mb-16 space-y-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-green-400 font-sans">What you get</p>
            <h2 className="text-4xl md:text-5xl font-display text-white leading-tight max-w-xl">
              Built for how Nigerians actually pay
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-3xl overflow-hidden">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-forest-950 p-8 space-y-4 hover:bg-forest-900 transition-colors duration-[220ms] group"
              >
                <div className="text-3xl">{f.emoji}</div>
                <h3 className="font-display text-xl text-white">{f.title}</h3>
                <p className="text-sm text-green-200/60 leading-relaxed font-sans">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-600 font-sans">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-display text-stone-900">Priced in Naira.</h2>
          <p className="text-lg text-stone-400 font-sans">No dollar fees. No forex surprises. Ever.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={[
                "relative rounded-3xl p-8 space-y-6",
                plan.featured
                  ? "bg-brand-600 text-white shadow-[0_16px_64px_-12px_rgba(224,106,14,0.4)]"
                  : "bg-white border border-ivory-200 shadow-sm",
              ].join(" ")}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-stone-900 text-white text-[11px] font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full font-sans">
                    Most popular
                  </span>
                </div>
              )}

              <div>
                <p className={`text-xs font-semibold tracking-widest uppercase font-sans ${plan.featured ? "text-orange-200" : "text-stone-400"}`}>
                  {plan.name}
                </p>
                <p className={`text-4xl font-display mt-2 ${plan.featured ? "text-white" : "text-stone-900"}`}>
                  {plan.price}
                  {plan.period && (
                    <span className={`text-base font-sans font-normal ${plan.featured ? "text-orange-200" : "text-stone-400"}`}>
                      {plan.period}
                    </span>
                  )}
                </p>
              </div>

              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 font-sans">
                    <span className={`mt-0.5 text-sm shrink-0 ${plan.featured ? "text-orange-200" : "text-brand-500"}`}>✓</span>
                    <span className={`text-sm ${plan.featured ? "text-orange-50" : "text-stone-600"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={[
                  "block w-full text-center text-sm font-semibold py-3 rounded-xl transition-all duration-[120ms] font-sans",
                  plan.featured
                    ? "bg-white text-brand-700 hover:bg-orange-50 active:scale-[0.97]"
                    : "bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.97]",
                ].join(" ")}
                style={{ transition: "background-color 120ms var(--ease-out-quart), transform 150ms var(--ease-spring)" }}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────── */}
      <section className="px-6 md:px-10 pb-24 max-w-7xl mx-auto">
        <div
          className="relative grain rounded-3xl overflow-hidden px-10 py-16 text-center"
          style={{ background: "linear-gradient(135deg, #1B3A2D 0%, #0f2a1e 100%)" }}
        >
          <h2 className="text-4xl md:text-5xl font-display text-white mb-4">
            Your audience is waiting.
          </h2>
          <p className="text-green-200/70 mb-8 font-sans text-lg">
            Claim your link in 30 seconds. No credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold text-base px-8 py-4 rounded-2xl font-sans shadow-[0_4px_24px_-4px_rgba(242,140,24,0.5)] hover:shadow-[0_8px_32px_-4px_rgba(242,140,24,0.6)] hover:-translate-y-0.5 active:scale-[0.97]"
            style={{ transition: "all 200ms var(--ease-out-quart)" }}
          >
            Claim your free link →
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-ivory-200 px-6 md:px-10 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center rotate-3">
              <span className="text-white font-bold text-[10px] -rotate-3">LN</span>
            </div>
            <span className="font-display text-stone-700">LinkNG</span>
          </div>
          <p className="text-sm text-stone-400 font-sans">
            © {new Date().getFullYear()} LinkNG · Made for Nigerian creators
          </p>
          <div className="flex gap-5">
            {["Terms", "Privacy"].map((item) => (
              <a key={item} href="#" className="text-sm text-stone-400 hover:text-stone-700 transition-colors duration-[120ms] font-sans">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}

const FEATURES = [
  {
    emoji: "💳",
    title: "Paystack storefronts",
    desc: "Accept Naira payments directly on your page. Debit cards, bank transfer — all local methods.",
  },
  {
    emoji: "💬",
    title: "WhatsApp with pre-fill",
    desc: "One tap opens WhatsApp with your custom message already typed. Customers arrive ready to buy.",
  },
  {
    emoji: "🏦",
    title: "NUBAN bank display",
    desc: "Show your account number as a tap-to-copy card. No more voice notes with account details.",
  },
  {
    emoji: "📊",
    title: "Nigerian analytics",
    desc: "State-level visitor map, time-of-day heatmap, traffic sources. Data brands actually want to see.",
  },
  {
    emoji: "🎨",
    title: "10 curated themes",
    desc: "From clean minimal to bold dark. Pick your vibe. No designer, no code.",
  },
  {
    emoji: "⚡",
    title: "Fast on any network",
    desc: "SSR-rendered public pages. Loads under 2.5 seconds on 3G — built for Nigerian realities.",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "₦0",
    period: "/mo",
    featured: false,
    features: ["Up to 5 links", "3 basic themes", "30-day analytics", "All payment blocks"],
  },
  {
    name: "Creator",
    price: "₦2,500",
    period: "/mo",
    featured: true,
    features: ["Unlimited links", "All 10 themes", "1-year analytics", "Custom domain", "Priority support"],
  },
  {
    name: "Pro",
    price: "₦6,000",
    period: "/mo",
    featured: false,
    features: ["Everything in Creator", "Tip button", "Paid content gate", "Exportable CSV reports"],
  },
];
