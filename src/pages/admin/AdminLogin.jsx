// src/pages/admin/AdminLogin.jsx
// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, getMe } = useAuth();
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const widgetIdRef = useRef(null);

  useEffect(() => {
    const ready = () =>
      typeof window !== "undefined" && window.turnstile && siteKey;

    const mount = () => {
      if (!ready()) return;
      try {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      } catch (err) {
        console.warn("turnstile remove failed:", err);
      }

      widgetIdRef.current = window.turnstile.render("#admin-turnstile", {
        sitekey: siteKey,
        theme: "light",
        callback: (token) => {
          setCaptchaToken(token || "");
        },
        "expired-callback": () => setCaptchaToken(""),
        "error-callback": () => setCaptchaToken(""),
        action: "admin_login",
      });
    };

    mount();
    const iv = setInterval(() => {
      if (ready() && !widgetIdRef.current) {
        mount();
      }
      if (widgetIdRef.current) clearInterval(iv);
    }, 300);

    return () => clearInterval(iv);
  }, [siteKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!captchaToken) {
      setErrorMsg("Please complete the captcha first.");
      return;
    }
    try {
      setLoading(true);
      await login(email, password, captchaToken);
      await getMe();
      setSuccessMsg("Login successful! Redirecting...");
      const redirectTo ="/admin/both";
      setTimeout(() => navigate(redirectTo, { replace: true }), 400);
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch (err) {
          console.warn("turnstile reset failed:", err);
        }
      }
      setCaptchaToken("");
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Login failed. Please try again.");
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch (resetErr) {
          console.warn("turnstile reset failed:", resetErr);
        }
      }
      setCaptchaToken("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* CARD */}
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="rounded-2xl border border-[#8B4513]/20  p-8 shadow-xl backdrop-blur"
          >
            {/* Big logo INSIDE the card, top-center */}
            <div className="mb-4 flex items-center justify-center">
              <img
                src='../images/logo.png'
                alt="KhatKhazana"
                className="h-28 w-fit drop-shadow-sm"
                draggable="false"
              />
            </div>

            <div className="mb-6 text-center">
              <h1 className="mb-1 text-3xl font-extrabold text-[#6E4A27] tracking-wide">
                Admin Login
              </h1>
              
            </div>

            {/* alerts */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700"
              >
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* email */}
              <div className="group">
                <label className="mb-1 block text-sm font-semibold">Email</label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6E4A27]/60">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-[#8B4513]/30 px-10 py-2 outline-none transition focus:border-[#6E4A27 focus:shadow-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* password with working eye toggle */}
              <div className="group">
                <label className="mb-1 block text-sm font-semibold">Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6E4A27]/60">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-[#8B4513]/30  px-10 py-2 pr-10 outline-none transition focus:border-[#6E4A27] focus:shadow-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    aria-pressed={showPass}
                    aria-label={showPass ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E4A27]/60 transition hover:text-[#6E4A27]"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#6E4A27] underline underline-offset-2 hover:text-[#5b3e20]"
                >
                  Forgot your password?
                </Link>
              </div>

              <div className="pt-2">
                <div id="admin-turnstile" />
                <input type="hidden" name="cf-turnstile-response" value={captchaToken} />
              </div>

              <motion.button
                type="submit"
                disabled={loading || !captchaToken}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-[#6E4A27] px-4 py-2 font-semibold text-white shadow-md transition-colors hover:bg-[#79542f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Logging in…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Login
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
