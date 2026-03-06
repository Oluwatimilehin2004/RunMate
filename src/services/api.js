const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Network error" }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Orders ────────────────────────────────────────────────────────────────────
// GET /orders
export const getOrders = () => request("/orders");

// POST /orders  →  body: { customer_name, items_json, location, payment_method }
export const createOrder = (data) =>
  request("/orders", { method: "POST", body: JSON.stringify(data) });

// PATCH /orders/:id/status  →  body: { status }
// status enum: "NEW" | "PICKING" | "READY" | "OUT_FOR_DELIVERY" | "DELIVERED"
export const updateOrderStatus = (id, status) =>
  request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });

// PATCH /orders/:id/assign-rider  →  body: { assigned_rider }
export const assignRider = (id, assigned_rider) =>
  request(`/orders/${id}/assign-rider`, { method: "PATCH", body: JSON.stringify({ assigned_rider }) });

// POST /orders/:id/validate-delivery  →  body: { delivery_code }
// returns: { success: boolean, order?: object }
export const validateDelivery = (id, delivery_code) =>
  request(`/orders/${id}/validate-delivery`, {
    method: "POST",
    body: JSON.stringify({ delivery_code }),
  });

// ── Riders ────────────────────────────────────────────────────────────────────
// GET /riders
export const getRiders = () => request("/riders");
