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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 bg-white/80 hover:bg-white w-10 h-10 rounded-full shadow cursor-pointer"
          >
            ✕
          </button>

          <img
            src={RelatedImage}
            alt="Related photograph (full view)"
            className="max-h-[70%] max-w-[70%] object-contain rounded-lg"
            onError={() => setImageOk(false)}
          />
        </div>
      )}
    </>
  );
};

export default ThumbnailForPhotograph;
