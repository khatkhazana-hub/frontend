// @ts-nocheck
import React, { useEffect, useId, useRef, useState } from "react";
import { X, Plus, File as FileIcon } from "lucide-react";
import ParchmentButton from "../InnerComponents/ParchmentButton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";

const FileInput = ({
  label,
  subtext,
  name,
  required = false,
  wrapperClassName = "",
  previewType = "image",
  fileCategory = "photograph", // "photograph" | "letter"
  resetTrigger,
  onFilesChange,
  ...props
}) => {
  const fileInputRef = useRef(null);
  const [previews, setPreviews] = useState([]); // blob URLs or null for non-image files
  const [filesData, setFilesData] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const MAX_FILES = 20;
  const MIN_FILES = 1;

  const uniqueId = useId();
  const paginationClass = `custom-pagination-${uniqueId}`;

  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/tiff",
  ];

  // guidance
  const guidanceText =
    previewType === "image"
      ? fileCategory === "photograph"
        ? "Allowed formats: JPEG, PNG, WebP, TIFF"
        : "Letters: any file type is allowed. Image previews shown when possible"
      : previewType === "audio"
      ? "Accepted audio: MP3, WAV, AAC"
      : subtext || "";

  const revokeAll = (urls) => {
    try {
      urls.forEach((u) => u && URL.revokeObjectURL(u));
    } catch {}
  };

  useEffect(() => {
    if (resetTrigger) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      revokeAll(previews);
      setPreviews([]);
      setFilesData([]);
      setFileNames([]);
      if (onFilesChange) onFilesChange([]);
      setErrorMessage("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTrigger]);

  // keep parent in sync with current file list
  useEffect(() => {
    onFilesChange?.(filesData);
  }, [filesData, onFilesChange]);

  // accept attr:
  // - photographs: strict image whitelist
  // - letters: ANY file type (omit accept attr)
  // - audio: audio/*
  let acceptAttr = props.accept;
  if (!acceptAttr) {
    if (previewType === "image") {
      acceptAttr =
        fileCategory === "photograph"
          ? "image/jpeg,image/png,image/webp,image/tiff"
          : undefined; // accept anything
    }
    if (previewType === "audio") acceptAttr = "audio/*";
  }

  const handleButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    let newPreviews = [...previews];
    let newNames = [...fileNames];
    let newFiles = [...filesData];
    let invalidFiles = [];

    setErrorMessage("");

    for (let file of files) {
      if (newPreviews.length >= MAX_FILES) {
        invalidFiles.push(
          `${file.name} - You can only upload up to ${MAX_FILES} files.`
        );
        break;
      }

      if (previewType === "image") {
        if (fileCategory === "photograph") {
          // photographs: strict formats ONLY
          if (!allowedImageTypes.includes(file.type)) {
            invalidFiles.push(
              `${file.name} - Unsupported format. Only JPEG, WebP, PNG, or TIFF allowed.`
            );
            continue;
          }
        }
        // letters: allow ANY file; preview images if possible, else show as a file chip
        let url = null;
        if (file.type.startsWith("image/")) {
          url = URL.createObjectURL(file);
        }
        newPreviews.push(url);
        newNames.push(file.name);
        newFiles.push(file);
      } else if (previewType === "audio") {
        if (!file.type.startsWith("audio/")) {
          invalidFiles.push(`${file.name} - Not an audio file`);
          continue;
        }
        const url = URL.createObjectURL(file);
        newPreviews.push(url);
        newNames.push(file.name);
        newFiles.push(file);
      }
    }

    setPreviews(newPreviews);
    setFileNames(newNames);
    setFilesData(newFiles);

    if (invalidFiles.length > 0) {
      const message =
        `${invalidFiles.length} file(s) have errors:\n\n` +
        invalidFiles.map((msg, i) => `${i + 1}. ${msg}`).join("\n");
      setErrorMessage(message);
    }
  };

  const handleRemoveFile = (index) => {
    const updatedPreviews = [...previews];
    const updatedNames = [...fileNames];
    const updatedFiles = [...filesData];

    const urlToRevoke = updatedPreviews[index];
    if (urlToRevoke) {
      try {
        URL.revokeObjectURL(urlToRevoke);
      } catch {}
    }

    updatedPreviews.splice(index, 1);
    updatedNames.splice(index, 1);
    updatedFiles.splice(index, 1);

    setPreviews(updatedPreviews);
    setFileNames(updatedNames);
    setFilesData(updatedFiles);
    onFilesChange?.(updatedFiles);

    if (updatedPreviews.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // helper to get file extension for chips
  const getExt = (name = "") => {
    const parts = name.split(".");
    return parts.length > 1 ? parts.pop().toUpperCase() : "FILE";
  };

  return (
    <div className={`flex flex-col w-full gap-3 ${wrapperClassName}`}>
      {label && (
        <label htmlFor={name} className="font-bold text-sm">
          {label} {required && <span className="text-red-600 font-normal text-xs">*</span>}
        </label>
      )}

      <input
        type="file"
        id={name}
        name={name}
        required={required && previews.length < MIN_FILES}
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        // omit accept entirely for letters (any type). React will drop undefined.
        accept={acceptAttr}
        multiple
        {...props}
      />

      {/* Upload button + guidance (when no files yet) */}
      {previews.length === 0 && (
        <>
          <ParchmentButton className="w-fit !text-[14px] !py-2" type="button" onClick={handleButtonClick}>
            Choose Files
          </ParchmentButton>
          {guidanceText && <p className="text-[11px] text-black">{guidanceText}</p>}
        </>
      )}

      {/* IMAGE / MIXED previews */}
      {previewType === "image" && previews.length > 0 && (
        <div className="w-full relative">
          {guidanceText && <p className="text-[11px] text-gray-500 -mt-1 mb-1">{guidanceText}</p>}
          <p className="text-[10px] text-gray-500 absolute -top-7 right-0 text-center">
            {previews.length} / {MAX_FILES} Files
          </p>

          <Swiper
            modules={[Navigation, Pagination]}
            pagination={{ clickable: true, el: `.${paginationClass}` }}
            spaceBetween={6}
            slidesPerView={5}
            className="mySwiper"
          >
            {previews.map((p, i) => (
              <SwiperSlide key={i} className="!w-auto">
                {p ? (
                  // image preview
                  <div className="relative w-16 h-16">
                    <img src={p} alt={`Preview ${i}`} className="w-full h-full border object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(i)}
                      className="absolute -top-1 -right-1 bg-black/60 hover:bg-black text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  // non-image chip
                  <div className="relative w-32 h-16 border rounded-md px-2 py-1 flex items-center gap-2">
                    <FileIcon size={16} />
                    <span className="text-[11px] truncate">{fileNames[i]}</span>
                    <span className="ml-auto text-[10px] px-1 py-0.5 border rounded">{getExt(fileNames[i])}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(i)}
                      className="absolute -top-1 -right-1 bg-black/60 hover:bg-black text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </SwiperSlide>
            ))}

            {previews.length < MAX_FILES && (
              <SwiperSlide className="!w-auto">
                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="w-10 h-10 ml-1 mt-2 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md cursor-pointer"
                >
                  <Plus size={16} className="text-gray-600" />
                </button>
              </SwiperSlide>
            )}
          </Swiper>

          <div className={`${paginationClass} custom-pagination mt-1 space-x-1 flex justify-center`} />
        </div>
      )}

      {/* AUDIO previews */}
      {previewType === "audio" && previews.length > 0 && (
        <div className="flex flex-col gap-2">
          {guidanceText && <p className="text-[11px] text-gray-500 -mt-1">{guidanceText}</p>}
          {previews.map((p, i) => (
            <div key={i} className="relative flex items-center gap-2">
              <audio controls src={p} className="w-full"></audio>
              <button
                type="button"
                onClick={() => handleRemoveFile(i)}
                className="absolute -top-1 -right-1 bg-black/60 hover:bg-black text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {errorMessage ? (
        <div className="text-xs text-red-500 whitespace-pre-line">{errorMessage}</div>
      ) : null}
    </div>
  );
};

export default FileInput;
