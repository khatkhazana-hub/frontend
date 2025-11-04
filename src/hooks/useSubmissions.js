// @ts-nocheck
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/utils/api";

const norm = (v) => String(v || "").trim().toLowerCase();

export default function useSubmissions({ type, serverFilter = false } = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      let url = "/submissions";
      if (serverFilter && type && typeof type === "string") {
        url = `/submissions?type=${encodeURIComponent(type)}`;
      }
      const { data } = await api.get(url);
      setRows(Array.isArray(data) ? data : []);
      setErr(""); // clear any old error on successful fetch
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }, [type, serverFilter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredRows = useMemo(() => {
    if (!type || serverFilter) return rows;
    const types = Array.isArray(type) ? type.map(norm) : [norm(type)];
    return rows.filter((r) => types.includes(norm(r.uploadType)));
  }, [rows, type, serverFilter]);

  const updateRow = (id, patch) =>
    setRows((prev) => prev.map((r) => (r._id === id ? { ...r, ...patch } : r)));

  // --- mutations that ALWAYS clear error on success ---
  const approve = useCallback(async (id) => {
    try {
      await api.patch(`/submissions/${id}/approve`);
      updateRow(id, { status: "approved" });
      setErr("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Action failed");
      throw e;
    }
  }, []);

  const reject = useCallback(async (id) => {
    try {
      await api.patch(`/submissions/${id}/reject`);
      updateRow(id, { status: "rejected" });
      setErr("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Action failed");
      throw e;
    }
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    try {
      await api.patch(`/submissions/${id}`, { status });
      updateRow(id, { status });
      setErr("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Action failed");
      throw e;
    }
  }, []);

  // ✅ only show error if BOTH attempts fail
  const setPending = useCallback(async (id) => {
    try {
      // try explicit /pending route if your API has it
      await api.patch(`/submissions/${id}/pending`);
      updateRow(id, { status: "pending" });
      setErr("");
    } catch (e1) {
      try {
        // fallback to generic status patch
        await api.patch(`/submissions/${id}`, { status: "pending" });
        updateRow(id, { status: "pending" });
        setErr(""); // make sure banner is cleared after successful fallback
      } catch (e2) {
        setErr(
          e2?.response?.data?.message ||
          e1?.response?.data?.message ||
          "Action failed"
        );
        throw e2;
      }
    }
  }, []);

  const toggleFeatured = useCallback(async (id, field, next) => {
    try {
      await api.patch(`/submissions/${id}`, { [field]: next });
      updateRow(id, { [field]: next });
      setErr("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Action failed");
      throw e;
    }
  }, []);

  const remove = useCallback(async (id) => {
    try {
      await api.delete(`/submissions/${id}`);
      setRows((prev) => prev.filter((r) => r._id !== id));
      setErr("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Action failed");
      throw e;
    }
  }, []);

  // nice-to-have: expose a way to manually clear the banner
  const clearError = useCallback(() => setErr(""), []);

  return {
    rows: filteredRows,
    rawRows: rows,
    loading,
    err,
    clearError,   // use to dismiss the pink box on click if you want
    refresh,
    approve,
    reject,
    setPending,
    updateStatus,
    toggleFeatured,
    remove,
    setRows,
  };
}
