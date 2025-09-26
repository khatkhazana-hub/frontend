// @ts-nocheck
import React from "react";
import PhotographFeaturedCard from "../Cards/PhotographFeaturedCard";

const TestimonialPhotographCard = ({ name, placetaken, phototrabscript, overlay, title, rightDescription }) => {
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

        <p className="mt-5 lg:mt-10 xl:w-[570px] text-[28px] leading-[140%] text-[#23262F] font-[Ephesis] font-normal">
          {phototrabscript}
        </p>
      </div>

      {/* Right card pulled from latest featured PHOTO */}
      <div>
        <PhotographFeaturedCard
          overlayImg={overlay}
          title={title || "Untitled Photo"}
          description={rightDescription || "—"}
        />
      </div>
    </div>
  );
};

export default TestimonialPhotographCard;
