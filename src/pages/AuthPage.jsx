import { useState } from "react";
import * as api from "../services/api";

// ─── Shared visual panel ──────────────────────────────────────────────────────
function AuthPanel({ mode }) {
  const isLogin = mode === "login";
  return (
    <div className="hidden lg:flex flex-col justify-between bg-primary-900 relative overflow-hidden p-12 min-h-full">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-[80px]"
        style={{ background: "radial-gradient(circle, #3B82F6, transparent)" }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-[80px]"
        style={{ background: "radial-gradient(circle, #F97316, transparent)" }} />

      {/* Top: Brand */}
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-16">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-[0_4px_10px_rgba(59,130,246,0.4)]">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <span className="font-heading font-extrabold text-white text-lg tracking-tight">RunMate</span>
        </div>

        {/* Headline */}
        <h2 className="font-heading text-4xl font-extrabold text-white leading-tight mb-4">
          {isLogin ? (
            <>Welcome<br />back.</>
          ) : (
            <>Start delivering<br />smarter.</>
          )}
        </h2>
        <p className="text-white/55 font-sans text-base leading-relaxed max-w-xs">
          {isLogin
            ? "Your team is waiting. Jump back in and see what's happening across all your fulfillment workflows."
            : "Set up your fulfillment hub in minutes. Connect vendors, runners, dispatchers, and riders — all in one place."}
        </p>
      </div>

      {/* Middle: Floating order card mockup */}
      <div className="relative z-10 my-8">
        {/* Workflow steps visual */}
        <div className="space-y-3">
          {[
            { label: "Order Created", status: "done", dot: "bg-success", time: "9:02 AM" },
            { label: "Items Picking", status: "done", dot: "bg-success", time: "9:08 AM" },
            { label: "Packed & Ready", status: "done", dot: "bg-success", time: "9:14 AM" },
            { label: "Out for Delivery", status: "active", dot: "bg-accent-500 animate-pulse", time: "9:19 AM" },
            { label: "Delivered", status: "pending", dot: "bg-white/20", time: "—" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="relative flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${s.dot} flex-shrink-0`} />
                {i < 4 && <div className="w-px h-5 bg-white/10 mt-1" />}
              </div>
              <div className="flex items-center justify-between flex-1 bg-white/5 rounded-xl px-3 py-2.5 border border-white/8">
                <span className={`text-sm font-semibold font-sans ${s.status === "pending" ? "text-white/30" : "text-white/80"}`}>
                  {s.label}
                </span>
                <span className="text-xs text-white/35 font-sans">{s.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: Testimonial */}
      <div className="relative z-10">
        <div className="bg-white/8 border border-white/12 rounded-2xl p-5">
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => <span key={i} className="text-accent-400 text-sm">★</span>)}
          </div>
          <p className="text-white/75 font-sans text-sm leading-relaxed mb-4">
            "Runmate cut our average dispatch time from 18 minutes to under 4. Our runners always know what to pack and riders are never waiting."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">A</div>
            <div>
              <p className="text-xs font-bold text-white font-sans">Amina K.</p>
              <p className="text-[10px] text-white/40 font-sans">Operations Lead, KigaliMart</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Eye toggle ────────────────────────────────────────────────────────────────
function EyeIcon({ show }) {
  return show ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ─── Input field component ────────────────────────────────────────────────────
function AuthInput({ label, type = "text", value, onChange, placeholder, autoComplete, required, icon, suffix }) {
  return (
    <div className="mb-4">
      <label className="block text-[11px] font-bold text-secondary-400 uppercase tracking-widest font-sans mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-300">{icon}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={`
            w-full py-3 rounded-xl border border-secondary-200 bg-secondary-50
            text-primary-900 text-sm font-sans font-medium
            focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100
            focus:bg-white transition-all placeholder:text-secondary-300
            ${icon ? "pl-10 pr-4" : "px-4"}
            ${suffix ? "pr-12" : ""}
          `}
        />
        {suffix && <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{suffix}</span>}
      </div>
    </div>
  );
}

// ─── Login form ────────────────────────────────────────────────────────────────
function LoginForm({ onNavigate, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    try {
      const data = await api.loginUser({ email, password });

      // Store token and user details
      localStorage.setItem("faas_token", data.token);
      localStorage.setItem("faas_user", JSON.stringify(data.user));

      onLogin(data.token, data.user);
      onNavigate("dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto animate-[fadeUp_0.4s_ease_both]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-primary-900 mb-1.5">Sign in</h1>
        <p className="text-sm text-secondary-400 font-sans">
          Don't have an account?{" "}
          <button type="button" onClick={() => onNavigate("signup")} className="text-primary-600 font-bold hover:text-primary-800 transition-colors">
            Create one →
          </button>
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <span className="text-danger text-sm">⚠</span>
          <p className="text-sm font-semibold text-red-700 font-sans">{error}</p>
        </div>
      )}

      <AuthInput
        label="Email address"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        required
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        }
      />

      <AuthInput
        label="Password"
        type={showPw ? "text" : "password"}
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="••••••••"
        autoComplete="current-password"
        required
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        }
        suffix={
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            className="text-secondary-300 hover:text-secondary-500 transition-colors"
          >
            <EyeIcon show={showPw} />
          </button>
        }
      />

      <div className="flex items-center justify-between mb-6 mt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-200" />
          <span className="text-xs font-semibold text-secondary-400 font-sans">Remember me</span>
        </label>
        <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-800 font-sans transition-colors">Forgot password?</a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold font-sans py-3.5 rounded-xl transition-all text-sm hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] mb-4"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Signing in…
          </span>
        ) : "Sign in to RunMate"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-secondary-200" />
        <span className="text-xs text-secondary-300 font-sans font-medium">or continue with</span>
        <div className="flex-1 h-px bg-secondary-200" />
      </div>

      {/* OAuth placeholder */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 border border-secondary-200 bg-white hover:bg-secondary-50 text-primary-900 font-semibold font-sans py-3 rounded-xl text-sm transition-all"
      >
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
        Sign in with Google
      </button>
    </form>
  );
}

// ─── Signup form ───────────────────────────────────────────────────────────────
function SignupForm({ onNavigate, onLogin }) {
  const [form, setForm] = useState({ fullName: "", email: "", phoneNumber: "", password: "", confirm: "", roles: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const ROLES = [
    { value: "vendor", label: "🏪 Vendor" },
    { value: "runner", label: "🏃 Runner" },
    // { value: "dispatcher", label: "📡 Dispatcher" },
    { value: "rider", label: "🚴 Rider" },
    // { value: "admin", label: "⚙️ Admin" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (!form.roles) { setError("Please select your role."); return; }
    if (!form.phoneNumber) { setError("Phone number is required."); return; }
    if (!agreed) { setError("Please accept the terms to continue."); return; }
    setError("");
    setLoading(true);
    try {
      const data = await api.registerUser({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        roles: form.roles
      });

      localStorage.setItem("faas_token", data.token);

      // Fetch full user details since register only returns token
      const res = await api.getCurrentUser();
      const fullUser = res?.user || res;
      localStorage.setItem("faas_user", JSON.stringify(fullUser));

      onLogin(data.token, fullUser);
      onNavigate("dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto animate-[fadeUp_0.4s_ease_both]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-primary-900 mb-1.5">Create account</h1>
        <p className="text-sm text-secondary-400 font-sans">
          Already have one?{" "}
          <button type="button" onClick={() => onNavigate("login")} className="text-primary-600 font-bold hover:text-primary-800 transition-colors">
            Sign in →
          </button>
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <span className="text-danger text-sm">⚠</span>
          <p className="text-sm font-semibold text-red-700 font-sans">{error}</p>
        </div>
      )}

      <AuthInput
        label="Full name"
        value={form.fullName}
        onChange={set("fullName")}
        placeholder="Your full name"
        autoComplete="name"
        required
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        }
      />

      <AuthInput
        label="Email address"
        type="email"
        value={form.email}
        onChange={set("email")}
        placeholder="you@example.com"
        autoComplete="email"
        required
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        }
      />

      <AuthInput
        label="Phone number"
        type="tel"
        value={form.phoneNumber}
        onChange={set("phoneNumber")}
        placeholder="e.g. 078XXXXXXX"
        required
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.21-2.21a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 18.92z" />
          </svg>
        }
      />

      {/* Role selector */}
      <div className="mb-4">
        <label className="block text-[11px] font-bold text-secondary-400 uppercase tracking-widest font-sans mb-1.5">
          Your Role <span className="text-danger">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setForm(f => ({ ...f, roles: r.value }))}
              className={`px-3 py-2.5 rounded-xl text-sm font-bold font-sans border-2 transition-all text-left ${form.roles === r.value ? "border-primary-500 bg-primary-50 text-primary-700" : "border-secondary-200 bg-secondary-50 text-secondary-400 hover:border-secondary-300"}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <AuthInput
        label="Password"
        type={showPw ? "text" : "password"}
        value={form.password}
        onChange={set("password")}
        placeholder="Min 8 characters"
        autoComplete="new-password"
        required
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        }
        suffix={
          <button type="button" onClick={() => setShowPw(v => !v)} className="text-secondary-300 hover:text-secondary-500 transition-colors">
            <EyeIcon show={showPw} />
          </button>
        }
      />

      {/* Password strength bar */}
      {form.password.length > 0 && (
        <div className="mb-4 -mt-2">
          <div className="flex gap-1 mb-1">
            {[...Array(4)].map((_, i) => {
              const strength = Math.min(Math.floor(form.password.length / 3), 4);
              return (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < strength ? ["bg-danger", "bg-warning", "bg-primary-400", "bg-success"][strength - 1] : "bg-secondary-200"}`} />
              );
            })}
          </div>
          <p className="text-[10px] text-secondary-300 font-sans">
            {form.password.length < 6 ? "Too short" : form.password.length < 9 ? "Fair" : form.password.length < 12 ? "Good" : "Strong"}
          </p>
        </div>
      )}

      <AuthInput
        label="Confirm password"
        type="password"
        value={form.confirm}
        onChange={set("confirm")}
        placeholder="Repeat password"
        autoComplete="new-password"
        required
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        }
      />

      {/* Terms */}
      <label className="flex items-start gap-2.5 mb-6 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-200 mt-0.5 flex-shrink-0"
        />
        <span className="text-xs text-secondary-400 font-sans leading-relaxed">
          I agree to the{" "}
          <a href="#" className="text-primary-600 font-bold hover:underline">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-primary-600 font-bold hover:underline">Privacy Policy</a>
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold font-sans py-3.5 rounded-xl transition-all text-sm hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating account…
          </span>
        ) : "Create my account →"}
      </button>
    </form>
  );
}

