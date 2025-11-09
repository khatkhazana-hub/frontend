// @ts-nocheck
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  const handleDelete = () => {
    if (confirm("Delete this submission? This cannot be undone.")) onDelete();
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1">
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
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Submission</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {s !== "approved" && (
              <DropdownMenuItem
                onClick={onApprove}
                className={cn(
                  "cursor-pointer",
                  s === "approved" && "text-green-600"
                )}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
              </DropdownMenuItem>
            )}

            {s !== "rejected" && (
              <DropdownMenuItem
                onClick={onReject}
                className={cn(
                  "cursor-pointer",
                  s === "rejected" && "text-red-600"
                )}
              >
                <XCircle className="mr-2 h-4 w-4" /> Reject
              </DropdownMenuItem>
            )}

            {s !== "pending" && (
              <DropdownMenuItem onClick={onSetPending} className="cursor-pointer">
                <Clock className="mr-2 h-4 w-4" /> Pending
              </DropdownMenuItem>
            )}

            {isBoth && onModeratePart && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Letter (Both)</DropdownMenuLabel>
                {letter !== "approved" && (
                  <DropdownMenuItem
                    onClick={() => handleModerate("letter", "approved")}
                    className="cursor-pointer"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Letter
                  </DropdownMenuItem>
                )}
                {letter !== "rejected" && (
                  <DropdownMenuItem
                    onClick={() => handleModerate("letter", "rejected")}
                    className="cursor-pointer"
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Reject Letter
                  </DropdownMenuItem>
                )}
                {letter !== "pending" && (
                  <DropdownMenuItem
                    onClick={() => handleModerate("letter", "pending")}
                    className="cursor-pointer"
                  >
                    <Clock className="mr-2 h-4 w-4" /> Mark Letter Pending
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Photo (Both)</DropdownMenuLabel>
                {photo !== "approved" && (
                  <DropdownMenuItem
                    onClick={() => handleModerate("photo", "approved")}
                    className="cursor-pointer"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Photo
                  </DropdownMenuItem>
                )}
                {photo !== "rejected" && (
                  <DropdownMenuItem
                    onClick={() => handleModerate("photo", "rejected")}
                    className="cursor-pointer"
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Reject Photo
                  </DropdownMenuItem>
                )}
                {photo !== "pending" && (
                  <DropdownMenuItem
                    onClick={() => handleModerate("photo", "pending")}
                    className="cursor-pointer"
                  >
                    <Clock className="mr-2 h-4 w-4" /> Mark Photo Pending
                  </DropdownMenuItem>
                )}
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="cursor-pointer text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
