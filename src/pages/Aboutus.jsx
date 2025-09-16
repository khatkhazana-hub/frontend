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
    <div className="min-h-screen bg-cover bg-center flex justify-center items-start my-10 lg:my-20 ">
      <div className="flex flex-col gap-10 lg:gap-20 w-[95%] md:w-[90%] xl:w-[80%] text-center max-w-[1270px]">
        {/* ✅ About Page Header Image */}
        <div>
          <img
            src="/images/About-header.webp"
            alt="About Khat-Khazana"
            className="w-full h-[200px] md:h-[300px] xl:h-[550px] object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* ✅ 3 Images Grid */}
        <div className="flex flex-col md:flex-row flex-wrap justify-center xl:items-start items-center gap-5 mb-10">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`About Khat-Khazana ${i + 1}`}
              className="xl:w-fit h-[400px] xl:h-[500px] object-cover rounded-xl shadow-lg cursor-pointer"
              onClick={() => setSelectedIndex(i)}
            />
          ))}
        </div>

        <div>
          <Subcription />
        </div>
      </div>

      {/* ✅ Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 top-10 backdrop-blur-sm bg-black/50 flex justify-center items-center z-50"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Close Button */}
          <button
            className="absolute top-20 right-5 text-white text-3xl cursor-pointer"
            onClick={handleClose}
          >
            <FaTimes />
          </button>

          {/* Left Arrow */}
          <button
            disabled={selectedIndex === 0}
            className={`absolute left-0 md:left-5 text-white text-4xl p-2 rounded-full z-50 cursor-pointer ${
              selectedIndex === 0 ? "opacity-40 cursor-not-allowed" : ""
            }`}
            onClick={handlePrev}
          >
            <FaChevronLeft />
          </button>

          {/* Right Arrow */}
          <button
            disabled={selectedIndex === images.length - 1}
            className={`absolute right-0 md:right-5 text-white text-4xl p-2 rounded-full z-50 cursor-pointer ${
              selectedIndex === images.length - 1
                ? "opacity-40 cursor-not-allowed"
                : ""
            }`}
            onClick={handleNext}
          >
            <FaChevronRight />
          </button>

          {/* Zoom Controls */}
          <div className="absolute right-20 bottom-10 flex gap-6 text-white text-3xl">
            <button onClick={handleZoomOut}>
              <FaSearchMinus />
            </button>
            <button onClick={handleZoomIn}>
              <FaSearchPlus />
            </button>
          </div>

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
              className="max-w-[80vw] max-h-[80vh] rounded-lg shadow-lg object-contain select-none"
              draggable={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Aboutus;
