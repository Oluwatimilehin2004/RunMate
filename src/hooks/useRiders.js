import { useState, useEffect, useCallback } from "react";
import * as api from "../services/api";

export function useRiders() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRiders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getRiders();
      setRiders(data || []);
    } catch (err) {
      // Silently fail if endpoint doesn't exist
      console.warn('Riders endpoint not available:', err.message);
      setRiders([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRiders();
  }, [fetchRiders]);

  const availableRiders = riders.filter(
    (r) => !r.assigned_orders || r.assigned_orders === 0
  );

  return {
    riders,
    availableRiders,
    loading,
    error,
    refetch: fetchRiders,
  };
}
