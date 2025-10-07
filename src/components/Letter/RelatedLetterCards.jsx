// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import ImageModalViewer from "../ImageModalViewer/ImageModalViewer";

const RelatedLetterCards = ({ photos }) => {
  const cards = useMemo(() => {
    return Array.isArray(photos) ? photos.slice(0, 2).map((img, i) => ({ id: i + 1, img })) : [];
  }, [photos]);

  const [errored, setErrored] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(0);

  const markError = (idx) => setErrored((prev) => ({ ...prev, [idx]: true }));
  const openAt = (idx) => {
    setActive(idx);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);
  const next = () => setActive((i) => (i + 1) % cards.length);
  const prev = () => setActive((i) => (i - 1 + cards.length) % cards.length);

  const images = cards.map((c) => c.img);

  return (
    <div className="lg:w-[25%] w-full flex flex-col lg:flex-row lg:justify-start justify-center relative items-center lg:items-start gap-5 xl:gap-10">
      <div className="self-center w-full h-px border-t border-black lg:w-px lg:h-[400px] lg:border-t-0 lg:border-l"></div>

      <div>
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-center" style={{ fontFamily: "philosopher" }}>
          Related Photographs
        </h2>

        {cards.length === 0 ? (
          <div className="w-full h-[200px] flex justify-center items-center text-gray-400 italic">No related photographs available.</div>
        ) : (
          <div className="w-full flex flex-col md:flex-row lg:flex-col justify-center gap-10 items-center lg:items-start">
            {cards.map((c, idx) => (
              <button key={c.id} type="button" className="flex flex-col items-center w-full gap-10 focus:outline-none" onClick={() => openAt(idx)}>
                <div className="relative flex justify-center items-center group cursor-pointer mt-3">
                  <div className="absolute left-1/2 -translate-x-1/2 w-[300px] h-[230px] z-30 pointer-events-none">
                    <img src="/images/Vertical-Frame.webp" alt="Frame" className="w-full h-full object-contain" />
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
                    <div className="flex items-center justify-center w-[130px] h-[190px] rounded-sm bg-gray-200 text-gray-600 text-xs">image unavailable</div>
                  )}

                  <img src="/images/logo.png" alt="Watermark" className="absolute top-14 w-[80px] h-[80px] opacity-20 object-cover pointer-events-none select-none" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reusable modal */}
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
};

export default RelatedLetterCards;
