// @ts-nocheck
import React from "react";
import PhotogaphCards from "./PhotogaphCards";

const RelatedPhotographs = ({ items = [] }) => {
  return (
    <div className="w-full">
      <PhotogaphCards items={items} />
    </div>
  );
};

export default RelatedPhotographs;
