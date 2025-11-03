// @ts-nocheck
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ImageModalViewer from "../ImageModalViewer/ImageModalViewer";
import { computeOrientation, FRAME_VARIANTS } from "@/utils/frameVariants";

const FRAME_STYLES = FRAME_VARIANTS.relatedSidebar;

function FramedThumb({ src, onLoad, onError, orientation = "portrait" }) {
  const styles = FRAME_STYLES[orientation] || FRAME_STYLES.portrait;

  return (
    <div className="relative flex justify-center items-start mt-2 group">
      <div className={`relative ${styles.frameBoxClass}`}>
        <div className={styles.windowClass}>
          <img
            src={src}
            alt="Related photograph"
            loading="eager"
            onLoad={onLoad}
            onError={onError}
            className="w-full h-full object-contain"
          />
        </div>

        <img src="/images/logo.png" alt="" aria-hidden="true" className={styles.watermarkClass} />

        <img
          src={styles.frameSrc}
          alt="Frame"
          className="absolute inset-0 w-full h-full object-contain z-30 pointer-events-none select-none"
        />
      </div>
    </div>
  );
}

export default function RelatedLetterCards({ photos, submissionId }) {
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
  const [orientation, setOrientation] = useState({});

  const images = cards.map((c) => c.img);
  const hasDetailLink = Boolean(submissionId);

  const markError = (idx) => setErrored((prev) => ({ ...prev, [idx]: true }));
  const openAt = (idx) => {
    setActive(idx);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);
  const next = () => setActive((i) => (i + 1) % cards.length);
  const prev = () => setActive((i) => (i - 1 + cards.length) % cards.length);

  const onImgLoad = (e, idx) => {
    const { naturalWidth: w, naturalHeight: h } = e.target;
    setOrientation((prev) => ({ ...prev, [idx]: computeOrientation(w, h) }));
  };

  const anyLandscape = Object.values(orientation).includes("landscape");

  return (
    <div
      className={`${
        anyLandscape ? "lg:w-[40%]" : "lg:w-[25%]"
      } w-full flex flex-col lg:flex-row lg:justify-start justify-center relative items-center lg:items-start gap-5 xl:gap-10 transition-all duration-300`}
    >
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
          <div className="w-full flex flex-col items-center lg:items-start gap-2">
            <div className="w-full flex flex-col md:flex-row lg:flex-col justify-start gap-10 items-center lg:items-start">
              {cards.map((c, idx) => {
                const orientationKey = orientation[idx] || "portrait";
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
                        orientation={orientationKey}
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

            {hasDetailLink && (
              <div className="w-full flex justify-center">
                <Link
                  to={`/photographs/${submissionId}`}
                  className="text-sm font-semibold text-[#704214] hover:underline"
                >
                  Read More
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

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
