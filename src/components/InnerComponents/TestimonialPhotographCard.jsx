// @ts-nocheck
import React from "react";
import PhotographFeaturedCard from "../Cards/PhotographFeaturedCard";

// Dummy Data (isko API ya props se bhi le sakte ho)
const cards = [
  {
    overlay: "/images/About-1.webp",
    title: "Lorem Ipsum 1",
    description:
      "A glimpse into the past with rare documents and timeless stories.",
  },
];

const TestimonialPhotographCard = ({ name, designation, description }) => {
  // cards[0] ko ek variable mai store kar liya
  const card = cards[0];

  return (
    <div className="relative flex flex-col lg:flex-row justify-between items-center gap-10 xl:w-[1230px] xl:h-[460px] w-full h-full mx-auto rounded-[20px] border-2 border-[#6E4A27] px-5 xl:px-[80px] py-[20px]">
      {/* Text Block */}
      <div className="flex flex-col justify-center items-start gap-2 w-fit text-left">
        <span className=" text-[20px] font-bold font-[Philosopher] text-[#23262F]">
          {name}
        </span>
        <span className="text-[16px] font-bold font-[Philosopher] text-[#23262F] opacity-50">
          {designation}
        </span>

        <p className="mt-5 lg:mt-10 xl:w-[570px] text-[28px] leading-[140%] text-[#23262F] font-[Ephesis] font-normal">
          {description}
        </p>
      </div>

      {/* Right Image Block */}

      <PhotographFeaturedCard
        overlayImg={card.overlay} // ✅ current card ka overlay
        title={card.title || "Default Title"} // ✅ dynamic title agar ho
        description={card.description || "Default description"} // ✅ dynamic desc agar ho
      />
    </div>
  );
};

export default TestimonialPhotographCard;
