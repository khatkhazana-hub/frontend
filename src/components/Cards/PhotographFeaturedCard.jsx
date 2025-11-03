// @ts-nocheck
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  computeOrientation,
  FRAME_VARIANTS,
  staticAsset,
} from "@/utils/frameVariants";

const FRAME_STYLES = FRAME_VARIANTS.photographFeaturedCard;
const CARD_BACKGROUND = staticAsset("Card.webp");

const PhotographFeaturedCard = ({
  to = "#",
  overlayImg,
  title = "Want more Lorem Ipsums?",
  description = "Join our archive mailing list and never miss an update.",
  isFeatured = true,
}) => {
  const navigate = useNavigate();
  const [orientation, setOrientation] = useState("portrait");

  const handleImageLoad = (e) => {
    const { naturalWidth = 0, naturalHeight = 0 } = e.target;
    setOrientation(computeOrientation(naturalWidth, naturalHeight));
  };

  const styles = FRAME_STYLES[orientation] || FRAME_STYLES.portrait;

  return (
    <Link to={to} className="w-full">
      <div
        onClick={() => navigate(to)}
        className="relative cursor-pointer rounded-[20px] overflow-hidden lg:w-[350px] h-[410px] group mx-auto"
      >
        <img
          src={CARD_BACKGROUND}
          alt="Card Background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
        />

        {isFeatured && (
          <span
            className="absolute top-16 right-20 lg:right-28 bg-white text-black text-sm font-semibold px-3 py-1 rounded-full shadow-md border border-black/10 z-40"
            style={{ fontFamily: "Philosopher" }}
          >
            Featured
          </span>
        )}

        <div className="relative flex justify-center z-10 pt-[25px]">
          <div className={`relative ${styles.frameBoxClass}`}>
            <div className={styles.windowClass}>
              <img
                src={overlayImg}
                alt={title || "Photograph"}
                onLoad={handleImageLoad}
                className="w-full h-full object-cover"
              />
            </div>
            <img src="/images/logo.png" alt="Watermark" className={styles.watermarkClass} />
            <img
              src={styles.frameSrc}
              alt="Frame"
              className="absolute top-0 left-0 w-full h-full object-contain z-30"
            />
          </div>
        </div>

        <div className="absolute left-[25px] top-[310px] w-[300px] text-left">
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
};

export default PhotographFeaturedCard;
