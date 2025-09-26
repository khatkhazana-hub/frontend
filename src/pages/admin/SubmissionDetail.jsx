// src/pages/admin/SubmissionDetail.jsx
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL || "http://localhost:8000";
export const buildFileUrl = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const key = p.replace(/^\/+/, "");
  return `${FILE_BASE}/${key}`;
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

  return (
    <div className="space-y-6 p-6">
      <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="rounded-xl border bg-white p-6">
        {/* Header */}
        <h2 className="mb-1 text-xl font-semibold">{s.title || "Untitled"}</h2>
        <p className="text-sm text-muted-foreground">
          {s.fullName} • {s.email}
        </p>

        {/* Meta */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <InfoRow label="Language">{s.letterLanguage || "—"}</InfoRow>
          <InfoRow label="Decade">{s.decade || "—"}</InfoRow>
          <InfoRow label="Type">{s.uploadType || "—"}</InfoRow>
          <InfoRow label="Status">{s.status || "pending"}</InfoRow>
          <InfoRow label="Phone">{s.phone || "—"}</InfoRow>
          <InfoRow label="Location">{s.location || "—"}</InfoRow>
        </div>

        {/* Media */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {s.letterImage?.path && (
            <Section
              title="Letter Image"
              right={s.letterNarrativeFormat && <Badge>{s.letterNarrativeFormat}</Badge>}
            >
              <img
                src={buildFileUrl(s.letterImage.path)}
                alt="Letter"
                className="w-full rounded-lg border object-contain"
              />
            </Section>
          )}

          {s.photoImage?.path && (
            <Section
              title="Photo Image"
              right={s.photoNarrativeFormat && <Badge>{s.photoNarrativeFormat}</Badge>}
            >
              <img
                src={buildFileUrl(s.photoImage.path)}
                alt="Photo"
                className="w-full rounded-lg border object-contain"
              />
            </Section>
          )}

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

        {/* Description */}
        {s.description && (
          <Section title="Description">
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {s.description}
            </p>
          </Section>
        )}

        {/* Narratives — THIS is what was missing */}
        {(s.letterNarrative ||
          s.letterNarrativeOptional ||
          s.photoNarrative ||
          s.photoNarrativeOptional) && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {(s.letterNarrative || s.letterNarrativeOptional) && (
              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">Letter Narrative</p>
                  {s.letterNarrativeFormat && (
                    <Badge>{s.letterNarrativeFormat}</Badge>
                  )}
                </div>

                {s.letterNarrative && (
                  <div className="mb-4">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Main
                    </p>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {s.letterNarrative}
                    </p>
                  </div>
                )}

                {s.letterNarrativeOptional && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Optional
                    </p>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {s.letterNarrativeOptional}
                    </p>
                  </div>
                )}
              </div>
            )}

            {(s.photoNarrative || s.photoNarrativeOptional) && (
              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">Photo Narrative</p>
                  {s.photoNarrativeFormat && (
                    <Badge>{s.photoNarrativeFormat}</Badge>
                  )}
                </div>

                {s.photoNarrative && (
                  <div className="mb-4">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Main
                    </p>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {s.photoNarrative}
                    </p>
                  </div>
                )}

                {s.photoNarrativeOptional && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Optional
                    </p>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {s.photoNarrativeOptional}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Photo meta (caption/place) */}
        {(s.photoCaption || s.photoPlace) && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {s.photoCaption && (
              <InfoRow label="Photo Caption">{s.photoCaption}</InfoRow>
            )}
            {s.photoPlace && (
              <InfoRow label="Photo Place">{s.photoPlace}</InfoRow>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
