import { useState, useEffect, useRef } from "react";

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "", duration = 1800 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [visible, target, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Navbar({ onNav }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-[0_1px_20px_rgba(23,37,84,0.08)]" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-[0_4px_10px_rgba(59,130,246,0.35)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <span className="font-heading font-extrabold text-primary-900 text-lg tracking-tight">RunMate</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {["How it Works", "Features", "Why RunMate", "Pricing"].map((l) => (
            <a key={l} href="#" className="text-sm font-semibold text-secondary-500 hover:text-primary-700 transition-colors font-sans">{l}</a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => onNav("login")} className="text-sm font-bold text-primary-700 hover:text-primary-900 font-sans transition-colors px-4 py-2">
            Sign In
          </button>
          <button onClick={() => onNav("signup")} className="bg-primary-900 hover:bg-primary-800 text-white text-sm font-bold font-sans px-5 py-2.5 rounded-xl transition-all hover:shadow-[0_4px_14px_rgba(23,37,84,0.25)]">
            Get Started →
          </button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(m => !m)} className="md:hidden p-2">
          <div className="space-y-1.5">
            <span className={`block w-5 h-0.5 bg-primary-900 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-primary-900 transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-primary-900 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-secondary-100 px-6 py-4 space-y-3">
          {["How it Works", "Features", "Why RunMate"].map((l) => (
            <a key={l} href="#" className="block text-sm font-semibold text-secondary-500 py-1.5 font-sans">{l}</a>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={() => onNav("login")} className="flex-1 text-sm font-bold border border-secondary-200 rounded-xl py-2.5 text-primary-700 font-sans">Sign In</button>
            <button onClick={() => onNav("signup")} className="flex-1 text-sm font-bold bg-primary-900 text-white rounded-xl py-2.5 font-sans">Get Started</button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onNav }) {
  return (
    <section className="relative min-h-screen bg-primary-900 overflow-hidden flex items-center pt-16">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-10 blur-[80px]"
        style={{ background: "radial-gradient(circle, #3B82F6, transparent)" }} />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-8 blur-[100px]"
        style={{ background: "radial-gradient(circle, #F97316, transparent)" }} />

      {/* Floating delivery card mockup */}
      <div className="absolute right-[10%] lg:right-[35%] top-[75%] -translate-y-1/2 block animate-float">
        <div className="w-72 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/60 font-sans uppercase tracking-widest">Live Orders</span>
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>
          {[
            { id: "ORD-042", name: "Claudine M.", status: "DELIVERED", color: "bg-green-500/20 text-green-400" },
            { id: "ORD-043", name: "Eric N.", status: "OUT FOR DELIVERY", color: "bg-orange-500/20 text-orange-400" },
            { id: "ORD-044", name: "Sandrine I.", status: "PICKING", color: "bg-amber-500/20 text-amber-400" },
          ].map((o) => (
            <div key={o.id} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2.5">
              <div>
                <p className="text-xs font-bold text-white font-sans">{o.name}</p>
                <p className="text-[10px] text-white/40 font-sans">{o.id}</p>
              </div>
              <span className={`text-[9px] font-bold font-sans px-2 py-1 rounded-lg ${o.color}`}>{o.status}</span>
            </div>
          ))}
          <div className="h-px bg-white/10" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40 font-sans">Today</span>
            <span className="text-sm font-extrabold text-white font-heading">44 / 47 delivered</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-400 to-success rounded-full" style={{ width: "93.6%" }} />
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 bg-white/8 border border-white/12 rounded-full px-4 py-2 mb-8 animate-[fadeUp_0.5s_ease_both]">
            <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse flex-shrink-0" />
            <span className="text-xs font-bold text-white/70 font-sans tracking-wide">Built for modern fulfillment operations</span>
          </div>

          {/* Headline */}
          <h1 className="font-heading font-extrabold text-white leading-[1.05] mb-6 animate-[fadeUp_0.5s_0.1s_ease_both_forwards] opacity-0"
            style={{ fontSize: "clamp(2.8rem, 6vw, 4.5rem)" }}>
            Fulfillment,{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #60A5FA, #93C5FD)" }}>
                orchestrated.
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400/60 to-transparent rounded-full" />
            </span>
          </h1>

          <p className="text-white/60 font-sans text-lg leading-relaxed mb-10 max-w-xl animate-[fadeUp_0.5s_0.2s_ease_both_forwards] opacity-0">
            Runmate gives vendors, runners, dispatchers, and riders one unified platform — from the moment an order is placed to the second it's delivered.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 animate-[fadeUp_0.5s_0.3s_ease_both_forwards] opacity-0">
            <button
              onClick={() => onNav("signup")}
              className="group flex items-center gap-2.5 bg-accent-500 hover:bg-accent-600 text-white font-bold font-sans px-7 py-3.5 rounded-xl transition-all hover:shadow-[0_8px_24px_rgba(249,115,22,0.4)] text-[15px]"
            >
              Start for free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button
              onClick={() => onNav("login")}
              className="flex items-center gap-2 text-white/70 hover:text-white font-semibold font-sans text-[15px] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              See how it works
            </button>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center gap-6 mt-12 animate-[fadeUp_0.5s_0.4s_ease_both_forwards] opacity-0">
            <div className="flex -space-x-2">
              {["bg-primary-400", "bg-accent-500", "bg-success", "bg-primary-300"].map((c, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-primary-900 flex items-center justify-center text-white text-xs font-bold`}>
                  {["R", "V", "D", "K"][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[...Array(5)].map((_, i) => <span key={i} className="text-accent-400 text-sm">★</span>)}
              </div>
              <p className="text-xs text-white/50 font-sans">Trusted by 200+ fulfillment teams</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 20C480 40 240 80 0 40L0 80Z" fill="#F8FAFC" />
        </svg>
      </div>
    </section>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} className="bg-secondary-50 py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: 12000, suffix: "+", label: "Orders processed" },
            { value: 98, suffix: "%", label: "On-time delivery rate" },
            { value: 200, suffix: "+", label: "Active vendors" },
            { value: 4, suffix: " min", label: "Avg. dispatch time" },
          ].map((s) => (
            <div key={s.label} className={`text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "100ms" }}>
              <p className="font-heading text-4xl font-extrabold text-primary-900 leading-none mb-1.5">
                {visible && <Counter target={s.value} suffix={s.suffix} />}
              </p>
              <p className="text-sm text-secondary-400 font-sans font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const [ref, visible] = useReveal();
  const steps = [
    {
      num: "01",
      icon: "📝",
      title: "Vendor Creates Order",
      desc: "Vendor submits customer details, items, delivery location, and payment method. A unique 4-digit delivery code is auto-generated.",
      color: "from-primary-500 to-primary-700",
    },
    {
      num: "02",
      icon: "📦",
      title: "Runner Picks & Packs",
      desc: "Runner receives the order in their interface, confirms picking of each item, and marks the order as packed and ready.",
      color: "from-amber-400 to-orange-500",
    },
    {
      num: "03",
      icon: "🚀",
      title: "Dispatcher Assigns Rider",
      desc: "Dispatcher selects an available rider from the fleet, assigns them, and the order moves to Out for Delivery instantly.",
      color: "from-violet-500 to-violet-700",
    },
    {
      num: "04",
      icon: "✅",
      title: "Rider Confirms Delivery",
      desc: "Rider enters the delivery code via USSD or the app. System validates, updates status, and the order is marked Delivered.",
      color: "from-green-400 to-green-600",
    },
  ];

  return (
    <section ref={ref} id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section label */}
        <div className={`mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="text-xs font-extrabold text-primary-500 uppercase tracking-[0.15em] font-sans">How it works</span>
          <h2 className="font-heading text-4xl font-extrabold text-primary-900 mt-2 max-w-lg leading-tight">
            From order to doorstep in four steps
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div
              key={s.num}
              className={`relative transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(100%+8px)] w-[calc(50%-8px)] h-px border-t-2 border-dashed border-secondary-200 z-10" />
              )}

              <div className="bg-secondary-50 hover:bg-white border border-secondary-100 hover:border-primary-100 rounded-2xl p-6 hover:shadow-card transition-all duration-300 group">
                {/* Number + icon */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-105 transition-transform`}>
                    {s.icon}
                  </div>
                  <span className="font-heading text-5xl font-extrabold text-secondary-100 leading-none group-hover:text-secondary-200 transition-colors">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-primary-900 text-base mb-2">{s.title}</h3>
                <p className="text-sm text-secondary-400 font-sans leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const [ref, visible] = useReveal();
  const features = [
    { icon: "⚡", title: "Real-time status tracking", desc: "Every status change — from picking to delivery — is reflected live across all interfaces." },
    { icon: "📊", title: "Kanban board", desc: "Visual pipeline shows every order's position across all workflow stages at a glance." },
    { icon: "🌍", title: "Trilingual confirmation", desc: "Delivery verification in English, French, and Kinyarwanda — built for local markets." },
    { icon: "🏍️", title: "Rider fleet management", desc: "Track availability, assign deliveries, and monitor active riders all from one screen." },
    { icon: "🔐", title: "Secure delivery codes", desc: "Unique 4-digit codes prevent false delivery confirmations and protect both parties." },
    { icon: "📱", title: "USSD simulation", desc: "Delivery confirmation works even without smartphones — optimized for any device." },
  ];

  return (
    <section ref={ref} className="py-24 bg-secondary-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="text-xs font-extrabold text-primary-500 uppercase tracking-[0.15em] font-sans">Features</span>
          <h2 className="font-heading text-4xl font-extrabold text-primary-900 mt-2 max-w-lg leading-tight">
            Everything a fulfillment team needs
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`bg-white rounded-2xl p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-card transition-all duration-300 group cursor-default ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-heading font-bold text-primary-900 mb-2 text-base">{f.title}</h3>
              <p className="text-sm text-secondary-400 font-sans leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Roles section ────────────────────────────────────────────────────────────
function RolesSection() {
  const [ref, visible] = useReveal();
  const [active, setActive] = useState(0);
  const roles = [
    {
      emoji: "🏪",
      role: "Vendor",
      tagline: "Create orders in seconds",
      desc: "Log customer orders with item lists, delivery location, and payment method. Get a unique delivery code instantly. Track every order's status in real time.",
      features: ["Order creation form", "Real-time status updates", "Auto-generated delivery codes", "Full order history"],
      color: "bg-primary-600",
      light: "bg-primary-50 border-primary-200",
    },
    {
      emoji: "🏃",
      role: "Runner",
      tagline: "Know exactly what to pack",
      desc: "See incoming orders the moment they're created. Follow the item checklist, confirm packing, and advance the order — no confusion, no missed items.",
      features: ["Live order queue", "Interactive item checklist", "One-tap status updates", "Order timeline view"],
      color: "bg-amber-500",
      light: "bg-amber-50 border-amber-200",
    },
    {
      emoji: "📡",
      role: "Dispatcher",
      tagline: "Command your fleet",
      desc: "See all packed orders waiting for dispatch. View real-time rider availability and assign the right rider in one click. Track every active delivery.",
      features: ["Rider fleet overview", "One-click rider assignment", "Live delivery tracking", "Active delivery dashboard"],
      color: "bg-violet-600",
      light: "bg-violet-50 border-violet-200",
    },
    {
      emoji: "🚴",
      role: "Rider",
      tagline: "Confirm delivery anywhere",
      desc: "Enter the customer's delivery code via USSD or the app. Get instant confirmation in your language. No paperwork, no calls — just deliver and confirm.",
      features: ["USSD-style code entry", "English / French / Kinyarwanda", "Instant confirmation", "Delivery history"],
      color: "bg-green-600",
      light: "bg-green-50 border-green-200",
    },
  ];

  const r = roles[active];

  return (
    <section ref={ref} className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`mb-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="text-xs font-extrabold text-primary-500 uppercase tracking-[0.15em] font-sans">Built for every role</span>
          <h2 className="font-heading text-4xl font-extrabold text-primary-900 mt-2 leading-tight">
            One platform, four interfaces
          </h2>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {roles.map((r, i) => (
            <button
              key={r.role}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold font-sans transition-all border ${active === i ? `${r.color} text-white border-transparent shadow-lg` : "bg-secondary-50 border-secondary-200 text-secondary-500 hover:border-secondary-300"}`}
            >
              <span>{r.emoji}</span>
              {r.role}
            </button>
          ))}
        </div>

        {/* Content */}
        <div key={active} className="grid lg:grid-cols-2 gap-10 items-center animate-[fadeUp_0.3s_ease_both]">
          <div>
            <p className={`text-xs font-extrabold uppercase tracking-[0.15em] font-sans mb-2`} style={{ color: ["#2563EB", "#F59E0B", "#7C3AED", "#16A34A"][active] }}>
              {r.emoji} {r.role}
            </p>
            <h3 className="font-heading text-3xl font-extrabold text-primary-900 mb-4 leading-tight">{r.tagline}</h3>
            <p className="text-secondary-400 font-sans text-base leading-relaxed mb-6">{r.desc}</p>
            <ul className="space-y-2.5">
              {r.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm font-semibold text-primary-800 font-sans">
                  <span className={`w-5 h-5 rounded-md ${r.color} flex items-center justify-center text-white flex-shrink-0`}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual mockup */}
          <div className={`rounded-2xl border-2 ${r.light} p-6`}>
            <div className="bg-white rounded-xl shadow-card p-5 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-secondary-100">
                <div className={`w-9 h-9 rounded-xl ${r.color} flex items-center justify-center text-lg`}>{r.emoji}</div>
                <div>
                  <p className="font-bold text-primary-900 text-sm font-sans">{r.role} Dashboard</p>
                  <p className="text-xs text-secondary-300 font-sans">Live view</p>
                </div>
                <span className="ml-auto w-2 h-2 rounded-full bg-success animate-pulse" />
              </div>
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-3 bg-secondary-50 rounded-xl px-3 py-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-secondary-200 flex items-center justify-center text-sm">📦</div>
                  <div className="flex-1">
                    <div className="h-2.5 bg-secondary-200 rounded-full w-24 mb-1.5" />
                    <div className="h-2 bg-secondary-100 rounded-full w-16" />
                  </div>
                  <div className="h-5 w-16 rounded-full bg-primary-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTASection({ onNav }) {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} className="py-24 bg-primary-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035]" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10 blur-[80px]"
        style={{ background: "radial-gradient(circle, #F97316, transparent)" }} />

      <div className={`max-w-2xl mx-auto px-6 text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <span className="text-xs font-extrabold text-accent-400 uppercase tracking-[0.15em] font-sans">Get started today</span>
        <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-white mt-3 mb-5 leading-tight">
          Ready to streamline your fulfillment?
        </h2>
        <p className="text-white/60 font-sans text-lg mb-10 leading-relaxed">
          Join hundreds of fulfillment teams across Rwanda and beyond using Runmate to deliver faster, smarter, and with full visibility.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNav("signup")}
            className="bg-accent-500 hover:bg-accent-600 text-white font-bold font-sans px-8 py-4 rounded-xl text-base transition-all hover:shadow-[0_8px_30px_rgba(249,115,22,0.45)]"
          >
            Create free account →
          </button>
          <button
            onClick={() => onNav("login")}
            className="border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-bold font-sans px-8 py-4 rounded-xl text-base transition-all"
          >
            Sign in
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-primary-900 border-t border-white/8 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <span className="font-heading font-extrabold text-white text-base">Runmate</span>
          </div>
          <p className="text-xs text-white/30 font-sans text-center">
            © {new Date().getFullYear()} Runmate - Built for modern logistics teams.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Support"].map((l) => (
              <a key={l} href="#" className="text-xs text-white/40 hover:text-white/70 font-sans transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(-50%) translateY(0px); }
          50% { transform: translateY(-50%) translateY(-16px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
      <Navbar onNav={onNavigate} />
      <Hero onNav={onNavigate} />
      <StatsBar />
      <HowItWorks />
      <Features />
      <RolesSection />
      <CTASection onNav={onNavigate} />
      <Footer />
    </div>
  );
}
