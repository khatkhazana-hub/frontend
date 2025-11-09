import React, { useMemo, useEffect, useState } from "react";
import useFeaturedLetters from "@/hooks/useFeaturedLetters";
import useFeaturedPhotos from "@/hooks/useFeaturedPhotos";
import { fileUrl } from "@/utils/files";
import FeaturedLetterCards from "@/components/Letter/FeaturedLetterCards";
import FeaturedPhotographCards from "@/components/photographs/FeaturedPhotographCards";
import PopupSubscritionModel from "../letters/PopupSubscritionModel";
import {
  computeOrientation,
  FRAME_VARIANTS,
  staticAsset,
} from "@/utils/frameVariants";

const Featuredletterandphotographs = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [photoOrientation, setPhotoOrientation] = useState("portrait");
  const [photoErrored, setPhotoErrored] = useState(false);

  useEffect(() => {
    const subscribed = typeof window !== "undefined" && localStorage.getItem("isSubscribed");
    if (!subscribed) setShowPopup(true);
  }, []);

  const {
    data: letters = [],
    loading: lettersLoading,
    error: lettersError,
  } = useFeaturedLetters();

  const {
    data: photos = [],
    loading: photosLoading,
    error: photosError,
  } = useFeaturedPhotos();

  const getLatest = (arr) => {
    if (!arr?.length) return null;
    const getDate = (r) =>
      new Date(r?.updatedAt || r?.createdAt || r?.publishedAt || r?.date || 0);
    return [...arr].sort((a, b) => getDate(b) - getDate(a))[0];
  };

  // ===== Featured Letter =====
  const heroLetter = useMemo(() => getLatest(letters), [letters]);
  const heroLetterVM = useMemo(() => {
    if (!heroLetter) return null;
    const imgs = Array.isArray(heroLetter?.letterImage) ? heroLetter.letterImage : [];
    const first = imgs.find((x) => x?.path) || null;

    return {
      name: heroLetter?.fullName || "Unknown",
      decade: heroLetter?.decade || "Unknown",
      category: heroLetter?.letterCategory || "—",
      excerpt: heroLetter?.letterNarrativeOptional || heroLetter?.letterNarrative || "—",
      overlay: first ? fileUrl(first.path) : "/images/sample-letter.jpg",
      to: `/letters/${encodeURIComponent(
        heroLetter?.letterLanguage?.toLowerCase() || "english"
      )}/${encodeURIComponent(heroLetter?._id)}`,
      title: heroLetter?.title || heroLetter?.fullName || "Featured Letter",
    };
  }, [heroLetter]);

  // ===== Featured Photo =====
  const heroPhoto = useMemo(() => getLatest(photos), [photos]);
  const heroPhotoVM = useMemo(() => {
    if (!heroPhoto) return null;
    const imgs = Array.isArray(heroPhoto?.photoImage) ? heroPhoto.photoImage : [];
    const first = imgs.find((x) => x?.path) || null;

    return {
      name: heroPhoto?.photoCaption || "Unknown",
      place: heroPhoto?.photoPlace || "Unknown",
      excerpt: heroPhoto?.photoNarrative || "—",
      overlay: first ? fileUrl(first.path) : "/images/sample-photo.jpg",
      to: `/photographs/${encodeURIComponent(heroPhoto?._id)}`,
      title: heroPhoto?.title || "Untitled Photo",
    };
  }, [heroPhoto]);

  useEffect(() => {
    setPhotoOrientation("portrait");
    setPhotoErrored(false);
  }, [heroPhotoVM?.overlay]);

  const handleHeroPhotoLoad = (e) => {
    const { naturalWidth = 0, naturalHeight = 0 } = e.target;
    const orientation = computeOrientation(naturalWidth, naturalHeight);
    setPhotoOrientation(orientation === "square" ? "1:1" : orientation);
  };

  const handleHeroPhotoError = () => {
    setPhotoErrored(true);
  };


  const FEATURED_FRAMES = FRAME_VARIANTS.featuredBundle;
  const normalizedOrientation =
    photoOrientation === "1:1" ? "square" : photoOrientation;
  const frameStyles =
    FEATURED_FRAMES[normalizedOrientation] || FEATURED_FRAMES.portrait;
  const isLandscape = normalizedOrientation === "landscape";
  const cardBackgroundSrc = staticAsset("Card.webp");

  return (
    <div className="flex flex-col justify-center items-start gap-14 mx-auto px-4 sm:px-6 lg:px-10 xl:px-0 max-w-[1270px] lg:py-20 py-10">
      {showPopup && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-md rounded-lg bg-[#FFE1B8] p-6 sm:p-10 shadow-lg">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-black"
              aria-label="Close"
            >
              ✖
            </button>
            {/* <PopupSubscritionModel onSubscribe={() => setShowPopup(false)} /> */}
          </div>
        </div>
      )}

      {/* ===== Featured Letter ===== */}
      <section className="flex w-full flex-col items-start justify-center gap-6 sm:gap-8">
        <h1 className="font-bold text-2xl sm:text-3xl lg:text-[40px] capitalize" style={{ fontFamily: "Philosopher" }}>
          Featured Letter
        </h1>

        {lettersLoading ? (
          <div className="opacity-70">loading featured letter…</div>
        ) : lettersError ? (
          <div className="opacity-70">{lettersError}</div>
        ) : heroLetterVM ? (
          <div className="relative mx-auto flex w-full flex-col items-center justify-between gap-8 rounded-[20px] border-2 border-[#6E4A27] p-4 sm:p-6 xl:px-[80px] xl:py-[20px] lg:flex-row">
            <div className="flex w-full max-w-[700px] flex-col items-start justify-center gap-2 text-left">
              <span className="text-lg sm:text-xl font-bold text-[#23262F]" style={{ fontFamily: "Philosopher" }}>
                {heroLetterVM.name}
              </span>
              <span className="text-sm sm:text-base font-bold text-[#23262F] opacity-50" style={{ fontFamily: "Philosopher" }}>
                {heroLetterVM.decade}
              </span>

              <div className="mt-4 w-full">
                <p className="text-[18px] sm:text-[22px] lg:text-[28px] leading-[1.4] text-[#23262F] font-[Ephesis] font-normal lowercase line-clamp-5 lg:line-clamp-4">
                  {heroLetterVM.excerpt}
                </p>
                <a href={heroLetterVM.to} className="mt-2 inline-block text-lg font-medium text-[#6E4A27] hover:underline">
                  ... Read more
                </a>
              </div>
            </div>

            <a href={heroLetterVM.to} className="group relative w-full max-w-[380px]">
              <div className="relative mx-auto w-full overflow-hidden rounded-[20px]">
                <img
                  src={`${import.meta.env.VITE_FILE_BASE_URL}/public/StaticImages/Card.webp`}
                  alt=""
                  loading="eager"
                  className="absolute inset-0 h-full w-full rounded-[20px] object-cover"
                />

                {/* badge */}
                <span
                  className="absolute right-2 top-2 sm:right-4 sm:top-4 z-20 rounded-full border border-black/10 bg-white px-3 py-1 text-xs sm:text-sm font-semibold text-black shadow-md"
                  style={{ fontFamily: "Philosopher" }}
                >
                  Featured
                </span>

                {/* media block – consistent aspect ratio */}
                <div className="relative z-10 flex aspect-[7/8] w-full items-center justify-center p-6 sm:p-8">
                  <img
                    src={heroLetterVM.overlay}
                    alt={heroLetterVM.title}
                    loading="eager"
                    className="h-42 md:h-full w-40 object-contain rounded-sm"
                  />
                  <img
                    src="/images/logo.png"
                    alt=""
                    className="pointer-events-none absolute inset-0 m-auto h-24 w-24 opacity-20 select-none object-contain"
                  />
                </div>

                {/* text overlay */}
                <div className="absolute inset-x-4 bottom-4 text-left">
                  <h2
                    className="w-full truncate text-lg sm:text-xl font-semibold text-black"
                    style={{ fontFamily: "Philosopher" }}
                  >
                    {heroLetterVM.name}
                  </h2>
                  <p
                    className="line-clamp-2"
                    style={{
                      fontFamily: "Ephesis",
                      fontWeight: 400,
                      fontSize: "18px",
                      lineHeight: "1.1",
                      color: "#000000",
                      margin: 0,
                    }}
                  >
                    {heroLetterVM.category}
                  </p>
                </div>
              </div>
            </a>
          </div>
        ) : (
          <div className="opacity-70">No Featured Letters.</div>
        )}
      </section>

      <div className="w-full">
        <FeaturedLetterCards />
      </div>

      {/* ===== Featured Photograph ===== */}
      <section className="flex w-full flex-col items-start justify-center gap-6 sm:gap-8">
        <h2 className="font-bold text-2xl sm:text-3xl lg:text-[40px] capitalize" style={{ fontFamily: "Philosopher" }}>
          Featured Photograph
        </h2>

        {photosLoading ? (
          <div className="opacity-70">loading featured photograph…</div>
        ) : photosError ? (
          <div className="opacity-70">{photosError}</div>
        ) : heroPhotoVM ? (
          <div className="relative mx-auto flex w-full flex-col items-center justify-between gap-8 rounded-[20px] border-2 border-[#6E4A27] p-4 sm:p-6 xl:px-[80px] xl:py-[20px] lg:flex-row">
            <div className="flex w-full max-w-[700px] flex-col items-start justify-center gap-2 text-left">
              <span className="text-lg sm:text-xl font-bold text-[#23262F]" style={{ fontFamily: "Philosopher" }}>
                {heroPhotoVM.name}
              </span>
              <span className="text-sm sm:text-base font-bold text-[#23262F] opacity-50" style={{ fontFamily: "Philosopher" }}>
                {heroPhotoVM.place}
              </span>

              <div className="mt-4 w-full">
                <p className="text-[18px] sm:text-[22px] lg:text-[28px] leading-[1.4] text-[#23262F] font-[Ephesis] font-normal lowercase line-clamp-5 lg:line-clamp-4">
                  {heroPhotoVM.excerpt}
                </p>
                <a href={heroPhotoVM.to} className="mt-2 inline-block text-lg font-medium text-[#6E4A27] hover:underline">
                  ... Read more
                </a>
              </div>
            </div>

            <a href={heroPhotoVM.to} className="group relative w-full max-w-[420px]">
              <div
                className={`relative mx-auto w-full overflow-hidden rounded-[20px] ${
                  isLandscape ? "max-w-[450px]" : ""
                }`}
              >
                <img
                  src={cardBackgroundSrc}
                  alt=""
                  loading="eager"
                  className="absolute inset-0 h-full w-full rounded-[20px] object-cover"
                />

                <span
                  className={`absolute z-20 rounded-full border border-black/10 bg-white px-3 py-1 text-xs sm:text-sm font-semibold text-black shadow-md ${frameStyles.badgeOffsetClass}`}
                  style={{ fontFamily: "Philosopher" }}
                >
                  Featured
                </span>

                <div
                  className={`relative z-10 flex mb-10 w-full items-center justify-center ${frameStyles.cardAspectClass} ${frameStyles.cardPaddingClass}`}
                >
                  <div className={`relative ${frameStyles.frameBoxClass}`}>
                    <div className={frameStyles.windowClass}>
                      {!photoErrored ? (
                        <img
                          src={heroPhotoVM.overlay}
                          alt={heroPhotoVM.title}
                          loading="eager"
                          className="h-full w-full object-cover  object-center"
                          onLoad={handleHeroPhotoLoad}
                          onError={handleHeroPhotoError}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs text-gray-600">
                          image unavailable
                        </div>
                      )}
                    </div>
                    <img src="/images/logo.png" alt="" className={frameStyles.watermarkClass} />
                      <img
                        src={frameStyles.frameSrc}
                        alt="Frame"
                        className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
                      />
                  </div>
                </div>

                <div className="absolute inset-x-4 bottom-4 text-left">
                  <h3
                    className="w-full truncate text-lg font-semibold text-black sm:text-xl"
                    style={{ fontFamily: "Philosopher" }}
                  >
                    {heroPhotoVM.name}
                  </h3>
                  <p
                    className="line-clamp-2"
                    style={{
                      fontFamily: "Ephesis",
                      fontWeight: 400,
                      fontSize: "18px",
                      lineHeight: "1.1",
                      color: "#000000",
                      margin: 0,
                    }}
                  >
                    {heroPhotoVM.place}
                  </p>
                </div>
              </div>
            </a>
          </div>
        ) : (
          <div className="opacity-70">No Featured Photographs.</div>
        )}
      </section>

      <div className="w-full">
        <FeaturedPhotographCards />
      </div>
    </div>
  );
};

export default Featuredletterandphotographs;
