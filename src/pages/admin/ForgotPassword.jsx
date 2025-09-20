// @ts-nocheck
import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (!email) return setErr("Email is required.");

    try {
      setLoading(true);

      const { data } = await api.post("/admin/password/forgot", {
        email: email.trim(),
      });

      // server might return generic or explicit message (if you enabled 404 on not-found)
      setMsg(data?.message || "If that account exists, a reset link has been sent.");
      setEmail("");
    } catch (error) {
      const m = error?.response?.data?.message || error?.message || "Failed to request reset.";
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
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>

        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        {err && <p className="text-red-600 text-sm">{err}</p>}
        {msg && <p className="text-green-600 text-sm">{msg}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-black text-white font-bold py-2 px-4 rounded-lg transition ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
          }`}
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>

        <div className="text-center text-sm">
          <Link to="/admin-login" className="underline">Back to login</Link>
        </div>
      </form>
    </main>
  );
}
