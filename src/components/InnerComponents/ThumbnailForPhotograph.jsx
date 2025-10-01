// @ts-nocheck
import React, { useState, useMemo } from "react";

const ThumbnailForPhotograph = ({ RelatedImage }) => {
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
        <>
          <div
            onClick={handleOpen}
            className="w-[180px] sm:w-[160px] h-[200px] rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer hover:scale-105 transition-transform relative"
          >
            <img
              src={RelatedImage}
              alt="Related photograph"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImageOk(false)}
            />
          </div>
        </>
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
            className="w-[50vh] lg:w-[70vh] lg:h-[80vh] shadow-lg object-contain select-none"
            onError={() => setImageOk(false)}
          />
        </div>
      )}
    </>
  );
};

export default ThumbnailForPhotograph;
