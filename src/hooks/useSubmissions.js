// @ts-nocheck
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/utils/api";

const norm = (v) =>
  String(v || "")
    .trim()
    .toLowerCase();

/**
 * useSubmissions
 * @param {Object} opts
 * @param {'letter'|'photo'|'both'|string|string[]} [opts.type] - uploadType filter(s)
 * @param {boolean} [opts.serverFilter=false] - hit /submissions?type=... instead of client filtering
 */
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
      setErr("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }, [type, serverFilter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // client-side filtering (if serverFilter=false)
  const filteredRows = useMemo(() => {
    if (!type || serverFilter) return rows;
    const types = Array.isArray(type) ? type.map(norm) : [norm(type)];
    return rows.filter((r) => types.includes(norm(r.uploadType)));
  }, [rows, type, serverFilter]);

  // ---- mutations ----
  const updateRow = (id, patch) =>
    setRows((prev) => prev.map((r) => (r._id === id ? { ...r, ...patch } : r)));

  const approve = useCallback(async (id) => {
    await api.patch(`/submissions/${id}/approve`);
    updateRow(id, { status: "approved" });
  }, []);

  const reject = useCallback(async (id) => {
    await api.patch(`/submissions/${id}/reject`);
    updateRow(id, { status: "rejected" });
  }, []);

  const toggleFeatured = useCallback(async (id, field, next) => {
    await api.patch(`/submissions/${id}`, { [field]: next });
    updateRow(id, { [field]: next });
  }, []);

  const remove = useCallback(async (id) => {
    await api.delete(`/submissions/${id}`);
    setRows((prev) => prev.filter((r) => r._id !== id));
  }, []);

  return {
    rows: filteredRows,
    rawRows: rows,
    loading,
    err,
    refresh,
    approve,
    reject,
    toggleFeatured,
    remove,
    setRows, // exposed just in case
  };
}
