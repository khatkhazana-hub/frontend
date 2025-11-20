// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { IoCalendarOutline } from "react-icons/io5";
import api from "@/utils/api";
import MainImageWithSlider from "../letters/MainImageWithSlider";
import FeaturedPhotographCards from "@/components/photographs/FeaturedPhotographCards";
import RelatedPhotoCards from "@/components/photographs/RelatedPhotoCards";

const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL || window.location.origin;

const buildFileUrl = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const rel = String(p).replace(/^\/+/, ""); // keep "public/..."
  return `${FILE_BASE}/${rel}`;
};

// meta -> url (supports {path}|{location}|{url}|string)
const metaToUrl = (m) => {
  if (!m) return "";
  if (typeof m === "string") return buildFileUrl(m);
  return buildFileUrl(m.path || m.location || m.url || "");
};

// array-or-single -> array of urls
const fieldToUrls = (v) => {
  if (!v) return [];
  const arr = Array.isArray(v) ? v : [v];
  return arr.map(metaToUrl).filter(Boolean);
};

const norm = (v) => String(v || "").toLowerCase();

const isPhotoApproved = (submission) => {
  const type = norm(submission?.uploadType);
  const base = norm(submission?.status);
  const photo = norm(submission?.photoStatus || submission?.status);
  return type === "both" ? photo === "approved" : base === "approved";
};

const isLetterApproved = (submission) => {
  const type = norm(submission?.uploadType);
  const base = norm(submission?.status);
  const letter = norm(submission?.letterStatus || submission?.status);
  return type === "both" ? letter === "approved" : base === "approved";
};

export default function PhotoGraphDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const blockContextMenu = (e) => e.preventDefault();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/submissions/${id}`);
        if (!isPhotoApproved(data)) {
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

    useEffect(() => {
      window.scrollTo(0, 0);
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

  // build arrays from uploaded meta
  const letterReady = isLetterApproved(data);
  const photoImages = useMemo(() => fieldToUrls(data?.photoImage), [data]);
  const letterImages = useMemo(
    () => (letterReady ? fieldToUrls(data?.letterImage) : []),
    [data, letterReady]
  );

  // hero & slider
  const heroImage = photoImages[0] || (letterReady ? letterImages[0] : "") || "";
  const sliderImages =
    photoImages.length ? photoImages : letterReady ? letterImages : [];

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
          <p className="text-base opacity-80 capitalize mt-2">{topRightMeta}</p>
        )}
      </div>

      <div
        className="w-full max-w-[1270px] rounded-[16px] py-16 px-5 lg:px-8 flex flex-col gap-10 bg-cover bg-center mx-auto"
        style={{
          backgroundImage: `url(${import.meta.env.VITE_FILE_BASE_URL}/public/StaticImages/Card.webp)`,
        }}
      >
        <div className="w-full text-black">
          <div className="flex flex-col lg:flex-row justify-start gap-5 mb-6 w-full">
            {/* main image + slider fed from uploaded arrays */}
            <MainImageWithSlider heroImage={heroImage} images={sliderImages} withFrame />

            {/* right-side info/thumb card stays rendered; content empty when letter not approved */}
            <RelatedPhotoCards
              photos={letterImages}
              submissionId={id}
              letterLanguage={data?.letterLanguage}
            />
          </div>

          {/* fullscreen modal (optional) */}
          {isOpen && heroImage && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
              <button
                className="absolute top-5 right-5 lg:top-6 text-[2vh] font-bold lg:right-6 bg-white/80 hover:bg-white w-[4vh] h-[4vh] rounded-full shadow cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
              <img
                src={heroImage}
                alt={caption}
                className="w-[50vh] lg:w-[70vh] lg:h-[80vh] object-contain select-none"
                draggable={false}
                onContextMenu={blockContextMenu}
              />
            </div>
          )}

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
                {(data.photoNarrative || data.photoNarrativeOptional) && (
                  <>
                    <h2 className="text-2xl font-bold mb-2">
                      About the Photograph
                    </h2>
                    <p className="text-xl leading-10 mb-4">
                      {data.photoNarrative}
                      {data.photoNarrative && data.photoNarrativeOptional && <br />}
                      {data.photoNarrativeOptional}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* related photographs */}
      <div className="w-full lg:py-20 py-10">
        <FeaturedPhotographCards/>
      </div>
    </div>
  );
}
