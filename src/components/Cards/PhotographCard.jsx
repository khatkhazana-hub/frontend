// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";

const PhotographCard = ({
  to = "#",
  overlay,
  overlayImg,
  title = "",
  description = "",
  className = "",
}) => {
  const imgSrc = overlay || overlayImg || "";

  return (
    <Link to={to}>
      <div
        className={`relative cursor-pointer rounded-[20px] overflow-hidden w-[350px] h-[410px] group mx-auto ${className}`}
      >
        <img
          src="/images/Card.webp"
          alt="Card Background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
        />

        <div className="relative flex justify-center z-10 pt-[30px]">
          <img
            src={imgSrc}
            alt={title || "Photograph"}
            loading="eager"
            className="object-fill group-hover:shadow-2xl shadow-black/50 transition-all duration-300 w-[200px] rounded-sm h-[250px]"
          />
          <img
            src="/images/Vector.webp"
            alt=""
            className="absolute top-20 left-[100px] w-[150px] h-[150px] opacity-20 object-cover pointer-events-none select-none"
          />
        </div>

        <div className="absolute left-[25px] top-[300px] w-[300px] text-left">
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

export default PhotographCard;
