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
      {error || "no featured letters found."}
    </div>
  );

  return (
    <div className="flex flex-col gap-14 max-w-[1270px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl lg:text-[40px] capitalize" style={{ fontFamily: "Philosopher" }}>
          Featured Letters
        </h1>
        <div className="flex items-center gap-3">
          <button ref={prevRef} className="bg-[#6E4A27] text-white rounded-full p-3 text-xl hover:bg-[#8b5e34] transition">
            <FaArrowLeft />
          </button>
          <button ref={nextRef} className="bg-[#6E4A27] text-white rounded-full p-3 text-xl hover:bg-[#8b5e34] transition">
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Swiper */}
      <div className="w-full">
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
            const title = r?.fullName || "Untitled";
            const category = r?.letterCategory || "";
            const overlayUrl = fileUrl(r?.letterImage[0]?.path) 


            const lang = encodeURIComponent((r?.letterLanguage || "english").toLowerCase());
            const id = encodeURIComponent(r?._id);
            const href = `/letters/${lang}/${id}`;

            return (
              <SwiperSlide key={r._id} className="flex justify-start !w-[350px]">
                <Link to={href}>
                  <div className="relative cursor-pointer rounded-[20px] overflow-hidden w-[350px] h-[410px] group mx-auto">
                    <img src="/images/Card.webp" alt="" className="absolute inset-0 w-full h-full object-cover rounded-[20px]" />
                    <div className="relative flex justify-center z-10 pt-[30px]">
                      <img src={overlayUrl} alt="" className="object-fill group-hover:shadow-2xl shadow-black/50 transition-all duration-300 w-[200px] rounded-sm h-[250px]" />
                      <img src="/images/logo.png" alt="" className="absolute top-20 left-[100px] w-[150px] h-[150px] opacity-20 object-cover pointer-events-none" />
                    </div>
                    <div className="absolute left-[25px] top-[300px] w-[300px] text-left">
                      <h2 className="text-[24px] sm:text-base lg:text-xl font-semibold text-black mb-1 truncate font-[philosopher] capitalize">
                        {title}
                      </h2>
                      {category && (
                        <p className="font-[Ephesis] font-normal text-[20px] leading-[100%] text-black m-0 line-clamp-2 capitalize">
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
