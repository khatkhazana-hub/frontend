// components/Form.jsx
// @ts-nocheck
import React, { useState } from "react";
import api from 'axios'
import FormSection from "./FormSection";
import InputField from "./InputField";
import RadioGroup from "./RadioGroup";
import FileInput from "./FileInput";
import DropdownField from "./DropdownField";

export default function Form() {
  // States
  const [uploadType, setUploadType] = useState("Both");
  const [before2000, setBefore2000] = useState("No");
  const [letterNarrativeFormat, setLetterNarrativeFormat] = useState("both");
  const [photoNarrativeFormat, setPhotoNarrativeFormat] = useState("both");
  const [hasReadGuidelines, setHasReadGuidelines] = useState(false);
  const [agreedTermsSubmission, setAgreedTermsSubmission] = useState(false);
  const [letterLanguage, setLetterLanguage] = useState("");
  const [letterCategory, setLetterCategory] = useState("");
  const [decade, setDecade] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUploadTypeChange = (e) => setUploadType(e.target.value);

  const decadeOptions = Array.from({ length: 10 }, (_, i) => {
    const start = 1900 + i * 10;
    const end = start + 10;
    return { value: `${start}-${end}`, label: `${start} - ${end}` };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const formEl = e.target;
      const formData = new FormData(formEl);

      // normalize controlled state -> formData (overwrite in case of mismatch)
      formData.set("uploadType", uploadType);
      formData.set("before2000", before2000);
      formData.set("letterNarrativeFormat", letterNarrativeFormat);
      formData.set("photoNarrativeFormat", photoNarrativeFormat);
      formData.set("guidelines", hasReadGuidelines ? "Yes" : "No");
      formData.set("termsSubmission", agreedTermsSubmission ? "Yes" : "No");
      formData.set("letterLanguage", letterLanguage || "");
      formData.set("letterCategory", letterCategory || "");
      formData.set("decade", decade || "");

      // post
      const res = await api.post("http://localhost:8000/api/submissions", formData, {
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
            <RadioGroup
              label="I have read the submission guidelines?"
              name="guidelines"
              required
              value={hasReadGuidelines ? "Yes" : "No"}
              onChange={(e) => setHasReadGuidelines(e.target.value === "Yes")}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />
            <RadioGroup
              label="I agree with term of submission?"
              name="termsSubmission"
              required
              value={agreedTermsSubmission ? "Yes" : "No"}
              onChange={(e) =>
                setAgreedTermsSubmission(e.target.value === "Yes")
              }
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />
          </div>
        </FormSection>

        {hasReadGuidelines && agreedTermsSubmission && (
          <>
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
                    <InputField
                      label="Title"
                      name="Title"
                      type="text"
                      required
                    />
                    <DropdownField
                      label="Category"
                      name="letterCategory"
                      required
                      value={letterCategory}
                      onChange={(e) => setLetterCategory(e.target.value)}
                      options={[
                        { value: "Family", label: "Family" },
                        { value: "love Letter", label: "love Letter" },
                        { value: "War Political", label: "War Political" },
                        { value: "Travel", label: "Travel" },
                        { value: "Diary Pages", label: "Diary Pages" },
                        { value: "PostCards", label: "PostCards" },
                        { value: "Calenders", label: "Calenders" },
                        { value: "MoviePosters", label: "MoviePosters" },
                        { value: "Others", label: "Others" },
                      ]}
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
                      subtext="Hi Res Jpegs only. 10” width scanned in 300 DPI (Max 5MB)"
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
                          Letter Transcript{" "}
                          <span className="text-red-600">*</span>
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
                            required
                            type="textarea"
                          />
                        )}

                        {(letterNarrativeFormat === "audio" ||
                          letterNarrativeFormat === "both") && (
                          <FileInput
                            name="letterAudioFile"
                            subtext="Only MP3 Format (Max 5MB)"
                            previewType="audio"
                            className="mt-5"
                            label="Audio"
                            required
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <InputField
                    wrapperClassName="w-full mt-6"
                    className="h-24"
                    label="Narrative (Optional)"
                    name="letterNarrativeOptional"
                    type="textarea"
                  />
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
                    <InputField
                      label="Place Taken (Optional)"
                      name="photoPlace"
                    />
                    <FileInput
                      label="Upload"
                      name="photoImage"
                      subtext="Hi Res Jpegs only. 10” width scanned in 300 DPI (Max 5MB)"
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
                          Photographs Transcript{" "}
                          <span className="text-red-600">*</span>
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
                            required
                            type="textarea"
                          />
                        )}

                        {(photoNarrativeFormat === "audio" ||
                          photoNarrativeFormat === "both") && (
                          <FileInput
                            name="photoAudioFile"
                            subtext="Only MP3 Format (Max 5MB)"
                            previewType="audio"
                            className="mt-5"
                            label="Audio"
                            required
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <InputField
                    wrapperClassName="w-full mt-6"
                    className="h-24"
                    label="Narrative (Optional)"
                    name="photoNarrativeOptional"
                    type="textarea"
                  />
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
            </FormSection>

            <div className="mt-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#6E4A27] text-white font-bold text-lg py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg cursor-pointer ${
                  isSubmitting
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-[#79542f]"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </form>
    </section>
  );
}
