// components/Form.jsx
// @ts-nocheck
import React, { useState, useEffect } from "react";
import FormSection from "./FormSection";
import InputField from "./InputField";
import RadioGroup from "./RadioGroup";
import FileInput from "./FileInput";
import DropdownField from "./DropdownField";
import api from "@/utils/api";
import ParchmentButton from "../InnerComponents/ParchmentButton";

export default function Form() {
  // States
  const [uploadType, setUploadType] = useState("Both");
  const [before2000, setBefore2000] = useState("No");

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

  const handleUploadTypeChange = (e) => setUploadType(e.target.value);

  const decadeOptions = Array.from({ length: 10 }, (_, i) => {
    const start = 1900 + i * 10;
    const end = start + 10;
    return { value: `${start}-${end}`, label: `${start} - ${end}` };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasReadGuidelines || !agreedTermsSubmission) {
      alert("Please check both boxes before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formEl = e.target;
      const formData = new FormData(formEl);

      // normalize controlled state -> formData
      formData.set("uploadType", uploadType);
      formData.set("before2000", before2000);
      formData.set("letterNarrativeFormat", letterNarrativeFormat);
      formData.set("photoNarrativeFormat", photoNarrativeFormat);
      formData.set("guidelines", hasReadGuidelines ? "Yes" : "No");
      formData.set("termsSubmission", agreedTermsSubmission ? "Yes" : "No");
      formData.set("letterLanguage", letterLanguage || "");
      formData.set("letterCategory", letterCategory || "");
      formData.set("decade", decade || "");

      const res = await api.post("/submissions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Saved:", res.data);
      alert("Form submitted successfully!");

      // Reset form + controlled state
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
            <InputField label="Phone" name="phone" />
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
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
                  subtext="Resolution must be at least 1200 x 1800 pixels (300 DPI)."
                  required
                  previewType="image"
                />
              </div>
            </FormSection>

            {/* Letter Transcript */}
            <FormSection>
              <div className="flex flex-col md:flex-row justify-between gap-3">
                <div className="flex flex-col justify-between w-full">
                  <div className="flex justify-between">
                    <label className="font-bold text-sm block">
                      Letter Transcript
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

                  <div className="flex flex-col lg:flex-row justify-between gap-10">
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
                        className="mt-5"
                        label="Audio"
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
                  subtext="Resolution must be at least 1200 x 1800 pixels (300 DPI)."
                  required
                  previewType="image"
                />
              </div>
            </FormSection>

            {/* Photo Transcript */}
            <FormSection>
              <div className="flex flex-col md:flex-row justify-between gap-3">
                <div className="flex flex-col justify-between w-full">
                  <div className="flex justify-between">
                    <label className="font-bold text-sm block">
                      About the Photograph{" "}
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

                  <div className="flex flex-col lg:flex-row justify-between gap-10">
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
                        className="mt-5"
                        label="Audio"
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
              label="Is the image from before 2000?"
              name="before2000"
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              value={before2000}
              onChange={(e) => setBefore2000(e.target.value)}
            />
          </div>
          <div className="mt-4 space-y-2 text-sm text-black font-medium ">
            <label className="flex items-center gap-2 text-sm md:text-base">
              <input
                type="checkbox"
                checked={hasReadGuidelines}
                onChange={(e) => setHasReadGuidelines(e.target.checked)}
                className="h-4 w-4"
              />
              I have read the submission guidelines?
            </label>

            {/* ✅ Checkbox Terms */}
            <label className="flex items-center gap-2 text-sm md:text-base">
              <input
                type="checkbox"
                checked={agreedTermsSubmission}
                onChange={(e) => setAgreedTermsSubmission(e.target.checked)}
                className="h-4 w-4"
              />
              I agree with term of submission?
            </label>
          </div>
        </FormSection>

        {/* SUBMIT */}
        <div className="mt-10">
          <ParchmentButton
            className="w-full"
            type="submit"
            disabled={
              isSubmitting || !hasReadGuidelines || !agreedTermsSubmission
            }
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </ParchmentButton>
        </div>
      </form>
    </section>
  );
}
