// @ts-nocheck
import React from "react";

const RadioGroup = ({
  label,
  name,
  options = [],
  value,
  onChange,
  required = false,
  wrapperClassName = "",
  className = "",
  ...props // to allow register/onChange/value etc.
}) => {
  return (
    <div className={`flex flex-col ${wrapperClassName}`}>
      {label && (
        <label className="font-bold text-sm mb-2 capitalize">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <div className={`flex flex-wrap gap-6 pt-2 ${className}`}>
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center cursor-pointer space-x-2 "
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              required={required} // HTML5 validation for at least one
              className="w-4 h-4 text-[#4A2C2A] bg-transparent border-black focus:ring-[#4A2C2A]"
              {...props} // register etc.
            />
            <span className="text-sm text-[#5C4033]">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