// ─── Auth page wrapper ────────────────────────────────────────────────────────
export function AuthPage({ mode, onNavigate, onLogin }) {
  return (
    <div className="min-h-screen flex">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Left: visual panel — 45% */}
      <div className="hidden lg:block lg:w-[45%] flex-shrink-0">
        <AuthPanel mode={mode} />
      </div>

      {/* Right: form — fills rest */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-secondary-100">
          {/* Mobile brand */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-primary-700 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <span className="font-heading font-extrabold text-primary-900 text-base">RunMate</span>
          </div>

          <span className="hidden lg:block text-sm text-secondary-400 font-sans">
            {mode === "login" ? "New to RunMate?" : "Already have an account?"}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("landing")}
              className="text-xs font-semibold text-secondary-400 hover:text-secondary-600 font-sans transition-colors flex items-center gap-1"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Back to home
            </button>
            <div className="w-px h-4 bg-secondary-200" />
            <button
              onClick={() => onNavigate(mode === "login" ? "signup" : "login")}
              className="bg-primary-900 hover:bg-primary-800 text-white text-xs font-bold font-sans px-4 py-2 rounded-xl transition-all"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-8 py-12 overflow-y-auto">
          {mode === "login"
            ? <LoginForm onNavigate={onNavigate} onLogin={onLogin} />
            : <SignupForm onNavigate={onNavigate} onLogin={onLogin} />
          }
        </div>

        {/* Bottom */}
        <div className="px-8 py-4 border-t border-secondary-100 text-center">
          <p className="text-xs text-secondary-300 font-sans">
            © {new Date().getFullYear()} RunMate· Secure & encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
