import React from "react";

const HeadingDesc = ({
  heading,
  description,
  headingClassName = "",
  descClassName = "",
  containerClassName = "",
}) => {
  return (
    <div className={containerClassName}>
      <h2
        className={`text-3xl font-bold text-black ${headingClassName}`}
        style={{ fontFamily: "philosopher" }}
      >
        {heading}
      </h2>

      {/* description optional */}
      {description && (
        <p
          className={`text-2xl md:text-4xl leading-14 text-black italic md:my-2 ${descClassName}`}
          style={{ fontFamily: "'Ephesis'" }}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default HeadingDesc;
