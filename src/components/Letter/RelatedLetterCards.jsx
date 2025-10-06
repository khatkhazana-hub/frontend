// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";

const RelatedLetterCards = ({ photos }) => {
  const cards = useMemo(() => {
    return Array.isArray(photos)
      ? photos.slice(0, 2).map((img, i) => ({ id: i + 1, img }))
      : [];
  }, [photos]);

  const [errored, setErrored] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [modalImgOk, setModalImgOk] = useState(true);
  const [zoom, setZoom] = useState(1);

  const modalRef = useRef(null);
  const imgContainerRef = useRef(null);

  const markError = (idx) => setErrored((prev) => ({ ...prev, [idx]: true }));

  const openAt = (idx) => {
    setActive(idx);
    setModalImgOk(true);
    setIsOpen(true);
    setZoom(1);
  };
  const close = () => {
    setIsOpen(false);
    setZoom(1);
  };

  const next = () => {
    if (!cards.length) return;
    setModalImgOk(true);
    setZoom(1);
    setActive((i) => (i + 1) % cards.length);
  };

  const prev = () => {
    if (!cards.length) return;
    setModalImgOk(true);
    setZoom(1);
    setActive((i) => (i - 1 + cards.length) % cards.length);
  };

  // zoom controls
  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));

  // mouse wheel zoom
  useEffect(() => {
    if (!isOpen || !imgContainerRef.current) return;
    const el = imgContainerRef.current;

    const handleWheel = (e) => {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [isOpen]);

  // keyboard + scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, cards.length]);

  return (
    <div className="lg:w-[25%] w-full flex flex-col lg:flex-row lg:justify-start justify-center relative items-center lg:items-start gap-5 xl:gap-10">
      <div className="self-center w-full h-px border-t border-black lg:w-px lg:h-[400px] lg:border-t-0 lg:border-l"></div>

      <div>
        <h2
          className="text-lg sm:text-xl font-bold mb-4 text-center"
          style={{ fontFamily: "philosopher" }}
        >
          Related Photographs
        </h2>

        {/* If no images */}
        {cards.length === 0 ? (
          <div className="w-full h-[200px] flex justify-center items-center text-gray-400 italic">
            No related photographs available.
          </div>
        ) : (
          <div className="w-full flex flex-col md:flex-row lg:flex-col justify-center gap-10 items-center lg:items-start">
            {cards.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                className="flex flex-col items-center w-full gap-10 focus:outline-none"
                onClick={() => openAt(idx)}
              >
                <div className="relative flex justify-center items-center group cursor-pointer mt-3">
                  <div className="absolute left-1/2 -translate-x-1/2 w-[300px] h-[230px] z-30 pointer-events-none">
                    <img
                      src="/images/Vertical-Frame.webp"
                      alt="Frame"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {!errored[idx] ? (
                    <img
                      src={c.img}
                      alt="Related photograph"
                      loading="eager"
                      onError={() => markError(idx)}
                      className="object-cover group-hover:drop-shadow-xl transition-all duration-300 w-[130px] rounded-sm h-[190px]"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-[130px] h-[190px] rounded-sm bg-gray-200 text-gray-600 text-xs">
                      image unavailable
                    </div>
                  )}

                  <img
                    src="/images/logo.png"
                    alt="Watermark"
                    className="absolute top-14 w-[80px] h-[80px] opacity-20 object-cover pointer-events-none select-none"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isOpen && cards.length > 0 && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onMouseDown={(e) => e.target === modalRef.current && close()}
          role="dialog"
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-5 right-5 lg:top-6 lg:right-6 w-[42px] h-[42px] rounded-full bg-white/85 hover:bg-white text-black font-bold shadow flex items-center justify-center transition"
          >
            ✕
          </button>

          {/* Prev */}
          <button
            onClick={prev}
            className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 h-[44px] min-w-[44px] px-3 rounded-full bg-white/85 hover:bg-white text-black font-semibold shadow transition"
          >
            ‹
          </button>

          {/* Next */}
          <button
            onClick={next}
            className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 h-[44px] min-w-[44px] px-3 rounded-full bg-white/85 hover:bg-white text-black font-semibold shadow transition"
          >
            ›
          </button>

          {/* Image container with zoom */}
          <div
            ref={imgContainerRef}
            className="max-w-[90vw] max-h-[85vh] p-3 overflow-hidden flex justify-center items-center"
          >
            {modalImgOk ? (
              <img
                src={cards[active]?.img}
                alt={`Related photograph ${active + 1}`}
                className="max-w-[90vw] max-h-[85vh] object-contain select-none rounded-md shadow-2xl transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
                onError={() => setModalImgOk(false)}
              />
            ) : (
              <div className="flex items-center justify-center w-[70vw] max-w-[900px] h-[70vh] rounded-md bg-gray-200 text-gray-700 text-sm">
                image unavailable
              </div>
            )}
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 px-4 py-2 rounded-full text-white backdrop-blur-md">
            <button
              onClick={zoomOut}
              className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition"
              title="Zoom out (wheel down)"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold">{Math.round(zoom * 100)}%</span>
            <button
              onClick={zoomIn}
              className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition"
              title="Zoom in (wheel up)"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>

          {/* Counter */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/90 text-sm px-3 py-1 rounded-full bg-black/40">
            {active + 1} / {cards.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedLetterCards;
