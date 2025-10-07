// @ts-nocheck
import React, { useMemo } from "react";
import useFeaturedLetters from "@/hooks/useFeaturedLetters";
import useFeaturedPhotos from "@/hooks/useFeaturedPhotos";
import { fileUrl } from "@/utils/files";
import FeaturedLetterCards from "@/components/Letter/FeaturedLetterCards";
import FeaturedPhotographCard from "@/components/Cards/FeaturedPhotographCard";
import FeaturedPhotographCards from "@/components/photographs/FeaturedPhotographCards";

const Featuredletterandphotographs = () => {
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

  // helper to get latest record
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
    const imgs = Array.isArray(heroLetter?.letterImage)
      ? heroLetter.letterImage
      : [];
    const first = imgs.find((x) => x?.path) || null;

    return {
      name: heroLetter?.fullName || "Unknown",
      decade: heroLetter?.decade || "Unknown",
      category: heroLetter?.letterCategory || "—",
      excerpt:
        heroLetter?.letterNarrativeOptional ||
        heroLetter?.letterNarrative ||
        "—",
      overlay: first ? fileUrl(first.path) : "/images/sample-letter.jpg",
      to: `/letters/${encodeURIComponent(
        heroLetter?.letterLanguage?.toLowerCase() || "english"
      )}/${encodeURIComponent(heroLetter?._id)}`,
    };
  }, [heroLetter]);

  // ===== Featured Photo =====
  const heroPhoto = useMemo(() => getLatest(photos), [photos]);
  const heroPhotoVM = useMemo(() => {
    if (!heroPhoto) return null;
    const imgs = Array.isArray(heroPhoto?.photoImage)
      ? heroPhoto.photoImage
      : [];
    const first = imgs.find((x) => x?.path) || null;

    return {
      name: heroPhoto?.photoCaption || "Unknown",
      place: heroPhoto?.photoPlace || "Unknown",
      excerpt: heroPhoto?.photoNarrative,
      overlay: first ? fileUrl(first.path) : "/images/sample-photo.jpg",
      to: `/photographs/${encodeURIComponent(heroPhoto?._id)}`,
      title: heroPhoto?.title || "Untitled Photo",
    };
  }, [heroPhoto]);

  return (
    <div className="flex flex-col justify-center max-w-[1270px] items-start gap-14 lg:px-10 xl:px-0 mx-auto px-5 lg:py-20 py-10">
      {/* ===== Featured Letter ===== */}
      <section className="flex flex-col items-start justify-center gap-10 w-full">
        <h1
          className="font-bold text-4xl lg:text-[40px] capitalize"
          style={{ fontFamily: "Philosopher" }}
        >
          Featured Letter
        </h1>

        {lettersLoading ? (
          <div className="opacity-70">loading featured letter…</div>
        ) : lettersError ? (
          <div className="opacity-70">{lettersError}</div>
        ) : heroLetterVM ? (
          <div className="relative flex flex-col lg:flex-row justify-between items-center gap-10 xl:h-[460px] w-full h-full mx-auto rounded-[20px] border-2 border-[#6E4A27] px-5 xl:px-[80px] py-[20px]">
            <div className="flex flex-col justify-center items-start gap-2 w-fit text-left">
              <span className="text-[20px] font-bold font-[Philosopher] text-[#23262F]">
                {heroLetterVM.name}
              </span>
              <span className="text-[16px] font-bold font-[Philosopher] text-[#23262F] opacity-50">
                {heroLetterVM.decade}
              </span>
              <div className="mt-5 xl:w-[570px]">
                <p className="text-[28px] leading-[140%] text-[#23262F] font-[Ephesis] font-normal lowercase h-[200px] overflow-hidden">
                  {heroLetterVM.excerpt}
                </p>
                <a
                  href={heroLetterVM.to}
                  className="text-[#6E4A27] hover:underline text-lg font-medium inline-block mt-1"
                >
                  ... Read more
                </a>
              </div>
            </div>

            <a href={heroLetterVM.to} className="relative group">
              <div className="relative cursor-pointer rounded-[20px] overflow-hidden w-[350px] h-[410px] mx-auto">
                <img
                  src="/images/Card.webp"
                  alt=""
                  loading="eager"
                  className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
                />
                <span
                  className="absolute top-12 lg:right-24 bg-white text-black text-sm font-semibold px-3 py-1 rounded-full shadow-md border border-black/10 z-20"
                  style={{ fontFamily: "Philosopher" }}
                >
                  Featured
                </span>
                <div className="relative flex justify-center z-10 pt-[30px]">
                  <img
                    src={heroLetterVM.overlay}
                    alt={heroLetterVM.title}
                    loading="eager"
                    className="object-fill group-hover:drop-shadow-xl transition-all duration-300 w-[200px] h-[250px] rounded-sm"
                  />
                  <img
                    src="/images/logo.png"
                    alt=""
                    className="absolute top-20 left-[100px] w-[150px] h-[150px] opacity-20 object-cover pointer-events-none select-none"
                  />
                </div>
                <div
                  className="absolute text-left"
                  style={{ width: "310px", top: "300px", left: "23px" }}
                >
                  <h2
                    className="text-[24px] lg:text-xl font-semibold text-black mb-1 truncate w-full"
                    style={{ fontFamily: "Philosopher" }}
                  >
                    {heroLetterVM.name}
                  </h2>
                  <p
                    className="font-ephesis line-clamp-2"
                    style={{
                      fontFamily: "Ephesis",
                      fontWeight: 400,
                      fontSize: "20px",
                      lineHeight: "100%",
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
          <div className="opacity-70">no featured letters.</div>
        )}
      </section>

      <div className="w-full">
        <FeaturedLetterCards />
      </div>

      {/* ===== Featured Photograph ===== */}
      <section className="flex flex-col items-start justify-center gap-10 w-full">
        <h2
          className="font-bold text-4xl lg:text-[40px] capitalize"
          style={{ fontFamily: "Philosopher" }}
        >
          Featured Photograph
        </h2>

        {photosLoading ? (
          <div className="opacity-70">loading featured photograph…</div>
        ) : photosError ? (
          <div className="opacity-70">{photosError}</div>
        ) : heroPhotoVM ? (
          <div className="relative flex flex-col lg:flex-row justify-between items-center gap-10 xl:h-[460px] w-full h-full mx-auto rounded-[20px] border-2 border-[#6E4A27] px-5 xl:px-[80px] py-[20px]">
            <div className="flex flex-col justify-center items-start gap-2 w-fit text-left">
              <span className="text-[20px] font-bold font-[Philosopher] text-[#23262F]">
                {heroPhotoVM.name}
              </span>
              <span className="text-[16px] font-bold font-[Philosopher] text-[#23262F] opacity-50">
                {heroPhotoVM.place}
              </span>
              <div className="mt-5 xl:w-[570px]">
                <p className="text-[28px] leading-[140%] text-[#23262F] font-[Ephesis] font-normal lowercase h-[200px] overflow-hidden">
                  {heroPhotoVM.excerpt}
                </p>
                <a
                  href={heroPhotoVM.to}
                  className="text-[#6E4A27] hover:underline text-lg font-medium inline-block mt-1"
                >
                  ... Read more
                </a>
              </div>
            </div>

            <a href={heroPhotoVM.to} className="relative group">
              <div className="relative cursor-pointer rounded-[20px] overflow-hidden w-[350px] h-[410px] mx-auto">
                <img
                  src="/images/Card.webp"
                  alt=""
                  loading="eager"
                  className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
                />
                <span
                  className="absolute top-12 lg:right-24 bg-white text-black text-sm font-semibold px-3 py-1 rounded-full shadow-md border border-black/10 z-20"
                  style={{ fontFamily: "Philosopher" }}
                >
                  Featured
                </span>
                <div className="relative flex justify-center z-10 pt-[30px]">
                  <img
                    src={heroPhotoVM.overlay}
                    alt={heroPhotoVM.title}
                    loading="eager"
                    className="object-fill group-hover:drop-shadow-xl transition-all duration-300 w-[200px] h-[250px] rounded-sm"
                  />
                  <img
                    src="/images/logo.png"
                    alt=""
                    className="absolute top-20 left-[100px] w-[150px] h-[150px] opacity-20 object-cover pointer-events-none select-none"
                  />
                </div>
                <div
                  className="absolute text-left"
                  style={{ width: "310px", top: "300px", left: "23px" }}
                >
                  <h3
                    className="text-[24px] lg:text-xl font-semibold text-black mb-1 truncate w-full"
                    style={{ fontFamily: "Philosopher" }}
                  >
                    {heroPhotoVM.name}
                  </h3>
                  <p
                    className="font-ephesis line-clamp-2"
                    style={{
                      fontFamily: "Ephesis",
                      fontWeight: 400,
                      fontSize: "20px",
                      lineHeight: "100%",
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
          <div className="opacity-70">no featured photographs.</div>
        )}
      </section>

       <div className="w-full">
        <FeaturedPhotographCards />
      </div>
    </div>
  );
};

export default Featuredletterandphotographs;
