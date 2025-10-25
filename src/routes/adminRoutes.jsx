// src/routes/adminRoutes.jsx
// @ts-nocheck
import React from "react";
import { paths } from "./constants/paths";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "../components/protected/ProtectedRoutes";
import SubmissionDetail from "@/pages/admin/SubmissionDetail";
import SubmissionEdit from "@/pages/admin/SubmissionEdit";
import AdminLetters from "@/pages/admin/AdminLetters";
import AdminPhotos from "@/pages/admin/AdminPhotos";
import CreateCategories from "@/pages/admin/CreateCategories";
import ContactData from "@/pages/admin/ContactData";
import SubscriptionData from "@/pages/admin/SubscriptionData";

const adminRoutes = [
  {
    path: paths.ADMIN, // "/admin"
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
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
      {
        path: "submissions/:id",
        element: (
          <ProtectedRoute>
            <SubmissionDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "submissions/:id/edit",
        element: (
          <ProtectedRoute>
            <SubmissionEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "categories",
        element: (
          <ProtectedRoute>
            <CreateCategories />
          </ProtectedRoute>
        ),
      },
      {
        path: "contact-data",
        element: (
          <ProtectedRoute>
            <ContactData />
          </ProtectedRoute>
        ),
      },
      {
        path: "subscriptions",
        element: (
          <ProtectedRoute>
            <SubscriptionData />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default adminRoutes;
