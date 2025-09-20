// @ts-nocheck
import React from "react";
import Sidebar from "./Sidebar";

export default function MobileSidebar() {
  // reuse Sidebar inside Sheet; it's fine since SheetContent is portal-mounted
  return <Sidebar />;
}
