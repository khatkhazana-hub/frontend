import React from "react";
import Thumbnails from "./Thumbnails";

// ✅ Demo Data
const demoData = [
  {
    id: 1,
    img: "/images/About-1.webp",
    title: "Lorem Ipsum #1",
  },
  {
    id: 2,
    img: "/images/About-2.webp",
    title: "Lorem Ipsum #2",
  },
];

const ThumbnailCards = () => {
  return (
    <div className="lg:w-[23%] xl:w-[18%]  w-full flex flex-col lg:justify-start justify-center relative items-center lg:items-start">
      {/* Heading */}
      <h2
        className="text-lg sm:text-xl font-bold mb-4 text-center"
        style={{ fontFamily: "philosopher" }}
      >
        Related Photographs
      </h2>

      {/* Cards Loop */}
      <div className="w-full flex flex-col md:flex-row lg:flex-col justify-center gap-4 items-center lg:items-start">
        {demoData.map((item) => (
          <Thumbnails RelatedImage={item?.img} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default ThumbnailCards;
