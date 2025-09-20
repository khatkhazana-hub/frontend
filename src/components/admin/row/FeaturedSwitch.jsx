// src/components/admin/row/FeaturedSwitch.jsx
// @ts-nocheck
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function FeaturedSwitch({ checked, onChange }) {
  const [local, setLocal] = useState(!!checked);

  const handle = async (v) => {
    setLocal(v);
    try {
      await onChange(v);
    } catch {
      // revert on error
      setLocal(!v);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Switch checked={local} onCheckedChange={handle} id="featured" />
      <label htmlFor="featured" className="text-xs text-muted-foreground">
        Featured
      </label>
    </div>
  );
}
