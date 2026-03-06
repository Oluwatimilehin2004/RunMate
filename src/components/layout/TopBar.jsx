import { useState, useEffect } from "react";

export function TopBar({ newOrderCount = 0, onBellClick }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const dateStr = time.toLocaleDateString("en-RW", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

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
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
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
            A
          </div>
          <div>
            <p className="text-xs font-bold text-primary-900 font-sans leading-none">Admin</p>
            <p className="text-[10px] text-secondary-400 font-sans leading-none mt-0.5">Operator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
