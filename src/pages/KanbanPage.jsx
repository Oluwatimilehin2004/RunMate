import { STATUS_CONFIG, STATUS_WORKFLOW, RIDER_TYPE_EMOJI } from "../utils/constants";
import { parseItems, timeAgo, shortLocation } from "../utils/helpers";
import { PageLoader, ErrorBanner, LocationIcon } from "../components/ui/index";
import { PageHeader } from "../components/layout/PageHeader";

function KanbanCard({ order }) {
  const items = parseItems(order.items_json);
  const cfg = STATUS_CONFIG[order.status];

  return (
    <div className="bg-white rounded-xl p-3.5 border border-secondary-100 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-card transition-all duration-200 cursor-default">
      {/* Top row */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] font-extrabold text-primary-600 font-sans">{order.id}</span>
        <span className="text-[10px] text-secondary-300 font-sans">{timeAgo(order.created_at)}</span>
      </div>

      {/* Customer */}
      <p className="font-bold text-primary-900 text-sm font-sans mb-1 leading-tight">{order.customer_name}</p>

      {/* Items count */}
      <p className="text-xs text-secondary-400 font-sans mb-2">
        {items.length} item{items.length !== 1 ? "s" : ""}
        {items.length > 0 && (
          <span className="text-secondary-300"> — {items[0].name}{items.length > 1 ? ` +${items.length - 1}` : ""}</span>
        )}
      </p>

      {/* Location */}
      <div className="flex items-center gap-1 text-[11px] text-secondary-300 font-sans mb-2.5">
        <LocationIcon size={11} />
        <span className="truncate">{shortLocation(order.location)}</span>
      </div>

      {/* Rider chip */}
      {order.assigned_rider && (
        <div className="flex items-center gap-1.5 bg-orange-50 rounded-lg px-2 py-1 mb-2.5">
          <span className="text-sm">{RIDER_TYPE_EMOJI["Motorcycle"]}</span>
          <span className="text-[11px] font-bold text-orange-600 font-sans truncate">{order.assigned_rider}</span>
        </div>
      )}

      {/* Delivery code */}
      <div className="bg-secondary-50 rounded-lg text-center py-1.5">
        <span className="text-xs font-extrabold text-primary-900 font-sans tracking-[0.2em]">
          #{order.delivery_code}
        </span>
      </div>
    </div>
  );
}

export function KanbanPage({ orders, loading, error, onRefetch }) {
  if (loading) return <PageLoader />;
  if (error) return <ErrorBanner message={error} onRetry={onRefetch} />;

  return (
    <div>
      <PageHeader
        title="Kanban Board"
        subtitle="Full order pipeline at a glance"
      />

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_WORKFLOW.map((status) => {
          const cfg = STATUS_CONFIG[status];
          const col = orders.filter((o) => o.status === status);

          return (
            <div key={status} className="flex-shrink-0 w-56">
              {/* Column header */}
              <div className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl mb-3 ${cfg.bg} border border-opacity-30`}
                style={{ borderColor: cfg.hex + "40" }}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  <span className={`text-[11px] font-extrabold uppercase tracking-wider font-sans ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
                <span
                  className="text-[11px] font-extrabold font-heading rounded-lg w-6 h-6 flex items-center justify-center text-white"
                  style={{ background: cfg.hex }}
                >
                  {col.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2.5">
                {col.map((order) => (
                  <KanbanCard key={order.id} order={order} />
                ))}
                {col.length === 0 && (
                  <div className="rounded-xl border-2 border-dashed border-secondary-200 py-8 text-center">
                    <p className="text-xs text-secondary-300 font-sans">Empty</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
