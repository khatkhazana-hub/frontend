// @ts-nocheck
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import LetterCard from "../Cards/LetterCard"; // adjust path
import { fileUrl, pickLetterImagePath } from "@/utils/files";

export default function FeaturedCards({ items = [], loading = false, error = "" }) {
  if (loading) return <div className="opacity-70">loading letters…</div>;
  if (error)   return <div className="opacity-70 text-red-600">{error}</div>;
  if (!items.length) return <div className="opacity-70">no featured letters.</div>;

  return (
    <div className="w-full">
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
        {items.map((r) => {
          const title = r?.title || "Untitled";
          const descSrc = r?.letterNarrativeOptional || r?.letterNarrative || "—";
          const description = descSrc.length > 80 ? `${descSrc.slice(0, 80)}...` : descSrc;

          const overlay = fileUrl(pickLetterImagePath(r));
          const lang = encodeURIComponent((r?.letterLanguage || "english").toLowerCase());
          const id = encodeURIComponent(r?._id);
          const to = `/letters/${lang}/${id}`;

          return (
            <SwiperSlide key={r._id} className="flex justify-start">
              <LetterCard to={to} overlay={overlay} title={title} description={description} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
