import ParchmentButton from "@/components/InnerComponents/ParchmentButton";
import api from "@/utils/api";
import React, { useEffect, useRef, useState } from "react";

const PopupSubscritionModel = ({ onSubscribe }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const widgetIdRef = useRef(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

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

      widgetIdRef.current = window.turnstile.render("#subscription-turnstile", {
        sitekey: siteKey,
        theme: "light",
        callback: (token) => setCaptchaToken(token || ""),
        "expired-callback": () => setCaptchaToken(""),
        "error-callback": () => setCaptchaToken(""),
        action: "subscribe_popup",
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

  const resetCaptcha = () => {
    if (window.turnstile && widgetIdRef.current) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch (err) {
        console.warn("turnstile reset failed:", err);
      }
    }
    setCaptchaToken("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }
    if (!captchaToken) {
      alert("Please complete the captcha first.");
      return;
    }
    setLoading(true);

    try {
      await api.post("/subscriptions", {
        email: email.trim(),
        "cf-turnstile-response": captchaToken,
      });

      // local storage flag
      localStorage.setItem("isSubscribed", "true");

      // callback if passed
      onSubscribe && onSubscribe();

      // ✅ success alert
      alert("Your email has been successfully submitted.");

      // optional: reset form
      setEmail("");
      resetCaptcha();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "❌ Something went wrong. Please try again.";
      alert(msg);
      resetCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-5 w-full"
    >
      <img
        src="/images/logo.svg"
        alt="Watermark"
        className="w-fit h-[200px] object-cover"
      />

      <h2 className="text-xl font-bold text-center text-[#6E4A27]">
        Subscribe to receive one featured Letter/Photograph delivered to your
        inbox every month.
      </h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="border border-[#6E4A27] w-full p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6E4A27]"
      />

      <div className="w-full">
        <div id="subscription-turnstile" />
        <input
          type="hidden"
          name="cf-turnstile-response"
          value={captchaToken}
        />
      </div>

      <ParchmentButton
        className="w-full"
        type="submit"
        disabled={loading || !captchaToken}
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </ParchmentButton>
    </form>
  );
};

export default PopupSubscritionModel;
