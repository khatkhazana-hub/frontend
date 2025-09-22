// @ts-nocheck
import React, { useRef, useState } from "react";
import { X } from "lucide-react"; // ❌ icon (install lucide-react if not already)

const FileInput = ({
  label,
  subtext,
  name,
  required = false,
  className = "",
  wrapperClassName = "",
  previewType = "image", // "image" | "audio" | "none"
  ...props
}) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");

  // automatic accept based on previewType
  let acceptAttr = props.accept;
  if (!acceptAttr) {
    if (previewType === "image") acceptAttr = "image/*";
    if (previewType === "audio") acceptAttr = "audio/*";
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (props.onChange) props.onChange(e);
    const file = e.target.files[0];

    if (file) {
      if (
        (previewType === "image" && file.type.startsWith("image/")) ||
        (previewType === "audio" && file.type.startsWith("audio/"))
      ) {
        const url = URL.createObjectURL(file);
        setPreview(url);
        setFileName(file.name);
      } else {
        alert(`Please upload a valid ${previewType} file.`);
        e.target.value = "";
        setPreview(null);
        setFileName("");
      }
    } else {
      setPreview(null);
      setFileName("");
    }
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPreview(null);
    setFileName("");
  };

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3 ${wrapperClassName}`}
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
          required={required && !preview}
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept={acceptAttr}
          {...props}
        />

        {/* Upload Button */}
        <button
          type="button"
          onClick={handleButtonClick}
          className={`bg-[#8B5E3C] whitespace-nowrap text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#A17A5D] transition-colors w-max ${className}`}
        >
          Choose File
        </button>

        {/* File Name */}
        {fileName && (
          <p className="text-xs text-gray-600 mt-1 truncate max-w-[200px]">
            {fileName}
          </p>
        )}

        {subtext && <p className="text-xs text-red-500 mt-2">{subtext}</p>}
      </div>

      {/* Preview with cross button */}
      {preview && previewType === "image" && (
        <div className="relative w-24 h-24">
          <img
            src={preview}
            alt="Preview"
            className="w-22 h-22 border object-cover rounded-md"
          />
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute top-0 right-0 bg-black/60 hover:bg-black text-white rounded-full p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {preview && previewType === "audio" && (
        <div className="relative inline-block">
          <audio controls className="mt-2 w-[200px]">
            <source src={preview} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute -top-2 -right-2 bg-black/60 hover:bg-black text-white rounded-full p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileInput;
