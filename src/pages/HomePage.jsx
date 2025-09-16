import React from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full container relative bg-black overflow-hidden">
      {/* 🔹 Video Section */}
      <video
        className="
          w-full 
       h-[410px]
        lg:h-[550px]
          object-cover
          block
          align-top
        "
        src="/video/Bg-video.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* 🔹 Poster Section */}
      <img
        src="/images/poster.webp"
        alt="Poster"
        onClick={() => navigate("/About")}
        className="
          w-full 
          h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-full
          object-cover
          block 
          align-top 
          cursor-pointer
        -mt-20 md:-mt-36
        
        "
      />
    </section>
  );
};

export default Homepage;
