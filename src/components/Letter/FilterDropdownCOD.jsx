// @ts-nocheck
import React from "react";

const FilterDropdownCOD = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  className = "",
  wrapperClassName = "",
}) => {
  return (
    <div className={`flex flex-col w-full text-left ${wrapperClassName}`}>
      {/* Label */}
      {label && (
        <span className="text-lg font-semibold text-[#704214] mb-2">
          {label}
        </span>
      )}

      {/* Dropdown with custom arrow */}
      <div className="relative ">
        <select
          value={value}
          onChange={onChange}
          className={`appearance-none w-full border-2 border-[#704214] rounded-full px-4 py-2 bg-white/20 backdrop-blur-sm text-sm text-[#704214] focus:outline-none pr-10 ${className}`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom arrow */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-[#704214]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FilterDropdownCOD;
