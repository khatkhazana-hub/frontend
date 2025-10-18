  // components/PhotographCard.jsx
  // @ts-nocheck
  import React, { useState } from "react";
  import { Link } from "react-router-dom";

  export default function PhotographCard({
    to = "#",
    overlay,
    overlayImg,
    title = "",
    description = "",
    className = "",
  }) {
    const imgSrc = overlay || overlayImg || "";
    const [isLandscape, setIsLandscape] = useState(null);
    const [aspect, setAspect] = useState(1); // w / h

    const handleImgLoad = (e) => {
      const { naturalWidth: w, naturalHeight: h } = e.target;
      if (!w || !h) return;
      setIsLandscape(w >= h);
      setAspect(w / h);
    };

    // frame asset
    const frameSrc = isLandscape
      ? `${import.meta.env.VITE_FILE_BASE_URL}/public/StaticImages/Horizantal-Frame.webp`
      : `${import.meta.env.VITE_FILE_BASE_URL}/public/StaticImages/Vertical-Frame.webp`;

    // frame box (whole frame image size)
    const frameBoxClass = isLandscape ? "w-[285px] h-[205px]" : "w-[280px] h-[280px]";

    // window (mat opening) — adjust if your PNGs differ
    const windowClass = isLandscape
      ? // a touch taller than before so fills nicer
        "absolute left-1/2 -translate-x-1/2 top-[34px] w-[232px] h-[138px] overflow-hidden rounded-[10px]"
      : "absolute left-1/2 -translate-x-1/2 top-[30px] w-[180px] h-[240px] overflow-hidden rounded-[6px]";

    // placement
    const wrapperClass = isLandscape
      ? "absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center z-10"
      : "relative flex justify-center z-10 pt-[25px]";

    // 🚀 adaptive fit: cover for most landscape shots (no gaps),
    // but if it's ultra-wide (panorama), switch to contain to avoid brutal crops.
    const isUltraWide = aspect > 2.0; // tune threshold if you like (1.9–2.2)
    const fitClass =
      isLandscape && !isUltraWide ? "object-cover" : isLandscape ? "object-contain" : "object-contain";

    return (
      <Link to={to}>
        <div className={`relative cursor-pointer rounded-[20px] overflow-hidden w-[350px] h-[420px] group mx-auto ${className}`}>
          {/* parchment */}
          <img
            src={`${import.meta.env.VITE_FILE_BASE_URL}/public/StaticImages/Card.webp`}
            alt="Card Background"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
          />

          {/* framed photo */}
          <div className={wrapperClass}>
            <div className={`relative ${frameBoxClass}`}>
              {/* clipped window */}
              <div className={windowClass}>
                <img
                  src={imgSrc}
                  alt={title || "Photograph"}
                  onLoad={handleImgLoad}
                  className={`w-full h-full ${fitClass}`}
                />
              </div>

              {/* watermark */}
              <img
                src="/images/logo.png"
                alt=""
                aria-hidden="true"
                className={`absolute ${isLandscape ? "top-[58px]" : "top-[80px]"} left-1/2 -translate-x-1/2 w-[90px] h-[90px] opacity-20 object-contain pointer-events-none select-none z-20`}
              />

              {/* frame on top */}
              <img
                src={frameSrc}
                alt="Frame"
                className="absolute inset-0 w-full h-full object-contain z-30 pointer-events-none select-none"
              />
            </div>
          </div>

          {/* text */}
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
