import { useState, useEffect, useCallback } from "react";
import * as api from "../services/api";

const normalizeOrder = (o) => {
  const itemsJsonStr = o.items
    ? typeof o.items === "string" ? o.items : JSON.stringify(o.items)
    : o.items_json || "[]";

  let parsed = [];
  try {
    parsed = typeof o.items === "object" ? o.items : JSON.parse(itemsJsonStr);
  } catch (e) { }

  return {
    ...o,
    id: o._id || o.id,
    delivery_code: o.delivery_code || o.deliveryCode || o.code || "N/A",
    customer_name: o.customerName || o.customer_name || o.name,
    payment_method: o.paymentMethod || o.payment_method || "cash",
    location: o.deliveryLocation || o.location || o.address,
    items_json: JSON.stringify(parsed || [])
  };
};

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

      const targetUser = user.user || user;
      const r = targetUser.roles || targetUser.role;
      const normalizedRole = (Array.isArray(r) ? r[0] : r)?.replace(/^ROLE_/i, "").toLowerCase();

      console.log('Fetching orders for role:', normalizedRole);

      if (normalizedRole === "vendor") {
        data = await api.getVendorOrders().catch(err => {
          console.error('Vendor orders error:', err);
          return [];
        });
      } else if (normalizedRole === "runner") {
        const [available, accepted] = await Promise.all([
          api.getAvailableOrders().catch(() => []),
          api.getMyAcceptedOrders().catch(() => [])
        ]);
        data = [...(accepted || []), ...(available || [])];
      } else if (normalizedRole === "rider") {
        data = await api.getAvailableOrders().catch(() => []);
      } else {
        data = [];
      }

      setOrders((data || []).map(normalizeOrder));
    } catch (err) {
      console.error('Order fetch error:', err.message);
      setError(null); // Don't show error, just return empty
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
    // Poll every 2 minutes for live updates
    const interval = setInterval(fetchOrders, 120000);
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
