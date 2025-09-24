// @ts-nocheck
import { useMemo } from "react";
import useSubmissions from "@/hooks/useSubmissions";
import TestimonialCard from "../../components/InnerComponents/TestimonialCard";
import FeaturedCards from "../../components/Cards/FeaturedCards";
import FeaturedPhotographCard from "../../components/Cards/FeaturedPhotographCard";
import TestimonialPhotographCard from "../../components/InnerComponents/TestimonialPhotographCard";
import Subcription from "../../components/InnerComponents/Subcription";

const Featurelatter = () => {
  const { rows, loading, err } = useSubmissions(); // ✅ one API call here

  const featuredLetters = useMemo(
    () =>
      rows.filter(
        (r) =>
          r?.featuredLetter === true &&
          String(r?.status || "").toLowerCase() === "approved"
      ),
    [rows]
  );

  const featuredPhotos = useMemo(
    () =>
      rows.filter(
        (r) =>
          r?.featuredPhoto === true &&
          String(r?.status || "").toLowerCase() === "approved"
      ),
    [rows]
  );

  return (
    <div className="flex flex-col justify-center items-start gap-20 lg:py-20 py-10 max-w-[1270px] mx-auto px-5 ">
      {/* Featured Letter (hero) */}
      <div className="flex flex-col items-start justify-center gap-10 w-full">
        <h1
          className="font-bold text-4xl lg:text-[50px] leading-[130%] capitalize"
          style={{ fontFamily: "Philosopher" }}
        >
          Featured Letter
        </h1>

        <TestimonialCard
          name="Josh Smith"
          designation="Manager of The New York Times"
          description="“They are have a perfect touch for make something so professional ...”"
        />
      </div>

      {/* Featured Letters */}
      <div className="flex flex-col gap-[50px] w-full">
        <div className="flex justify-between items-start lg:items-center w-full">
          <h1
            className="font-bold text-left text-2xl lg:text-[50px]  capitalize"
            style={{ fontFamily: "Philosopher" }}
          >
            Featured Letters
          </h1>
          <button
            className="bg-[#6E4A27] text-sm lg:text-base text-white whitespace-nowrap font-bold px-4 py-2 leading-5 rounded-full hover:bg-[#8b5e34] transition"
            style={{ fontFamily: "Philosopher" }}
          >
            View All
          </button>
        </div>

        <FeaturedCards items={featuredLetters} loading={loading} error={err} />
      </div>

      {/* Featured Photograph (hero) */}
      <div className="flex flex-col items-start justify-center gap-10 w-full">
        <h1
          className="font-bold text-4xl lg:text-[50px] capitalize"
          style={{ fontFamily: "Philosopher" }}
        >
          Featured Photograph
        </h1>
        <TestimonialPhotographCard
          name="Josh Smith"
          designation="Manager of The New York Times"
          description="“They are have a perfect touch for make something so professional ...”"
        />
      </div>

      {/* Featured Photographs */}
      <div className="flex flex-col gap-[50px] w-full">
        <div className="flex justify-between items-start lg:items-center w-full">
          <h1
            className="font-bold text-left text-2xl lg:text-[50px] capitalize"
            style={{ fontFamily: "Philosopher" }}
          >
            Featured photographs
          </h1>
          <button
            className="bg-[#6E4A27] text-sm lg:text-base text-white whitespace-nowrap font-bold px-4 py-2 leading-5 rounded-full hover:bg-[#8b5e34] transition"
            style={{ fontFamily: "Philosopher" }}
          >
            View All
          </button>
        </div>

        <div className="w-full">
          <FeaturedPhotographCard
            items={featuredPhotos}
            loading={loading}
            error={err}
          />
        </div>
      </div>

      <div className="w-full my-10">
        <Subcription />
      </div>
    </div>
  );
};

export default Featurelatter;
