import { useState, useEffect, useCallback } from "react";
import * as api from "../services/api";

const normalizeOrder = (o) => ({
  ...o,
  id: o._id || o.id,
  delivery_code: o.deliveryCode || o.delivery_code,
  customer_name: o.customerName || o.customer_name,
  payment_method: o.paymentMethod || o.payment_method,
  location: o.deliveryLocation || o.location,
  items_json: JSON.stringify(o.items || (o.items_json ? JSON.parse(o.items_json) : []))
});

export function useOrders(user) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      let data = [];

      // Robust role detection
      const targetUser = user.user || user;
      const r = targetUser.roles || targetUser.role;
      const normalizedRole = (Array.isArray(r) ? r[0] : r)?.replace(/^ROLE_/i, "").toLowerCase();

      if (normalizedRole === "vendor") {
        data = await api.getVendorOrders();
      } else if (normalizedRole === "runner" || normalizedRole === "rider") {
        // For runners, we show available orders AND their current accepted orders
        const [available, accepted] = await Promise.all([
          api.getAvailableOrders(),
          api.getMyAcceptedOrders()
        ]);
        data = [...(accepted || []), ...(available || [])];
      } else {
        // Fallback for other roles or generic dashboard
        data = await api.getVendorOrders(); // Default to vendor if unsure
      }

      setOrders((data || []).map(normalizeOrder));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
    // Poll every 45 seconds for live updates (adjust as needed)
    const interval = setInterval(fetchOrders, 45000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const createOrder = async (payload) => {
    let newOrder = await api.createOrder(payload);
    newOrder = normalizeOrder(newOrder);
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const acceptOrder = async (id) => {
    let updated = await api.acceptOrder(id);
    updated = normalizeOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  };

  const markPicked = async (id) => {
    let updated = await api.markOrderPicked(id);
    updated = normalizeOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  };

  const markDelivered = async (id) => {
    let updated = await api.markOrderDelivered(id);
    updated = normalizeOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  };

  const validateDelivery = async (id, delivery_code) => {
    let updated = await api.confirmDelivery(id, delivery_code);
    updated = normalizeOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  };

  const deleteOrder = async (id) => {
    await api.deleteOrder(id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
    acceptOrder,
    markPicked,
    markDelivered,
    validateDelivery,
    deleteOrder,
  };
}
