import { useState, useEffect, useCallback } from "react";
import { getRiders } from "../services/api";

export function useRiders() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRiders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRiders();
      setRiders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRiders();
  }, [fetchRiders]);

  // A rider is "available" if assigned_orders count is 0 (or field is falsy/null)
  const availableRiders = riders.filter(
    (r) => !r.assigned_orders || r.assigned_orders === 0
  );

  return { riders, availableRiders, loading, error, refetch: fetchRiders };
}
