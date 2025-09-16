// src/context/AuthContext.jsx
// @ts-nocheck
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on app load
  const hydrate = useCallback(async () => {
    try {
      const stored = localStorage.getItem("adminToken");
      if (!stored) {
        setAdmin(null);
        setToken(null);
        return;
      }
      setToken(stored);
      const { data } = await api.get("/admin/me"); // interceptor adds Bearer
      setAdmin(data.admin);
    } catch (e) {
      localStorage.removeItem("adminToken");
      setAdmin(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await hydrate();
      setLoading(false);
    })();
  }, [hydrate]);

  // login with credentials
  const login = async (email, password) => {
    const { data } = await api.post(
      "/admin/login",
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    // store token from login
    localStorage.setItem("adminToken", data.token);
    setToken(data.token);
    setAdmin(data.admin);
    return data;
  };

  // fetch current admin
  const getMe = async () => {
    const { data } = await api.get("/admin/me");
    setAdmin(data.admin);
    return data.admin;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    setAdmin(null);
  };

  const value = { admin, token, loading, login, logout, getMe };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
