// @ts-nocheck
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSubmissions from "@/hooks/useSubmissions";
import SubmissionsTable from "@/components/admin/SubmissionsTable";

const normalize = (value) => String(value || "").toLowerCase();

export default function SubmissionsPage({ title = "Submissions", type, serverFilter = false, columns: colsProp }) {
  const navigate = useNavigate();

  const { rows, loading, err, approve, reject, toggleFeatured, remove, setPending, moderatePart } =
    useSubmissions({ type, serverFilter });

  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // NEW: local overrides so items don't disappear after action
  const [localStatus, setLocalStatus] = useState({}); // { [id]: 'approved' | 'rejected' | 'pending' }

  const columns = useMemo(
    () =>
      colsProp || [
        { key: "fullName", label: "Name" },
        { key: "email", label: "Email" },
        { key: "title", label: "Title" },
        { key: "decade", label: "Decade" },
      ],
    [colsProp]
  );

  const baseFeatureScope = useMemo(() => {
    const t = normalize(type);
    if (t === "letter") return "letter";
    if (t === "photo" || t === "photographs") return "photo";
    return "both";
  }, [type]);

  const featureScope = useMemo(() => {
    if (typeFilter === "letter") return "letter";
    if (typeFilter === "photo") return "photo";
    return baseFeatureScope;
  }, [baseFeatureScope, typeFilter]);

  const filteredRows = useMemo(() => {
    const list = Array.isArray(rows) ? rows : [];
    if (!list.length) return list;

    return list.filter((row) => {
      const rowType = normalize(row?.uploadType);
      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "letter" &&
          (rowType === "letter" || rowType === "both")) ||
        (typeFilter === "photo" &&
          (rowType === "photo" || rowType === "photographs" || rowType === "both"));

      // use effective status = local override OR server status
      const effectiveStatus = normalize(localStatus[row?._id] ?? row?.status);
      const matchesStatus =
        statusFilter === "all" || effectiveStatus === statusFilter;

      return matchesType && matchesStatus;
    });
  }, [rows, statusFilter, typeFilter, localStatus]);

  const onView = (id) => navigate(`/admin/submissions/${id}`);
  const onEdit = (id) => navigate(`/admin/submissions/${id}/edit`);

  // helpers to set local status on success
  const bump = (id, next) =>
    setLocalStatus((m) => ({ ...m, [id]: next }));

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>

        <div className="flex flex-wrap items-end justify-center gap-3 sm:justify-end">
          {/* if you want the Type filter back, just uncomment your block */}
          <div className="flex flex-col text-left">
            <label htmlFor="submission-status-filter" className="text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="submission-status-filter"
              className="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {err && <div className="mb-4 rounded bg-red-100 p-3 text-red-700">{err}</div>}

      <SubmissionsTable
        loading={loading}
        rows={filteredRows}
        columns={columns}
        featureScope={featureScope}
        onView={onView}
        onEdit={onEdit}
        onApprove={async (id) => {
          try {
            await approve(id);
            bump(id, "approved");
          } catch (e) {
            alert(e?.response?.data?.message || "Approve failed");
          }
        }}
        onReject={async (id) => {
          try {
            await reject(id);
            bump(id, "rejected");
          } catch (e) {
            alert(e?.response?.data?.message || "Reject failed");
          }
        }}
        onSetPending={async (id) => {
          try {
            // your hook should expose this; if not, call a generic updateStatus(id, 'pending')
            await (setPending ? setPending(id) : Promise.resolve());
            bump(id, "pending");
          } catch (e) {
            alert(e?.response?.data?.message || "Set pending failed");
          }
        }}
        onModeratePart={async (id, part, nextStatus) => {
          try {
            await moderatePart(id, part, nextStatus);
          } catch (e) {
            alert(e?.response?.data?.message || "Partial moderation failed");
          }
        }}
        onToggleFeatured={async (id, field, next) => {
          try {
            await toggleFeatured(id, field, next);
          } catch (e) {
            alert(e?.response?.data?.message || "Feature toggle failed");
          }
        }}
        onDelete={async (id) => {
          try {
            await remove(id);
            // optional: clear local override so GC doesn’t keep stale status
            setLocalStatus((m) => {
              const copy = { ...m };
              delete copy[id];
              return copy;
            });
          } catch (e) {
            alert(e?.response?.data?.message || "Delete failed");
          }
        }}
      />
    </div>
  );
}
