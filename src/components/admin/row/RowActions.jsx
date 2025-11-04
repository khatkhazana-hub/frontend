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

export default function RowActions({
  status,
  onView,
  onEdit,
  onApprove,
  onReject,
  onSetPending,   // 👈 NEW
  onDelete,
}) {
  const handleDelete = () => {
    if (confirm("Delete this submission? This cannot be undone.")) onDelete();
  };

  const s = (status || "").toLowerCase();

  return (
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

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Moderation</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Only show actions that make sense for current status */}
          {s !== "approved" && (
            <DropdownMenuItem
              onClick={onApprove}
              className={cn("cursor-pointer", s === "approved" && "text-green-600")}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
            </DropdownMenuItem>
          )}

          {s !== "rejected" && (
            <DropdownMenuItem
              onClick={onReject}
              className={cn("cursor-pointer", s === "rejected" && "text-red-600")}
            >
              <XCircle className="mr-2 h-4 w-4" /> Reject
            </DropdownMenuItem>
          )}

          {s !== "pending" && (
            <DropdownMenuItem
              onClick={onSetPending}
              className="cursor-pointer"
            >
              <Clock className="mr-2 h-4 w-4" />pending
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-red-600 cursor-pointer">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
