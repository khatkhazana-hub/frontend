// components/PhotographCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  computeOrientation,
  FRAME_VARIANTS,
  staticAsset,
} from "@/utils/frameVariants";

const FRAME_STYLES = FRAME_VARIANTS.photographCard;
const CARD_BACKGROUND = staticAsset("Card.webp");

export default function PhotographCard({
  to = "#",
  overlay,
  overlayImg,
  title = "",
  description = "",
  className = "",
}) {
  const imgSrc = overlay || overlayImg || "";
  const [orientation, setOrientation] = useState(null);

  const handleImgLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.target;
    if (!w || !h) return;
    setOrientation(computeOrientation(w, h));
  };

  const orientationKey = orientation || "portrait";
  const styles = FRAME_STYLES[orientationKey] || FRAME_STYLES.portrait;

  return (
    <Link to={to}>
      <div
        className={`relative cursor-pointer rounded-[20px] overflow-hidden w-[350px] h-[420px] group mx-auto [transform:translateZ(0)] ${className}`}
      >
        <img
          src={CARD_BACKGROUND}
          alt="Card Background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover rounded-[20px] block"
          draggable={false}
        />

        <div className={styles.wrapperClass}>
          <div className={`relative ${styles.frameBoxClass}`}>
            <div className={`${styles.windowClass} overflow-hidden`}>
              <img
                src={imgSrc}
                alt={title || "Photograph"}
                onLoad={handleImgLoad}
                className="w-full h-full block object-cover"
                draggable={false}
              />
            </div>

            <img
              src="/images/logo.png"
              alt=""
              aria-hidden="true"
              className={`${styles.watermarkClass} block`}
              draggable={false}
            />

            <img
              src={styles.frameSrc}
              alt="Frame"
              className="absolute inset-0 w-full h-full object-contain z-30 pointer-events-none select-none block"
              draggable={false}
            />
          </div>
        </div>

        <div className="absolute left-[25px] top-[320px] w-[300px] text-left">
          <h2 className="text-[24px] sm:text-base lg:text-xl font-semibold text-black mb-1 truncate font-[philosopher] capitalize">
            {title}
          </h2>
          <p className="font-[Ephesis] font-normal text-[20px] leading-[100%] text-black m-0 line-clamp-2 capitalize">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
