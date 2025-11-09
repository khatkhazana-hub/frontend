// @ts-nocheck
import React from "react";
import RowActions from "./row/RowActions";
import FeaturedSwitch from "./row/FeaturedSwitch";

const norm = (v) => String(v || "").toLowerCase();
const safeValue = (v) => (v === undefined || v === null ? "" : v);

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
  onSetPending,
  onModeratePart,
  onToggleFeatured,
}) {
  const rowType = norm(row.uploadType); // 'letter' | 'photo' | 'both'
  const supportsLetter = rowType === "letter" || rowType === "both";
  const supportsPhoto = rowType === "photographs" || rowType === "both";

  return (
    <tr className="border-t">
      {columns.map((c) => (
        <td key={c.key} className="px-4 py-3 text-sm">
          {String(safeValue(row[c.key]))}
        </td>
      ))}

      {showLetterCol && (
        <td className="px-4 py-3 text-sm">
          {supportsLetter ? (
            <FeaturedSwitch
              checked={!!row.featuredLetter}
              onChange={(next) =>
                onToggleFeatured(row._id, "featuredLetter", next)
              }
            />
          ) : (
            ""
          )}
        </td>
      )}

      {showPhotoCol && (
        <td className="px-4 py-3 text-sm">
          {supportsPhoto ? (
            <FeaturedSwitch
              checked={!!row.featuredPhoto}
              onChange={(next) =>
                onToggleFeatured(row._id, "featuredPhoto", next)
              }
            />
          ) : (
            ""
          )}
        </td>
      )}

      <td className="px-4 py-3">
        <RowActions
          status={(row.status || "").toLowerCase()}
          letterStatus={row.letterStatus}
          photoStatus={row.photoStatus}
          uploadType={row.uploadType}
          onView={() => onView(row._id)}
          onEdit={() => onEdit(row._id)}
          onApprove={() => onApprove(row._id)}
          onReject={() => onReject(row._id)}
          onSetPending={() => onSetPending(row._id)}
          onModeratePart={
            onModeratePart
              ? (part, nextStatus) => onModeratePart(row._id, part, nextStatus)
              : undefined
          }
          onDelete={() => onDelete(row._id)}
        />
      </td>
    </tr>
  );
}
