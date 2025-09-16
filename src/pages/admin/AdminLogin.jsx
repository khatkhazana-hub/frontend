// src/pages/admin/AdminLogin.jsx
// @ts-nocheck
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, getMe } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      setLoading(true);
      await login(email, password);   // set token + admin
      await getMe();                  // immediately fetch fresh admin
      setSuccessMsg("Login successful! Redirecting...");
      const redirectTo = location.state?.from?.pathname || "/admin-dashboard";
      navigate(redirectTo, { replace: true }); // redirect immediately
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl shadow-xl p-8 border border-[#8B4513]/30">
        <h1 className="text-2xl font-bold text-[#6E4A27] mb-6 text-center">
          Admin Login
        </h1>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#6E4A27]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#6E4A27]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#6E4A27] text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#79542f]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
