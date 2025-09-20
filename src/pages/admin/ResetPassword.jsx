// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const qEmail = String(params.get("email") || "");
    const qToken = String(params.get("token") || "");
    setEmail(qEmail);
    setToken(qToken);
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!email || !token) return setErr("Invalid or expired reset link.");
    if (!password || password.length < 8)
      return setErr("Password must be at least 8 characters.");
    if (password !== confirm) return setErr("Passwords do not match.");

    try {
      setLoading(true);

      await api.post("/admin/password/reset", {
        email,
        token,
        newPassword: password,
      });

      setMsg("Password updated. Redirecting to login…");
      setTimeout(() => navigate("/admin-login", { replace: true }), 1200);
    } catch (error) {
      const m =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to reset password.";
      setErr(m);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 p-6 rounded-2xl shadow-xl border"
      >
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>

        <input
          type="email"
          className="w-full border rounded-lg px-3 py-2 bg-gray-100"
          value={email}
          disabled
        />

        <input
          type="password"
          className="w-full border rounded-lg px-3 py-2"
          placeholder="New password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        {err && <p className="text-red-600 text-sm">{err}</p>}
        {msg && <p className="text-green-600 text-sm">{msg}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-black text-white font-bold py-2 px-4 rounded-lg transition ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
          }`}
        >
          {loading ? "Updating…" : "Update Password"}
        </button>

        <div className="text-center text-sm">
          <Link to="/admin/login" className="underline">
            Back to login
          </Link>
        </div>
      </form>
    </main>
  );
}
