import React from "react";

const TextareaField = ({
  label,
  name,
  required = false,
  className = "",
  rows = 4,
  wrapperClassName = "",
  ...props // to allow register/onChange/value etc.
}) => {
  return (
    <div className={`flex flex-col ${wrapperClassName}`}>
      <label htmlFor={name} className="font-bold text-sm mb-2 text-[#4A2C2A]">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required} // adds HTML5 validation
        className={`border border-[#8B4513]/50 text-[#4A2C2A] text-sm rounded-lg 
          focus:ring-[#8B4513] focus:border-[#8B4513] block resize-none p-2.5 ${className}`}
        {...props} // lets you use register(name) etc.
      />
    </div>
  );
};

export default TextareaField;
