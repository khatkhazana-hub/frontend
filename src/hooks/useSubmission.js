// @ts-nocheck
import { useEffect, useState } from "react";
import api from "../utils/api";

/**
 * Fetch a single submission by id.
 * Returns { data, loading, error } and refetch()
 */
export default function useSubmission(id, { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState("");

  const fetchSubmission = async (signal) => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/submissions/${id}`, { signal });
      setData(res.data || null);
    } catch (e) {
      if (signal?.aborted) return;
      console.error(e);
      setError("Failed to load letter. Check the ID or server.");
      setData(null);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled || !id) return;
    const controller = new AbortController();
    fetchSubmission(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, enabled]);

  const refetch = () => {
    const controller = new AbortController();
    fetchSubmission(controller.signal);
    return () => controller.abort();
  };

  return { data, loading, error, refetch };
}
