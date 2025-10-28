// src/pages/admin/SubmissionEdit.jsx
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL || "http://localhost:8000";
const buildFileUrl = (p) => {
  if (!p) return "";
  const rel = String(p).replace(/^\/+/, "").replace(/^public[\\/]/, ""); // strip "public/"
  return `${FILE_BASE}/${rel}`;
};
const norm = (v) => String(v || "").trim().toLowerCase();

export default function SubmissionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // Personal
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  // Flags
  const [hasReadGuidelines, setHasReadGuidelines] = useState(false);
  const [agreedTermsSubmission, setAgreedTermsSubmission] = useState(false);

  // Meta
  const [uploadType, setUploadType] = useState(""); // "Letter" | "Photo" | "Both"
  const [title, setTitle] = useState("");
  const [letterCategory, setLetterCategory] = useState("");
  const [letterLanguage, setLetterLanguage] = useState("");
  const [decade, setDecade] = useState("");

  // Letter content
  const [letterNarrativeFormat, setLetterNarrativeFormat] = useState("text"); // text|audio|both
  const [letterNarrative, setLetterNarrative] = useState("");
  const [letterNarrativeOptional, setLetterNarrativeOptional] = useState("");

  // Photo content
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoPlace, setPhotoPlace] = useState("");
  const [photoNarrativeFormat, setPhotoNarrativeFormat] = useState("text"); // text|audio|both
  const [photoNarrative, setPhotoNarrative] = useState("");
  const [photoNarrativeOptional, setPhotoNarrativeOptional] = useState("");

  // Verification / status / featured
  const [before2000, setBefore2000] = useState("No"); // "Yes" | "No"
  const [status, setStatus] = useState("pending"); // pending|approved|rejected
  const [featured, setFeatured] = useState(false);

  // Optional file replacements
  const [letterImage, setLetterImage] = useState(null);
  const [photoImage, setPhotoImage] = useState(null);
  const [letterAudioFile, setLetterAudioFile] = useState(null);
  const [photoAudioFile, setPhotoAudioFile] = useState(null);

  // Notes (new)
  const [notes, setNotes] = useState("");

  // derived visibility
  const t = norm(uploadType); // 'letter'|'photo'|'both'
  const showLetter = t === "letter" || t === "both";
  const showPhoto  = t === "photographs"  || t === "both";

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/submissions/${id}`);
        setData(data);

        // hydrate
        setFullName(data.fullName || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setLocation(data.location || "");

        setHasReadGuidelines(!!data.hasReadGuidelines);
        setAgreedTermsSubmission(!!data.agreedTermsSubmission);

        // keep whatever is stored; normalize only for visibility
        setUploadType(data.uploadType || "");

        setTitle(data.title || "");
        setLetterCategory(data.letterCategory || "");
        setLetterLanguage(data.letterLanguage || "");
        setDecade(data.decade || "");

        setLetterNarrativeFormat(data.letterNarrativeFormat || "text");
        setLetterNarrative(data.letterNarrative || "");
        setLetterNarrativeOptional(data.letterNarrativeOptional || "");

        setPhotoCaption(data.photoCaption || "");
        setPhotoPlace(data.photoPlace || "");
        setPhotoNarrativeFormat(data.photoNarrativeFormat || "text");
        setPhotoNarrative(data.photoNarrative || "");
        setPhotoNarrativeOptional(data.photoNarrativeOptional || "");

        setBefore2000(data.before2000 || "No");
        setStatus(data.status || "pending");
        setFeatured(!!data.featured);

        // notes
        setNotes(data.notes || "");
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load submission");
      }
    })();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      setSaving(true);
      const fd = new FormData();

      // Personal (always)
      fd.append("fullName", fullName);
      fd.append("email", email);
      fd.append("phone", phone);
      fd.append("location", location);

      // Flags
      fd.append("guidelines", hasReadGuidelines ? "yes" : "no");
      fd.append("termsSubmission", agreedTermsSubmission ? "yes" : "no");

      // Meta (uploadType always; other meta conditional)
      fd.append("uploadType", uploadType);

      if (showLetter) {
        fd.append("Title", title); // capital T to match your create handler
        fd.append("letterCategory", letterCategory);
        fd.append("letterLanguage", letterLanguage);
        fd.append("decade", decade);
      }

      // Letter content + files only if showLetter
      if (showLetter) {
        fd.append("letterNarrativeFormat", letterNarrativeFormat);
        fd.append("letterNarrative", letterNarrative);
        fd.append("letterNarrativeOptional", letterNarrativeOptional);
        if (letterImage)     fd.append("letterImage", letterImage);
        if (letterAudioFile) fd.append("letterAudioFile", letterAudioFile);
      }

      // Photo content + files only if showPhoto
      if (showPhoto) {
        fd.append("photoCaption", photoCaption);
        fd.append("photoPlace", photoPlace);
        fd.append("photoNarrativeFormat", photoNarrativeFormat);
        fd.append("photoNarrative", photoNarrative);
        fd.append("photoNarrativeOptional", photoNarrativeOptional);
        if (photoImage)     fd.append("photoImage", photoImage);
        if (photoAudioFile) fd.append("photoAudioFile", photoAudioFile);
      }

      // Always allowed
      fd.append("before2000", before2000);
      fd.append("status", status);
      fd.append("featured", String(featured));

      // NEW: include notes (even if empty, server will accept and keep/clear)
      fd.append("notes", notes);

      await api.patch(`/submissions/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate(`/admin/submissions/${id}/edit`, { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!data && !err) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  // decide where to render notes:
  const hadExistingNotes = ((data?.notes || "").trim().length > 0);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Edit Submission</h1>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* PERSONAL */}
        <Section title="Personal">
          <Grid two>
            <Input label="Full Name" value={fullName} onChange={setFullName} />
            <Input label="Email" type="email" value={email} onChange={setEmail} />
            <Input label="Phone" value={phone} onChange={setPhone} />
            <Input label="Location" value={location} onChange={setLocation} />
          </Grid>
        </Section>

        {/* LETTER — only if Letter or Both */}
        {showLetter && (
          <Section title="Letter">
            <Grid two>
              <div />
              <Textarea
                label="Narrative"
                value={letterNarrative}
                onChange={setLetterNarrative}
                rows={5}
              />
            </Grid>
          </Section>
        )}

        {/* PHOTO — only if Photo or Both */}
        {showPhoto && (
          <Section title="Photo">
            <Grid two>
              <Input label="Photo Caption" value={photoCaption} onChange={setPhotoCaption} />
              <Input label="Photo Place" value={photoPlace} onChange={setPhotoPlace} />
              <div />
              <Textarea
                label="Narrative"
                value={photoNarrative}
                onChange={setPhotoNarrative}
                rows={5}
              />
            </Grid>
          </Section>
        )}

        {/* NOTES — show here only if notes already exist */}
        {hadExistingNotes && (
          <Section title="Notes">
            <Textarea
              label="Internal Notes"
              value={notes}
              onChange={setNotes}
              rows={5}
              placeholder="Add any moderator/admin notes…"
            />
          </Section>
        )}

        {/* ACTIONS */}
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>

        {/* If there were no notes before, give the option TO ADD NOTES AT THE END */}
        {!hadExistingNotes && (
          <Section title="Add Notes (optional)">
            <Textarea
              label="Internal Notes"
              value={notes}
              onChange={setNotes}
              rows={4}
              placeholder="No notes yet — add something useful for your future self…"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              These notes are internal (not shown to submitters).
            </p>
          </Section>
        )}
      </form>
    </div>
  );
}

