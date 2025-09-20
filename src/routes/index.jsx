// src/routes/index.jsx
// @ts-nocheck
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { paths } from "./constants/paths";

import RootLayout from "../layouts/RootLayout";
import publicRoutes from "./publicRoutes";
import adminRoutes from "./adminRoutes";

const router = createBrowserRouter([
  {
    path: paths.HOME,
    element: <RootLayout />,
    children: [...publicRoutes],
  },
  ...adminRoutes, // mounted at /admin
  {
    path: "/access-denied",
    element: <h1 style={{ padding: 24 }}>Access Denied</h1>,
  },
  {
    path: "*",
    element: <h1 style={{ padding: 24 }}>404 — Not Found</h1>,
  },
]);

export default router;
