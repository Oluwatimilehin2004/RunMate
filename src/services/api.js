const BASE_URL = import.meta.env.VITE_API_URL || "https://hackathon-pjge.onrender.com/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("runmate_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Network error" }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  // Some endpoints might not return JSON (like 204 No Content or simple success)
  if (res.status === 204) return null;

  const json = await res.json().catch(() => null);

  // Unwrap the standard { success, data, message } envelope if present
  if (json && typeof json === "object" && json.data !== undefined) {
    if (json.success === false) {
      throw new Error(json.message || `HTTP ${res.status}`);
    }
    return json.data;
  }

  return json;
}

// ── Users (Auth) ─────────────────────────────────────────────────────────────
export const registerUser = (data) =>
  request("/users/register", { method: "POST", body: JSON.stringify(data) });

export const loginUser = (data) =>
  request("/users/login", { method: "POST", body: JSON.stringify(data) });

export const verifyOTP = (otp) =>
  request(`/users/verify/${otp}`);

export const getCurrentUser = () =>
  request("/users/user");

export const resendOTP = () =>
  request("/users/resend");

export const sendPasswordResetOTP = (email) =>
  request(`/users/reset/${email}`);

export const resetPin = (data) =>
  request("/users/reset", { method: "POST", body: JSON.stringify(data) });

export const deleteAccount = () =>
  request("/users/deleteMe", { method: "DELETE" });

// ── Orders ────────────────────────────────────────────────────────────────────
// Vendor: Create a new order
export const createOrder = (data) =>
  request("/orders", { method: "POST", body: JSON.stringify(data) });

// Vendor: Get all orders created by the vendor
export const getVendorOrders = () =>
  request("/orders/vendor");

// Runner: Get all available deliveries for runners
export const getAvailableOrders = () =>
  request("/orders/available");

// Runner: Accept an order
export const acceptOrder = (id) =>
  request(`/orders/${id}/accept`, { method: "PATCH" });

// Runner: Mark order as picked
export const markOrderPicked = (id) =>
  request(`/orders/${id}/picked`, { method: "PATCH" });

// Runner: Mark order as delivered
export const markOrderDelivered = (id) =>
  request(`/orders/${id}/delivered`, { method: "PATCH" });

// Runner/Rider: Confirm delivery using the delivery code
export const confirmDelivery = (id, delivery_code) =>
  request(`/orders/${id}/confirm-delivery`, {
    method: "PATCH",
    body: JSON.stringify({ delivery_code })
  });

// Vendor: Delete their order
export const deleteOrder = (id) =>
  request(`/orders/${id}`, { method: "DELETE" });

// Runner: Get all orders accepted by the runner
export const getMyAcceptedOrders = () =>
  request("/orders/my-accepted");

// ── Riders ───────────────────────────────────────────────────────────────────
// Fetch list of riders (dispatcher view)
export const getRiders = () =>
  request("/riders");


