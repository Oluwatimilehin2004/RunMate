export function StatCard({ label, value, icon, colorClass, bgClass, trend, trendPositive = true }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-secondary-100 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-soft transition-all duration-200">
      <div className={`w-13 h-13 rounded-2xl ${bgClass} flex items-center justify-center flex-shrink-0 text-2xl`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-secondary-400 uppercase tracking-widest font-sans truncate">{label}</p>
        <p className={`text-3xl font-extrabold font-heading leading-none mt-0.5 ${colorClass}`}>{value}</p>
        {trend && (
          <p className={`text-xs font-semibold mt-1 font-sans ${trendPositive ? "text-success" : "text-secondary-400"}`}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
