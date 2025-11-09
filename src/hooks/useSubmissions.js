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

  const mergeFromResponse = (id, response, fallback) => {
    const next = response?.data?.data;
    if (next && typeof next === "object") {
      updateRow(id, next);
    } else if (fallback) {
      updateRow(id, fallback);
    }
  };

  // --- mutations that ALWAYS clear error on success ---
  const approve = useCallback(async (id) => {
    try {
      const res = await api.patch(`/submissions/${id}/approve`);
      mergeFromResponse(id, res, { status: "approved" });
      setErr("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Action failed");
      throw e;
    }
  }, []);

  const reject = useCallback(async (id) => {
    try {
      const res = await api.patch(`/submissions/${id}/reject`);
      mergeFromResponse(id, res, { status: "rejected" });
      setErr("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Action failed");
      throw e;
    }
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    try {
      const res = await api.patch(`/submissions/${id}`, { status });
      mergeFromResponse(id, res, { status });
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
      const res = await api.patch(`/submissions/${id}/pending`);
      mergeFromResponse(id, res, { status: "pending" });
      setErr("");
    } catch (e1) {
      try {
        // fallback to generic status patch
        const res = await api.patch(`/submissions/${id}`, { status: "pending" });
        mergeFromResponse(id, res, { status: "pending" });
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
      const res = await api.patch(`/submissions/${id}`, { [field]: next });
      mergeFromResponse(id, res, { [field]: next });
      setErr("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Action failed");
      throw e;
    }
  }, []);

  const moderatePart = useCallback(async (id, part, nextStatus) => {
    const targetPart = norm(part);
    if (!["letter", "photo"].includes(targetPart)) {
      throw new Error("Invalid part target");
    }
    const targetStatus = norm(nextStatus);
    if (!["approved", "rejected", "pending"].includes(targetStatus)) {
      throw new Error("Invalid status value");
    }

    try {
      let res;
      if (targetStatus === "approved" || targetStatus === "rejected") {
        const endpoint = targetStatus === "approved" ? "approve" : "reject";
        res = await api.patch(`/submissions/${id}/${endpoint}`, {
          part: targetPart,
        });
      } else {
        const field =
          targetPart === "letter" ? "letterStatus" : "photoStatus";
        res = await api.patch(`/submissions/${id}`, {
          [field]: "pending",
        });
      }

      const fallback =
        targetPart === "letter"
          ? { letterStatus: targetStatus }
          : { photoStatus: targetStatus };
      mergeFromResponse(id, res, fallback);
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
    moderatePart,
    toggleFeatured,
    remove,
    setRows,
  };
}
