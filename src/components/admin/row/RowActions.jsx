// src/components/admin/row/RowActions.jsx
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
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RowActions({
  status,
  onView,
  onEdit,
  onApprove,
  onReject,
  onDelete,
}) {
  const handleDelete = () => {
    if (confirm("Delete this submission? This cannot be undone.")) onDelete();
  };

  // decide button ka color aur text dynamically set karo
  const decideText =
    status === "approved"
      ? "Approved"
      : status === "rejected"
      ? "Rejected"
      : "Decide";

  const decideClass =
    status === "approved"
      ? "bg-green-500 text-white hover:bg-green-600"
      : status === "rejected"
      ? "bg-red-500 text-white hover:bg-red-600"
      : "";

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
          <Button size="sm" className={cn("gap-1", decideClass)}>
            {decideText}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Moderation</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onApprove}
            className={cn(status === "approved" && "text-green-600")}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onReject}
            className={cn(status === "rejected" && "text-red-600")}
          >
            <XCircle className="mr-2 h-4 w-4" /> Reject
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
