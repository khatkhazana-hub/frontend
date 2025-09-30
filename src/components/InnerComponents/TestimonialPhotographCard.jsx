// @ts-nocheck
import React from "react";
import PhotographFeaturedCard from "../Cards/PhotographFeaturedCard";
import { Link } from "react-router-dom";

const TestimonialPhotographCard = ({
  name,
  placetaken,
  phototrabscript,
  overlay,
  title,
  rightDescription,
  to,
}) => {
  return (
    <div className="relative flex flex-col lg:flex-row justify-between items-center gap-10 xl:h-[460px] w-full h-full mx-auto rounded-[20px] border-2 border-[#6E4A27] px-5 xl:px-[80px] py-[20px]">
      {/* Left text */}
      <div className="flex flex-col justify-center items-start gap-2 w-fit text-left ">
        <span className=" text-[20px] font-bold font-[Philosopher] text-[#23262F]">
          {name}
        </span>
        <span className="text-[16px] font-bold font-[Philosopher] text-[#23262F] opacity-50">
          {placetaken}
        </span>
        <div className="mt-5 xl:w-[570px]">
          <p className="text-[28px] leading-[140%] text-[#23262F] font-[Ephesis] font-normal max-h-[200px] overflow-hidden">
            {phototrabscript}
          </p>

          {/* Read more link */}
          <Link
            to={to}
            className="text-[#6E4A27] hover:underline text-lg font-medium inline-block mt-1"
          >
            ... Read more
          </Link>
        </div>
      </div>

      {/* Right card pulled from latest featured PHOTO */}
      <div>
        <PhotographFeaturedCard
          overlayImg={overlay}
          title={title || "Untitled Photo"}
          description={rightDescription || "—"}
          to={to}
        />
      </div>
    </div>
  );
};

export default TestimonialPhotographCard;
