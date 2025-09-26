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

const Featurelatter = () => {
  const { rows, loading, err } = useSubmissions(); // ✅ one API call here
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Page load hone pr check kare
  useEffect(() => {
    const subscribed = localStorage.getItem("isSubscribed");
    if (!subscribed) {
      setShowPopup(true); // agar subscribed nahi hai to popup show karo
    }
  }, []);

  const featuredLetters = useMemo(
    () =>
      rows.filter(
        (r) =>
          r?.featuredLetter === true &&
          String(r?.status || "").toLowerCase() === "approved"
      ),
    [rows]
  );

  const featuredPhotos = useMemo(
    () =>
      rows.filter(
        (r) =>
          r?.featuredPhoto === true &&
          String(r?.status || "").toLowerCase() === "approved"
      ),
    [rows]
  );

  // for letters
  const prevLetterRef = useRef(null);
  const nextLetterRef = useRef(null);

  // for photos
  const prevPhotoRef = useRef(null);
  const nextPhotoRef = useRef(null);

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
            <PopupSubscritionModel
              onSubscribe={() => {
                // Jab subscribe ho jaye tab popup band kar do
                setShowPopup(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Featured Letter (hero) */}
      <div className="flex flex-col items-start justify-center  gap-10 w-full">
        <h1
          className="font-bold text-4xl lg:text-[40px]  capitalize"
          style={{ fontFamily: "Philosopher" }}
        >
          Featured Letter
        </h1>

        <TestimonialCard
          name="Josh Smith"
          designation="Manager of The New York Times"
          description="“They are have a perfect touch for make something so professional ...”"
        />
      </div>

      {/* Featured Letters */}
      <div className="flex flex-col gap-[50px] w-full">
        <div className="flex justify-between items-center  w-full">
          <h1
            className="font-bold text-left text-2xl lg:text-[40px]  capitalize"
            style={{ fontFamily: "Philosopher" }}
          >
            Featured Letters
          </h1>

          {/* arrow buttons */}
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
          items={featuredLetters}
          loading={loading}
          error={err}
          prevRef={prevLetterRef}
          nextRef={nextLetterRef}
        />
      </div>

      {/* Featured Photograph (hero) */}
      <div className="flex flex-col items-start justify-center gap-10 w-full">
        <h1
          className="font-bold text-4xl lg:text-[40px] capitalize"
          style={{ fontFamily: "Philosopher" }}
        >
          Featured Photograph
        </h1>
        <TestimonialPhotographCard
          name="Josh Smith"
          designation="Manager of The New York Times"
          description="“They are have a perfect touch for make something so professional ...”"
        />
      </div>

      {/* Featured Photographs */}
      <div className="flex flex-col gap-[50px] w-full">
        <div className="flex justify-between items-center  w-full">
          <h1
            className="font-bold text-left text-2xl lg:text-[40px]  capitalize"
            style={{ fontFamily: "Philosopher" }}
          >
            Featured Photographs
          </h1>

          {/* arrow buttons */}
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
          items={featuredPhotos}
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
