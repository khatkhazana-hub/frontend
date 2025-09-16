// @ts-nocheck
import React from "react";
import TestimonialCard from "../../components/InnerComponents/TestimonialCard";
import FeaturedCards from "../../components/Cards/FeaturedCards";
import FeaturedPhotographCard from "../../components/Cards/FeaturedPhotographCard";
import TestimonialPhotographCard from "../../components/InnerComponents/TestimonialPhotographCard";
import Subcription from "../../components/InnerComponents/Subcription";

const Featurelatter = () => {
  return (
    <div className="flex flex-col justify-center items-start gap-20 lg:py-20 py-10 max-w-[1270px] mx-auto px-5">
      <div className=" flex flex-col items-start justify-center gap-10">
        <h1
          className="font-bold text-4xl lg:text-[50px] leading-[130%] capitalize"
          style={{ fontFamily: "Philosopher" }}
        >
          Featured Letter
        </h1>

        <TestimonialCard
          name="Josh Smith"
          designation="Manager of The New York Times"
          description="“They are have a perfect touch for make something so professional ,interest and useful for a lot of people .They are have a perfect touch for make something so professional ,interest and useful for a lot of people .They are have a perfect touch for make something so professional ,interest and useful for a lot of people ”"
        />
      </div>

      <div className="flex flex-col gap-[50px] w-full">
        <div className="flex justify-between items-start lg:items-center w-full">
          <h1
            className="font-bold text-left text-3xl lg:text-[50px] leading-[130%] capitalize"
            style={{ fontFamily: "Philosopher" }}
          >
            More Featured Letters
          </h1>

          <button
            className="bg-[#6E4A27] text-white whitespace-nowrap font-bold px-4 py-2 leading-5 rounded-full cursor-pointer hover:bg-[#8b5e34] transition"
            style={{ fontFamily: "Philosopher" }}
          >
            View All
          </button>
        </div>

        {/* More Featured Letterss Section */}
        <FeaturedCards />
      </div>

      {/* -----------  {/* More Featured Photographs Section *------------------------------------ */}

      <div className=" flex flex-col items-start justify-center gap-10">
        <h1
          className="font-bold text-4xl lg:text-[50px] leading-[130%] capitalize"
          style={{ fontFamily: "Philosopher" }}
        >
          Featured Photograph
        </h1>

        <TestimonialPhotographCard
          name="Josh Smith"
          designation="Manager of The New York Times"
          description="“They are have a perfect touch for make something so professional ,interest and useful for a lot of people .They are have a perfect touch for make something so professional ,interest and useful for a lot of people .They are have a perfect touch for make something so professional ,interest and useful for a lot of people ”"
        />
      </div>

      <div className="flex flex-col gap-[50px] w-full">
        <div className="flex justify-between items-start lg:items-center w-full">
          <h1
            className="font-bold text-left text-3xl lg:text-[50px] leading-[130%] capitalize"
            style={{ fontFamily: "Philosopher" }}
          >
            more Featured photographs
          </h1>

          <button
            className="bg-[#6E4A27] text-white whitespace-nowrap font-bold px-4 py-2 leading-5 rounded-full cursor-pointer hover:bg-[#8b5e34] transition"
            style={{ fontFamily: "Philosopher" }}
          >
            View All
          </button>
        </div>

        {/* More Featured Letterss Section */}
        <div className="w-full">
          <FeaturedPhotographCard />
        </div>
      </div>

      <div className="w-full my-10">
        <Subcription />
      </div>
    </div>
  );
};

export default Featurelatter;
