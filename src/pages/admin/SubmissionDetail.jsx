// src/pages/admin/SubmissionDetail.jsx
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ImageModalViewer from "@/components/ImageModalViewer/ImageModalViewer";

const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL || "http://localhost:8000";

export const buildFileUrl = (p) => {
  if (!p) return "";
  if (typeof p === "string" && /^https?:\/\//i.test(p)) return p;
  const key = String(p || "").replace(/^\/+/, "");
  return `${FILE_BASE}/${key}`;
};

// normalize value to an array of file objects with a `path`
const toFiles = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter((x) => x && x.path);
  if (typeof v === "object" && v.path) return [v];
  if (typeof v === "string") return [{ path: v }];
  return [];
};

function InfoRow({ label, children }) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-sm text-muted-foreground">{children ?? "—"}</p>
    </div>
  );
}

function Section({ title, children, right }) {
  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium">{title}</p>
        {right}
      </div>
      {children}
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
      {children}
    </span>
  );
}

export default function SubmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // modal state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openViewer = (imgs, idx) => {
    setViewerImages(imgs);
    setViewerIndex(idx);
    setViewerOpen(true);
  };
  const blockContextMenu = (e) => e.preventDefault();

  const closeViewer = () => setViewerOpen(false);
  const nextViewer = () =>
    setViewerIndex((i) => (i < viewerImages.length - 1 ? i + 1 : i));
  const prevViewer = () => setViewerIndex((i) => (i > 0 ? i - 1 : i));

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/submissions/${id}`);
        setData(data);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to fetch submission");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!data) return null;

  const s = data;
  const letterFiles = toFiles(s.letterImage);
  const photoFiles = toFiles(s.photoImage);

  return (
    <div className="space-y-6 p-6">
      <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="rounded-xl border bg-white/70 p-6">
        <h2 className="mb-1 text-xl font-semibold">{s.title || "Untitled"}</h2>
        <p className="text-sm text-muted-foreground">
          {s.fullName} • {s.email}
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <InfoRow label="Language">{s.letterLanguage || "—"}</InfoRow>
          <InfoRow label="Decade">{s.decade || "—"}</InfoRow>
          <InfoRow label="Type">{s.uploadType || "—"}</InfoRow>
          <InfoRow label="Status">{s.status || "pending"}</InfoRow>
          <InfoRow label="Phone">{s.phone || "—"}</InfoRow>
          <InfoRow label="Location">{s.location || "—"}</InfoRow>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {/* Letter Images */}
          {letterFiles.length > 0 && (
            <Section
              title="Letter Image(s)"
              right={
                s.letterNarrativeFormat && <Badge>{s.letterNarrativeFormat}</Badge>
              }
            >
              <div
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                onContextMenu={blockContextMenu}
              >
                {letterFiles.map((f, i) => (
                  <img
                    key={f.filename || f.path || i}
                    src={buildFileUrl(f.path)}
                    alt={`Letter ${i + 1}`}
                    className="w-full max-h-[420px] rounded-lg border object-contain bg-muted cursor-pointer transition hover:opacity-80"
                    loading="lazy"
                    draggable={false}
                    onClick={() =>
                      openViewer(letterFiles.map((x) => buildFileUrl(x.path)), i)
                    }
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Photo Images */}
          {photoFiles.length > 0 && (
            <Section
              title="Photo Image(s)"
              right={
                s.photoNarrativeFormat && <Badge>{s.photoNarrativeFormat}</Badge>
              }
            >
              <div
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                onContextMenu={blockContextMenu}
              >
                {photoFiles.map((f, i) => (
                  <img
                    key={f.filename || f.path || i}
                    src={buildFileUrl(f.path)}
                    alt={`Photo ${i + 1}`}
                    className="w-full max-h-[420px] rounded-lg border object-contain bg-muted cursor-pointer transition hover:opacity-80"
                    loading="lazy"
                    draggable={false}
                    onClick={() =>
                      openViewer(photoFiles.map((x) => buildFileUrl(x.path)), i)
                    }
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Audio */}
          {s.letterAudioFile?.path && (
            <Section title="Letter Audio">
              <audio
                controls
                src={buildFileUrl(s.letterAudioFile.path)}
                className="w-full"
              >
                Your browser does not support the audio element.
              </audio>
            </Section>
          )}
          {s.photoAudioFile?.path && (
            <Section title="Photo Audio">
              <audio
                controls
                src={buildFileUrl(s.photoAudioFile.path)}
                className="w-full"
              >
                Your browser does not support the audio element.
              </audio>
            </Section>
          )}
        </div>

        {/* Narratives */}
        {(s.letterNarrative || s.photoNarrative) && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {s.letterNarrative && (
              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">Letter Narrative</p>
                  {s.letterNarrativeFormat && (
                    <Badge>{s.letterNarrativeFormat}</Badge>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {s.letterNarrative}
                </p>
              </div>
            )}
            {s.photoNarrative && (
              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">Photo Narrative</p>
                  {s.photoNarrativeFormat && (
                    <Badge>{s.photoNarrativeFormat}</Badge>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {s.photoNarrative}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {s.notes && (
          <Section title="Notes">
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {s.notes}
            </p>
          </Section>
        )}
      </div>

      {/* 🔥 Fullscreen viewer */}
      <ImageModalViewer
        isOpen={viewerOpen}
        images={viewerImages}
        activeIndex={viewerIndex}
        onClose={closeViewer}
        onPrev={prevViewer}
        onNext={nextViewer}
      />
    </div>
  );
}
