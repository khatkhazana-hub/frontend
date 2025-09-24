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
              src="/images/Vector.webp"
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
        <div
          className="fixed inset-0  backdrop-blur-sm bg-black/50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <div
            className="relative rounded-lg overflow-hidden max-w-[70vw] md:h-[80%] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={RelatedImage}
              alt="Related photograph (full view)"
              className="w-full h-full object-fill"
              onError={() => setImageOk(false)}
            />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 cursor-pointer bg-white rounded-full flex items-center justify-center text-black text-lg font-bold hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Thumbnails;
