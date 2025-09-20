// @ts-nocheck
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useSubmissions from "@/hooks/useSubmissions";
import SubmissionsTable from "@/components/admin/SubmissionsTable";

export default function SubmissionsPage({ title = "Submissions", type, serverFilter = false, columns: colsProp }) {
  const navigate = useNavigate();

  const { rows, loading, err, approve, reject, toggleFeatured, remove } =
    useSubmissions({ type, serverFilter });

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

  // letters → letter, photos → photo, else both
  const featureScope = useMemo(() => {
    const t = String(type || "").toLowerCase();
    if (t === "letter") return "letter";
    if (t === "photo" || t === "photographs") return "photo";
    return "both";
  }, [type]);

  const onView = (id) => navigate(`/admin/submissions/${id}`);
  const onEdit = (id) => navigate(`/admin/submissions/${id}/edit`);

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>

      {err && <div className="mb-4 rounded bg-red-100 p-3 text-red-700">{err}</div>}

      <SubmissionsTable
        loading={loading}
        rows={rows}
        columns={columns}
        featureScope={featureScope}                
        onView={onView}
        onEdit={onEdit}
        onApprove={async (id) => { try { await approve(id); } catch (e) { alert(e?.response?.data?.message || "Approve failed"); } }}
        onReject={async (id) => { try { await reject(id); } catch (e) { alert(e?.response?.data?.message || "Reject failed"); } }}
        onToggleFeatured={async (id, field, next) => {  /* 👈 field-aware */
          try { await toggleFeatured(id, field, next); }
          catch (e) { alert(e?.response?.data?.message || "Feature toggle failed"); }
        }}
        onDelete={async (id) => { try { await remove(id); } catch (e) { alert(e?.response?.data?.message || "Delete failed"); } }}
      />
    </div>
  );
}
