// @ts-nocheck
import React, { useState, useMemo } from "react";
import { computeOrientation, FRAME_VARIANTS } from "@/utils/frameVariants";

const FRAME_STYLES = FRAME_VARIANTS.thumbnails;

const Thumbnails = ({ RelatedImage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageOk, setImageOk] = useState(true);
  const [orientation, setOrientation] = useState("portrait");

  const hasSrc = useMemo(() => {
    return typeof RelatedImage === "string" && RelatedImage.trim().length > 0;
  }, [RelatedImage]);

  if (!hasSrc || !imageOk) return null;

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const styles = FRAME_STYLES[orientation] || FRAME_STYLES.portrait;

  return (
    <>
      {RelatedImage && RelatedImage.trim() && (
        <div className="flex flex-col items-center w-full gap-10">
          <div className="relative flex justify-center items-center group cursor-pointer mt-3" onClick={handleOpen}>
            <div className={styles.frameBoxClass}>
              <img src={styles.frameSrc} alt="Frame" className="w-full h-full object-contain" />
            </div>

            <div className={styles.windowWrapperClass}>
              <img
                src={RelatedImage}
                alt="Overlay"
                loading="eager"
                onLoad={(e) => {
                  const { naturalWidth = 0, naturalHeight = 0 } = e.target;
                  setOrientation(computeOrientation(naturalWidth, naturalHeight));
                }}
                onError={() => setImageOk(false)}
                className={`${styles.imageClass} w-full h-full`}
              />
            </div>

            <img src="/images/logo.png" alt="Watermark" className={styles.watermarkClass} />
          </div>
        </div>
      )}

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
