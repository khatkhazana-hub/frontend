// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/mousewheel";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export default function MainImageWithSlider({ images = [], title }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  const heroImage = images[selectedIndex] || "/images/placeholder.webp";

  const openModalAt = (index) => {
    setSelectedIndex(index);
    setIsOpen(true);
    resetZoom();
  };

  const closeModal = () => {
    setIsOpen(false);
    resetZoom();
  };

  const resetZoom = () => {
    setZoom(1);
    setPos({ x: 0, y: 0 });
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
      resetZoom();
    }
  };

  const handleNext = () => {
    if (selectedIndex < images.length - 1) {
      setSelectedIndex((prev) => prev + 1);
      resetZoom();
    }
  };

  const handleZoomIn = () => setZoom((z) => clamp(z + 0.2, 0.5, 3));
  const handleZoomOut = () => setZoom((z) => clamp(z - 0.2, 0.5, 3));

  // drag only when zoomed
  const onMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    setPos({ x: e.clientX - start.x, y: e.clientY - start.y });
  };
  const onMouseUp = () => setIsDragging(false);

  // wheel to zoom inside modal
  const onWheelZoom = (e) => {
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoom((z) => clamp(z + delta, 0.5, 3));
  };

  // lock scroll + ESC/arrow keys when modal open
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "+") handleZoomIn();
      if (e.key === "-") handleZoomOut();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, selectedIndex]);

  return (
    <>
      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-5 justify-between items-start w-full">
        {/* Main Image (click to open modal) */}
        <div className="relative flex justify-center items-center mx-auto group">
          <img
            src={heroImage}
            alt={title || "Photo"}
            className="rounded-md mx-auto w-[240px] lg:w-[330px] h-[350px] lg:h-[500px] object-contain cursor-zoom-in"
            onClick={() => openModalAt(selectedIndex)}
          />

          {/* Watermark */}
          <img
            src="/images/logo.png"
            alt="Watermark"
            className="absolute w-[150px] h-[150px] opacity-20 object-cover pointer-events-none select-none z-10"
          />

          {/* Fullscreen (open) */}
          <button
            type="button"
            onClick={() => openModalAt(selectedIndex)}
            aria-label="Enter full screen"
            className="absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 opacity-90 transition-opacity
                       bg-black/55 hover:bg-black/70 text-white rounded-full p-2 shadow ring-1 ring-white/20"
          >
            <Maximize2 size={18} />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="w-full lg:w-fit mt-5">
          {/* Mobile → Horizontal */}
          <div className="block lg:hidden">
            <Swiper slidesPerView={6} spaceBetween={3} className="w-full px-2">
              {images.map((img, i) => (
                <SwiperSlide key={i}>
                  <div
                    onClick={() => openModalAt(i)}
                    className="cursor-pointer rounded-md overflow-hidden border-2 border-transparent hover:border-[#704214] transition-all duration-150"
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-20 h-14 object-cover rounded-md"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop → Vertical */}
          <div className="hidden lg:block w-fit h-[450px]">
            <Swiper
              direction="vertical"
              slidesPerView={5}
              spaceBetween={3}
              mousewheel
              modules={[Mousewheel]}
              className="h-full"
            >
              {images.map((img, i) => (
                <SwiperSlide key={i}>
                  <div
                    onClick={() => openModalAt(i)}
                    className="cursor-pointer rounded-md overflow-hidden border-2 border-transparent hover:border-[#704214] transition-all duration-150"
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className="lg:w-28 h-20 object-cover rounded-md"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />

            {/* Close (Cross) */}
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close image viewer"
              className="absolute top-6 right-6 z-20 bg-white/90 hover:bg-white text-black rounded-full p-2 shadow-md transition"
            >
              <X size={24} />
            </button>

            {/* Content */}
            <motion.div
              className="relative z-10 max-w-[90vw] max-h-[90vh] flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onWheel={onWheelZoom}
            >
              {/* Prev */}
              {selectedIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-[-56px] text-white/80 hover:text-white transition p-2"
                  aria-label="Previous"
                  type="button"
                >
                  <ChevronLeft size={36} />
                </button>
              )}

              {/* Zoomable / Draggable image */}
              <div
                className="relative cursor-grab active:cursor-grabbing"
                onMouseDown={onMouseDown}
              >
                <img
                  src={images[selectedIndex]}
                  alt={title || "Zoomed"}
                  style={{
                    transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${zoom})`,
                    transition: isDragging ? "none" : "transform 0.2s ease",
                    cursor: zoom > 1 ? "grab" : "default",
                  }}
                  className="max-w-[90vw] max-h-[80vh] object-contain select-none"
                  draggable={false}
                />
              </div>

              {/* Next */}
              {selectedIndex < images.length - 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-[-56px] text-white/80 hover:text-white transition p-2"
                  aria-label="Next"
                  type="button"
                >
                  <ChevronRight size={36} />
                </button>
              )}

              {/* Zoom Controls */}
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-3 rounded-xl bg-white/15 backdrop-blur-2xl px-4 py-2">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 text-white/90 hover:text-white transition"
                    aria-label="Zoom out"
                    type="button"
                  >
                    <ZoomOut size={22} />
                  </button>
                  <div className="text-white/90 text-sm min-w-[48px] text-center">
                    {(zoom * 100).toFixed(0)}%
                  </div>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 text-white/90 hover:text-white transition"
                    aria-label="Zoom in"
                    type="button"
                  >
                    <ZoomIn size={22} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
