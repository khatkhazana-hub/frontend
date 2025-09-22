import React from "react";

const InputField = ({
  label,
  type = "text", // 👈 agar 'textarea' pass karoge to textarea render hoga
  name,
  required = false,
  wrapperClassName = "",
  className = "",
  ...props // extra props like onChange, value, ref, etc.
}) => {
  const isTextArea = type === "textarea";

  return (
    <div className={`flex flex-col ${wrapperClassName}`}>
      <label htmlFor={name} className="font-bold text-sm mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {isTextArea ? (
        <textarea
          id={name}
          name={name}
          required={required}
          className={`border border-[#8B4513]/50 text-[#4A2C2A] text-sm rounded-lg focus:ring-[#8B4513] focus:border-[#8B4513] w-full flex justify-start items-start p-2.5 text-start resize-none ${className}`}
          {...props}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          className={`border border-[#8B4513]/50 text-[#4A2C2A] text-sm rounded-lg focus:ring-[#8B4513] focus:border-[#8B4513] w-full flex justify-start items-start p-2.5 text-start ${className}`}
          {...props}
        />
      )}
    </div>
  );
};

export default InputField;
