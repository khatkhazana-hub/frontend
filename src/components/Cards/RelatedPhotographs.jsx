// @ts-nocheck
import React from "react";
import PhotogaphCards from "./PhotogaphCards";

const RelatedPhotographs = ({ items = [] }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-4xl font-bold text-black" style={{ fontFamily: "philosopher" }}>
        Related Photographs
      </h2>
      <div className="w-full mb-10" style={{ maxWidth: "1270px" }}>
        <PhotogaphCards items={items} />
      </div>
    </div>
  );
};

export default RelatedPhotographs;
