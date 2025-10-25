// @ts-nocheck
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Mail,
  Images,
  BookText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Lock,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/both", label: "Both", icon: BookText },
  { to: "/admin/letters", label: "Letters", icon: BookText },
  { to: "/admin/photos", label: "Photos", icon: Images },
  { to: "/admin/categories", label: "Categories", icon: Images },
  { to: "/admin/contact-data", label: "Contact-Us Data", icon: Mail },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: Mail },
];

export default function Sidebar() {
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 min-h-full border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75",
        "transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Brand + collapse button */}
        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex items-center gap-2 overflow-hidden">
            {/* ✅ Logo added here */}
            <img
              src="/images/logo.png" // <-- put your logo in public/logo.png or use any URL
              alt="Logo"
              className="h-12 w-12 object-contain"
            />

            {/* Lock icon stays */}
            <Lock className="h-5 w-5 text-primary" />

            {/* Brand name */}
            {!collapsed && (
              <span className="truncate font-semibold tracking-wide">
                Long Lost Letters
              </span>
            )}
          </div>

          {/* Collapse button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={toggle}
            className="h-8 w-8"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <Separator />

        {/* Nav */}
        <TooltipProvider delayDuration={100}>
          <nav className="mt-2 flex-1 space-y-1 px-2">
            {NAV.map(({ to, label, icon: Icon }) => {
              const item = (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate">{label}</span>}
                </NavLink>
              );

              return collapsed ? (
                <Tooltip key={to}>
                  <TooltipTrigger asChild>{item}</TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              ) : (
                item
              );
            })}
          </nav>
        </TooltipProvider>

        <Separator className="mt-auto" />

        {/* Footer spot (version/logout/etc.) */}
        <div className="p-2 text-[11px] text-muted-foreground">
          {!collapsed ? "v1.0.0" : "v1"}
        </div>
      </div>
    </aside>
  );
}
