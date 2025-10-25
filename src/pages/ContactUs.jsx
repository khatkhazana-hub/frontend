import React, { useEffect, useRef, useState } from "react";
import HeadingDesc from "../components/InnerComponents/HeadingDesc";
import ParchmentButton from "@/components/InnerComponents/ParchmentButton";
import api from "@/utils/api"; // <-- your axios wrapper

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    message: "",
    subscribe: false,
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
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

      widgetIdRef.current = window.turnstile.render("#contact-turnstile", {
        sitekey: siteKey,
        theme: "light",
        callback: (token) => setCaptchaToken(token || ""),
        "expired-callback": () => setCaptchaToken(""),
        "error-callback": () => setCaptchaToken(""),
        action: "contact_submit",
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!ok) return "Enter a valid email";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    const err = validate();
    if (err) {
      setStatus({ type: "error", msg: err });
      return;
    }
    if (!captchaToken) {
      setStatus({ type: "error", msg: "Please complete the captcha first." });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        zip: form.zip.trim(),
        message: form.message.trim(),
        subscribe: !!form.subscribe,
        "cf-turnstile-response": captchaToken,
      };

      await api.post("/contacts", payload); // <-- backend route

      setStatus({
        type: "success",
        msg: "Message sent. We will contact you within 24 hours.",
      });
      // reset only non-requireds so UX doesn’t nuke everything
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        zip: "",
        message: "",
        subscribe: false,
      });
      setCaptchaToken("");
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch (err) {
          console.warn("turnstile reset failed:", err);
        }
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong sending your message.";
      setStatus({ type: "error", msg });
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch (err) {
          console.warn("turnstile reset failed:", err);
        }
      }
      setCaptchaToken("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col justify-center items-center py-20 px-5"
      style={{ fontFamily: "Philosopher" }}
    >
      <HeadingDesc
        headingClassName="md:text-[40px] text-center"
        heading="Contact Us"
        containerClassName="mb-14"
        description={undefined}
      />

      <section className="flex flex-col-reverse xl:flex-row w-full max-w-5xl p-5 lg:p-10 overflow-hidden rounded-2xl shadow-2xl border border-[#8B4513]/30">
        {/* RIGHT: Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 p-6 xl:p-10 backdrop-blur-md text-left"
        >
          {/* status banner */}
          {status.msg ? (
            <div
              className={`mb-4 rounded-lg px-3 py-2 text-sm ${
                status.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {status.msg}
            </div>
          ) : null}

          {/* Top row */}
          <div className="grid md:grid-cols-2 gap-3">
            <Field
              label="Name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Row 2 */}
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <Field
              label="Phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
            />
            <Field
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          {/* Row 3 */}
          <div className="grid md:grid-cols-4 gap-3 mt-3">
            <Field
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
            />
            <Field
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
            />
            <Field
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
            />
            <Field
              label="Zip"
              name="zip"
              value={form.zip}
              onChange={handleChange}
            />
          </div>

          {/* Message */}
          <div className="mt-3">
            <label className="font-bold text-sm text-black mb-2">Message</label>
            <textarea
              rows={5}
              name="message"
              value={form.message}
              onChange={handleChange}
              className="border border-[#8B4513]/50 mt-1 text-[#4A2C2A] text-sm rounded-lg focus:ring-[#8B4513] focus:border-[#8B4513] w-full flex justify-start items-start p-2.5 text-start"
            />
          </div>

          {/* Subscribe */}
          <label className="mt-4 flex items-start gap-3 text-sm text-black">
            <input
              type="checkbox"
              name="subscribe"
              checked={form.subscribe}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-black/40 accent-[#5a3c1e]"
            />
            <span>
              Subscribe to receive one featured Letter/Photograph delivered to your inbox every month.
              <br />
              <span className="text-neutral-600 text-xs">
                We respect your privacy and you can unsubscribe any time.
              </span>
            </span>
          </label>

          {/* Button */}
          <div className="mt-6">
            <div id="contact-turnstile" />
            <input
              type="hidden"
              name="cf-turnstile-response"
              value={captchaToken}
            />
          </div>
          <div className="mt-10">
            <ParchmentButton
              className="w-full"
              type="submit"
              disabled={loading || !captchaToken}
            >
              {loading ? "Sending..." : "Send Message"}
            </ParchmentButton>
          </div>
        </form>
      </section>
    </main>
  );
}

/** Reusable input field (controlled) */
function Field({ label, name, required, type = "text", value, onChange }) {
  // only digits in phone
  const handleTelInput = (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
    onChange(e);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="font-bold text-sm mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={type === "tel" ? handleTelInput : onChange}
        inputMode={type === "tel" ? "numeric" : undefined}
        pattern={type === "tel" ? "[0-9]*" : undefined}
        className="border border-[#8B4513]/50 text-[#4A2C2A] text-sm rounded-lg focus:ring-[#8B4513] focus:border-[#8B4513] w-full flex justify-start items-start p-2.5 text-start"
      />
    </div>
  );
}
