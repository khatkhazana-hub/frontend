// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { IoCalendarOutline } from "react-icons/io5";
import { FiMaximize2 } from "react-icons/fi"; // fullscreen icon
import api from "@/utils/api";
import useSubmissions from "@/hooks/useSubmissions"; // ✅ fetch once here
import RelatedPhotographs from "@/components/Cards/RelatedPhotographs";
import ThumbnailPhotoCard from "@/components/InnerComponents/ThumbnailPhotoCard";

const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL || window.location.origin;

const buildFileUrl = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const rel = String(p).replace(/^\/+/, "");
  return `${FILE_BASE}/${rel}`;
};

export default function PhotoGraphDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ one global fetch for all submissions
  const { rows: allRows } = useSubmissions();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/submissions/${id}`);
        if (String(data?.status || "").toLowerCase() !== "approved") {
          throw new Error("This photograph is not available.");
        }
        setData(data);
        setErr("");
      } catch (e) {
        setErr(
          e?.response?.data?.message || e?.message || "Failed to load photo"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const created = useMemo(() => {
    if (!data?.createdAt) return "";
    try {
      return new Date(data.createdAt).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }, [data]);

  // ✅ related photographs = featuredPhoto + approved, exclude current id
  const relatedPhotos = useMemo(() => {
    return (allRows || []).filter(
      (r) =>
        r?._id !== id &&
        r?.featuredPhoto === true &&
        String(r?.status || "").toLowerCase() === "approved"
    );
  }, [allRows, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-t-[#704214] border-gray-300 rounded-full animate-spin" />
      </div>
    );
  }

  if (err || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h1 className="text-2xl font-semibold text-red-600">
          {err || "Not found"}
        </h1>
        <Link to="/photographs" className="underline text-[#704214]">
          Back to Photographs
        </Link>
      </div>
    );
  }

  const photoSrc = data.photoImage?.path
    ? buildFileUrl(data.photoImage.path)
    : null;
  const caption = data.photoCaption || data.title || "Untitled Photo";
  const category = data.letterCategory || "—";
  const place = data.photoPlace || "";
  const decade = data.decade || "";
  const topRightMeta = [place, decade].filter(Boolean).join(" • ");

  return (
    <div className="min-h-[300px] px-5 lg:px-0 bg-cover bg-center">
      <div className="py-5 max-w-[1270px] w-full mx-auto text-black text-left">
        <div className="flex items-center text-sm mt-10">
          <div className="inline-flex items-center justify-evenly bg-white text-black px-4 py-2 rounded-full shadow-sm space-x-2">
            <IoCalendarOutline className="w-4 h-4 mr-2" />
            <span className="text-sm" style={{ fontFamily: "philosopher" }}>
              {created || "—"}
            </span>
            <span className="w-px h-4 bg-black ml-1" />
            <span className="text-sm capitalize font-bold">{category}</span>
          </div>
        </div>

        <p
          className="w-full text-left text-2xl md:text-[40px] font-bold capitalize mt-4"
          style={{ fontFamily: "philosopher" }}
        >
          {caption}
        </p>
        {topRightMeta && (
          <p className="text-sm opacity-80 capitalize">{topRightMeta}</p>
        )}
      </div>

      <div
        className="w-full max-w-[1270px] rounded-[16px] py-10 px-5 lg:py-16 lg:px-8 flex flex-col gap-10 bg-cover bg-center mx-auto"
        style={{ backgroundImage: "url('/images/Card.webp')" }}
      >
        <div className="w-full text-black">
          <div className="flex flex-col lg:flex-row justify-between gap-10 rounded-md">
            <div className="relative flex justify-center w-full">
              <img
                src={photoSrc}
                alt={caption}
                className="rounded-md mx-auto w-fit h-[300px] lg:h-[500px] max-h-[500px] object-contain"
              />

              <img
                src="/images/Vector.webp"
                alt="Watermark"
                className="absolute top-40 left-[400px] w-[150px] h-[150px] opacity-20 object-cover pointer-events-none select-none"
              />
            </div>

            <ThumbnailPhotoCard photo={data} />
          </div>

          {data.photoAudioFile?.path && (
            <div className="mt-6">
              <audio
                controls
                src={buildFileUrl(data.photoAudioFile.path)}
                className="w-full"
              />
            </div>
          )}

          {(data.photoNarrative || data.photoNarrativeOptional) && (
            <div className="mt-10 flex flex-col lg:flex-row justify-between gap-10">
              <div className="text-black text-left leading-10">
                {/* Photo Narrative */}
                {data.photoNarrative && (
                  <>
                    <h2 className="text-2xl font-bold mb-2">Text</h2>
                    <p className="text-xl leading-10 mb-4">
                      {data.photoNarrative}
                    </p>
                  </>
                )}

                {/* Photo Narrative Optional */}
                {data.photoNarrativeOptional && (
                  <>
                    <h3 className="text-2xl font-bold mb-2">Narrative</h3>
                    <p className="text-xl leading-10">
                      {data.photoNarrativeOptional}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ pass related photos down as props (no extra fetches) */}
      <div className="w-full lg:py-20 py-10">
        <RelatedPhotographs items={relatedPhotos} />
      </div>
    </div>
  );
}
