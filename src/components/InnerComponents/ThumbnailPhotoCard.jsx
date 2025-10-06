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

// normalize meta -> url (supports {path}|{location}|{url}|string)
const metaToUrl = (m) => {
  if (!m) return "";
  if (typeof m === "string") return buildFileUrl(m);
  return buildFileUrl(m.path || m.location || m.url || "");
};

const ThumbnailPhotoCard = ({ photo }) => {
  // letterImage can be an array or a single object; we want the FIRST one
  const firstLetterMeta = Array.isArray(photo?.letterImage)
    ? photo.letterImage[0]
    : photo?.letterImage;

  const firstLetterImgUrl = metaToUrl(firstLetterMeta);

  const cards = firstLetterImgUrl
    ? [
        {
          id: photo?._id || "letter-1",
          img: firstLetterImgUrl,
          title: photo?.title || "Untitled Letter",
        },
      ]
    : [];

  return (
    <div className="lg:w-[25%] w-full flex flex-col lg:flex-row lg:justify-start justify-center relative items-center lg:items-start gap-10">
      <div className="self-center w-full h-px border-t border-black lg:w-px lg:h-[400px] lg:border-t-0 lg:border-l"></div>

      <div>
        <h2
          className="text-lg sm:text-xl font-bold mb-4 text-center"
          style={{ fontFamily: "philosopher" }}
        >
          Related Letters
        </h2>

        {cards.length > 0 && (
          <div className="w-full flex flex-col md:flex-row lg:flex-col justify-center gap-4 items-center lg:items-start">
            {cards.map((item) => (
              <ThumbnailForPhotograph
                key={item.id}
                RelatedImage={item.img}
                RelatedThumbnailName={item.title}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThumbnailPhotoCard;
