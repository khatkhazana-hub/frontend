// @ts-nocheck
import React from "react";
import ThumbnailForPhotograph from "./ThumbnailForPhotograph";

const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL || window.location.origin;

const buildFileUrl = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const rel = String(p).replace(/^\/+/, "");
  return `${FILE_BASE}/${rel}`;
};

const ThumbnailPhotoCard = ({ photo }) => {
  console.log(photo, "photo");

  // Cards sirf tab banenge jab letterImage ho
  const cards = photo?.letterImage?.path
    ? [
        {
          id: photo._id,
          img: buildFileUrl(photo.letterImage.path),
          title: photo.title || "Untitled Letter",
        },
      ]
    : [];

  return (
    <div className="lg:w-[25%] w-full flex flex-col lg:flex-row lg:justify-start justify-center relative items-center lg:items-start gap-10">
      <div className="self-center w-full h-px border-t border-black lg:w-px lg:h-[400px] lg:border-t-0 lg:border-l"></div>

      <div className="">
        {/* Heading hamesha show ho */}
        <h2
          className="text-lg sm:text-xl font-bold mb-4 text-center"
          style={{ fontFamily: "philosopher" }}
        >
          Related Letters
        </h2>

        {/* Cards sirf tab render ho jab data ho */}
        {cards?.length > 0 && (
          <div className="w-full flex flex-col md:flex-row lg:flex-col justify-center gap-4 items-center lg:items-start">
            {cards.map((item) => (
              <ThumbnailForPhotograph
                RelatedImage={item.img}
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

export default ThumbnailPhotoCard;
