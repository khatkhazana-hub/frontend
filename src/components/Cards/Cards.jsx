// @ts-nocheck
import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import LetterCard from "./LetterCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL || "http://localhost:8000";

const shouldStripPublic = () => {
  try {
    const host = new URL(FILE_BASE).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return true;
  }
};

const fileUrl = (pathLike) => {
  if (!pathLike) return "";
  if (/^https?:\/\//i.test(pathLike)) return pathLike;
  let p = String(pathLike).replace(/^\/+/, "");
  if (shouldStripPublic() && p.startsWith("public/")) {
    p = p.replace(/^public\//, "");
  }
  const base = String(FILE_BASE).replace(/\/+$/, "");
  return `${base}/${p}`;
};

const RelatedCards = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // ✅ put /api back (you removed it accidentally)
        const res = await fetch(`${API_BASE}/submissions`, {
          cache: "no-store",
        });
        const json = await res.json();
        const arr = Array.isArray(json) ? json : json?.data || [];
        const featured = arr.filter((item) => item?.featuredLetter === true);
        setLetters(featured);
      } catch (err) {
        console.error("Error fetching letters:", err);
        setLetters([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // new refs for arrows
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (loading) {
    return (
      <div className="mt-14 w-full flex justify-center">
        <div className="w-full max-w-[1270px] text-center text-sm opacity-70">
          loading featured letters…
        </div>
      </div>
    );
  }

  if (!letters.length) {
    return (
      <div className="mt-14 w-full flex justify-center">
        <div className="w-full max-w-[1270px] text-center text-sm opacity-70">
          no featured letters found.
        </div>
      </div>
    );
  }

  console.log(letters, "letters");

  return (
    <div className="flex flex-col justify-center items-start gap-14 lg:px-0 max-w-[1270px] mx-auto ">
      {/* Heading */}
      <div className="flex justify-between items-center lg:items-center w-full">
        <h1
          className="font-bold text-left text-3xl lg:text-[40px]  capitalize"
          style={{ fontFamily: "Philosopher" }}
        >
          Featured Letters
        </h1>

        {/* arrow buttons */}
        <div className="flex items-center gap-3 ">
          <button
            ref={prevRef}
            className="bg-[#6E4A27] text-white rounded-full p-3 text-xl cursor-pointer hover:bg-[#8b5e34] transition"
          >
            <FaArrowLeft />
          </button>
          <button
            ref={nextRef}
            className="bg-[#6E4A27] text-white rounded-full p-3 text-xl cursor-pointer hover:bg-[#8b5e34] transition"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      <div className="w-full max-w-[1270px]">
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={50}
          slidesPerView="auto"
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
        >
          {letters.map((r) => {
            const title = r?.title || "Untitled";
            const descSrc =
              r?.letterNarrativeOptional ||
              r?.letterNarrative ||
              "No description";
            const description =
              descSrc.length > 80 ? `${descSrc.slice(0, 80)}...` : descSrc;

            const overlayUrl =
              fileUrl(r?.photoImage?.path) ||
              fileUrl(r?.letterImage?.path) ||
              "";

            // ✅ build the route exactly like you asked
            const lang = encodeURIComponent(
              (r?.letterLanguage || "english").toLowerCase()
            );
            const id = encodeURIComponent(r?._id);
            const href = `/letters/${lang}/${id}`;

            return (
              <SwiperSlide
                key={r._id}
                className="flex justify-start !w-[350px]"
              >
                <LetterCard
                  to={href}
                  overlay={overlayUrl}
                  title={title}
                  description={description}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default RelatedCards;
