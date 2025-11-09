// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";

const LetterCard = ({ to, overlay, title, letcategory, className }) => {
  const imgSrc = overlay;

  // console.log(imgSrc);

  return (
    <Link to={to}>
      <div
        className={`relative cursor-pointer grop rounded-[20px] overflow-hidden w-full max-w-[350px] h-[410px] group mx-auto ${className}`}
      >
        <img
          src={`${import.meta.env.VITE_FILE_BASE_URL}/public/StaticImages/Card.webp`}
          alt="Card Background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
        />

        <div className="relative flex justify-center z-10 pt-[30px]">
          <img
            src={imgSrc}
            alt="Overlay"
            loading="eager"
            className="object-contain transition-all duration-300 w-[160px] h-[210px] sm:w-[190px] sm:h-[240px] md:w-[200px] md:h-[250px]"
          />
          <img
            src="/images/logo.png"
            alt="Watermark"
            className="absolute top-20 left-[100px] w-[150px] h-[150px] opacity-20 object-cover pointer-events-none select-none"
          />
        </div>

        <div className="absolute left-4 right-4 bottom-6 text-left sm:left-6 sm:right-6 sm:bottom-6 md:left-[25px] md:right-[25px] md:bottom-[25px]">
          <h2 className="text-xl sm:text-2xl lg:text-[24px] font-semibold text-black mb-1 truncate font-[philosopher] capitalize">
            {title}
          </h2>
          <p className="font-[Ephesis] font-normal text-base sm:text-lg leading-tight text-black m-0 line-clamp-2 capitalize">
            {letcategory}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default LetterCard;
