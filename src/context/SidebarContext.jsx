// @ts-nocheck
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  // persist
  useEffect(() => {
    const v = localStorage.getItem("admin_sidebar_collapsed");
    if (v === "true") setCollapsed(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("admin_sidebar_collapsed", String(collapsed));
  }, [collapsed]);

  const value = useMemo(() => ({
    collapsed,
    toggle: () => setCollapsed((v) => !v),
    open: () => setCollapsed(false),
    close: () => setCollapsed(true),
  }), [collapsed]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
