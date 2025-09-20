// @ts-nocheck
import React from "react";
import Thumbnails from "./Thumbnails";

const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL || window.location.origin;

const buildFileUrl = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const rel = String(p).replace(/^\/+/, "");
  return `${FILE_BASE}/${rel}`;
};

const ThumbnailletterCards = ({ photo }) => {
    console.log(photo , 'photo')
  // If real photo data exists, show the letterImage instead of dummy
  const cards = photo?.letterImage?.path
    ? [
        {
          id: photo._id,
          img: buildFileUrl(photo.letterImage.path), // ✅ proper CloudFront URL
          title: photo.title || "Untitled Letter",
        },
      ]
    : [
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

  return (
    <div className="lg:w-[23%] xl:w-[18%] w-full flex flex-col lg:justify-start justify-center relative items-center lg:items-start">
      <div className="w-full flex flex-col md:flex-row lg:flex-col justify-center gap-4 items-center lg:items-start">
        {cards.map((item) => (
          <Thumbnails RelatedImage={item.img} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default ThumbnailletterCards;
