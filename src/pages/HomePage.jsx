import React from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="w-full relative overflow-hidden">
        {/* 🔹 Video Section */}
        <video
          className="
          w-full   h-[410px] lg:h-[70vh]
          object-cover
          block
          align-top
        "
          src={`${import.meta.env.VITE_FILE_BASE_URL}/public/StaticImages/Bg-video.mp4`}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* 🔹 Poster Section */}
        <img
          src={`${import.meta.env.VITE_FILE_BASE_URL}/public/StaticImages/poster_new.webp`}
          alt="Poster"
          onClick={() => navigate("/About")}
          className="
          w-full 
          h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-full
          object-cover
          block 
          align-top 
          cursor-pointer
        -mt-10 md:-mt-32
        
        "
        />
      </section>
    </>
  );
};

export default Homepage;
