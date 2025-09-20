// @ts-nocheck
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, LogOut, User, Sun, Moon } from "lucide-react";
import MobileSidebar from "./TopbarMobileSidebar";

export default function Topbar() {
  const { open } = useSidebar();
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(); // make sure this clears token + auth state
      navigate("/admin-login", { replace: true });
    } catch (e) {
      console.error("logout failed:", e);
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="flex h-14 items-center gap-3 px-4">
        {/* mobile drawer trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <MobileSidebar />
          </SheetContent>
        </Sheet>

        {/* search */}
        <div className="hidden md:flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input className="w-[260px]" placeholder="Search…" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Theme toggle (demo only) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            title="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {/* user menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="" alt="@admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium">Admin</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate("/admin/profile")}>
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>

              {/* ✅ Use onSelect on the item, not on the icon */}
              <DropdownMenuItem onSelect={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator />
    </header>
  );
}
