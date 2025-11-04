// @ts-nocheck
import React from "react";
import RowActions from "./row/RowActions";
import FeaturedSwitch from "./row/FeaturedSwitch";

const norm = (v) => String(v || "").toLowerCase();

export default function SubmissionRow({
  row,
  columns,
  showLetterCol = false,
  showPhotoCol = true,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onSetPending,          // 👈 NEW
  onToggleFeatured,
}) {
  const rowType = norm(row.uploadType); // 'letter' | 'photo' | 'both'
  const supportsLetter = rowType === "letter" || rowType === "both";
  const supportsPhoto  = rowType === "photographs" || rowType === "both";

  return (
    <tr className="border-t">
      {columns.map((c) => (
        <td key={c.key} className="px-4 py-3 text-sm">
          {String(row[c.key] ?? "—")}
        </td>
      ))}

      {showLetterCol && (
        <td className="px-4 py-3 text-sm">
          {supportsLetter ? (
            <FeaturedSwitch
              checked={!!row.featuredLetter}
              onChange={(next) => onToggleFeatured(row._id, "featuredLetter", next)}
            />
          ) : "—"}
        </td>
      )}

      {showPhotoCol && (
        <td className="px-4 py-3 text-sm">
          {supportsPhoto ? (
            <FeaturedSwitch
              checked={!!row.featuredPhoto}
              onChange={(next) => onToggleFeatured(row._id, "featuredPhoto", next)}
            />
          ) : "—"}
        </td>
      )}

      <td className="px-4 py-3">
        <RowActions
          status={(row.status || "").toLowerCase()}
          onView={() => onView(row._id)}
          onEdit={() => onEdit(row._id)}
          onApprove={() => onApprove(row._id)}
          onReject={() => onReject(row._id)}
          onSetPending={() => onSetPending(row._id)} 
          onDelete={() => onDelete(row._id)}
        />
      </td>
    </tr>
  );
}
