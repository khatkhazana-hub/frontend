// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Pencil,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Trash2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const norm = (v) => String(v || "").toLowerCase();
const pretty = (v) => v.charAt(0).toUpperCase() + v.slice(1);
const badgeClass = (status) =>
  cn(
    "rounded-full border px-2 py-0.5 text-xs font-semibold",
    status === "approved" && "border-green-200 bg-green-50 text-green-700",
    status === "rejected" && "border-red-200 bg-red-50 text-red-700",
    status === "pending" && "border-yellow-200 bg-yellow-50 text-yellow-700"
  );

export default function RowActions({
  status,
  letterStatus,
  photoStatus,
  uploadType,
  onView,
  onEdit,
  onApprove,
  onReject,
  onSetPending,
  onModeratePart,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  const handleDelete = () => {
    if (confirm("Delete this submission? This cannot be undone.")) onDelete();
    setOpen(false);
  };

  const s = norm(status);
  const uploadKind = norm(uploadType);
  const isBoth = uploadKind === "both";
  const letter =
    norm(letterStatus) || (isBoth ? (s || "pending") : "pending");
  const photo =
    norm(photoStatus) || (isBoth ? (s || "pending") : "pending");

  const handleModerate = (part, nextStatus) => {
    if (!onModeratePart) return;
    onModeratePart(part, nextStatus);
    setOpen(false);
  };

  // close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const act = (fn) => () => {
    if (fn) fn();
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {isBoth && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className={badgeClass(letter)}>Letter: {pretty(letter)}</span>
          <span className={badgeClass(photo)}>Photo: {pretty(photo)}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onView} className="gap-1">
          <Eye className="h-4 w-4" />
          View
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit} className="gap-1">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>

        <div className="relative">
          <Button
            ref={triggerRef}
            size="sm"
            className="gap-1"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-haspopup="menu"
          >
            {s === "approved" ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Approved
                <ChevronDown className="h-4 w-4" />
              </>
            ) : s === "rejected" ? (
              <>
                <XCircle className="h-4 w-4 text-red-600" />
                Rejected
                <ChevronDown className="h-4 w-4" />
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" />
                Pending
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>

          {open && (
            <div
              ref={menuRef}
              className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-md border bg-white shadow-lg"
              role="menu"
            >
              <div className="px-3 py-2 text-sm font-semibold text-gray-700">
                Submission
              </div>
              <div className="h-px bg-gray-200" />

              {s !== "approved" && (
                <button
                  type="button"
                  onClick={act(onApprove)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50",
                    s === "approved" && "text-green-600"
                  )}
                  role="menuitem"
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve
                </button>
              )}

              {s !== "rejected" && (
                <button
                  type="button"
                  onClick={act(onReject)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50",
                    s === "rejected" && "text-red-600"
                  )}
                  role="menuitem"
                >
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              )}

              {s !== "pending" && (
                <button
                  type="button"
                  onClick={act(onSetPending)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                  role="menuitem"
                >
                  <Clock className="h-4 w-4" /> Pending
                </button>
              )}

              {isBoth && onModeratePart && (
                <>
                  <div className="h-px bg-gray-200" />
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Letter (Both)
                  </div>
                  {letter !== "approved" && (
                    <button
                      type="button"
                      onClick={() => handleModerate("letter", "approved")}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                      role="menuitem"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Approve Letter
                    </button>
                  )}
                  {letter !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => handleModerate("letter", "rejected")}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                      role="menuitem"
                    >
                      <XCircle className="h-4 w-4" /> Reject Letter
                    </button>
                  )}
                  {letter !== "pending" && (
                    <button
                      type="button"
                      onClick={() => handleModerate("letter", "pending")}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                      role="menuitem"
                    >
                      <Clock className="h-4 w-4" /> Mark Letter Pending
                    </button>
                  )}

                  <div className="h-px bg-gray-200" />
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Photo (Both)
                  </div>
                  {photo !== "approved" && (
                    <button
                      type="button"
                      onClick={() => handleModerate("photo", "approved")}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                      role="menuitem"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Approve Photo
                    </button>
                  )}
                  {photo !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => handleModerate("photo", "rejected")}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                      role="menuitem"
                    >
                      <XCircle className="h-4 w-4" /> Reject Photo
                    </button>
                  )}
                  {photo !== "pending" && (
                    <button
                      type="button"
                      onClick={() => handleModerate("photo", "pending")}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                      role="menuitem"
                    >
                      <Clock className="h-4 w-4" /> Mark Photo Pending
                    </button>
                  )}
                </>
              )}

              <div className="h-px bg-gray-200" />
              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                role="menuitem"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
