import { useState, useEffect } from "react";

export function TopBar({ user, userMeta, newOrderCount = 0, onBellClick, onLogout }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const dateStr = time.toLocaleDateString("en-RW", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ""}` : (user?.fullName || user?.name || "Member");
  const initials = (user?.firstName ? user.firstName[0] : (displayName[0] || "U")).toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-secondary-100 flex items-center justify-between px-8 flex-shrink-0 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Date */}
      <p className="text-sm text-secondary-400 font-sans font-medium">{dateStr}</p>

      {/* Right cluster */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={onBellClick}
            className="w-9 h-9 rounded-xl bg-secondary-50 border border-secondary-200 flex items-center justify-center text-secondary-400 hover:bg-secondary-100 hover:text-primary-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>
          {newOrderCount > 0 && (
            <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-danger rounded-full border-2 border-white flex items-center justify-center text-[9px] font-extrabold text-white font-sans">
              {newOrderCount > 9 ? "9+" : newOrderCount}
            </span>
          )}
        </div>

        <div className="w-px h-6 bg-secondary-200" />

        {/* System status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 border border-green-200">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-bold text-green-700 font-sans">System Live</span>
        </div>

        <div className="w-px h-6 bg-secondary-200" />

        {/* Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
          <div>
            <p className="text-xs font-bold text-primary-900 font-sans leading-none">{displayName}</p>
            <p className="text-[10px] text-secondary-400 font-sans leading-none mt-0.5">{userMeta?.label || "Member"}</p>
          </div>
        </div>

        {onLogout && (
          <>
            <div className="w-px h-6 bg-secondary-200" />
            <button
              onClick={onLogout}
              className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-danger hover:bg-red-100 transition-colors"
              title="Logout"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
