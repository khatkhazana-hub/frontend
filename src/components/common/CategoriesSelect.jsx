// src/components/common/CategoriesSelect.jsx
import React, { useMemo } from "react";
import useCategories from "@/hooks/useCategories";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesSelect({ value, onChange, label = "Category", includePlaceholder = true }) {
  const { activeOptions, loading, error } = useCategories({ auto: true });

  const items = useMemo(() => activeOptions, [activeOptions]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-1">
        <Label>{label}</Label>
        <p className="text-sm text-red-600">Failed to load categories</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {includePlaceholder && (
            <SelectItem value="">(none)</SelectItem>
          )}
          {items.map((c) => (
            <SelectItem key={c._id} value={c.slug}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
