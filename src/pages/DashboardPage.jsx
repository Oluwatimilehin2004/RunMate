import { ORDER_STATUS, STATUS_CONFIG, STATUS_WORKFLOW } from "../utils/constants";
import { parseItems, timeAgo, shortLocation } from "../utils/helpers";
import { StatCard } from "../components/ui/StatCard";
import { StatusBadge, PageLoader, ErrorBanner, ArrowRightIcon, LocationIcon } from "../components/ui/index";
import { PageHeader } from "../components/layout/PageHeader";

export function DashboardPage({ orders, loading, error, onRefetch }) {
  if (loading) return <PageLoader />;
  if (error) return <ErrorBanner message={error} onRetry={onRefetch} />;

  // Counts per status — uses DB status values
  const counts = STATUS_WORKFLOW.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const total = orders.length;
  const deliveredCount = counts[ORDER_STATUS.DELIVERED];
  const completionRate = total > 0 ? Math.round((deliveredCount / total) * 100) : 0;
  const inProgress = counts[ORDER_STATUS.PICKING] + counts[ORDER_STATUS.READY];

  const recent = [...orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8);

  return (
    <div>
      <PageHeader
        title="Operations Overview"
        subtitle="Live snapshot of your fulfillment workflow"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <StatCard
          label="Total Orders"
          value={total}
          icon="📦"
          bgClass="bg-primary-50"
          colorClass="text-primary-800"
          trend={`+${counts[ORDER_STATUS.NEW]} new today`}
        />
        <StatCard
          label="In Progress"
          value={inProgress}
          icon="⚙️"
          bgClass="bg-amber-50"
          colorClass="text-amber-700"
        />
        <StatCard
          label="Out for Delivery"
          value={counts[ORDER_STATUS.OUT_FOR_DELIVERY]}
          icon="🚀"
          bgClass="bg-orange-50"
          colorClass="text-orange-600"
        />
        <StatCard
          label="Delivered Today"
          value={deliveredCount}
          icon="✅"
          bgClass="bg-green-50"
          colorClass="text-green-700"
          trend={`${completionRate}% completion rate`}
          trendPositive={completionRate >= 70}
        />
      </div>

      {/* Workflow Pipeline */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-secondary-100 mb-5">
        <p className="text-[11px] font-bold text-secondary-400 uppercase tracking-widest font-sans mb-4">Workflow Pipeline</p>
        <div className="flex items-stretch gap-2 overflow-x-auto pb-1">
          {STATUS_WORKFLOW.map((status, i) => {
            const cfg = STATUS_CONFIG[status];
            const count = counts[status];
            return (
              <div key={status} className="flex items-center gap-2 flex-1 min-w-[110px]">
                <div className={`flex-1 rounded-xl p-4 border-2 transition-all ${count > 0 ? `${cfg.bg} ${cfg.border}` : "bg-secondary-50 border-secondary-200"}`}>
                  <p className={`text-[10px] font-extrabold uppercase tracking-widest font-sans mb-1.5 ${count > 0 ? cfg.color : "text-secondary-300"}`}>
                    {cfg.label}
                  </p>
                  <p className={`text-3xl font-extrabold font-heading leading-none ${count > 0 ? "text-primary-900" : "text-secondary-300"}`}>
                    {count}
                  </p>
                </div>
                {i < STATUS_WORKFLOW.length - 1 && (
                  <span className="text-secondary-300 flex-shrink-0">
                    <ArrowRightIcon size={14} />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-card border border-secondary-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary-100">
          <p className="text-[11px] font-bold text-secondary-400 uppercase tracking-widest font-sans">
            Recent Orders ({recent.length})
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-50">
                {["Order ID", "Customer", "Items", "Location", "Payment", "Status", "Time"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-secondary-400 uppercase tracking-widest font-sans whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((order) => {
                const items = parseItems(order.items_json);
                return (
                  <tr
                    key={order.id}
                    className="border-b border-secondary-50 last:border-0 hover:bg-secondary-50 transition-colors"
                  >
                    <td className="px-4 py-3.5 text-xs font-extrabold text-primary-600 font-sans whitespace-nowrap">
                      {order.id}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-bold text-primary-900 font-sans whitespace-nowrap">
                      {order.customer_name}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-secondary-400 font-sans max-w-[160px] truncate">
                      {items.length > 0
                        ? items.map((i) => `${i.name} ×${i.qty}`).join(", ")
                        : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-secondary-400 font-sans whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <LocationIcon size={11} />
                        {shortLocation(order.location)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-secondary-400 font-sans whitespace-nowrap">
                      {order.payment_method}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3.5 text-xs text-secondary-300 font-sans whitespace-nowrap">
                      {timeAgo(order.created_at)}
                    </td>
                  </tr>
                );
              })}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-secondary-300 font-sans">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
