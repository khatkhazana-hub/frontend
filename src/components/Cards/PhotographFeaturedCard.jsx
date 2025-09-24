// @ts-nocheck
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const PhotographFeaturedCard = ({
  to = "#",
  overlayImg, // overlay image prop
  title = "Want more Lorem Ipsums?", // heading prop
  description = "Join our archive mailing list and never miss an update.", // description prop
  isFeatured = true, // naya prop add kiya
  isFrame = false, // naya prop add kiya
}) => {
  const navigate = useNavigate();

  return (
    <Link to={to} className="w-full">
      <div
        onClick={() => navigate(to)}
        className="relative cursor-pointer rounded-[20px] overflow-hidden lg:w-[350px] h-[410px] group mx-auto"
      >
        <img
          src="/images/Card.webp"
          alt="Card Background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
        />

        {/* Featured Badge */}
        {isFeatured && (
          <span
            className="absolute top-16 right-20 lg:right-28 bg-white text-black text-sm font-semibold px-3 py-1 rounded-full shadow-md z-40"
            style={{ fontFamily: "Philosopher" }}
          >
            Featured
          </span>
        )}

        <div className="relative flex justify-center z-10 pt-[25px]">
          {/* Frame sabse upar */}
          <div className="relative w-[280px] h-[280px]">
            {/* Main Image inside Frame */}
            <img
              src={overlayImg}
              alt={title || "Photograph"}
              className="absolute top-[30px] left-1/2 -translate-x-1/2 w-[180px] h-[240px] rounded-sm object-cover z-10"
            />

            {/* Watermark on top of image */}
            <img
              src="/images/logo.png"
              alt="Watermark"
              className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[100px] h-[100px] opacity-20 object-cover pointer-events-none select-none z-20"
            />

            {/* Frame Image sabse upar */}
            <img
              src="/images/Vertical-Frame.webp"
              alt="Frame"
              className="absolute top-0 left-0 w-full h-full object-contain z-30"
            />
          </div>
        </div>

        {/* Bottom Heading */}
        <div className="absolute left-[25px] top-[310px] w-[300px] text-left">
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

export default PhotographFeaturedCard;
