// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";

const FeaturedCard = ({
  to = "#",
  overlay,
  title = "Want more Lorem Ipsums?",
  description = "Join our archive mailing list and never miss an update.",
  className = "",
  isFeatured = true,
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

        {/* Featured Badge */}
        {isFeatured && (
          <span
            className="absolute top-12 right-24 bg-white text-black text-sm font-semibold px-3 py-1 rounded-full shadow-md z-20"
            style={{ fontFamily: "Philosopher" }}
          >
            Featured
          </span>
        )}

        {/* Overlay Container */}
        <div className="relative flex justify-center z-10 pt-[30px]">
          {/* Overlay Image */}
          <img
            src={overlay}
            alt="Overlay"
            loading="eager"
            className="object-contain group-hover:drop-shadow-xl transition-all duration-300 w-[310px] h-[250px]"
          />

          {/* ✅ Watermark Image (Full Overlay Area) */}
          <img
            src="/images/Vector.webp"
            alt="Watermark"
            className="
            absolute 
          top-20 left-[100px]
            w-[150px] h-[150px]   /* same size as overlay */
            opacity-20        /* adjust transparency */
            object-cover          /* cover full area */
            pointer-events-none select-none "
          />
        </div>

        {/* Bottom Text */}
        <div
          className="absolute text-left"
          style={{
            width: "310px",
            height: "27px",
            top: "300px",
            left: "23px",
          }}
        >
          <h2
            className="text-[24px] sm:text-base lg:text-xl font-semibold text-black mb-1 truncate w-full "
            style={{ fontFamily: "philosopher" }}
          >
            {title}
          </h2>
          <p
            className="font-ephesis line-clamp-2"
            style={{
              fontFamily: "Ephesis",
              fontWeight: 400,
              fontSize: "20px",
              lineHeight: "100%",
              color: "#000000",
              margin: 0,
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedCard;
