import React from "react";
import Cards from "./Cards";

const RelatedCards = () => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Heading */}

      <h2
        className="text-4xl font-bold text-black"
        style={{ fontFamily: "philosopher" }}
      >
        Related Letters
      </h2>

      {/* Cards Grid */}
      <div className="w-full mb-10" style={{ maxWidth: "1270px" }}>
        <Cards />
      </div>
    </div>
  );
};

export default RelatedCards;
