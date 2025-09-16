// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";

const LetterCard = ({
  to = "#",
  overlay,
  title = "Want more Lorem Ipsums?",
  description = "Join our archive mailing list and never miss an update.",
  className = "",
}) => {
  return (
    <Link to={to}>
      <div
        className={`relative cursor-pointer rounded-[20px] overflow-hidden w-[350px] h-[410px] group mx-auto ${className}`}
      >
        {/* Card Background Image */}
        <img
          src="/images/Card.webp"
          alt="Card Background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
        />

        <div className="relative flex justify-center z-10 pt-[30px]">
          {/* Overlay Image */}
          <img
            src={overlay}
            alt="Overlay"
            loading="eager"
            className="object-contain group-hover:drop-shadow-xl transition-all duration-300 w-[190px] rounded-sm h-[250px]"
          />

          {/* ✅ Watermark Image (Full Overlay Area) */}
          <img
            src="/images/Vector.webp"
            alt="Watermark"
            className="
            absolute 
            top-20 left-[100px]
            w-[150px] h-[150px]   /* same size as overlay */
            opacity-20     /* adjust transparency */
            object-cover          /* cover full area */
            pointer-events-none select-none "
          />
        </div>

        {/* Bottom Text */}
        <div className="absolute left-[23px] top-[300px] w-[310px] text-left">
          <h2 className="text-[24px] sm:text-base lg:text-xl font-semibold text-black mb-1 truncate font-[philosopher]">
            {title}
          </h2>
          <p className="font-[Ephesis] font-normal text-[20px] leading-[100%] text-black m-0 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default LetterCard;
