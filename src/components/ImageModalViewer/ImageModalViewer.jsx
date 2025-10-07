import React, { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/** Keeps overlay UI constant vs browser zoom */
const useAntiZoomScale = (enabled) => {
  const [k, setK] = useState(1);
  const baseDprRef = useRef(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    if (!baseDprRef.current) baseDprRef.current = window.devicePixelRatio || 1;

    const compute = () => {
      const currDpr = window.devicePixelRatio || 1;
      const vvScale =
        (window.visualViewport && window.visualViewport.scale) || 1;
      const anti = (baseDprRef.current / currDpr) * (1 / vvScale || 1);
      setK(anti || 1);
    };
    compute();

    const vv = window.visualViewport;
    const onResize = () => compute();
    const onScroll = () => compute();
    window.addEventListener("resize", onResize);
    vv?.addEventListener("resize", onResize);
    vv?.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("resize", onResize);
      vv?.removeEventListener("resize", onResize);
      vv?.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) baseDprRef.current = null;
  }, [enabled]);

  return k;
};

/** 🔥 Reusable image modal viewer with zoom controls */
export default function ImageModalViewer({
  isOpen,
  images = [],
  activeIndex = 0,
  onClose,
  onPrev,
  onNext,
}) {
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const antiScale = useAntiZoomScale(isOpen);

  // Start drag
  const handleMouseDown = (e) => {
    if (zoom <= 1) return; // only allow drag when zoomed in
    setIsDragging(true);
    setStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  // Move image
  const handleMouseMove = (e) => {
    if (!isDragging || zoom <= 1) return;
    const x = e.clientX - start.x;
    const y = e.clientY - start.y;
    setPos({ x, y });
  };

  // Stop drag
  const handleMouseUp = () => setIsDragging(false);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));

  // Mouse wheel zoom
  useEffect(() => {
    if (!isOpen || !imgRef.current) return;
    const el = imgRef.current;
    const handleWheel = (e) => {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [isOpen]);

  // ESC, arrows, +, -
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
      if (e.key === "+") zoomIn();
      if (e.key === "-") zoomOut();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
  if (zoom === 1) setPos({ x: 0, y: 0 });
}, [zoom]);


  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.button
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-[42px] h-[42px] rounded-full bg-white/85 hover:bg-white text-black font-bold shadow flex items-center justify-center transition z-20"
          style={{
            transform: `scale(${antiScale})`,
            transformOrigin: "top right",
          }}
        >
          <X size={22} />
        </button>

        {/* Prev */}
        {activeIndex > 0 && (
          <button
            onClick={onPrev}
            aria-label="Prev"
            className="absolute left-5 top-1/2 -translate-y-1/2 h-[44px] min-w-[44px] px-3 rounded-full bg-white/85 hover:bg-white text-black font-semibold shadow transition z-20"
            style={{
              transform: `scale(${antiScale})`,
              transformOrigin: "center left",
            }}
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Next */}
        {activeIndex < images.length - 1 && (
          <button
            onClick={onNext}
            aria-label="Next"
            className="absolute right-5 top-1/2 -translate-y-1/2 h-[44px] min-w-[44px] px-3 rounded-full bg-white/85 hover:bg-white text-black font-semibold shadow transition z-20"
            style={{
              transform: `scale(${antiScale})`,
              transformOrigin: "center right",
            }}
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Image */}
        <motion.div
          className="relative z-10 max-w-[90vw] max-h-[90vh] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          <div
            ref={imgRef}
            className="max-w-[90vw] max-h-[80vh] p-3 overflow-hidden flex justify-center items-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
            }}
          >
            <img
              src={images[activeIndex]}
              alt="Zoomed"
              className="max-w-[90vw] max-h-[80vh] object-contain select-none rounded-md shadow-2xl transition-transform duration-200"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
              }}
              draggable={false}
            />
          </div>

          {/* Zoom controls overlayed */}
          <div
            className="absolute"
            style={{
              bottom: "-5%",
              left: "50%",
              transform: `translate(-50%, 50%)`,
              transformOrigin: "center center",
              zIndex: 20,
            }}
          >
            <div className="flex items-center gap-[1vw] rounded-full bg-black/60 backdrop-blur-md px-[1vw] py-[0.5vw] text-white shadow-lg">
              <button
                onClick={zoomOut}
                className="flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition"
                style={{
                  width: "2.8vw",
                  height: "2.8vw",
                  minWidth: "32px",
                  minHeight: "32px",
                }}
              >
                <ZoomOut
                  style={{
                    width: "1.3vw",
                    height: "1.3vw",
                    minWidth: "18px",
                    minHeight: "18px",
                  }}
                />
              </button>

              <span
                className="font-semibold text-center flex items-center justify-center flex-none"
                style={{ width: "3.5vw", minWidth: "48px", fontSize: "1vw" }}
              >
                {Math.round(zoom * 100)}%
              </span>

              <button
                onClick={zoomIn}
                className="flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition"
                style={{
                  width: "2.8vw",
                  height: "2.8vw",
                  minWidth: "32px",
                  minHeight: "32px",
                }}
              >
                <ZoomIn
                  style={{
                    width: "1.3vw",
                    height: "1.3vw",
                    minWidth: "18px",
                    minHeight: "18px",
                  }}
                />
              </button>
            </div>
          </div>

          {/* Counter */}
          <div
            className="absolute text-white/90 text-sm px-3 py-1 rounded-full bg-black/40"
            style={{
              bottom: "2%",
              left: "50%",
              transform: `translateX(-50%) scale(${antiScale})`,
              transformOrigin: "bottom center",
            }}
          >
            {activeIndex + 1} / {images.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
