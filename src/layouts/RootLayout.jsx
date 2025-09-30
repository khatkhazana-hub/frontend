// src/layouts/RootLayout.jsx
// @ts-nocheck
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/pages/Navbar";
import Footer from "@/pages/Footer";
import Subcription from "../components/InnerComponents/Subcription";

export default function RootLayout() {
  const { pathname } = useLocation();

  // homepage per hide, baqi sab per show
  const showChrome = pathname !== "/";

  // subscription ko hide karo agar route contactus ya submission hai
  const hideSubscription = pathname === "/contact" || pathname === "/submission";

  return (
    <>
      {showChrome && <Navbar />}
      <Outlet />
      {showChrome && !hideSubscription && <Subcription />}
      {showChrome && <Footer />}
    </>
  );
}
