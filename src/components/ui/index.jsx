import { STATUS_CONFIG } from "../../utils/constants";

// ── StatusBadge ───────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {
    badge: "bg-secondary-100 text-secondary-500 border border-secondary-200",
    label: status,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
const VARIANTS = {
  primary:   "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-[0_4px_14px_rgba(59,130,246,0.35)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.45)]",
  secondary: "bg-secondary-100 hover:bg-secondary-200 text-secondary-500 hover:text-primary-800",
  success:   "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-[0_4px_14px_rgba(34,197,94,0.3)]",
  warning:   "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-[0_4px_14px_rgba(245,158,11,0.3)]",
  violet:    "bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white shadow-[0_4px_14px_rgba(139,92,246,0.3)]",
  danger:    "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_4px_14px_rgba(239,68,68,0.3)]",
  ghost:     "border border-secondary-200 bg-white hover:bg-secondary-50 text-secondary-500 hover:text-primary-700",
};

export function Button({ children, variant = "primary", size = "md", disabled, loading, onClick, className = "", type = "button" }) {
  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
    full: "w-full px-4 py-3 text-sm rounded-xl",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-bold font-sans
        transition-all duration-200 active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${VARIANTS[variant]} ${sizes[size]} ${className}
      `}
    >
      {loading && <Spinner size="sm" color="white" />}
      {children}
    </button>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = "max-w-lg" }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(23,37,84,0.45)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-soft w-full ${width} animate-fadeUp`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-secondary-100">
          <h3 className="font-heading text-lg font-bold text-primary-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-secondary-100 hover:bg-secondary-200 flex items-center justify-center transition-colors"
          >
            <XIcon />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = "md", color = "blue" }) {
  const s = size === "sm" ? "w-4 h-4 border-2" : size === "lg" ? "w-10 h-10 border-4" : "w-6 h-6 border-2";
  const c = color === "white" ? "border-white/30 border-t-white" : "border-primary-200 border-t-primary-600";
  return <div className={`${s} ${c} rounded-full animate-spin`} />;
}

// ── PageLoader ────────────────────────────────────────────────────────────────
export function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-64">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-3 text-sm text-secondary-400 font-sans font-medium">Loading…</p>
      </div>
    </div>
  );
}

// ── ErrorBanner ───────────────────────────────────────────────────────────────
export function ErrorBanner({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-danger text-lg">⚠</span>
        <p className="text-sm font-semibold text-red-700 font-sans">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="text-xs font-bold text-red-600 underline hover:no-underline">
          Retry
        </button>
      )}
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-secondary-100 flex items-center justify-center mb-4 text-3xl">
        {icon}
      </div>
      <p className="font-heading font-bold text-primary-900 text-base mb-1">{title}</p>
      {description && <p className="text-sm text-secondary-400 font-sans max-w-xs">{description}</p>}
    </div>
  );
}

// ── Form helpers ──────────────────────────────────────────────────────────────
export function Field({ label, required, children, hint }) {
  return (
    <div className="mb-4">
      <label className="block mb-1.5 text-[11px] font-bold text-secondary-400 font-sans uppercase tracking-widest">
        {label}{required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-secondary-300 font-sans">{hint}</p>}
    </div>
  );
}

export const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-secondary-200 bg-secondary-50 text-primary-900 text-sm font-sans font-medium focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-secondary-300";
export const selectCls = `${inputCls} appearance-none cursor-pointer`;

// ── Inline icons ──────────────────────────────────────────────────────────────
export const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
export const PlusIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
export const CheckIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
export const LocationIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
export const ArrowRightIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
