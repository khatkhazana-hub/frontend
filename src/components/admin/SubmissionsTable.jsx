// @ts-nocheck
import React from "react";
import SubmissionRow from "./SubmissionRow";

const norm = (v) => String(v || "").toLowerCase();

export default function SubmissionsTable({
  loading,
  rows,
  columns,
  featureScope = "both",
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onSetPending,      // NEW
  onModeratePart,
  onToggleFeatured,
}) {
  if (loading) return <div className="p-6">Loading submissions…</div>;
  if (!rows?.length) return <div className="p-6">No submissions found.</div>;

  const scope = norm(featureScope);
  const showLetterCol = scope === "both" || scope === "letter";
  const showPhotoCol  = scope === "both" || scope === "photo";

  return (
    <div className="overflow-x-auto rounded-xl border bg-white/50">
      <table className="min-w-full">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                {c.label}
              </th>
            ))}
            {showLetterCol && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Featured Letter
              </th>
            )}
            {showPhotoCol && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Featured Photo
              </th>
            )}
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <SubmissionRow
              key={r._id}
              row={r}
              columns={columns}
              showLetterCol={showLetterCol}
              showPhotoCol={showPhotoCol}
              onView={onView}
              onEdit={onEdit}
              onApprove={onApprove}
              onReject={onReject}
              onSetPending={onSetPending}     // NEW
              onModeratePart={onModeratePart}
              onToggleFeatured={onToggleFeatured}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
