// @ts-nocheck
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import LetterCard from "../Cards/LetterCard"; // adjust path
import { fileUrl, pickLetterImagePath } from "@/utils/files";

export default function FeaturedCards({
  items = [],
  loading = false,
  error = "",
  prevRef,
  nextRef,
}) {
  if (loading) return <div className="opacity-70">loading letters…</div>;
  if (error) return <div className="opacity-70 text-red-600">{error}</div>;
  if (!items.length)
    return <div className="opacity-70">no featured letters.</div>;


  console.log(items)

  return (
    <div className="w-full max-w-[1270px]">
      <Swiper
        className=""
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
        {items?.map((r) => {
          const title = r?.fullName || "Untitled";
          const category =r?.letterCategory

          const overlay = fileUrl(pickLetterImagePath(r));
          const lang = encodeURIComponent(
            (r?.letterLanguage || "english").toLowerCase()
          );
          const id = encodeURIComponent(r?._id);
          const to = `/letters/${lang}/${id}`;

          return (
            <SwiperSlide key={r._id} className="flex justify-start !w-[350px]">
              <LetterCard
                to={to}
                overlay={overlay}
                title={title}
                category={category}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
