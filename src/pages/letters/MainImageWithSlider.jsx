// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Scrollbar } from "swiper/modules";
import { Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/scrollbar";
import ImageModalViewer from "@/components/ImageModalViewer/ImageModalViewer";
import { computeOrientation, FRAME_VARIANTS } from "@/utils/frameVariants";

const FRAME_STYLES = FRAME_VARIANTS.mainSlider;

export default function MainImageWithSlider({ images = [], title, withFrame = false }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [orientationMap, setOrientationMap] = useState({});
  const [errored, setErrored] = useState({});
  const swiperRef = useRef(null);

  const heroImage = images[selectedIndex] || "/images/placeholder.webp";
  const heroOrientation = orientationMap[selectedIndex] || "portrait";
  const heroStyles = FRAME_STYLES[heroOrientation] || FRAME_STYLES.portrait;

  const openModalAt = (index) => {
    setSelectedIndex(index);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);
  const handlePrev = () => setSelectedIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setSelectedIndex((i) => Math.min(images.length - 1, i + 1));

  // Track scrollability for mobile Swiper
  useEffect(() => {
    if (!swiperRef.current) return;
    const swiper = swiperRef.current.swiper;
    const checkEdges = () => {
      setCanScrollLeft(swiper.isBeginning === false);
      setCanScrollRight(swiper.isEnd === false);
    };
    swiper.on("slideChange", checkEdges);
    swiper.on("touchMove", checkEdges);
    swiper.on("progress", checkEdges);
    swiper.on("resize", checkEdges);
    checkEdges();
    return () => {
      swiper.off("slideChange", checkEdges);
      swiper.off("touchMove", checkEdges);
      swiper.off("progress", checkEdges);
      swiper.off("resize", checkEdges);
    };
  }, [images]);

  const handleImageLoad = (e, index) => {
    if (!withFrame) return;
    const { naturalWidth = 0, naturalHeight = 0 } = e.target;
    setOrientationMap((prev) => ({
      ...prev,
      [index]: computeOrientation(naturalWidth, naturalHeight),
    }));
  };

  const handleImageError = (index) => {
    if (!withFrame) return;
    setErrored((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-5 justify-between items-start w-full">
        {/* Main image */}
        <div className="relative flex justify-center items-center mx-auto group w-full max-w-[480px] px-2 sm:px-0">
          {withFrame ? (
            <div
              className={`relative flex justify-center items-center ${heroStyles.frameBoxClass} cursor-zoom-in`}
              role="button"
              tabIndex={0}
              onClick={() => openModalAt(selectedIndex)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openModalAt(selectedIndex);
                }
              }}
            >
              <div className={`${heroStyles.windowClass} overflow-hidden`}>
                {!errored[selectedIndex] ? (
                  <img
                    src={heroImage}
                    alt={title || "Photo"}
                    className="w-full h-full object-cover select-none"
                    onLoad={(e) => handleImageLoad(e, selectedIndex)}
                    onError={() => handleImageError(selectedIndex)}
                    draggable={false}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-xs text-gray-600 bg-gray-200">
                    image unavailable
                  </div>
                )}
              </div>

              {/* Watermark */}
              <img
                src="/images/logo.png"
                alt="Watermark"
                className={heroStyles.watermarkClass}
              />

              {/* Frame overlay */}
              <img
                src={heroStyles.frameSrc}
                alt="Frame"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-20"
              />

              {/* Fullscreen button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openModalAt(selectedIndex);
                }}
                aria-label="Enter full screen"
                className="absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 opacity-90 transition-opacity bg-black/55 hover:bg-black/70 text-white rounded-full p-2 shadow ring-1 ring-white/20 z-30"
              >
                <Maximize2 size={18} />
              </button>
            </div>
          ) : (
            <>
              <img
                src={heroImage}
                alt={title || "Photo"}
                className="rounded-md mx-auto w-full max-w-[360px] sm:max-w-[420px] h-[320px] sm:h-[360px] lg:h-[500px] object-cover cursor-zoom-in"
                onClick={() => openModalAt(selectedIndex)}
                draggable={false}
              />

              {/* Watermark */}
              <img
                src="/images/logo.png"
                alt="Watermark"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] max-w-[160px] opacity-20 object-contain pointer-events-none select-none z-10"
              />

              {/* Fullscreen button */}
              <button
                type="button"
                onClick={() => openModalAt(selectedIndex)}
                aria-label="Enter full screen"
                className="absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 opacity-90 transition-opacity bg-black/55 hover:bg-black/70 text-white rounded-full p-2 shadow ring-1 ring-white/20"
              >
                <Maximize2 size={18} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails Section */}
        <div className="w-full lg:w-fit mt-5 relative">
                    {/* Mobile horizontal scroll */}
          <div className="block lg:hidden relative">
            <Swiper
              ref={swiperRef}
              slidesPerView={"auto"}
              spaceBetween={8}
              freeMode={true}
              grabCursor={true}
              resistanceRatio={0.85}
              touchMoveStopPropagation={false}
              scrollbar={{ draggable: true }}
              modules={[Scrollbar]}
              className="w-full px-2"
            >
              {images.map((img, i) => (
                <SwiperSlide key={i} style={{ width: "85px" }}>
                  <div
                    onClick={() => openModalAt(i)}
                    className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-150 ${
                      i === selectedIndex
                        ? "border-[#704214]"
                        : "border-transparent hover:border-[#704214]"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-20 h-14 object-cover rounded-md"
                      draggable={false}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Edge fade indicators */}
            <div
              className={`absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-white/90 to-transparent pointer-events-none transition-opacity ${
                canScrollLeft ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white/90 to-transparent pointer-events-none transition-opacity ${
                canScrollRight ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Arrow buttons (fade-in when scrollable) */}
            {canScrollLeft && (
              <button
                onClick={() => swiperRef.current.swiper.slidePrev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white rounded-full w-7 h-7 flex items-center justify-center"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => swiperRef.current.swiper.slideNext()}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white rounded-full w-7 h-7 flex items-center justify-center"
              >
                <ChevronRight size={16} />
              </button>
            )}
          </div>

                    {/* Desktop vertical scroll */}
          <div className="hidden lg:block w-fit h-[450px]">
            <Swiper
              direction="vertical"
              slidesPerView={5}
              spaceBetween={6}
              mousewheel
              modules={[Mousewheel]}
              className="h-full"
            >
              {images.map((img, i) => (
                <SwiperSlide key={i}>
                  <div
                    onClick={() => openModalAt(i)}
                    className={`cursor-pointer border-none rounded-md overflow-hidden border-2 transition-all duration-150`}>
                    <img
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className="lg:w-28 h-20 object-contain rounded-md"
                      draggable={false}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* Reusable Modal */}
      <ImageModalViewer
        isOpen={isOpen}
        images={images}
        activeIndex={selectedIndex}
        onClose={closeModal}
        onPrev={handlePrev}
        onNext={handleNext}
        title={title}
        zoomOverlayOffsetPct={12}
      />
    </>
  );
}
