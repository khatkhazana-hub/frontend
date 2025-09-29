// @ts-nocheck
import React from "react";
import FeaturedCard from "../Cards/FeaturedCard";

 
    //  const to = `/photographs/${encodeURIComponent(r?._id)}`;

const TestimonialCard = ({
  name,
  decade,
  lettertrabscript,
  overlay,
  letCategory,
  to, 
}) => {
  return (
    <div className="relative flex flex-col lg:flex-row justify-between items-center gap-10 xl:h-[460px] w-full h-full mx-auto rounded-[20px] border-2 border-[#6E4A27] px-5 xl:px-[80px] py-[20px]">
      {/* Left text */}
      <div className="flex flex-col justify-center items-start gap-2 w-fit text-left">
        <span className=" text-[20px] font-bold font-[Philosopher] text-[#23262F]">
          {name}
        </span>
        <span className="text-[16px] font-bold font-[Philosopher] text-[#23262F] opacity-50">
          {decade}
        </span>

        <p className="mt-5 lg:mt-10 xl:w-[570px] text-[28px] leading-[140%] text-[#23262F] font-[Ephesis] font-normal">
          {lettertrabscript}
        </p>
      </div>

      {/* Right card pulled from latest featured LETTER */}
      <FeaturedCard
        overlay={overlay}
        title={name || "Untitled"}
        description={letCategory || "—"}
        to={to}
      />
    </div>
  );
};

export default TestimonialCard;
