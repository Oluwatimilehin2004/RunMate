import { useState, useEffect, useCallback } from "react";
import * as api from "../services/api";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const createOrder = async (payload) => {
    const newOrder = await api.createOrder(payload);
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateStatus = async (id, status) => {
    const updated = await api.updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  };

  const assignRider = async (id, assigned_rider) => {
    const updated = await api.assignRider(id, assigned_rider);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  };

  const validateDelivery = async (id, delivery_code) => {
    const result = await api.validateDelivery(id, delivery_code);
    if (result.success && result.order) {
      setOrders((prev) => prev.map((o) => (o.id === id ? result.order : o)));
    }
    return result;
  };

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
    updateStatus,
    assignRider,
    validateDelivery,
  };
}
