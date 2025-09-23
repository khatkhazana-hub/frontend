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

export default ThumbnailForPhotograph;
