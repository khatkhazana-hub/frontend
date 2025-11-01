import React from "react";
import { useNavigate } from "react-router-dom";

const FILE_BASE = import.meta.env?.VITE_FILE_BASE_URL || "";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Safari/Android shims + focal control */}
      <style>{`
        :root {
          /* tweak this (0% = top, 50% = center). try 15%-25% if heads are still clipped */
          --focalY: 0%;
          /* width-aware seam fix to keep poster nudged over video even at extreme zooms */
          --posterSeamFix: clamp(4px, 1.5vw, 32px);
        }
        .inline-video {
          object-fit: cover;
          object-position: center var(--focalY);
          -webkit-playsinline: always;
          playsinline: always;
          transform: translateZ(0);
          background-color: #000;
        }
        .tap-clear { -webkit-tap-highlight-color: transparent; }
        video::-webkit-media-controls { display: none !important; }

        /* === fix tiny hairline between video & image === */
        .overlap-fix {
          top: calc(var(--posterSeamFix) * -1);
        }
      `}</style>

      <section className="w-full relative overflow-hidden tap-clear">
        {/* VIDEO */}
        <div className="relative w-full h-[62.5svh] sm:h-[58svh] md:h-[62svh] lg:h-[70dvh]">
          <video
            className="inline-video absolute inset-0 w-full h-full block align-top pointer-events-none"
            preload="metadata"
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src={`${FILE_BASE}/public/StaticImages/Bg-video.mp4`}
              type="video/mp4"
            />
          </video>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 md:h-24 bg-gradient-to-b from-transparent to-black/30" />
        </div>

        {/* POSTER (clickable) */}
        <button
          type="button"
          onClick={() => navigate("/About")}
          aria-label="Go to About"
          className="relative block w-full cursor-pointer 
                     -mt-[clamp(6rem,18svh,14rem)] z-10 overlap-fix
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/60"
        >
          <picture>
            {/* Mobile image */}
            <source
              media="(max-width: 640px)"
             srcSet={`${FILE_BASE}/public/StaticImages/poster_mobile.webp`}
              type="image/webp"
            />
            {/* Desktop image */}
            <source
              srcSet={`${FILE_BASE}/public/StaticImages/poster_desktop.webp`}
              type="image/webp"
            />
            <img
              src={`${FILE_BASE}/public/StaticImages/poster_desktop.webp`}
              alt="Poster"
              loading="eager"
              decoding="async"
              /* keep the top of the artwork visible on Chrome desktop */
              className="w-full block align-top object-cover md:object-fill md:-mt-20 
                         h-[65svh] sm:h-[66svh] md:h-[74svh] lg:h-[120dvh]"
              /* or use the same focal var as the video: style={{ objectPosition: `center var(--focalY)` }} */
            />
          </picture>
        </button>
      </section>

      <noscript>
        <img
          // src={`${FILE_BASE}/public/StaticImages/poster_new.jpg`}
          src={`${FILE_BASE}/public/StaticImages/poster_desktop.webp`}
          alt="Poster"
          style={{ width: "100%", display: "block" }}
        />
      </noscript>
    </>
  );
};

export default Homepage;


