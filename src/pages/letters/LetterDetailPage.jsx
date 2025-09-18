// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RelatedCards from "../../components/Cards/Cards";
import ThumbnailCards from "../../components/InnerComponents/ThumbnailCards";
import { IoCalendarOutline } from "react-icons/io5";

const BASE_URL = import.meta.env.VITE_FILE_BASE_URL;

const LetterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");

    fetch(`http://localhost:8000/api/submissions/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (!alive) return;
        const doc = json;
        if (doc?.status?.toLowerCase() !== "approved") {
          navigate("/letters/english", { replace: true });
          return;
        }
        setData(doc);
      })
      .catch((e) => {
        if (!alive) return;
        console.error(e);
        setErr("Failed to load letter. Check the ID or server.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id, navigate]);

  const fileUrl = (p) => {
    if (!p) return "";
    if (/^https?:\/\//i.test(p)) return p;
    const cleaned = p.replace(/^\/?/, "");
    return `${BASE_URL}/${cleaned}`;
  };

  const prettyDate = useMemo(() => {
    if (!data?.createdAt) return "";
    try {
      const d = new Date(data.createdAt);
      return d.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-[300px] px-5 lg:px-0 bg-cover bg-center">
        <div className="py-16 max-w-[1270px] w-full mx-auto flex justify-center">
          <div className="w-8 h-8 border-4 border-t-[#704214] border-gray-300 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (err || !data) {
    return (
      <div className="min-h-[300px] px-5 lg:px-0 bg-cover bg-center">
        <div className="py-16 max-w-[1270px] w-full mx-auto text-center text-red-600">
          {err || "Letter not found."}
        </div>
      </div>
    );
  }

  const {
    title,
    letterCategory,
    decade,
    letterNarrative,
    letterNarrativeOptional,
    letterImage,
    letterAudioFile,
    photoCaption,
    photoPlace,
    photoImage,
    photoAudioFile,
    photoNarrative,
    fullName,
  } = data;

  const heroImage =
    (letterImage && fileUrl(letterImage.path)) || "/images/About-1.webp";

  const audioSrc = (letterAudioFile && fileUrl(letterAudioFile.path)) || "";

  const caption =
    letterNarrativeOptional ||
    [letterCategory, decade].filter(Boolean).join(" · ");

  return (
    <div className="min-h-[300px] px-5 lg:px-0 bg-cover bg-center">
      <div className="py-5 max-w-[1270px] w-full mx-auto text-black">
        {/* Date + Category */}
        <div className="flex items-center text-sm mt-10">
          <div className="inline-flex items-center bg-white text-black px-4 py-2 rounded-full shadow-sm space-x-2">
            <IoCalendarOutline className="w-4 h-4 mr-2" />
            <span className="text-sm" style={{ fontFamily: "philosopher" }}>
              {prettyDate || "—"}
            </span>
            <span className="w-px h-4 bg-black ml-1" />
            <span className="text-sm">{letterCategory || "Uncategorized"}</span>
          </div>
        </div>

        {/* Title */}
        <p
          className="w-full text-left text-2xl md:text-[40px] font-bold capitalize mt-4"
          style={{ fontFamily: "philosopher" }}
        >
          {title || "Untitled Letter"}
        </p>

        {/* Owner / Decade helper row */}
        <div className="mt-2 text-sm opacity-80">
          {fullName ? `By ${fullName}` : ""} {decade ? `· ${decade}` : ""}
        </div>
      </div>

      {/* Main Content */}
      <div
        className="w-full max-w-[1270px] rounded-[16px] py-10 px-5 lg:py-16 lg:px-8 flex flex-col gap-10 bg-cover bg-center mx-auto"
        style={{ backgroundImage: "url('/images/Card.webp')" }}
      >
        <div className="w-full text-black">
          {/* Letter Image + Thumbnails */}
          <div className="flex flex-col lg:flex-row justify-start gap-5 mb-6 w-full">
            <img
              src={heroImage}
              alt={title || "Letter Image"}
              className="rounded-[20px] mx-auto w-[70%] h-[300px] lg:h-[500px] object-contain"
            />

            <div className="self-center w-full h-px border-t border-black lg:w-px lg:h-[400px] lg:border-t-0 lg:border-l"></div>

            <ThumbnailCards
              photo={{
                overlay: photoImage
                  ? fileUrl(photoImage.path)
                  : "/images/Card.webp",
                title: photoCaption || "Related Photograph",
                description: photoNarrative || "No description available",
              }}
            />
          </div>

          {/* Letter Audio */}
          {audioSrc && (
            <div className="mt-4">
              <audio controls className="w-full">
                <source
                  src={audioSrc}
                  type={letterAudioFile?.mimeType || "audio/mpeg"}
                />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Letter Narrative */}
          <div className="mt-10 flex flex-col lg:flex-row justify-between gap-10">
            <div
              className="lg:w-[70%] xl:w-[80%] text-[18px] sm:text-[20px] md:text-[26px] lg:text-[30px] text-black leading-7 sm:leading-8 md:leading-10 italic text-left"
              style={{ fontFamily: "'Ephesis'" }}
            >
              {letterNarrative && (
                <>
                  {letterNarrative}
                  <br />
                </>
              )}
              {caption}
            </div>
          </div>
        </div>
      </div>

    
      {/* Related Letters Section */}
      <div className="w-full lg:py-20 py-10">
        <RelatedCards />
      </div>
    </div>
  );
};

export default LetterDetailPage;
