// @ts-nocheck
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { SidebarProvider } from "@/context/SidebarContext";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      {/* lock the outer shell to viewport height so the column can be the scroller */}
      <div className="flex h-screen overflow-hidden">
        <Sidebar />

        {/* make this the scrolling container and always reserve the gutter */}
        <div className="flex min-w-0 flex-1 flex-col overflow-y-scroll [scrollbar-gutter:stable]">
          <Topbar />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

