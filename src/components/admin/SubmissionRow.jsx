// @ts-nocheck
import React from "react";
import RowActions from "./row/RowActions";
import FeaturedSwitch from "./row/FeaturedSwitch";

const norm = (v) => String(v || "").toLowerCase();
const safeValue = (v) => (v === undefined || v === null ? "" : v);

const prettyDateTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
};

const renderCell = (column, row) => {
  if (typeof column.render === "function") return column.render(row);

  if (column.key === "createdAt" || column.key === "updatedAt") {
    return prettyDateTime(row[column.key]);
  }

  return String(safeValue(row[column.key]));
};

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
          {renderCell(c, row)}
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
