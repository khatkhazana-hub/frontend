// @ts-nocheck
import { useEffect, useState } from "react";
import api from "../utils/api";

/**
 * Featured letters only when status is approved.
 * Returns: { data, loading, error, refetch }
 */
export default function useFeaturedLetters({ enabled = true } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState("");

  const isApproved = (val) => {
    if (typeof val === "boolean") return val === true;
    if (typeof val === "string") return val.trim().toLowerCase() === "approved";
    return false;
  };

  const getStatus = (item) =>
    item?.status ?? item?.reviewStatus ?? item?.review?.status;

  const fetchFeatured = async (signal) => {
    if (!enabled) return;
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/submissions", { signal });
      const raw = Array.isArray(res.data) ? res.data : res?.data?.data || [];

      const featuredApproved = raw.filter(
        (x) => x?.featuredLetter === true && isApproved(getStatus(x))
      );

      setData(featuredApproved);
    } catch (e) {
      if (signal?.aborted) return;
      console.error(e);
      setError("Failed to load featured letters.");
      setData([]);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    fetchFeatured(controller.signal);
    return () => controller.abort();
  }, [enabled]);

  const refetch = () => {
    const controller = new AbortController();
    fetchFeatured(controller.signal);
    return () => controller.abort();
  };

  return { data, loading, error, refetch };
}
