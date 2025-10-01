import React from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <>
<div className=" relative flex flex-col items-center justify-center min-h-screen capitalize bg-[#6E4A27] text-white overflow-hidden">
  {/* Glowing background accents */}
  <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
  <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

  {/* Subtle Stars */}
  <div className="absolute w-[10px] h-[10px] bg-white rounded-full top-1/3 left-1/4 animate-pulse"></div>
  <div className="absolute w-[5px] h-[5px] bg-white rounded-full top-1/2 left-2/3 animate-ping"></div>
  <div className="absolute w-[5px] h-[5px] bg-white rounded-full bottom-1/3 right-1/5 animate-pulse"></div>

  {/* Icon */}
  <div className="relative w-28 h-28 mb-8">
    <div className="absolute inset-0 bg-white/10 rounded-full animate-ping"></div>
    <div className="relative w-28 h-28 bg-white/5 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md border border-white">
      <span className="text-6xl ">📜</span>
    </div>
  </div>

  {/* Website Name */}
  <h1
    className="text-4xl md:text-6xl font-bold mb-2 text-center tracking-wide drop-shadow-xl"
    style={{ fontFamily: 'philosopher' }}
  >
    Long Lost Letter
  </h1>

  {/* Heading */}
  <h2
    className="text-3xl md:text-5xl font-extrabold mb-6 text-center drop-shadow-xl"
    style={{ fontFamily: 'philosopher' }}
  >
    Coming <span className="">Soon</span>
  </h2>

  {/* Subtitle */}
  <p
    className="text-lg md:text-2xl text-center max-w-xl leading-relaxed text-white/90"
    style={{ fontFamily: 'philosopher' }}
  >
    Letters from the past, feelings for the future.  
    We’re preparing something <span className="font-bold ">special</span> for you.
  </p>

  {/* Animated Loader */}
  <div className="relative mt-14">
    <div className="w-20 h-20 border-4 border-t-transparent rounded-full animate-spin"></div>
    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm tracking-widest uppercase">
      Loading Magic…
    </span>
  </div>
</div>




      <section className="w-full relative overflow-hidden hidden">
        {/* 🔹 Video Section */}
        <video
          className="
          w-full   h-[410px] lg:h-[70vh]
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
        -mt-10 md:-mt-32
        
        "
        />
      </section>
    </>
  );
};

export default Homepage;