/* ---------- tiny UI helpers (no extra deps) ---------- */

function Section({ title, children }) {
  return (
    <section className="rounded-xl border bg-white/50 p-5">
      <h2 className="mb-4 text/base md:text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ two, children }) {
  return <div className={two ? "grid gap-4 sm:grid-cols-2" : "grid gap-4"}>{children}</div>;
}

function Input({ label, value, onChange, type = "text", ...rest }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        type={type}
        className="mt-1 w-full rounded  border-black/20 border px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 4, ...rest }) {
  return (
    <div className="sm:col-span-2">
      <label className="block text-sm font-medium">{label}</label>
      <textarea
        rows={rows}
        className="mt-1 w-full rounded border px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </div>
  );
}

function Select({ label, value, onChange, options = [] }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <select
        className="mt-1 w-full rounded border px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select…</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function SwitchField({ label, checked, onChange, id }) {
  const _id = id || label.replace(/\s+/g, "_").toLowerCase();
  return (
    <div className="flex items-center gap-2">
      <Switch id={_id} checked={checked} onCheckedChange={onChange} />
      <label htmlFor={_id} className="text-sm text-muted-foreground">
        {label}
      </label>
    </div>
  );
}

function MediaPreview({ label, children }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      {children}
    </div>
  );
}

function FileInput({ label, accept, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        type="file"
        accept={accept}
        className="mt-1 w-full rounded border px-3 py-2"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </div>
  );
}
