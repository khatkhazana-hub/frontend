import React from "react";
import PhotogaphCards from "./PhotogaphCards";

const RelatedPhotographs = () => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Heading */}

      <h2
        className="text-4xl font-bold text-black"
        style={{ fontFamily: "philosopher" }}
      >
        Related Photographs
      </h2>

      {/* Cards Grid */}
      <div className="w-full mb-10" style={{ maxWidth: "1270px" }}>
        <PhotogaphCards />
      </div>
    </div>
  );
};

export default RelatedPhotographs;
