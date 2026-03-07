import { useState } from "react";
import { PAYMENT_METHODS } from "../utils/constants";
import { parseItems, stringifyItems, timeAgo, shortLocation } from "../utils/helpers";
import {
  Modal, Button, Field, inputCls, selectCls,
  StatusBadge, EmptyState, PageLoader, ErrorBanner,
  PlusIcon, XIcon, LocationIcon, CheckIcon,
} from "../components/ui/index";
import { PageHeader } from "../components/layout/PageHeader";

export function VendorPage({ orders, loading, error, onRefetch, onCreateOrder, onDeleteOrder }) {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [flash, setFlash] = useState(null); // { id, delivery_code }

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [itemRows, setItemRows] = useState([{ qty: 1 }]);
  const [location, setLocation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);

  const resetForm = () => {
    setCustomerName("");
    setItemRows([{ qty: 1 }]);
    setLocation("");
    setPaymentMethod(PAYMENT_METHODS[0]);
  };

  const addItem = () => setItemRows((r) => [...r, { qty: 1 }]);
  const removeItem = (i) => setItemRows((r) => r.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) =>
    setItemRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));

  const handleSubmit = async () => {
    const validItems = itemRows.filter((r) => (r.name || "").trim() && Number(r.qty) > 0);
    if (!(customerName || "").trim() || !(location || "").trim() || validItems.length === 0) return;

    setSubmitting(true);
    try {
      // POST /orders — matches API schema correctly
      const payload = {
        customerName: (customerName || "").trim(),
        items: validItems.map(item => ({ name: item.name || "Package", quantity: Number(item.qty || 1) })),
        deliveryLocation: (location || "").trim(),
        paymentMethod: paymentMethod,
      };
      const newOrder = await onCreateOrder(payload);
      setFlash({
        id: newOrder._id || newOrder.id,
        delivery_code: newOrder.deliveryCode || newOrder.delivery_code
      });
      resetForm();
      setShowModal(false);
    } catch (err) {
      alert("Failed to create order: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <ErrorBanner message={error} onRetry={onRefetch} />;

  return (
    <div>
      <PageHeader
        title="Vendor Portal"
        subtitle="Create and track customer orders"
        action={
          <Button onClick={() => setShowModal(true)}>
            <PlusIcon size={15} /> New Order
          </Button>
        }
      />

      {/* Success flash */}
      {flash && (
        <div className="mb-5 flex items-center justify-between gap-4 bg-green-50 border border-green-200 rounded-xl px-5 py-4 animate-fadeUp">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-success flex items-center justify-center text-white flex-shrink-0">
              <CheckIcon size={17} />
            </div>
            <div>
              <p className="font-bold text-primary-900 text-sm font-sans">
                Order <span className="text-primary-600">{flash.id}</span> created!
              </p>
              <p className="text-xs text-secondary-400 font-sans mt-0.5">
                Delivery code:{" "}
                <span className="font-extrabold text-primary-900 text-sm tracking-widest">
                  {flash.delivery_code}
                </span>{" "}
                — share with the customer
              </p>
            </div>
          </div>
          <button onClick={() => setFlash(null)} className="text-secondary-300 hover:text-secondary-500 transition-colors">
            <XIcon />
          </button>
        </div>
      )}

      {/* Orders list */}
      <div className="bg-white rounded-2xl shadow-card border border-secondary-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary-100 flex items-center justify-between">
          <p className="text-[11px] font-bold text-secondary-400 uppercase tracking-widest font-sans">
            All Orders ({orders.length})
          </p>
        </div>

        {orders.length === 0 ? (
          <EmptyState icon="📦" title="No orders yet" description="Create your first order using the button above." />
        ) : (
          <div>
            {orders.map((order) => {
              const items = parseItems(order.items_json);
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-4 px-6 py-4 border-b border-secondary-50 last:border-0 hover:bg-secondary-50 transition-colors flex-wrap"
                >
                  {/* Left */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-xl flex-shrink-0">
                      📦
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-extrabold text-primary-600 font-sans">{order.id}</span>
                        <span className="text-secondary-200 text-xs">·</span>
                        <span className="text-sm font-bold text-primary-900 font-sans">{order.customer_name}</span>
                      </div>
                      <p className="text-xs text-secondary-400 font-sans mt-0.5 truncate max-w-xs">
                        {items.map((i) => `${i.name} ×${i.qty}`).join(", ") || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-4 flex-shrink-0 flex-wrap">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-secondary-400 font-sans justify-end">
                        <LocationIcon size={11} />
                        {shortLocation(order.location)}
                      </div>
                      <span className="text-[10px] text-secondary-300 font-sans">{timeAgo(order.created_at)}</span>
                    </div>
                    <StatusBadge status={order.status} />
                    <div className="bg-secondary-100 rounded-lg px-2.5 py-1 text-sm font-extrabold text-primary-900 tracking-[0.18em] font-sans">
                      #{order.delivery_code}
                    </div>
                    {onDeleteOrder && (
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this order?")) {
                            onDeleteOrder(order.id);
                          }
                        }}
                        className="p-2 text-secondary-300 hover:text-danger hover:bg-red-50 rounded-lg transition-all"
                        title="Delete order"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); resetForm(); }} title="Create New Order">
        <Field label="Customer Name" required>
          <input
            className={inputCls}
            value={customerName}
            placeholder="Full name"
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </Field>

        <Field label="Items to Fulfill" required>
          {itemRows.map((row, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className={`${inputCls.replace("w-full ", "")} flex-1 min-w-[120px] w-full`}
                value={row.name || ""}
                placeholder="Item name"
                onChange={(e) => updateItem(i, "name", e.target.value)}
              />
              <input
                className={`${inputCls.replace("w-full ", "")} w-[80px] flex-shrink-0 text-center`}
                type="number"
                min={1}
                value={row.qty}
                onChange={(e) => updateItem(i, "qty", Math.max(1, parseInt(e.target.value) || 1))}
              />
              {itemRows.length > 1 && (
                <button
                  onClick={() => removeItem(i)}
                  className="w-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-danger hover:bg-red-100 transition-colors flex-shrink-0"
                >
                  <XIcon />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addItem}
            className="flex items-center gap-2 text-xs font-bold text-primary-600 font-sans mt-1 px-3 py-2 rounded-xl border border-dashed border-primary-200 bg-primary-50 hover:bg-primary-100 transition-colors w-full justify-center"
          >
            <PlusIcon size={13} /> Add another item
          </button>
        </Field>

        <Field label="Delivery Location" required>
          <input
            className={inputCls}
            value={location}
            placeholder="e.g. Kimihurura, KG 11 Ave"
            onChange={(e) => setLocation(e.target.value)}
          />
        </Field>

        <Field label="Payment Method">
          <select
            className={selectCls}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
          </select>
        </Field>

        <Button
          size="full"
          onClick={handleSubmit}
          loading={submitting}
          disabled={!(customerName || "").trim() || !(location || "").trim() || !itemRows.some((r) => (r.name || "").trim() && Number(r.qty) > 0)}
          className="mt-1"
        >
          Create Order
        </Button>
      </Modal>
    </div>
  );
}
