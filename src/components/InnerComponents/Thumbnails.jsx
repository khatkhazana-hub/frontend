// @ts-nocheck
import React, { useState, useMemo } from "react";

const Thumbnails = ({ RelatedImage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageOk, setImageOk] = useState(true);

  // basic sanity check (non-empty string)
  const hasSrc = useMemo(() => {
    return typeof RelatedImage === "string" && RelatedImage.trim().length > 0;
  }, [RelatedImage]);

  // if no valid src OR the image errored, render nothing
  if (!hasSrc || !imageOk) return null;

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Thumbnail Card */}
      {RelatedImage && RelatedImage.trim() && (
        <div className="flex flex-col items-center w-full gap-10">
          <div
            className="relative flex justify-center items-center group cursor-pointer mt-3"
            onClick={handleOpen}
          >
            {/* Frame */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[300px] h-[230px] z-30">
              <img
                src="/images/Vertical-Frame.webp"
                alt="Frame"
                className="w-full h-full object-contain"
              />
            </div>
            {/* Overlay Image */}
            <img
              src={RelatedImage}
              alt="Overlay"
              loading="eager"
              onError={() => setImageOk(false)}
              className="object-cover group-hover:drop-shadow-xl transition-all duration-300 w-[130px] rounded-sm h-[190px]"
            />

            {/* ✅ Watermark Image (Full Overlay Area) */}
            <img
              src="/images/logo.png"
              alt="Watermark"
              className="
            absolute 
            top-14
            w-[80px] h-[80px]   /* same size as overlay */
            opacity-20     /* adjust transparency */
            object-cover          /* cover full area */
            pointer-events-none select-none "
            />
          </div>
        </div>
      )}

      {/* Modal / Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <button
            className="absolute top-5 right-5 lg:top-6 text-[2vh] font-bold lg:right-6 bg-white/80 hover:bg-white w-[4vh] h-[4vh] rounded-full shadow cursor-pointer"
            onClick={handleClose}
          >
            ✕
          </button>

          <img
            src={RelatedImage}
            alt="Related photograph (full view)"
            className="w-[50vh] lg:w-[70vh] lg:h-[80vh] object-contain select-none"
            onError={() => setImageOk(false)}
          />
        </div>
      )}
    </>
  );
};

export default Thumbnails;
