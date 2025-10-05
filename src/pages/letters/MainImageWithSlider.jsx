// @ts-nocheck
import React, { useState } from "react";
import { FiMaximize2 } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearchPlus,
  FaSearchMinus,
} from "react-icons/fa";
import "swiper/css";
import "swiper/css/mousewheel";

const MainImageWithSlider = ({ images = [], title }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  const heroImage = images[selectedIndex] || "/images/placeholder.webp";

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

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const resetZoom = () => {
    setZoom(1);
    setPos({ x: 0, y: 0 });
  };

  const handleClose = () => {
    setIsOpen(false);
    resetZoom();
  };

  // 🖱️ Drag Logic
  const handleMouseDown = (e) => {
    if (zoom <= 1) return; // only drag when zoomed
    setIsDragging(true);
    setStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPos({ x: e.clientX - start.x, y: e.clientY - start.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  // 🧠 Open Lightbox when thumbnail clicked
  const openLightbox = (index) => {
    setSelectedIndex(index);
    setIsOpen(true);
    resetZoom();
  };

  return (
    <>
      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-5 justify-between items-start w-full h-auto">
        {/* Main Image Section */}
        <div className="relative flex justify-center items-center mx-auto">
          <img
            src={heroImage}
            alt={title || "Letter Image"}
            className="rounded-md mx-auto w-[240px] lg:w-[330px] h-[350px] lg:h-[500px] object-fill"
          />

          {/* Watermark */}
          <img
            src="/images/logo.png"
            alt="Watermark"
            className="absolute  w-[150px] h-[150px] opacity-20 object-cover pointer-events-none select-none z-10"
          />

          {/* Frame */}
          <img
            src="/images/DetailPageBorder.webp"
            alt="Frame"
            className="absolute top-0 left-0 w-full h-full object-fill pointer-events-none select-none z-20"
          />

          {/* Fullscreen Icon */}
          <button
            onClick={() => setIsOpen(true)}
            className="absolute top-1  right-1 bg-white/50 hover:bg-white p-2 rounded-full shadow z-30 cursor-pointer"
          >
            <FiMaximize2 className="text-black w-6 h-6" />
          </button>
        </div>

        {/* Thumbnail Section */}
        <div className="w-full lg:w-fit mt-5">
          {/* Mobile → Horizontal Swiper */}
          <div className="block lg:hidden">
            <Swiper slidesPerView={6} spaceBetween={3} className="w-full px-2">
              {images.map((img, i) => (
                <SwiperSlide key={i}>
                  <div
                    onClick={() => openLightbox(i)} // 🔥 open lightbox directly
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

          {/* Desktop → Vertical Swiper */}
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
                    onClick={() => openLightbox(i)} // 🔥 open lightbox directly
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

      {/* Fullscreen Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Close Button */}
          <button
            className="absolute top-5 right-5 bg-white/80 hover:bg-white text-black font-bold w-[5vh] h-[5vh] rounded-full shadow text-[2.5vh] cursor-pointer"
            onClick={handleClose}
          >
            ✕
          </button>

          {/* Left Arrow */}
          {selectedIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-5 z-[999] text-[4vh] cursor-pointer text-white/80 hover:text-white"
            >
              <FaChevronLeft />
            </button>
          )}

          {/* Zoomable / Draggable Image */}
          <div
            className="relative cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
          >
            <img
              src={images[selectedIndex]}
              alt="Zoomed"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
                transition: isDragging ? "none" : "transform 0.2s ease",
                cursor: zoom > 1 ? "grab" : "default",
              }}
              className="w-[40vh] lg:w-fit lg:h-[80vh] object-contain select-none"
              draggable={false}
            />
          </div>

          {/* Right Arrow */}
          {selectedIndex < images.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-5 z-[999] text-[4vh] cursor-pointer text-white/80 hover:text-white"
            >
              <FaChevronRight />
            </button>
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-6 text-white w-[14vh] h-[7vh] flex items-center justify-center gap-4 bg-white/20 backdrop-blur-2xl px-4 py-2 rounded-lg">
            <button onClick={handleZoomOut} className="cursor-pointer">
              <FaSearchMinus className="text-[4vh]" />
            </button>
            <button onClick={handleZoomIn} className="cursor-pointer">
              <FaSearchPlus className="text-[4vh]" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MainImageWithSlider;
