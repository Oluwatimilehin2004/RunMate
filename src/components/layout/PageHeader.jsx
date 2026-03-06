export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-7">
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-primary-900 leading-tight">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-secondary-400 font-sans">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
