// components/Form.jsx
// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import FormSection from "./FormSection";
import InputField from "./InputField";
import RadioGroup from "./RadioGroup";
import FileInput from "./FileInput";
import DropdownField from "./DropdownField";
import api from "@/utils/api";
import ParchmentButton from "../InnerComponents/ParchmentButton";
import ReactConfetti from "react-confetti";

export default function Form() {
  // States
  const [uploadType, setUploadType] = useState("Both");
  const [before2000, setBefore2000] = useState("No");
  const [letterFiles, setLetterFiles] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [letterAudioFiles, setLetterAudioFiles] = useState([]);
  const [photoAudioFiles, setPhotoAudioFiles] = useState([]);

  // narrative formats
  const [letterNarrativeFormat, setLetterNarrativeFormat] = useState("both");
  const [photoNarrativeFormat, setPhotoNarrativeFormat] = useState("both");

  // ✅ checkboxes
  const [hasReadGuidelines, setHasReadGuidelines] = useState(false);
  const [agreedTermsSubmission, setAgreedTermsSubmission] = useState(false);

  // letter info
  const [letterLanguage, setLetterLanguage] = useState("");
  const [letterCategory, setLetterCategory] = useState("");
  const [decade, setDecade] = useState("");
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(false);

  // Turnstile
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const [captchaToken, setCaptchaToken] = useState("");
  const widgetIdRef = useRef(null);

  const handleUploadTypeChange = (e) => setUploadType(e.target.value);

  // decade options
  const decadeOptions = [
    { value: "unknown", label: "Unknown" },
    { value: "before-1900", label: "Before 1900" },
    ...Array.from({ length: 10 }, (_, i) => {
      const start = 1900 + i * 10;
      const end = start + 10;
      return { value: `${start}-${end}`, label: `${start} - ${end}` };
    }),
  ];

  // ---- Turnstile: explicit render ----
  useEffect(() => {
    // guard: wait for global script
    const ready = () =>
      typeof window !== "undefined" && window.turnstile && siteKey;

    const mount = () => {
      if (!ready()) return;
      // destroy any previous widget (React fast-refresh / rerenders)
      try {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      } catch {}

      widgetIdRef.current = window.turnstile.render("#turnstile-widget", {
        sitekey: siteKey,
        theme: "light",
        callback: (token) => {
          setCaptchaToken(token || "");
        },
        "expired-callback": () => setCaptchaToken(""),
        "error-callback": () => setCaptchaToken(""),
        action: "form_submit",
      });
    };

    // try now, and also retry a few times if script is still loading
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

    if (!hasReadGuidelines || !agreedTermsSubmission) {
      alert("Please check both boxes before submitting.");
      return;
    }
    if (letterFiles.length < 1 && photoFiles.length < 1) {
      alert("Please upload at least 1 image.");
      return;
    }
    if (!captchaToken) {
      alert("Please complete the captcha.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formEl = e.target;

      // Build FormData from the form ONLY (includes files)
      const formData = new FormData(formEl);

      // Add the token explicitly (defensive) in case hidden field is missing
      formData.set("cf-turnstile-response", captchaToken);

      // Normalize controlled state -> formData (text/booleans only)
      formData.set("uploadType", uploadType);
      formData.set("before2000", before2000);
      formData.set("letterNarrativeFormat", letterNarrativeFormat);
      formData.set("photoNarrativeFormat", photoNarrativeFormat);
      formData.set("guidelines", hasReadGuidelines ? "Yes" : "No");
      formData.set("termsSubmission", agreedTermsSubmission ? "Yes" : "No");
      formData.set("letterLanguage", letterLanguage || "");
      formData.set("letterCategory", letterCategory || "");
      formData.set("decade", decade || "");

      // <---------- API ----------->
      const res = await api.post("/submissions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Saved to server:", res.data);
      setShowThankYou(true);

      // Reset form + state
      formEl.reset();
      setUploadType("Both");
      setBefore2000("No");
      setLetterNarrativeFormat("text");
      setPhotoNarrativeFormat("text");
      setLetterLanguage("");
      setLetterCategory("");
      setDecade("");
      setHasReadGuidelines(false);
      setAgreedTermsSubmission(false);
      setLetterFiles([]);
      setPhotoFiles([]);
      setLetterAudioFiles([]);
      setPhotoAudioFiles([]);
      setCaptchaToken("");
      setResetTrigger((prev) => !prev);

      // Reset Turnstile widget instance
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch {}
      }
    } catch (err) {
      console.error("Submit error:", err?.response?.data || err.message);
      alert(
        err?.response?.data?.message ||
          "Submission failed. Check required fields and file sizes/types."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        const data = res.data || [];
        const active = data.filter((c) => c.active);
        setCategories(active.map((c) => ({ value: c.slug, label: c.name })));
      })
      .catch((err) => {
        console.error("Failed to load categories", err);
        setCategories([]);
      });
  }, []);

  const renderLetterInfo = uploadType === "Letter" || uploadType === "Both";
  const renderPhotoInfo = uploadType === "Photographs" || uploadType === "Both";

  return (
    <section className="max-w-5xl text-left mx-auto p-8 sm:p-12 rounded-2xl shadow-2xl border border-[#8B4513]/30">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* PERSONAL INFO */}
        <FormSection title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 items-center">
            <InputField label="Full Name" name="fullName" required />
            <InputField label="Email" name="email" type="email" required />
            <InputField label="Phone" name="phone" type="tel" />
            <InputField label="Current Location" name="location" />
          </div>
        </FormSection>

        {/* UPLOAD TYPE */}
        <div className="md:col-span-2 mb-8">
          <RadioGroup
            label="Are you uploading letters or photographs?"
            name="uploadType"
            required
            value={uploadType}
            onChange={handleUploadTypeChange}
            options={[
              { value: "Letter", label: "Letter" },
              { value: "Photographs", label: "Photographs" },
              { value: "Both", label: "Both" },
            ]}
          />
        </div>

        {/* LETTER INFO */}
        {renderLetterInfo && (
          <>
            <FormSection title="Letter Information">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 xl:gap-x-8 gap-y-6">
                <DropdownField
                  label="Category"
                  name="letterCategory"
                  required
                  value={letterCategory}
                  onChange={(e) => setLetterCategory(e.target.value)}
                  options={categories}
                />
                <DropdownField
                  label="Language"
                  name="letterLanguage"
                  required
                  value={letterLanguage}
                  onChange={(e) => setLetterLanguage(e.target.value)}
                  options={[
                    { value: "English", label: "English" },
                    { value: "Urdu", label: "Urdu" },
                    { value: "Punjabi", label: "Punjabi" },
                  ]}
                />
                <DropdownField
                  label="Decade"
                  name="decade"
                  required
                  value={decade}
                  onChange={(e) => setDecade(e.target.value)}
                  options={decadeOptions}
                />
                <FileInput
                  label="Upload"
                  name="letterImage"
                  subtext="Accepted formats: PNG/JPG"
                  required
                  previewType="image"
                  resetTrigger={resetTrigger}
                  fileCategory="letter"
                  multiple={true}
                  onFilesChange={setLetterFiles}
                />
              </div>
            </FormSection>

            {/* Letter Transcript */}
            <FormSection>
              <div className="flex flex-col md:flex-row justify-between gap-3">
                <div className="flex flex-col justify-between w-full">
                  <div className="flex w-full lg:w-1/2 justify-between">
                    <label className="font-bold text-sm block">
                      Letter Transcript (Optional)
                    </label>
                    <span className="flex gap-4 text-sm">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="letterNarrativeFormat"
                          value="text"
                          checked={letterNarrativeFormat === "text"}
                          onChange={() => setLetterNarrativeFormat("text")}
                        />
                        Text
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="letterNarrativeFormat"
                          value="audio"
                          checked={letterNarrativeFormat === "audio"}
                          onChange={() => setLetterNarrativeFormat("audio")}
                        />
                        Audio
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="letterNarrativeFormat"
                          value="both"
                          checked={letterNarrativeFormat === "both"}
                          onChange={() => setLetterNarrativeFormat("both")}
                        />
                        Both
                      </label>
                    </span>
                  </div>

                  <div className="flex flex-col lg:flex-row justify-between lg:gap-10">
                    {(letterNarrativeFormat === "text" ||
                      letterNarrativeFormat === "both") && (
                      <InputField
                        wrapperClassName="w-full mt-4"
                        className="h-24"
                        name="letterNarrative"
                        label="Text"
                        type="textarea"
                      />
                    )}

                    {(letterNarrativeFormat === "audio" ||
                      letterNarrativeFormat === "both") && (
                      <FileInput
                        name="letterAudioFile"
                        subtext="Accepted formats: MP3, WAV, or AAC."
                        previewType="audio"
                        wrapperClassName="w-full mt-4"
                        label="Audio"
                        resetTrigger={resetTrigger}
                        multiple={false}
                        onFilesChange={(files) =>
                          setLetterAudioFiles(files.slice(0, 1))
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </FormSection>
          </>
        )}

        {/* PHOTO INFO */}
        {renderPhotoInfo && (
          <>
            <FormSection title="Photographs Information">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                <InputField
                  label="Photograph Caption"
                  name="photoCaption"
                  required
                  className="md:col-span-2"
                />
                <InputField label="Place Taken (Optional)" name="photoPlace" />
                <FileInput
                  label="Upload"
                  name="photoImage"
                  subtext="Resolution must be at least 1200 x 1800 pixels (300 DPI). Accepted formats: PNG/JPG"
                  required
                  previewType="image"
                  resetTrigger={resetTrigger}
                  fileCategory="photograph"
                  multiple={true}
                  onFilesChange={setPhotoFiles}
                />
              </div>
            </FormSection>

            {/* Photo Transcript */}
            <FormSection>
              <div className="flex flex-col md:flex-row justify-between gap-3">
                <div className="flex flex-col justify-between w-full">
                  <div className="flex w-full gap-1 lg:w-1/2 justify-between">
                    <label className="font-bold text-sm block">
                      About the Photograph (Optional)
                    </label>
                    <span className="flex gap-4 text-sm">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="photoNarrativeFormat"
                          value="text"
                          checked={photoNarrativeFormat === "text"}
                          onChange={() => setPhotoNarrativeFormat("text")}
                        />
                        Text
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="photoNarrativeFormat"
                          value="audio"
                          checked={photoNarrativeFormat === "audio"}
                          onChange={() => setPhotoNarrativeFormat("audio")}
                        />
                        Audio
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="photoNarrativeFormat"
                          value="both"
                          checked={photoNarrativeFormat === "both"}
                          onChange={() => setPhotoNarrativeFormat("both")}
                        />
                        Both
                      </label>
                    </span>
                  </div>

                  <div className="flex flex-col lg:flex-row justify-between lg:gap-10">
                    {(photoNarrativeFormat === "text" ||
                      photoNarrativeFormat === "both") && (
                      <InputField
                        wrapperClassName="w-full mt-4"
                        className="h-24"
                        name="photoNarrative"
                        label="Text"
                        type="textarea"
                      />
                    )}

                    {(photoNarrativeFormat === "audio" ||
                      photoNarrativeFormat === "both") && (
                      <FileInput
                        name="photoAudioFile"
                        subtext="Accepted formats: MP3, WAV, or AAC."
                        previewType="audio"
                        wrapperClassName="w-full mt-4"
                        label="Audio"
                        resetTrigger={resetTrigger}
                        multiple={false}
                        onFilesChange={(files) =>
                          setPhotoAudioFiles(files.slice(0, 1))
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </FormSection>
          </>
        )}

        {/* VERIFICATION */}
        <FormSection title="Verification">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            <RadioGroup
              label="Is the Photograph/Letter from before 2000?"
              name="before2000"
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              value={before2000}
              onChange={(e) => setBefore2000(e.target.value)}
            />
          </div>
          <div className="mt-8 space-y-2 text-sm font-semibold text-black ">
            <label className="flex items-center gap-2 ">
              <input
                type="checkbox"
                checked={hasReadGuidelines}
                onChange={(e) => setHasReadGuidelines(e.target.checked)}
                className="h-4 w-4"
              />
              I have read the submission guidelines.
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agreedTermsSubmission}
                onChange={(e) => setAgreedTermsSubmission(e.target.checked)}
                className="h-4 w-4"
              />
              I agree with the terms of submission.
            </label>
          </div>
        </FormSection>

        {/* --- Turnstile Captcha (render target) --- */}
        <div className="my-8">
          <div id="turnstile-widget"></div>
          {/* defensive hidden input: ensures token is posted */}
          <input
            type="hidden"
            name="cf-turnstile-response"
            value={captchaToken}
          />
        </div>

        {/* SUBMIT */}
        <div className="mt-10">
          <ParchmentButton
            className="w-full"
            type="submit"
            disabled={
              isSubmitting ||
              !hasReadGuidelines ||
              !agreedTermsSubmission ||
              !captchaToken
            }
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </ParchmentButton>
        </div>
      </form>

      {showThankYou && (
        <>
          <ReactConfetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={1000}
            recycle={false}
          />

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
              <h2 className="text-2xl font-bold mb-4 text-[#6E4A27]">
                🎉 Thank You!
              </h2>
              <p className="mb-6">
                Thank you for your submission. Our team will contact you soon.
              </p>

              <button
                onClick={() => setShowThankYou(false)}
                className="bg-[#6E4A27] text-white px-6 py-2 rounded-md cursor-pointer transition"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
