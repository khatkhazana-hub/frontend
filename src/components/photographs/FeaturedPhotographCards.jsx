// @ts-nocheck
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { fileUrl } from "@/utils/files";
import useFeaturedPhotos from "@/hooks/useFeaturedPhotos";
import {
  computeOrientation,
  FRAME_VARIANTS,
  staticAsset,
} from "@/utils/frameVariants";

const FRAME_STYLES = FRAME_VARIANTS.featuredCarousel;
const CARD_BACKGROUND = staticAsset("Card.webp");

function FramedPhoto({ src, alt, orientation = "portrait", onLoad, onError }) {
  const styles = FRAME_STYLES[orientation] || FRAME_STYLES.portrait;

  return (
    <div className={`relative ${styles.frameBoxClass}`}>
      <div className={styles.windowClass}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={onLoad}
          onError={onError}
          className="w-full h-full object-contain"
        />
      </div>
      <img src="/images/logo.png" alt="" aria-hidden="true" className={styles.watermarkClass} />
      <img
        src={styles.frameSrc}
        alt="Frame"
        className="absolute inset-0 w-full h-full object-contain z-30 pointer-events-none select-none"
      />
    </div>
  );
}


export default function FeaturedPhotographCards() {
  const { data: letters, loading, error } = useFeaturedPhotos();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [orientationMap, setOrientationMap] = useState({});
  const [errored, setErrored] = useState({});

  const handleImageLoad = (e, key) => {
    const { naturalWidth = 0, naturalHeight = 0 } = e.target;
    setOrientationMap((prev) => ({
      ...prev,
      [key]: computeOrientation(naturalWidth, naturalHeight),
    }));
  };

  const handleImageError = (key) => {
    setErrored((prev) => ({ ...prev, [key]: true }));
  };

  if (loading) return (
    <div className="mt-14 w-full text-center opacity-70">
      loading featured letters…
    </div>
  );

  if (error || !letters?.length) return (
    <div className="mt-14 w-full text-center opacity-70">
      {error || "No Featured Photographs Found."}
    </div>
  );

  return (
    <div className="flex flex-col gap-14 max-w-[1270px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl lg:text-[40px] capitalize" style={{ fontFamily: "Philosopher" }}>
          Featured Photographs
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
          {letters.map((r, idx) => {
            const title = r?.photoCaption || "Untitled";
            const category = r?.photoPlace || "Untitled";
            const overlayUrl = fileUrl(r?.photoImage[0]?.path);
            const id = encodeURIComponent(r?._id);
            const href = `/photographs/${id}`;
            const key = r?._id || idx;
            const orientationKey = orientationMap[key] || "portrait";

            return (
              <SwiperSlide key={key} className="flex justify-start !w-[350px]">
                <Link to={href}>
                  <div className="relative cursor-pointer rounded-[20px] overflow-hidden w-[350px] h-[410px] group mx-auto">
                    <img
                      src={CARD_BACKGROUND}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
                    />
                    <div className="relative flex justify-center z-10 pt-[30px]">
                      {!errored[key] ? (
                        <FramedPhoto
                          src={overlayUrl}
                          alt={title}
                          orientation={orientationKey}
                          onLoad={(e) => handleImageLoad(e, key)}
                          onError={() => handleImageError(key)}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-[220px] h-[180px] rounded bg-gray-200 text-gray-600 text-xs">
                          image unavailable
                        </div>
                      )}
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
