// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RelatedCards from "../../components/Cards/Cards";
import ThumbnailCards from "../../components/InnerComponents/ThumbnailCards";
import { IoCalendarOutline } from "react-icons/io5";
import api from "../../utils/api";
import { FiMaximize2 } from "react-icons/fi"; // fullscreen icon

const BASE_URL = import.meta.env.VITE_FILE_BASE_URL;

const LetterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [isOpen, setIsOpen] = useState(false); // fullscreen modal state

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");

    api
      .get(`/submissions/${id}`) // baseURL already set in api.js
      .then((res) => {
        if (!alive) return;
        const doc = res.data;

        if (doc?.status?.toLowerCase() !== "approved") {
          // redirect back to the correct language list
          navigate(
            `/letters/${doc?.letterLanguage?.toLowerCase() || "english"}`,
            {
              replace: true,
            }
          );
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
    photoImage,
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
    <div className="min-h-[300px] px-5 lg:px-10 xl:px-0 bg-cover bg-center">
      <div className="py-5 max-w-[1270px] w-full mx-auto text-black text-left">
        {/* Date + Category */}
        <div className="flex items-center text-sm mt-10">
          <div className="inline-flex items-center bg-white text-black px-4 py-2 rounded-full shadow-sm space-x-2">
            <IoCalendarOutline className="w-4 h-4 mr-2" />
            <span className="text-sm" style={{ fontFamily: "philosopher" }}>
              {prettyDate || "—"}
            </span>
            <span className="w-px h-4 bg-black ml-1" />
            <span className="text-sm capitalize font-bold">
              {letterCategory || "Uncategorized"}
            </span>
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
        <div className="text-sm opacity-80 capitalize">
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

          <div className="flex flex-col lg:flex-row justify-start gap-5 mb-6  w-full">
            <div className="relative flex justify-center lg:w-[70%] xl:w-full">
              {/* Hero Image */}
              <img
                src={heroImage}
                alt={title || "Letter Image"}
                className="rounded-md mx-auto w-[230px] lg:w-[330px] h-[350px] lg:h-[500px] max-h-[500px] object-cover"
              />
              {/* Fullscreen Icon */}
              <button
                onClick={() => setIsOpen(true)}
                className="absolute lg:top-2 right-2 bg-white/50 hover:bg-white p-2 rounded-full shadow z-30"
              >
                <FiMaximize2 className="text-black w-6 h-6" />
              </button>

              {/* Watermark */}
              <img
                src="/images/logo.png"
                alt="Watermark"
                className="absolute top-40 xl:left-[400px] w-[150px] h-[150px] opacity-20 object-cover pointer-events-none select-none z-10"
              />

              {/* Frame – sabse top par */}
              <img
                src="/images/DetailPageBorder.webp" // yahan apka frame image path
                alt="Frame"
                className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none select-none z-20"
              />
            </div>

            <ThumbnailCards
              photo={{
                overlay: photoImage ? fileUrl(photoImage.path) : null,
                title: photoCaption || "Related Photograph",
                description: photoNarrative || "No description available",
              }}
            />
          </div>

          {/* Fullscreen Modal */}
          {isOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 bg-white/80 hover:bg-white w-10 h-10 rounded-full shadow cursor-pointer"
              >
                ✕
              </button>

              <img
                src={heroImage}
                alt={title || "Letter Image"}
                className="max-h-[70%] max-w-[70%] object-contain rounded-lg"
              />
            </div>
          )}

          {/* Letter Audio */}
          {audioSrc && (
            <div className="mt-10">
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
            <div className="text-black text-left leading-10">
              {/* Narrative text */}
              {letterNarrative && (
                <>
                  <h2 className="text-2xl font-bold mb-2">
                    Letter Transcript{" "}
                  </h2>
                  <p className="text-xl leading-10 mb-4">
                    {letterNarrative} <br /> {caption}
                  </p>
                </>
              )}

              {/* Caption text */}
              {/* {caption && (
                <>
                  <h2 className="text-2xl font-bold mb-2">Narrative</h2>
                  <p className="text-xl leading-10">{caption}</p>
                </>
              )} */}
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
