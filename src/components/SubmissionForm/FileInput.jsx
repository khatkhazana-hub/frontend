// @ts-nocheck
import React, { useRef, useState } from "react";

const FileInput = ({
  label,
  subtext,
  name,
  required = false,
  className = "",
  wrapperClassName = "",
  previewType = "image", // 👈 "image" | "audio" | "none"
  ...props // accept, multiple, register, onChange etc.
}) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (props.onChange) props.onChange(e); // parent onChange
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  return (
    <div
      className={`flex justify-between items-center w-full ${wrapperClassName}`}
    >
      <div className="flex flex-col">
        {label && (
          <label htmlFor={name} className="font-bold text-sm mb-2 block">
            {label} {required && <span className="text-red-600">*</span>}
          </label>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          id={name}
          name={name}
          required={required}
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          {...props} // accept/multiple/register
        />

        {/* Custom styled button */}
        <button
          type="button"
          onClick={handleButtonClick}
          className={`bg-[#8B5E3C] whitespace-nowrap text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#A17A5D] transition-colors w-max ${className}`}
        >
          Choose File
        </button>

        {subtext && <p className="text-xs text-red-500 mt-2">{subtext}</p>}
      </div>
      {/* Preview */}
      {preview && previewType === "image" && (
        <img
          src={preview}
          alt="Preview"
          className="ml-1 w-22 h-22 object-cover rounded-md"
        />
      )}
      {preview && previewType === "audio" && (
        <audio controls className="mt-2 w-[50%]">
          <source src={preview} type="audio/mpeg" className="ml-3 w-52 h-32" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default FileInput;
