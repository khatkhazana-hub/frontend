// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from "react";
import useSubmissions from "@/hooks/useSubmissions";
import TestimonialCard from "../../components/InnerComponents/TestimonialCard";
import FeaturedCards from "../../components/Cards/FeaturedCards";
import FeaturedPhotographCard from "../../components/Cards/FeaturedPhotographCard";
import TestimonialPhotographCard from "../../components/InnerComponents/TestimonialPhotographCard";
import Subcription from "../../components/InnerComponents/Subcription";
import PopupSubscritionModel from "./PopupSubscritionModel";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// 👇 you'll need these to build image urls for the hero cards
import {
  fileUrl,
  pickLetterImagePath,
  pickPhotoImagePath,
} from "@/utils/files";

const Featurelatter = () => {
  const { rows, loading, err } = useSubmissions();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const subscribed = localStorage.getItem("isSubscribed");
    if (!subscribed) setShowPopup(true);
  }, []);

  // helpers
  const getDate = (r) => {
    const d = r?.updatedAt || r?.createdAt || r?.publishedAt || r?.date;
    return d ? new Date(d) : new Date(0);
  };

  const sortNewestFirst = (arr) =>
    [...arr].sort((a, b) => getDate(b) - getDate(a));

  // filter featured + approved
  const featuredLettersRaw = useMemo(
    () =>
      rows.filter(
        (r) =>
          r?.featuredLetter === true &&
          String(r?.status || "").toLowerCase() === "approved"
      ),
    [rows]
  );

  const featuredPhotosRaw = useMemo(
    () =>
      rows.filter(
        (r) =>
          r?.featuredPhoto === true &&
          String(r?.status || "").toLowerCase() === "approved"
      ),
    [rows]
  );

  // newest first
  const featuredLettersSorted = useMemo(
    () => sortNewestFirst(featuredLettersRaw),
    [featuredLettersRaw]
  );

  const featuredPhotosSorted = useMemo(
    () => sortNewestFirst(featuredPhotosRaw),
    [featuredPhotosRaw]
  );

  // pick hero (latest) + remainder for sliders
  const heroLetter = featuredLettersSorted[0] || null;
  const restLetters = featuredLettersSorted.slice(1);

  const heroPhoto = featuredPhotosSorted[0] || null;
  const restPhotos = featuredPhotosSorted.slice(1);

  // map hero content to card props
  const heroLetterCard = useMemo(() => {
    if (!heroLetter) return null;
    const title = heroLetter?.title || "Untitled";
    const descSrc =
      heroLetter?.letterNarrativeOptional || heroLetter?.letterNarrative || "—";
    const rightDescription =
      descSrc.length > 80 ? `${descSrc.slice(0, 80)}...` : descSrc;
    const overlay = fileUrl(pickLetterImagePath(heroLetter));
    const name = heroLetter?.fullName || "Unknown";
    const category = heroLetter?.letterCategory || "Unknown";
    const decade = heroLetter?.decade || "Unknown";
    const lettertrabscript = heroLetter?.letterNarrative || "Unknown";
    return { overlay, title, rightDescription, name , category , decade  , lettertrabscript};
  }, [heroLetter]);

  const heroPhotoCard = useMemo(() => {
    if (!heroPhoto) return null;
    const title =
      heroPhoto?.photoCaption || heroPhoto?.title || "Untitled Photo";
    const descSrc =
      heroPhoto?.photoNarrativeOptional ||
      heroPhoto?.photoNarrative ||
      heroPhoto?.letterNarrative ||
      "—";
    const rightDescription =
      descSrc.length > 80 ? `${descSrc.slice(0, 80)}...` : descSrc;
    const overlay = fileUrl(pickPhotoImagePath(heroPhoto));
    const name = heroPhoto?.photoCaption || "Unknown";
    const placetaken = heroLetter?.photoPlace || "Unknown";
    const phototrabscript = heroLetter?.photoNarrative || "Unknown";
    return { overlay, title, rightDescription, name , placetaken , phototrabscript };
  }, [heroPhoto]);

  // for letters
  const prevLetterRef = useRef(null);
  const nextLetterRef = useRef(null);

  // for photos
  const prevPhotoRef = useRef(null);
  const nextPhotoRef = useRef(null);
  console.log(rows);

  return (
    <div className="flex flex-col justify-center items-start gap-14 lg:px-10 xl:px-0 max-w-[1270px] mx-auto px-5 lg:py-20 py-10">
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/80 backdrop-blur-sm z-[999] ">
          <div className="bg-[#FFE1B8] rounded-lg shadow-lg p-10 max-w-md w-full relative mx-4">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
            >
              ✖
            </button>
            <PopupSubscritionModel onSubscribe={() => setShowPopup(false)} />
          </div>
        </div>
      )}

      {/* Featured Letter (hero = newest) */}
      <div className="flex flex-col items-start justify-center  gap-10 w-full">
        <h1
          className="font-bold text-4xl lg:text-[40px]  capitalize"
          style={{ fontFamily: "Philosopher" }}
        >
          Featured Letter
        </h1>

        {heroLetterCard ? (
          <TestimonialCard
            name={heroLetterCard.name}
            letCategory={heroLetterCard.category}
            decade={heroLetterCard.decade}
            lettertrabscript={heroLetterCard.lettertrabscript}
            designation="Manager of The New York Times"
            description="“They are have a perfect touch for make something so professional ...”"
            overlay={heroLetterCard.overlay}
            title={heroLetterCard.title}
            rightDescription={heroLetterCard.rightDescription}
          />
        ) : (
          <div className="opacity-70">no featured letters.</div>
        )}
      </div>

      {/* Featured Letters list (the rest) */}
      <div className="flex flex-col gap-[50px] w-full">
        <div className="flex justify-between items-center  w-full">
          <h1
            className="font-bold text-left text-2xl lg:text-[40px]  capitalize"
            style={{ fontFamily: "Philosopher" }}
          >
            Featured Letters
          </h1>

          {/* arrows */}
          <div className="flex items-center gap-3 ">
            <button
              ref={prevLetterRef}
              className="bg-[#6E4A27] text-white rounded-full p-3 text-xl cursor-pointer hover:bg-[#8b5e34] transition"
            >
              <FaArrowLeft />
            </button>
            <button
              ref={nextLetterRef}
              className="bg-[#6E4A27] text-white rounded-full p-3 text-xl cursor-pointer hover:bg-[#8b5e34] transition"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        <FeaturedCards
          items={restLetters}
          loading={loading}
          error={err}
          prevRef={prevLetterRef}
          nextRef={nextLetterRef}
        />
      </div>

      {/* Featured Photograph (hero = newest) */}
      <div className="flex flex-col items-start justify-center gap-10 w-full">
        <h1
          className="font-bold text-4xl lg:text-[40px] capitalize"
          style={{ fontFamily: "Philosopher" }}
        >
          Featured Photograph
        </h1>

        {heroPhotoCard ? (
          <TestimonialPhotographCard
            name={heroPhotoCard.name}
            phototrabscript={heroPhotoCard.phototrabscript}
            placetaken={heroPhotoCard.placetaken}
            designation="Manager of The New York Times"
            description="“They are have a perfect touch for make something so professional ...”"
            overlay={heroPhotoCard.overlay}
            title={heroPhotoCard.title}
            rightDescription={heroPhotoCard.rightDescription}
          />
        ) : (
          <div className="opacity-70">no featured photographs.</div>
        )}
      </div>

      {/* Featured Photographs list (the rest) */}
      <div className="flex flex-col gap-[50px] w-full">
        <div className="flex justify-between items-center  w-full">
          <h1
            className="font-bold text-left text-2xl lg:text-[40px]  capitalize"
            style={{ fontFamily: "Philosopher" }}
          >
            Featured Photographs
          </h1>

          {/* arrows */}
          <div className="flex items-center gap-3 ">
            <button
              ref={prevPhotoRef}
              className="bg-[#6E4A27] text-white rounded-full p-3 text-xl cursor-pointer hover:bg-[#8b5e34] transition"
            >
              <FaArrowLeft />
            </button>
            <button
              ref={nextPhotoRef}
              className="bg-[#6E4A27] text-white rounded-full p-3 text-xl cursor-pointer hover:bg-[#8b5e34] transition"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        <FeaturedPhotographCard
          items={restPhotos}
          loading={loading}
          error={err}
          nextRef={nextPhotoRef}
          prevRef={prevPhotoRef}
        />
      </div>

      <div className="w-full my-10">
        <Subcription />
      </div>
    </div>
  );
};

export default Featurelatter;
