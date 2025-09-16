// @ts-nocheck
import React from "react";

const FormSection = ({ title, children, className = "" }) => {
  return (
    <section className={`mb-8 ${className}`}>
      {title && (
        <h2
          className="text-2xl font-bold text-[#4A2C2A] mb-6"
          style={{ fontFamily: "Philosopher, serif" }}
        >
          {title}
        </h2>
      )}
      <div>{children}</div>
    </section>
  );
};

export default FormSection;
