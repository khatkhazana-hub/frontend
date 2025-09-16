    // src/components/ProtectedRoute.jsx
    // @ts-nocheck
    import React from "react";
    import { Navigate, useLocation } from "react-router-dom";
    import { useAuth } from "../../context/AuthContext";

    export default function ProtectedRoute({ children }) {
    const { admin, loading } = useAuth();

    console.log(admin , 'admin')
    const location = useLocation();

    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Loading...</p>
        </div>
        );
    }

    if (!admin) {
        return <Navigate to="/admin-login" replace state={{ from: location }} />;
    }

    return children;
    }
