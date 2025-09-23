// @ts-nocheck
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import PhotographCard from "./PhotographCard";

const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL || window.location.origin;
const shouldStripPublic = () => {
  try {
    const host = new URL(FILE_BASE).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return true;
  }
};
const fileUrl = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  let rel = String(p).replace(/^\/+/, "");
  if (shouldStripPublic() && rel.startsWith("public/"))
    rel = rel.replace(/^public\//, "");
  return `${String(FILE_BASE).replace(/\/+$/, "")}/${rel}`;
};

// guards so we never pass an audio file as an image
const isImageMime = (m) => typeof m === "string" && m.startsWith("image/");
const isImageExt = (p) =>
  /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(String(p || ""));
const pickPhotoImagePath = (r) => {
  if (
    r?.photoImage &&
    (isImageMime(r.photoImage?.mimeType) || isImageExt(r.photoImage?.path))
  ) {
    return r.photoImage.path;
  }
  if (
    r?.letterImage &&
    (isImageMime(r.letterImage?.mimeType) || isImageExt(r.letterImage?.path))
  ) {
    return r.letterImage.path;
  }
  return "";
};

const PhotogaphCards = ({ items = [] }) => {
  const photos = items.filter((it) => !!pickPhotoImagePath(it));

  if (!photos.length) {
    return (
      <div className="text-center opacity-70 py-6">
        no related photographs found.
      </div>
    );
  }

  return (
    <div className="mt-14 w-full flex justify-start">
      <div className="w-full max-w-[1270px]">
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={50} // ✅ 50px gap stays
          slidesPerView="auto" // ✅ automatic number of slides
        >
          {photos.map((r) => {
            const title = r?.photoCaption || r?.title || "Untitled Photo";
            const descSrc =
              r?.photoNarrativeOptional ||
              r?.photoNarrative ||
              r?.letterNarrative ||
              "";
            const description =
              descSrc && descSrc.length > 80
                ? `${descSrc.slice(0, 80)}...`
                : descSrc || "—";
            const overlay = fileUrl(pickPhotoImagePath(r));
            const href = `/photographs/${encodeURIComponent(r?._id)}`;

            return (
              <SwiperSlide
                key={r._id}
                className="flex justify-start !w-[350px]"
              >
                <PhotographCard
                  to={href}
                  overlay={overlay}
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

export default PhotogaphCards;
