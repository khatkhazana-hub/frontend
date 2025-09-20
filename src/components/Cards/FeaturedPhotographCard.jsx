// @ts-nocheck
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import PhotographCard from "../Cards/PhotographCard"; // adjust path
import { fileUrl, pickPhotoImagePath } from "@/utils/files";

export default function FeaturedPhotographCard({ items = [], loading = false, error = "" }) {
  if (loading) return <div className="opacity-70">loading photographs…</div>;
  if (error)   return <div className="opacity-70 text-red-600">{error}</div>;
  if (!items.length) return <div className="opacity-70">no featured photographs.</div>;

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
          const title = r?.photoCaption || r?.title || "Untitled Photo";
          const descSrc = r?.photoNarrativeOptional || r?.photoNarrative || r?.letterNarrative || "—";
          const description = descSrc.length > 80 ? `${descSrc.slice(0, 80)}...` : descSrc;

          const overlay = fileUrl(pickPhotoImagePath(r));
          const to = `/photographs/${encodeURIComponent(r?._id)}`;

          return (
            <SwiperSlide key={r._id} className="flex justify-start">
              <PhotographCard to={to} overlay={overlay} title={title} description={description} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
