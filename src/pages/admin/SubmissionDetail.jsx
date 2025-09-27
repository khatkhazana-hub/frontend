// src/pages/admin/SubmissionDetail.jsx
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const FILE_BASE =
  import.meta.env.VITE_FILE_BASE_URL || "http://localhost:8000";
export const buildFileUrl = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const key = p.replace(/^\/+/, "");
  return `${FILE_BASE}/${key}`;
};

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
        <p className="text-sm text-muted-foreground">
          {s.fullName} • {s.email}
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium">Language</p>
            <p className="text-sm text-muted-foreground">
              {s.letterLanguage || "—"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Decade</p>
            <p className="text-sm text-muted-foreground">{s.decade || "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Type</p>
            <p className="text-sm text-muted-foreground">
              {s.uploadType || "—"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Status</p>
            <p className="text-sm text-muted-foreground">
              {s.status || "pending"}
            </p>
          </div>
        </div>

        {/* Media */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {s.letterImage?.path && (
            <div>
              <p className="mb-2 text-sm font-medium">Letter Image</p>
              <img
                src={buildFileUrl(s.letterImage.path)}
                alt="Letter"
                className="w-full rounded-lg border object-contain"
              />
            </div>
          )}
          {s.photoImage?.path && (
            <div>
              <p className="mb-2 text-sm font-medium">Photo Image</p>
              <img
                src={buildFileUrl(s.photoImage.path)}
                alt="Photo"
                className="w-full rounded-lg border object-contain"
              />
            </div>
          )}

          {s.letterAudioFile?.path && (
            <div>
              <p className="mb-2 text-sm font-medium">Letter Audio</p>
              <audio
                controls
                src={buildFileUrl(s.letterAudioFile.path)}
                className="w-full"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          {s.photoAudioFile?.path && (
            <div>
              <p className="mb-2 text-sm font-medium">Photo Audio</p>
              <audio
                controls
                src={buildFileUrl(s.photoAudioFile.path)}
                className="w-full"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>

        {/* Description / content */}
        {s.description && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">Description</p>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {s.description}
            </p>
          </div>
        )}

        {/* Narratives */}
        {s.letterNarrative && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">Letter Narrative</p>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {s.letterNarrative}
            </p>
          </div>
        )}

        {s.photoNarrative && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">Photo Narrative</p>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {s.photoNarrative}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
