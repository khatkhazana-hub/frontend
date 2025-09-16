import React from "react";

const InputField = ({
  label,
  type = "text",
  name,
  required  = false,
  wrapperClassName = "",
  className = "",
  ...props // extra props like onChange, value, ref, etc.
}) => {
  return (
    <div className={`flex flex-col ${wrapperClassName}`}>
      <label htmlFor={name} className="font-bold text-sm mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required} // adds HTML5 validation
        className={`border border-[#8B4513]/50 text-[#4A2C2A] text-sm rounded-lg focus:ring-[#8B4513] focus:border-[#8B4513]  w-full flex justify-start items-start p-2.5 text-start ${className}`}
        {...props} // lets you pass register(name) or onChange/value
      />
    </div>
  );
};

export default InputField;
