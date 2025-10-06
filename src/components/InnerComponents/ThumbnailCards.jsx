// @ts-nocheck
import React from "react";
import Thumbnails from "./Thumbnails";

const ThumbnailCards = ({ photos }) => {
  console.log(photos , 'photo')
  const cards = photos
    ? [
        {
          id: 1,
          img: photos, // API photo URL
          title: photos.title,
        },
      ]
    : null

  return (
    <div className="lg:w-[25%] w-full flex flex-col lg:flex-row lg:justify-start justify-center relative items-center lg:items-start gap-5 lg:gap-5 xl:gap-10">
    
      <div className="self-center w-full h-px border-t border-black lg:w-px lg:h-[400px] lg:border-t-0 lg:border-l"></div>

      <div className="">
        {/* Heading hamesha show ho */}
        <h2
          className="text-lg sm:text-xl font-bold mb-4 text-center"
          style={{ fontFamily: "philosopher" }}
        >
          Related Photographs
        </h2>
        {/* Cards Loop */}
        {cards?.length > 0 && (
          <div className="w-full flex flex-col md:flex-row lg:flex-col justify-center gap-4 items-center lg:items-start">
            {cards.map((item) => (
              <Thumbnails
                RelatedImage={item?.img}
                key={item.id}
                RelatedThumbnailName={"Related Letters"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThumbnailCards;
