// src/layouts/RootLayout.jsx
// @ts-nocheck
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/pages/Navbar";
import Footer from "@/pages/Footer";

export default function RootLayout() {
  const { pathname } = useLocation();
  const showChrome = pathname !== "/"; // hide on homepage
  return (
    <>
      {showChrome && <Navbar />}
      <Outlet />
      {showChrome && <Footer />}
    </>
  );
}
