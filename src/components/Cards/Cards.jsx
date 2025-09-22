// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import LetterCard from "./LetterCard";

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
    <div className="w-full flex flex-col items-center gap-10 lg:gap-20">
      {/* Heading */}
      <h2
        className="text-4xl font-bold text-black"
        style={{ fontFamily: "philosopher" }}
      >
        Related Letters
      </h2>

      <div className="w-full max-w-[1270px]">
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 2.3 },
            1440: { slidesPerView: 3.2 },
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
              <SwiperSlide key={r._id} className="flex justify-start">
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
