import React from "react";
import { useNavigate } from "react-router-dom";

/* Vite-safe: if the var isn't set, it's just undefined */
const FILE_BASE = import.meta.env?.VITE_FILE_BASE_URL || "";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Small CSS for Safari & Android quirks */}
      <style>{`
        /* Prevent iOS Safari from forcing inline video to fullscreen */
        .inline-video {
          object-fit: cover;
          -webkit-playsinline: always;
          playsinline: always;
          transform: translateZ(0); /* helps GPU compositing on iOS */
          background-color: #000;
        }
        /* Remove tap highlight on iOS for cleaner feel */
        .tap-clear {
          -webkit-tap-highlight-color: transparent;
        }
        /* Hide media controls ghost on some WebKit builds (we're not rendering controls) */
        video::-webkit-media-controls {
          display: none !important;
        }
      `}</style>

      <section className="w-full relative overflow-hidden tap-clear">
        {/* VIDEO */}
        <div
          className="
            relative w-full
            h-[62.5svh] sm:h-[58svh] md:h-[62svh] lg:h-[70dvh]
          "
        >
          <video
            className="
              inline-video
              absolute inset-0 w-full h-full
              block align-top
              pointer-events-none
            "
            preload="metadata"
            autoPlay
            loop
            muted
            playsInline
            poster={`${FILE_BASE}/public/StaticImages/poster_new.webp`}
          >
            {/* webm first for size, then mp4 fallback for Safari */}
            <source
              src={`${FILE_BASE}/public/StaticImages/Bg-video.webm`}
              type="video/webm"
            />
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
          className="
            relative block w-full cursor-pointer
            -mt-[clamp(2rem,12svh,10rem)]
            focus:outline-none
            focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/60
          "
        >
          <picture>
            <source
              srcSet={`${FILE_BASE}/public/StaticImages/poster_new.webp`}
              type="image/webp"
            />
            <img
              src={`${FILE_BASE}/public/StaticImages/poster_new.jpg`}
              alt="Poster"
              loading="eager"
              decoding="async"
              className="
                w-full block align-top
                object-cover
                h-[58svh] sm:h-[66svh] md:h-[74svh] lg:h-[72dvh]
              "
            />
          </picture>
        </button>
      </section>

      <noscript>
        <img
          src={`${FILE_BASE}/public/StaticImages/poster_new.jpg`}
          alt="Poster"
          style={{ width: "100%", display: "block" }}
        />
      </noscript>
    </>
  );
};

export default Homepage;
