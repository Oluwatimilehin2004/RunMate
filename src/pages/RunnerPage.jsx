import { useState } from "react";
import { ORDER_STATUS } from "../utils/constants";
import { parseItems, timeAgo } from "../utils/helpers";
import {
  Button, StatusBadge, EmptyState, PageLoader, ErrorBanner, CheckIcon, LocationIcon,
} from "../components/ui/index";
import { PageHeader } from "../components/layout/PageHeader";

function RunnerCard({ order, onAdvance }) {
  const [loading, setLoading] = useState(false);
  const isNew = order.status === ORDER_STATUS.NEW;
  const items = parseItems(order.items_json);

  const handleAdvance = async () => {
    setLoading(true);
    try {
      // PATCH /orders/:id/status
      // NEW → PICKING, PICKING → READY
      const nextStatus = isNew ? ORDER_STATUS.PICKING : ORDER_STATUS.READY;
      await onAdvance(order.id, nextStatus);
    } catch (err) {
      alert("Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-card border-2 ${isNew ? "border-primary-200" : "border-amber-300"} transition-all`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-xs font-extrabold text-primary-600 font-sans">{order.id}</span>
            <StatusBadge status={order.status} />
          </div>
          <p className="font-heading text-lg font-bold text-primary-900">{order.customer_name}</p>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-secondary-400 font-sans">
            <LocationIcon size={12} />
            {order.location}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-secondary-300 font-sans">{timeAgo(order.created_at)}</p>
          <p className="text-xs font-bold text-secondary-400 font-sans mt-0.5">{order.payment_method}</p>
        </div>
      </div>

      {/* Items checklist */}
      <div className="bg-secondary-50 rounded-xl p-4 mb-5">
        <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest font-sans mb-3">
          Items to Pack ({items.length})
        </p>
        <div className="space-y-2">
          {items.map((item, i) => {
            const packed = order.status === ORDER_STATUS.PICKING;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${packed ? "bg-success border-success" : "border-secondary-300 bg-white"}`}>
                  {packed && <CheckIcon size={11} />}
                </div>
                <span className={`text-sm font-semibold font-sans flex-1 transition-all ${packed ? "line-through text-secondary-300" : "text-primary-900"}`}>
                  {item.name}
                </span>
                <span className="text-xs font-bold text-secondary-400 font-sans bg-secondary-200 rounded-md px-2 py-0.5">
                  ×{item.qty}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <Button
        size="full"
        variant={isNew ? "warning" : "success"}
        onClick={handleAdvance}
        loading={loading}
      >
        {isNew ? "▶  Start Picking" : "✓  All Packed — Mark as Ready"}
      </Button>
    </div>
  );
}

export function RunnerPage({ orders, loading, error, onRefetch, onUpdateStatus }) {
  if (loading) return <PageLoader />;
  if (error) return <ErrorBanner message={error} onRetry={onRefetch} />;

  const active = orders.filter((o) =>
    [ORDER_STATUS.NEW, ORDER_STATUS.PICKING].includes(o.status)
  );

  const doneToday = orders.filter((o) => o.status === ORDER_STATUS.READY).length;

  return (
    <div>
      <PageHeader
        title="Runner Interface"
        subtitle="Pick and pack orders before dispatch"
      />

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: "Waiting", count: orders.filter((o) => o.status === ORDER_STATUS.NEW).length, color: "text-primary-600", bg: "bg-primary-50" },
          { label: "Picking", count: orders.filter((o) => o.status === ORDER_STATUS.PICKING).length, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Packed & Ready", count: doneToday, color: "text-violet-600", bg: "bg-violet-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-white/60`}>
            <p className="text-[10px] font-bold uppercase tracking-widest font-sans text-secondary-400 mb-1">{s.label}</p>
            <p className={`text-3xl font-extrabold font-heading ${s.color}`}>{s.count}</p>
          </div>
        ))}
      </div>

      {active.length === 0 ? (
        <EmptyState
          icon="✅"
          title="All caught up!"
          description="No orders waiting to be picked or packed right now."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {active.map((order) => (
            <RunnerCard key={order.id} order={order} onAdvance={onUpdateStatus} />
          ))}
        </div>
      )}
    </div>
  );
}
