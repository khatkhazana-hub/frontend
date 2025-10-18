// @ts-nocheck
import React, { useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ThumbnailCards from "../../components/InnerComponents/ThumbnailCards";
import { IoCalendarOutline } from "react-icons/io5";
import MainImageWithSlider from "./MainImageWithSlider";
import useSubmission from "../../hooks/useSubmission";
import FeaturedLetterCards from "@/components/Letter/FeaturedLetterCards";
import RelatedLetterCards from "@/components/Letter/RelatedLetterCards";


const BASE_URL = import.meta.env.VITE_FILE_BASE_URL || window.location.origin;

// turn stored path/location/url into a full URL
const fileUrl = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const cleaned = String(p).replace(/^\/+/, ""); // keep "public/..."
  return `${BASE_URL}/${cleaned}`;
};

// single meta -> url
const metaToUrl = (m) => fileUrl(m?.path || m?.location || m?.url || "");

// array-or-object -> array of urls
const fieldToUrls = (v) => {
  if (!v) return [];
  const arr = Array.isArray(v) ? v : [v];
  return arr.map(metaToUrl).filter(Boolean);
};

const LetterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // use the hook
  const { data, loading, error: err } = useSubmission(id);

  // redirect out if not approved (once we have data)
  React.useEffect(() => {
    if (!data) return;
    const status = data?.status?.toLowerCase?.() || "";
    if (status !== "approved") {
      navigate(`/letters/${data?.letterLanguage?.toLowerCase() || "english"}`, {
        replace: true,
      });
    }
  }, [data, navigate]);

  // scroll to top when page loads or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
    letterImage, // array or single (legacy)
    letterAudioFile, // single
    photoCaption,
    photoImage, // array or single (legacy)
    photoNarrative,
    fullName,
  } = data;

  // build image sources from arrays
  const letterImages = fieldToUrls(letterImage);
  const photoImages = fieldToUrls(photoImage);

  // hero = first letter image; fallback to first photo image
  const heroImage = photoImages[0] || "";
  const RelatedImages = photoImages;

  // slider prefers letter images; if none, uses photos
  const sliderImages = letterImages.length ? letterImages : photoImages;

  const audioSrc = metaToUrl(letterAudioFile);

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

        {/* Owner / Decade */}
        <div className="text-base opacity-80 capitalize ps-3 mt-3">
          {fullName ? `By ${fullName}` : ""} {decade ? `· ${decade}` : ""}
        </div>
      </div>

      {/* Main Content */}
      <div
        className="w-full max-w-[1270px] rounded-[16px] py-10 px-5 lg:py-16 lg:px-8 flex flex-col gap-10 bg-cover bg-center mx-auto"
        style={{
          backgroundImage: `url(${import.meta.env.VITE_FILE_BASE_URL}/public/StaticImages/Card.webp)`,
        }}
      >
        <div className="w-full text-black">
          <div className="flex flex-col lg:flex-row justify-start gap-5 mb-6 w-full">
            <MainImageWithSlider
              heroImage={heroImage}
              title={title}
              images={sliderImages}
            />

            {/* right-side thumbnails -> all uploaded photo images */}
            <RelatedLetterCards photos={RelatedImages} />
          </div>

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
          {!!letterNarrative && (
            <div className="mt-10 flex flex-col lg:flex-row justify-between gap-10">
              <div className="text-black text-left leading-10">
                <h2 className="text-2xl font-bold mb-2">Letter Transcript</h2>
                <p className="text-xl leading-10 mb-4">{letterNarrative}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Letters Section */}
      <div className="w-full lg:py-20 py-10">
        <FeaturedLetterCards />
      </div>
    </div>
  );
};

export default LetterDetailPage;
