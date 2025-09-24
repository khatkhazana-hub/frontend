// @ts-nocheck
import React from "react";

const DropdownField = ({
  label,
  name,
  options = [],
  required = false,
  value,
  onChange,
  className = "",
  wrapperClassName = "",
}) => {
  return (
    <div className={`flex flex-col ${wrapperClassName}`}>
      {label && (
        <label className="font-bold text-sm mb-1">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      {/* <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`border border-[#8B4513]/50 text-[#4A2C2A] text-sm rounded-lg focus:ring-[#8B4513] focus:border-[#8B4513]  w-full flex justify-start items-start p-2.5 pr-3 bg-transparent  text-start ${className}`}
      >
        <option value="">Select {label}</option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select> */}

      <div className="relative w-full">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`appearance-none border border-[#8B4513]/50 text-[#4A2C2A] text-sm rounded-lg focus:ring-[#8B4513] focus:border-[#8B4513] w-full p-2.5 pr-10 bg-transparent text-start ${className}`}
        >
          <option value="">Select {label}</option>
          {options.map((opt, index) => (
            <option key={index} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* custom arrow */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#4A2C2A]">
          <svg
            className="w-4 h-4 text-[#4A2C2A]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DropdownField;
