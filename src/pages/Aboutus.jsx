// @ts-nocheck
import ImageModalViewer from "@/components/ImageModalViewer/ImageModalViewer";
import React, { useState } from "react";

function Aboutus() {
  const images = [
    `${import.meta.env.VITE_FILE_BASE_URL}/public/StaticImages/About-1.webp`,
    `${import.meta.env.VITE_FILE_BASE_URL}/public/StaticImages/About-2.webp`,
    `${import.meta.env.VITE_FILE_BASE_URL}/public/StaticImages/About-3.webp`,
  ];

  const [selectedIndex, setSelectedIndex] = useState(null);

  const openAt = (i) => setSelectedIndex(i);
  const close = () => setSelectedIndex(null);
  const prev = () =>
    setSelectedIndex((i) => (i > 0 ? i - 1 : i));
  const next = () =>
    setSelectedIndex((i) => (i < images.length - 1 ? i + 1 : i));

  return (
    <div className="flex flex-col items-center my-10 lg:my-20 max-w-[1920px] mx-auto">
      <div className="flex flex-col gap-10 lg:gap-20 text-center lg:px-20 px-5 w-full">
        {/* header */}
        <div>
          <img
            src={`${import.meta.env.VITE_FILE_BASE_URL}/public/StaticImages/About-header1.webp`}
            alt="About Khat-Khazana"
            className="w-full h-auto object-cover lg:rounded-2xl rounded-md shadow-lg"
          />
        </div>

        {/* grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`About Khat-Khazana ${i + 1}`}
              className="w-full h-auto object-contain shadow-lg cursor-pointer"
              onClick={() => openAt(i)}
            />
          ))}
        </div>
      </div>

      {/* modal */}
      <ImageModalViewer
        isOpen={selectedIndex !== null}
        images={images}
        activeIndex={selectedIndex ?? 0}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </div>
  );
}

export default Aboutus;
