// @ts-nocheck
import React, { useMemo, useState } from "react";
import ImageModalViewer from "../ImageModalViewer/ImageModalViewer";

/** one framed thumbnail using the SAME logic as PhotographCard */
function FramedThumb({ src, idx, onLoad, onError, isLandscape }) {
  // same frame assets
  const frameSrc = isLandscape
    ? "/images/Horizantal-Frame.webp"
    : "/images/Vertical-Frame.webp";

  // same frame box sizes (whole frame image)
  const frameBoxClass = isLandscape ? "w-[300px] h-[205px]" : "w-[280px] h-[280px]";

  // same window (mat opening) inside the frame
  const windowClass = isLandscape
    ? "absolute left-1/2 -translate-x-1/2 top-[34px] w-[232px] h-[138px] overflow-hidden rounded-[10px]"
    : "absolute left-1/2 -translate-x-1/2 top-[30px] w-[180px] h-[240px] overflow-hidden rounded-[6px]";

  return (
    <div className="relative flex justify-center items-start mt-2 group">
      <div className={`relative ${frameBoxClass}`}>
        {/* clipped image window */}
        <div className={windowClass}>
          <img
            src={src}
            alt="Related photograph"
            loading="eager"
            onLoad={onLoad}
            onError={onError}
            className="w-full h-full object-contain"  // fill window = no bars
          />
        </div>

        {/* watermark — keep consistent with PhotographCard */}
        <img
          src="/images/logo.png"
          alt=""
          aria-hidden="true"
          className={`absolute ${isLandscape ? "top-[58px]" : "top-[80px]"} left-1/2 -translate-x-1/2 w-[90px] h-[90px] opacity-20 object-contain pointer-events-none select-none z-20`}
        />

        {/* frame overlay on top */}
        <img
          src={frameSrc}
          alt="Frame"
          className="absolute inset-0 w-full h-full object-contain z-30 pointer-events-none select-none"
        />
      </div>
    </div>
  );
}

export default function RelatedLetterCards({ photos }) {
  // normalize to at most 2 images (your original behavior)
  const cards = useMemo(
    () =>
      Array.isArray(photos)
        ? photos.slice(0, 2).map((img, i) => ({ id: i + 1, img }))
        : [],
    [photos]
  );

  const [errored, setErrored] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [orientation, setOrientation] = useState({}); // idx -> "landscape" | "portrait"

  const images = cards.map((c) => c.img);

  const markError = (idx) => setErrored((p) => ({ ...p, [idx]: true }));
  const openAt = (idx) => { setActive(idx); setIsOpen(true); };
  const close = () => setIsOpen(false);
  const next = () => setActive((i) => (i + 1) % cards.length);
  const prev = () => setActive((i) => (i - 1 + cards.length) % cards.length);

  // detect aspect exactly once per image
  const onImgLoad = (e, idx) => {
    const { naturalWidth: w, naturalHeight: h } = e.target;
    setOrientation((o) => ({ ...o, [idx]: w >= h ? "landscape" : "portrait" }));
  };

  // widen the right column if any landscape present (same behavior as before)
  const anyLandscape = Object.values(orientation).includes("landscape");

  return (
    <div
      className={`${
        anyLandscape ? "lg:w-[40%]" : "lg:w-[25%]"
      } w-full flex flex-col lg:flex-row lg:justify-start justify-center relative items-center lg:items-start gap-5 xl:gap-10 transition-all duration-300`}
    >
      {/* vertical divider */}
      <div className="self-center w-full h-px border-t border-black lg:w-px lg:h-[420px] lg:border-t-0 lg:border-l" />

      <div className="w-full">
        <h2
          className="text-lg sm:text-xl font-bold mb-4 text-center"
          style={{ fontFamily: "philosopher" }}
        >
          Related Photographs
        </h2>

        {cards.length === 0 ? (
          <div className="w-full h-[160px] flex justify-center items-center text-black italic">
            No Related Photographs Available.
          </div>
        ) : (
          <div className="w-full flex flex-col md:flex-row lg:flex-col justify-start gap-10 items-center lg:items-start">
            {cards.map((c, idx) => {
              const isLandscape = orientation[idx] === "landscape";
              return (
                <button
                  key={c.id}
                  type="button"
                  className="flex flex-col items-center w-full gap-6 focus:outline-none"
                  onClick={() => openAt(idx)}
                >
                  {!errored[idx] ? (
                    <FramedThumb
                      src={c.img}
                      idx={idx}
                      isLandscape={isLandscape}
                      onLoad={(e) => onImgLoad(e, idx)}
                      onError={() => markError(idx)}
                    />
                  ) : (
                    <div className="relative flex items-center justify-center w-[220px] h-[150px] bg-gray-200 text-gray-600 text-xs rounded">
                      image unavailable
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* modal viewer */}
      <ImageModalViewer
        isOpen={isOpen}
        images={images}
        activeIndex={active}
        onClose={close}
        onPrev={prev}
        onNext={next}
        title="Related photograph"
        zoomOverlayOffsetPct={12}
      />
    </div>
  );
}
