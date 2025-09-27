// src/routes/adminRoutes.jsx
// @ts-nocheck
import React from "react";
import { Navigate } from "react-router-dom";
import { paths } from "./constants/paths";
import AdminLayout from "../layouts/AdminLayout";
import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "../components/protected/ProtectedRoutes";
import SubmissionDetail from "@/pages/admin/SubmissionDetail";
import SubmissionEdit from "@/pages/admin/SubmissionEdit";
import AdminLetters from "@/pages/admin/AdminLetters";
import AdminPhotos from "@/pages/admin/AdminPhotos";
import CreateCategories from "@/pages/admin/CreateCategories";
import ContactData from "@/pages/admin/ContactData";

const adminRoutes = [
  {
    path: paths.ADMIN, // "/admin"
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <h1>DASHBOARD</h1> },
      {
        path: "both",
        element: (
          <ProtectedRoute>
            <Dashboard title="Admin-Dashboard" />
          </ProtectedRoute>
        ),
      },
      {
        path: "letters",
        element: (
          <ProtectedRoute>
            <AdminLetters />
          </ProtectedRoute>
        ),
      },
      {
        path: "photos",
        element: (
          <ProtectedRoute>
            <AdminPhotos />
          </ProtectedRoute>
        ),
      },
      { path: "submissions/:id", element: <SubmissionDetail /> },
      { path: "submissions/:id/edit", element: <SubmissionEdit /> }, 
      { path: "categories", element: <CreateCategories /> }, 
      { path: "contact-data", element: <ContactData/> }, 
    ],
  },
];

export default adminRoutes;
