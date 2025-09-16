/* eslint-disable no-unused-vars */
// @ts-nocheck
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import HeadingDesc from "../../components/InnerComponents/HeadingDesc";
import PhotographCard from "../../components/Cards/PhotographCard";
import Subcription from "../../components/InnerComponents/Subcription";

const cards = [
  {
    overlay: "/images/About-1.webp",
    title: "Lorem Ipsum 1",
    description:
      "A glimpse into the past with rare documents and timeless stories.",
  },
  {
    overlay: "/images/About-2.webp",
    title: "Lorem Ipsum 2",
    description:
      "Rare and valuable find showcasing memories of forgotten eras.",
  },
  {
    overlay: "/images/About-3.webp",
    title: "Lorem Ipsum 3",
    description:
      "Preserving history and stories through beautifully kept letters.",
  },
  {
    overlay: "/images/About-1.webp",
    title: "Lorem Ipsum 4",
    description: "Discover unseen letters that reveal unique life experiences.",
  },
  {
    overlay: "/images/About-2.webp",
    title: "Lorem Ipsum 5",
    description:
      "Historic archives providing insight into the past’s narratives.",
  },
  {
    overlay: "/images/About-3.webp",
    title: "Lorem Ipsum 6",
    description:
      "Beautifully preserved memories and letters of historical value.",
  },
  {
    overlay: "/images/About-1.webp",
    title: "Lorem Ipsum 7",
    description:
      "Timeless correspondence capturing the heart of old generations.",
  },
  {
    overlay: "/images/About-2.webp",
    title: "Lorem Ipsum 8",
    description: "Rare letters connecting us to the voices of a bygone age.",
  },
  {
    overlay: "/images/About-3.webp",
    title: "Lorem Ipsum 9",
    description: "Stories written in ink revealing untold journeys of life.",
  },
  {
    overlay: "/images/About-1.webp",
    title: "Lorem Ipsum 10",
    description:
      "Preserved messages reflecting emotions and memories of the past.",
  },
  {
    overlay: "/images/About-2.webp",
    title: "Lorem Ipsum 11",
    description:
      "Letters that document moments of love, struggle, and history.",
  },
  {
    overlay: "/images/About-3.webp",
    title: "Lorem Ipsum 12",
    description: "Unlock the past through these rare handwritten treasures.",
  },
];


const PhotoGraph = () => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(false);

  const visibleCards = cards.slice(0, visibleCount);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 12);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen  bg-cover bg-center flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Heading */}
      <HeadingDesc
        headingClassName="md:text-[40px] text-center"
        heading="Photographs"
        containerClassName="mt-6"
        description={undefined}
      />

      {/* Filters */}
      <div className="w-[90%] md:w-full max-w-5xl mt-10  md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {["Category", "Owner's Name", "Decade"].map((filter, idx) => (
          <div key={idx} className="flex flex-col w-full text-left">
            <span className="text-lg font-semibold text-[#704214] hover:text-black mb-2">
              By {filter}
            </span>
            <div className="flex items-center w-full border-2 border-[#704214] rounded-full px-4 py-2 bg-white/20 backdrop-blur-sm">
              <FiSearch className="text-[#704214] mr-2" size={20} />
              <input
                type="text"
                placeholder={`Search ${filter.toLowerCase()}...`}
                className="w-full outline-none bg-transparent placeholder:text-[#704214] text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="mt-16 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {visibleCards?.map((card, i) => (
          <PhotographCard
            key={card?.id}
            to={`/PhotoGraphs/${i}`}
            overlayImg={card?.overlay}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>

      {/* Loader / Load More */}
      <div className="mt-20">
        {loading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-t-[#704214] border-gray-300 rounded-full animate-spin"></div>
          </div>
        ) : (
          visibleCount < cards.length && (
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 text-[#704214] font-semibold border border-[#704214] rounded-full hover:bg-[#704214] hover:text-white transition disabled:opacity-50 cursor-pointer"
              disabled={loading}
            >
              Load More
            </button>
          )
        )}
      </div>

      {/* Mailing List */}
      <div className="my-20 w-full">
        <Subcription />
      </div>
    </div>
  );
};

export default PhotoGraph;
