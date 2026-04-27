import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory-50 flex">
      {/* Left brand panel — desktop only */}
      <div
        className="hidden lg:flex flex-col justify-between w-[440px] shrink-0 p-12 relative overflow-hidden grain"
        style={{ background: "linear-gradient(160deg, #1B3A2D 0%, #0f1f16 100%)" }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #f28c18, transparent)" }}
        />
        <div
          className="absolute top-1/3 right-0 w-64 h-64 rounded-full opacity-5 translate-x-1/2"
          style={{ background: "radial-gradient(circle, #f28c18, transparent)" }}
        />

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center rotate-3">
            <span className="text-white font-bold text-sm -rotate-3">LN</span>
          </div>
          <span className="font-display text-xl text-white">LinkNG</span>
        </Link>

        <div className="space-y-6 relative z-10">
          <h2 className="font-display text-4xl text-white leading-tight">
            Every link.<br />
            Every payment.<br />
            <em className="not-italic text-brand-400">One page.</em>
          </h2>
          <p className="text-green-200/60 font-sans text-sm leading-relaxed">
            The link-in-bio built for Nigerian creators. Paystack, WhatsApp,
            bank transfers — all in one place. Priced in Naira.
          </p>

          {/* Testimonial */}
          <div className="border border-white/10 rounded-2xl p-5 space-y-3">
            <p className="text-white/80 font-sans text-sm leading-relaxed italic">
              "I went from sending voice notes with my account number to getting
              paid automatically. LinkNG changed how I work."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-500/40 flex items-center justify-center text-white font-display text-sm">
                T
              </div>
              <div>
                <p className="text-white text-xs font-semibold font-sans">Temi Adeyemi</p>
                <p className="text-white/40 text-xs font-sans">Fashion creator · Lagos</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-white/20 text-xs font-sans relative z-10">
          © {new Date().getFullYear()} LinkNG
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 justify-center">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center rotate-3">
              <span className="text-white font-bold text-xs -rotate-3">LN</span>
            </div>
            <span className="font-display text-lg text-stone-900">LinkNG</span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}
