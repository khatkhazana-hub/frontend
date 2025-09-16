// @ts-nocheck
import React, { useState } from "react";

const Thumbnails = ({ RelatedImage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const caption = "Join our archive mailing list and never miss an update.";

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Thumbnail Card */}
      <div
        onClick={handleOpen}
        className="w-[180px] sm:w-[200px] h-[200px] rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer hover:scale-105 transition-transform relative"
      >
        {/* Background Image */}
        <img
          src={RelatedImage}
          alt="Thumbnail"
          className="w-full h-full object-fill"
        />

        {/* Caption Overlay */}
        <p className="absolute bottom-0 left-0 w-full text-[12px] font-semibold text-white italic px-2 py-1 text-center bg-black/80">
          {caption}
        </p>
      </div>

      {/* Modal / Popup */}
      {isOpen && (
        <div
          className="fixed inset-0 top-10 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <div
            className="relative rounded-lg overflow-hidden max-w-[70vw] md:h-[80%]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Image */}
            <img
              src={RelatedImage}
              alt="Thumbnail Full"
              className="w-full h-full object-fill"
            />

            {/* Caption Overlay */}
            <p className="absolute bottom-0 left-0 w-full text-white text-lg lg:text-xl  px-2 py-3 lg:py-5 text-center bg-black/80">
              {caption}
            </p>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 bg-white text-black rounded-full px-2 py-1 text-sm shadow cursor-pointer hover:bg-gray-200"
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
