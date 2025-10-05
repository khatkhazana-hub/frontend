// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import Subcription from "../components/InnerComponents/Subcription";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSearchPlus,
  FaSearchMinus,
} from "react-icons/fa";

function Aboutus() {
  const images = [
    "/images/About-1.webp",
    "/images/About-2.webp",
    "/images/About-3.webp",
  ];

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [zoom, setZoom] = useState(1);

  // Pan (drag) states
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // ✅ Escape & Arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, zoom]);

  const handleClose = () => {
    setSelectedIndex(null);
    setZoom(1);
    setPos({ x: 0, y: 0 });
  };

  // ✅ Non-looping Prev / Next
  const handlePrev = () => {
    setSelectedIndex((prev) => {
      if (prev > 0) return prev - 1; // go previous
      return prev; // stay on first
    });
    resetZoom();
  };

  const handleNext = () => {
    setSelectedIndex((prev) => {
      if (prev < images.length - 1) return prev + 1; // go next
      return prev; // stay on last
    });
    resetZoom();
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));

  const resetZoom = () => {
    setZoom(1);
    setPos({ x: 0, y: 0 });
  };

  // Start dragging — har zoom level par drag allow
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStart({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPos({
      x: e.clientX - start.x,
      y: e.clientY - start.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className=" flex flex-col  items-center  my-10 lg:my-20 max-w-[1920px] mx-auto">
      <div className="flex flex-col gap-10 lg:gap-20 text-center lg:px-20 px-5 w-full">
        {/* ✅ About Page Header Image */}
        <div>
          <img
            src="/images/About-header.webp"
            alt="About Khat-Khazana"
            className="w-full h-auto md:h-fit object-cover lg:rounded-2xl rounded-md shadow-lg"
          />
        </div>

        {/* ✅ 3 Images Grid */}
        <div className="grid grid-cols-2  md:grid-cols-3 xl:grid-cols-3 gap-3 ">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`About Khat-Khazana ${i + 1}`}
              className="w-full h-auto object-contain shadow-lg cursor-pointer"
              onClick={() => setSelectedIndex(i)}
            />
          ))}
        </div>
      </div>


      {/* ✅ Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/80 flex justify-center items-center z-[9999]"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Close Button */}
          <button
            className="absolute top-5 z-50 right-5 lg:top-6 text-[2.5vh] font-bold lg:right-6 bg-white/80 hover:bg-white w-[5vh] h-[5vh] rounded-full shadow cursor-pointer"
            onClick={handleClose}
          >
            ✕
          </button>

          {/* Left Arrow */}
          <button
            disabled={selectedIndex === 0}
            className={`absolute left-0 md:left-5 text-[4vh] text-white p-2 rounded-full z-50 cursor-pointer ${
              selectedIndex === 0 ? "opacity-40 cursor-not-allowed" : ""
            }`}
            onClick={handlePrev}
          >
            <FaChevronLeft />
          </button>

          {/* Right Arrow */}
          <button
            disabled={selectedIndex === images.length - 1}
            className={`absolute right-0 md:right-5 text-white text-[4vh] p-2 rounded-full z-50 cursor-pointer ${
              selectedIndex === images.length - 1
                ? "opacity-40 cursor-not-allowed"
                : ""
            }`}
            onClick={handleNext}
          >
            <FaChevronRight />
          </button>

          {/* Image */}
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
                cursor: "grab",
              }}
              className="w-[40vh] lg:w-fit lg:h-[80vh] object-contain select-none "
              draggable={false}
            />
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-6 text-white w-[14vh]  h-[7vh] flex items-center justify-center gap-4 bg-white/20 backdrop-blur-2xl px-4 py-2 rounded-lg">
            <button onClick={handleZoomOut} className="cursor-pointer">
              <FaSearchMinus className="text-[4vh]" />
            </button>
            <button onClick={handleZoomIn} className="cursor-pointer  ">
              <FaSearchPlus className="text-[4vh]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Aboutus;
