import { useState } from "react";
import { ORDER_STATUS, RIDER_TYPE_EMOJI } from "../utils/constants";
import { parseItems, timeAgo } from "../utils/helpers";
import {
  Modal, Button, StatusBadge, EmptyState, PageLoader, ErrorBanner,
  CheckIcon, LocationIcon,
} from "../components/ui/index";
import { PageHeader } from "../components/layout/PageHeader";

function RiderCard({ rider }) {
  // A rider with assigned_orders === 0 (or null) is available
  const isAvailable = !rider.assigned_orders || rider.assigned_orders === 0;
  const emoji = RIDER_TYPE_EMOJI[rider.type] || "🛵";

  return (
    <div className={`bg-white rounded-xl p-4 border-2 ${isAvailable ? "border-primary-100" : "border-amber-200"}`}>
      <div className="flex items-center gap-3 mb-2.5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${isAvailable ? "bg-primary-50" : "bg-amber-50"}`}>
          {emoji}
        </div>
        <div>
          <p className="text-sm font-bold text-primary-900 font-sans leading-tight">{rider.name}</p>
          <p className="text-xs text-secondary-400 font-sans">{rider.type}</p>
        </div>
      </div>
      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold font-sans rounded-full px-2.5 py-0.5 ${isAvailable ? "bg-green-50 text-green-600 border border-green-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-success" : "bg-warning"}`} />
        {isAvailable ? "Available" : `On delivery (${rider.assigned_orders})`}
      </span>
    </div>
  );
}

export function DispatcherPage({ orders, riders, ridersLoading, ridersError, loading, error, onRefetch, onRidersRefetch }) {
  const [selected, setSelected] = useState(null);
  const [riderId, setRiderId] = useState("");
  const [assigning, setAssigning] = useState(false);

  // Show loader/error for orders first; if orders are fine, show riders errors inline
  if (loading) return <PageLoader />;
  if (error) return <ErrorBanner message={error} onRetry={onRefetch} />;
  if (ridersLoading) return <PageLoader />;
  if (ridersError) return <ErrorBanner message={ridersError} onRetry={onRidersRefetch} />;

  const readyOrders = orders.filter((o) => o.status === ORDER_STATUS.PICKED && !o.assigned_rider);
  const inDelivery = orders.filter((o) => o.status === ORDER_STATUS.PICKED && o.assigned_rider);
  const availableRiders = riders.filter((r) => !r.assigned_orders || r.assigned_orders === 0);

  const handleAssign = async () => {
    if (!riderId || !selected) return;
    setAssigning(true);
    try {
      // For now, just show success - backend doesn't have assign endpoint
      alert(`Rider ${riderId} assigned to order ${selected.id}`);
      setSelected(null);
      setRiderId("");
      // Refresh both orders and riders lists so UI updates
      try { onRefetch && onRefetch(); } catch (e) { /* ignore */ }
      try { onRidersRefetch && onRidersRefetch(); } catch (e) { /* ignore */ }
    } catch (err) {
      alert("Failed: " + err.message);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Dispatch Control"
        subtitle="Assign riders to packed orders"
      />

      {/* Rider grid */}
      <div className="bg-white rounded-2xl shadow-card border border-secondary-100 p-5 mb-6">
        <p className="text-[11px] font-bold text-secondary-400 uppercase tracking-widest font-sans mb-4">
          Rider Fleet ({riders.length})
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {riders.map((r) => <RiderCard key={r.id} rider={r} />)}
          {riders.length === 0 && (
            <p className="text-sm text-secondary-300 col-span-full text-center py-6 font-sans">No riders in fleet.</p>
          )}
        </div>
      </div>

      {/* Ready to dispatch */}
      <div className="mb-6">
        <p className="text-[11px] font-bold text-secondary-400 uppercase tracking-widest font-sans mb-3">
          Packed & Ready to Dispatch ({readyOrders.length})
        </p>
        {readyOrders.length === 0 ? (
          <div className="bg-secondary-50 rounded-xl p-8 text-center">
            <p className="text-sm text-secondary-300 font-sans">No orders ready for dispatch yet.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {readyOrders.map((order) => {
              const items = parseItems(order.items_json);
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border-2 border-violet-100 px-5 py-4 flex items-center justify-between flex-wrap gap-4 hover:border-violet-200 hover:shadow-card transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-xs font-extrabold text-primary-600 font-sans">{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="font-bold text-primary-900 font-sans">{order.customer_name}</p>
                    <div className="flex items-center gap-1 text-xs text-secondary-400 font-sans mt-0.5">
                      <LocationIcon size={11} />
                      {order.location}
                    </div>
                    <p className="text-xs text-secondary-300 font-sans mt-1">
                      {items.length} item{items.length !== 1 ? "s" : ""} — {order.payment_method}
                    </p>
                  </div>
                  <Button
                    variant="violet"
                    onClick={() => { setSelected(order); setRiderId(""); }}
                  >
                    Assign Rider →
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Currently in delivery */}
      <div>
        <p className="text-[11px] font-bold text-secondary-400 uppercase tracking-widest font-sans mb-3">
          Out for Delivery ({inDelivery.length})
        </p>
        {inDelivery.length === 0 ? (
          <div className="bg-secondary-50 rounded-xl p-6 text-center">
            <p className="text-sm text-secondary-300 font-sans">No active deliveries.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {inDelivery.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-orange-200 bg-orange-50/30 px-5 py-4 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-0.5">
                    <span className="text-xs font-extrabold text-primary-600 font-sans">{order.id}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="font-bold text-primary-900 font-sans">{order.customer_name}</p>
                  <div className="flex items-center gap-1 text-xs text-secondary-400 font-sans mt-0.5">
                    <LocationIcon size={11} />
                    {order.location}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-secondary-300 font-sans uppercase tracking-wider mb-0.5">Rider</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{RIDER_TYPE_EMOJI["Motorcycle"]}</span>
                    <span className="font-bold text-primary-900 font-sans text-sm">{order.assigned_rider || "—"}</span>
                  </div>
                  <p className="text-[10px] text-secondary-300 font-sans mt-1">{timeAgo(order.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Rider Modal */}
      <Modal
        open={!!selected}
        onClose={() => { setSelected(null); setRiderId(""); }}
        title={`Assign Rider — ${selected?.id}`}
      >
        {selected && (
          <>
            {/* Order summary */}
            <div className="bg-secondary-50 rounded-xl p-4 mb-5">
              <p className="font-bold text-primary-900 font-sans">{selected.customer_name}</p>
              <div className="flex items-center gap-1 text-xs text-secondary-400 font-sans mt-1">
                <LocationIcon size={11} />
                {selected.location}
              </div>
              <p className="text-xs text-secondary-400 font-sans mt-1.5">
                {parseItems(selected.items_json).map((i) => `${i.name} ×${i.qty}`).join(", ")}
              </p>
            </div>

            {/* Rider selection */}
            <p className="text-[11px] font-bold text-secondary-400 uppercase tracking-widest font-sans mb-3">Select Rider</p>

            {availableRiders.length === 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-center">
                <p className="text-sm font-semibold text-red-600 font-sans">No riders available right now.</p>
              </div>
            ) : (
              <div className="space-y-2.5 mb-5">
                {availableRiders.map((r) => {
                  const isSelected = riderId === r.name;
                  const emoji = RIDER_TYPE_EMOJI[r.type] || "🛵";
                  return (
                    <label
                      key={r.id}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? "border-primary-400 bg-primary-50" : "border-secondary-200 bg-white hover:border-secondary-300"}`}
                    >
                      <input
                        type="radio"
                        name="rider"
                        value={r.name}
                        checked={isSelected}
                        onChange={(e) => setRiderId(e.target.value)}
                        className="hidden"
                      />
                      <span className="text-2xl">{emoji}</span>
                      <div className="flex-1">
                        <p className="font-bold text-primary-900 font-sans text-sm">{r.name}</p>
                        <p className="text-xs text-secondary-400 font-sans">{r.type}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center text-white flex-shrink-0">
                          <CheckIcon size={11} />
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            )}

            <Button
              size="full"
              variant="violet"
              onClick={handleAssign}
              loading={assigning}
              disabled={!riderId}
            >
              Confirm & Dispatch
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
}
