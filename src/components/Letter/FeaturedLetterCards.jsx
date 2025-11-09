// @ts-nocheck
import React, { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import useFeaturedLetters from "@/hooks/useFeaturedLetters";
import { fileUrl } from "@/utils/files";


export default function FeaturedLetterCards() {
  const { data: letters, loading, error } = useFeaturedLetters();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (loading) return (
    <div className="mt-14 w-full text-center opacity-70">
      loading featured letters…
    </div>
  );

  if (error || !letters?.length) return (
    <div className="mt-14 w-full text-center opacity-70">
      {error || "No Featured Letters Found."}
    </div>
  );

  return (
    <div className="flex flex-col gap-14 max-w-[1270px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
        <h1
          className="font-bold text-2xl sm:text-3xl lg:text-[40px] text-center sm:text-left capitalize"
          style={{ fontFamily: "Philosopher" }}
        >
          Featured Letters
        </h1>
        <div className="flex items-start gap-3">
          <button ref={prevRef} className="bg-[#6E4A27] text-white rounded-full p-3 text-xl hover:bg-[#8b5e34] transition">
            <FaArrowLeft />
          </button>
          <button ref={nextRef} className="bg-[#6E4A27] text-white rounded-full p-3 text-xl hover:bg-[#8b5e34] transition">
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Swiper */}
      <div className="w-full px-2 sm:px-0">
        <Swiper
          modules={[Pagination, Navigation]}
          slidesPerView="auto"
          centerInsufficientSlides
          breakpoints={{
            0: { spaceBetween: 16 },
            640: { spaceBetween: 32 },
            1024: { spaceBetween: 50 },
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
        >
          {letters.map((r, idx) => {
            const title = r?.fullName || "Untitled";
            const category = r?.letterCategory || "";
            const overlayUrl = fileUrl(r?.letterImage[0]?.path) 


            const lang = encodeURIComponent((r?.letterLanguage || "english").toLowerCase());
            const id = encodeURIComponent(r?._id);
            const href = `/letters/${lang}/${id}`;

            return (
              <SwiperSlide key={r?._id || idx} className="flex justify-start !w-[280px] sm:!w-[320px] lg:!w-[350px]">
                <Link to={href}>
                  <div className="relative cursor-pointer rounded-[20px] overflow-hidden w-full max-w-[350px] h-[410px] group mx-auto">
                    <img
                      src={`${import.meta.env.VITE_FILE_BASE_URL}/public/StaticImages/Card.webp`}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
                    />
                    <div className="relative flex justify-center z-10 pt-[20px] sm:pt-[30px]">
                      <img
                        src={overlayUrl}
                        alt=""
                        className="object-contain transition-all duration-300 w-[160px] h-[210px] sm:w-[190px] sm:h-[240px] rounded-sm"
                      />
                      <img
                        src="/images/logo.png"
                        alt=""
                        className="absolute top-14 left-1/2 -translate-x-1/2 w-[120px] h-[120px] opacity-20 object-cover pointer-events-none"
                      />
                    </div>
                    <div className="absolute left-4 right-4 bottom-6 text-left sm:left-[25px] sm:right-[25px]">
                      <h2 className="text-xl sm:text-[22px] lg:text-[24px] font-semibold text-black mb-1 truncate font-[philosopher] capitalize">
                        {title}
                      </h2>
                      {category && (
                        <p className="font-[Ephesis] font-normal text-base sm:text-[20px] leading-tight text-black m-0 line-clamp-2 capitalize">
                          {category}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
