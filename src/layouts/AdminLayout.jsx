// @ts-nocheck
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { SidebarProvider } from "@/context/SidebarContext";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/30">
        {/* fixed sidebar column */}
        <Sidebar />

        {/* right column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* topbar starts where sidebar ends */}
          <Topbar />
          {/* page content */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
