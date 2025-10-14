import React, { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/** Keeps overlay UI constant vs browser zoom */
const useAntiZoomScale = (enabled) => {
  const [k, setK] = useState(1);
  const baseDprRef = useRef(null);
  const baseVvScaleRef = useRef(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    if (!baseDprRef.current) baseDprRef.current = window.devicePixelRatio || 1;
    if (!baseVvScaleRef.current && window.visualViewport) {
      baseVvScaleRef.current = window.visualViewport.scale || 1;
    }

    const compute = () => {
      const currDpr = window.devicePixelRatio || 1;
      const currVvScale = (window.visualViewport && window.visualViewport.scale) || 1;
      const baseDpr = baseDprRef.current || 1;
      const baseVvScale =
        baseVvScaleRef.current ??
        (window.visualViewport ? window.visualViewport.scale || 1 : 1);

      const dprFactor = currDpr ? baseDpr / currDpr : 1;
      const vvFactor = currVvScale ? baseVvScale / currVvScale : 1;
      const dprChanged = Math.abs(currDpr - baseDpr) > 0.001;
      const anti = dprChanged ? dprFactor : dprFactor * vvFactor;

      setK(Number.isFinite(anti) && anti > 0 ? anti : 1);
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

  return k;
};

export default function ImageModalViewer({
  isOpen,
  images = [],
  activeIndex = 0,
  onClose,
  onPrev,
  onNext,
}) {
  const [zoom, setZoom] = useState(1);
  const antiScale = useAntiZoomScale(isOpen);

  // drag state
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const startRef = useRef({ sx: 0, sy: 0, px: 0, py: 0 }); // pointer start + pos start
  const imgRef = useRef(null);
  const rafRef = useRef(null);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 4));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.25));
  const resetZoom = () => setZoom(1);

  // reset on image change / zoom back to 1
  useEffect(() => setZoom(1), [activeIndex]);
  useEffect(() => {
    if (zoom <= 1) setPos({ x: 0, y: 0 });
  }, [zoom]);

  // wheel zoom on fullscreen (no inner frame)
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    };
    window.addEventListener("wheel", handler, { passive: false });
    return () => window.removeEventListener("wheel", handler);
  }, [isOpen]);

  // keyboard
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
      if (e.key === "+") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // clamp helper: keep image edges from leaving screen too far
  const clampPos = (nx, ny) => {
    const el = imgRef.current;
    if (!el) return { x: nx, y: ny };

    const rect = el.getBoundingClientRect(); // includes current scale
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // how much content extends beyond viewport on each axis
    const overX = Math.max(0, (rect.width - vw) / 2);
    const overY = Math.max(0, (rect.height - vh) / 2);

    // allow free move only if image is bigger than viewport on that axis
    const minX = -overX;
    const maxX = overX;
    const minY = -overY;
    const maxY = overY;

    return {
      x: Math.min(maxX, Math.max(minX, nx)),
      y: Math.min(maxY, Math.max(minY, ny)),
    };
  };

  // pointer events for drag (mouse + touch unified)
  const onPointerDown = (e) => {
    if (zoom <= 1) return; // no drag at 100% or below
    draggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    startRef.current = { sx: e.clientX, sy: e.clientY, px: pos.x, py: pos.y };
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current || zoom <= 1) return;
    const { sx, sy, px, py } = startRef.current;
    const nx = px + (e.clientX - sx);
    const ny = py + (e.clientY - sy);

    // throttle with rAF
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      setPos((prev) => {
        const clamped = clampPos(nx, ny);
        // avoid state churn
        if (clamped.x === prev.x && clamped.y === prev.y) return prev;
        return clamped;
      });
    });
  };

  const onPointerUp = (e) => {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[9999] flex"
        style={{ width: "100vw", height: "100vh", overflow: "hidden" }} // no inner scroll; pure drag
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.button
          className="absolute inset-0 bg-black/85"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          aria-label="Close backdrop"
        />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-30 w-[42px] h-[42px] rounded-full bg-white/85 hover:bg-white text-black font-bold shadow flex items-center justify-center transition z-20"
          style={{ transform: `scale(${antiScale})`, transformOrigin: "top right" }}
        >
          <X size={22} />
        </button>

        {/* Prev / Next */}
        {activeIndex > 0 && (
          <button
            onClick={onPrev}
            aria-label="Prev"
            className="absolute left-30 top-1/2 -translate-y-1/2 h-[44px] min-w-[44px] px-3 rounded-full bg-white/85 hover:bg-white text-black font-semibold shadow transition z-20"
            style={{ transform: `scale(${antiScale})`, transformOrigin: "center left" }}
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {activeIndex < images.length - 1 && (
          <button
            onClick={onNext}
            aria-label="Next"
            className="absolute right-30 top-1/2 -translate-y-1/2 h-[44px] min-w-[44px] px-3 rounded-full bg-white/85 hover:bg-white text-black font-semibold shadow transition z-20"
            style={{ transform: `scale(${antiScale})`, transformOrigin: "center right" }}
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Fullscreen stage */}
        <div
          className="relative z-10 w-screen h-screen flex items-center justify-center"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{
            touchAction: zoom > 1 ? "none" : "auto", // prevent page panning on touch while dragging
            cursor: zoom > 1 ? (draggingRef.current ? "grabbing" : "grab") : "default",
          }}
        >
          <img
            ref={imgRef}
            src={images[activeIndex]}
            alt="Zoomed"
            className="select-none"
            style={{
              // fits at 100%, grows past viewport when zoomed
              maxWidth: "100vw",
              maxHeight: "100vh",
              width: "auto",
              height: "auto",
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${zoom})`,
              transformOrigin: "center center",
              transition: draggingRef.current ? "transform 0s" : "transform 0.2s ease",
              willChange: "transform",
            }}
            draggable={false}
          />
        </div>

        {/* Zoom controls */}
        <div
          className="absolute"
          style={{
            bottom: 24,
            left: "50%",
            transform: `translateX(-50%) scale(${antiScale})`,
            transformOrigin: "bottom center",
            zIndex: 20,
          }}
        >
          <div className="flex items-center gap-3 rounded-full bg-white/20 backdrop-blur-md px-3 py-2 text-white shadow-lg">
            <button
              onClick={zoomOut}
              className="flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition w-10 h-10"
            >
              <ZoomOut size={18} />
            </button>
            <span className="font-semibold w-16 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={zoomIn}
              className="flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition w-10 h-10"
            >
              <ZoomIn size={18} />
            </button>
          </div>
        </div>

        {/* Counter */}
        <div
          className="absolute text-white/90 text-sm px-3 py-1 rounded-full bg-black/40"
          style={{
            bottom: 80,
            left: "50%",
            transform: `translateX(-50%) scale(${antiScale})`,
            transformOrigin: "bottom center",
            zIndex: 20,
          }}
        >
          {activeIndex + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
