import { useState } from "react";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "vendor",
    label: "Vendor Portal",
    badge: "newCount",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    id: "runner",
    label: "Runner",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" /><path d="M20 21l-2-7-3 2-3-8-3 8-3-2-2 7" />
      </svg>
    ),
  },
  {
    id: "dispatcher",
    label: "Dispatch",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
  },
  {
    id: "delivery",
    label: "Delivery",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    id: "kanban",
    label: "Kanban",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="5" height="18" /><rect x="10" y="3" width="5" height="12" />
        <rect x="17" y="3" width="5" height="15" />
      </svg>
    ),
  },
];

export function Sidebar({ currentPage, onNavigate, allowedPages = [], newOrderCount = 0 }) {
  const [collapsed, setCollapsed] = useState(false);

  const filteredItems = NAV_ITEMS.filter((item) => allowedPages.includes(item.id));

  return (
    <aside
      className={`
        flex flex-col flex-shrink-0 h-screen sticky top-0
        bg-primary-900 transition-all duration-300 ease-in-out
        ${collapsed ? "w-[68px]" : "w-[230px]"}
      `}
      style={{ boxShadow: "4px 0 24px rgba(23,37,84,0.2)" }}
    >
      {/* Brand */}
      <div className={`flex items-center gap-3 border-b border-white/10 transition-all duration-300 ${collapsed ? "px-[15px] py-5 justify-center" : "px-5 py-5"}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(59,130,246,0.4)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" />
            <path d="M16 8h4l3 3v5h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-heading text-base font-extrabold text-white leading-none tracking-tight whitespace-nowrap">FaaS</p>
            <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest font-sans whitespace-nowrap mt-0.5">Fulfillment Hub</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {!collapsed && (
          <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.12em] font-sans px-3 mb-2">
            Navigation
          </p>
        )}

        {filteredItems.map((item) => {
          const active = currentPage === item.id;
          const showBadge = item.badge === "newCount" && newOrderCount > 0;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={`
                w-full flex items-center gap-3 rounded-xl mb-1 font-sans font-semibold text-sm
                transition-all duration-150 relative group
                ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"}
                ${active
                  ? "bg-primary-500/20 text-white"
                  : "text-white/50 hover:bg-white/6 hover:text-white/90"
                }
              `}
            >
              {/* Active indicator rail */}
              {active && (
                <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] bg-primary-400 rounded-r-full" />
              )}

              {/* Icon */}
              <span className={`flex-shrink-0 transition-colors ${active ? "text-primary-300" : "text-white/40 group-hover:text-white/70"}`}>
                {item.icon}
              </span>

              {/* Label */}
              {!collapsed && <span className="whitespace-nowrap flex-1 text-left">{item.label}</span>}

              {/* Badge */}
              {showBadge && !collapsed && (
                <span className="bg-accent-500 text-white text-[10px] font-extrabold rounded-md px-1.5 py-0.5 font-sans">
                  {newOrderCount}
                </span>
              )}
              {showBadge && collapsed && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500 border-2 border-primary-900" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={`
            w-full flex items-center gap-3 rounded-xl py-2.5 text-white/40
            hover:bg-white/6 hover:text-white/80 transition-all duration-150
            ${collapsed ? "justify-center px-0" : "px-3"}
          `}
        >
          <svg
            width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`flex-shrink-0 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18M15 9l-3 3 3 3" />
          </svg>
          {!collapsed && <span className="text-xs font-bold font-sans whitespace-nowrap">Collapse sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
