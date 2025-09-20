// @ts-nocheck
import React from "react";
import RowActions from "./row/RowActions";
import FeaturedSwitch from "./row/FeaturedSwitch";

const norm = (v) => String(v || "").toLowerCase();

export default function SubmissionRow({
  row,
  columns,
  showLetterCol = true,
  showPhotoCol = true,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onToggleFeatured,
}) {
  const rowType = norm(row.uploadType); // 'letter' | 'photo' | 'both' (or variants)

  const supportsLetter = rowType === "letter" || rowType === "both";
  const supportsPhoto  = rowType === "photo"  || rowType === "both";

  return (
    <tr className="border-t">
      {columns.map((c) => (
        <td key={c.key} className="px-4 py-3 text-sm">
          {String(row[c.key] ?? "—")}
        </td>
      ))}

      {/* Featured Letter (conditional column) */}
      {showLetterCol && (
        <td className="px-4 py-3 text-sm">
          {supportsLetter ? (
            <FeaturedSwitch
              checked={!!row.featuredLetter}
              onChange={(next) => onToggleFeatured(row._id, "featuredLetter", next)}
            />
          ) : (
            "—"
          )}
        </td>
      )}

      {/* Featured Photo (conditional column) */}
      {showPhotoCol && (
        <td className="px-4 py-3 text-sm">
          {supportsPhoto ? (
            <FeaturedSwitch
              checked={!!row.featuredPhoto}
              onChange={(next) => onToggleFeatured(row._id, "featuredPhoto", next)}
            />
          ) : (
            "—"
          )}
        </td>
      )}

      {/* Actions */}
      <td className="px-4 py-3">
        <RowActions
          status={row.status}
          onView={() => onView(row._id)}
          onEdit={() => onEdit(row._id)}
          onApprove={() => onApprove(row._id)}
          onReject={() => onReject(row._id)}
          onDelete={() => onDelete(row._id)}
        />
      </td>
    </tr>
  );
}
