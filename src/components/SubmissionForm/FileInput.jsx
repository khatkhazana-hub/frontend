// @ts-nocheck
import React, { useEffect, useId, useRef, useState } from "react";
import { X, Plus } from "lucide-react";
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
  fileCategory = "photograph", // 👈 new prop
  resetTrigger,
  onFilesChange,
  ...props
}) => {
  const fileInputRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [filesData, setFilesData] = useState([]); // ✅ actual files for form submission
  const [fileNames, setFileNames] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ For showing error under subtext

  const MAX_FILES = 20;
  const MIN_FILES = 1;

  // ✅ Generate unique ID for each instance (for pagination)
  const uniqueId = useId();
  const paginationClass = `custom-pagination-${uniqueId}`;

  useEffect(() => {
    if (resetTrigger) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPreviews([]);
      setFilesData([]);
      setFileNames([]);
      if (onFilesChange) onFilesChange([]);
    }
  }, [resetTrigger]);

  let acceptAttr = props.accept;
  if (!acceptAttr) {
    if (previewType === "image") acceptAttr = "image/*";
    if (previewType === "audio") acceptAttr = "audio/mpeg,audio/wav,audio/aac"; // ✅ Only MP3, WAV, AAC
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    let newPreviews = [...previews];
    let newNames = [...fileNames];
    let newFiles = [...filesData];
    let invalidFiles = [];

    setErrorMessage(""); // clear previous error

    for (let file of files) {
      if (newPreviews.length >= MAX_FILES) {
        invalidFiles.push(
          `${file.name} → You can only upload up to ${MAX_FILES} files.`
        );
        break;
      }

      // ✅ Image Upload Validation
      if (previewType === "image") {
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
          invalidFiles.push(
            `${file.name} → Invalid file type (Only JPG, PNG allowed)`
          );
          continue;
        }

        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > 20) {
          invalidFiles.push(`${file.name} → File size exceeds 20 MB`);
          continue;
        }

        // ✅ Only check resolution for "photograph"
        if (fileCategory === "photograph") {
          const img = await new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = URL.createObjectURL(file);
          });

          if (img.width < 1200 || img.height < 1800) {
            invalidFiles.push(
              `${file.name} → Resolution too low (${img.width}x${img.height})`
            );
            continue;
          }
        }

        // ✅ Passed all checks
        const url = URL.createObjectURL(file);
        newPreviews.push(url);
        newNames.push(file.name);
        newFiles.push(file);
      }

      // ✅ Audio Upload Validation
      else if (previewType === "audio") {
        const allowedTypes = ["audio/mpeg", "audio/wav", "audio/aac"];
        if (!allowedTypes.includes(file.type)) {
          invalidFiles.push(
            `${file.name} → Invalid audio format (Only MP3, WAV, AAC allowed)`
          );
          continue;
        }

        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > 20) {
          invalidFiles.push(`${file.name} → File size exceeds 20 MB`);
          continue;
        }

        // ✅ Passed all checks
        const url = URL.createObjectURL(file);
        newPreviews.push(url);
        newNames.push(file.name);
        newFiles.push(file);
      }
    }

    // ✅ Update state
    setPreviews(newPreviews);
    setFileNames(newNames);
    setFilesData(newFiles);
    if (onFilesChange) onFilesChange(newFiles);

    // ✅ Show formatted error summary
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

    updatedPreviews.splice(index, 1);
    updatedNames.splice(index, 1);
    updatedFiles.splice(index, 1);

    setPreviews(updatedPreviews);
    setFileNames(updatedNames);
    setFilesData(updatedFiles);

    if (onFilesChange) onFilesChange(updatedFiles);

    if (updatedPreviews.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col w-full gap-3 ${wrapperClassName}`}>
      {label && (
        <label htmlFor={name} className="font-bold text-sm">
          {label}{" "}
          {required && (
            <span className="text-red-600 font-normal text-xs">*</span>
          )}
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
        accept={acceptAttr}
        multiple
        {...props}
      />

      {/* Agar abhi tak koi file nahi hai to choose file button */}
      {previews.length === 0 && (
        <ParchmentButton
          className="w-fit !text-[14px] !py-2"
          type="button"
          onClick={handleButtonClick}
        >
          Choose Files
        </ParchmentButton>
      )}

      {/* ✅ Image Previews with Swiper */}
      {previewType === "image" && previews.length > 0 && (
        <div className="w-full  relative cursor-pointer">
          <p className="text-[10px] text-gray-500 absolute -top-7 right-0 text-center">
            {previews.length} / {MAX_FILES} Images
          </p>
          <Swiper
            modules={[Navigation, Pagination]}
            // navigation
            pagination={{
              clickable: true,
              el: `.${paginationClass}`, // 👈 unique per instance
            }}
            spaceBetween={2}
            slidesPerView={5}
            className="mySwiper"
          >
            {previews.map((p, i) => (
              <SwiperSlide key={i} className="!w-auto">
                <div className="relative w-14 h-14">
                  <img
                    src={p}
                    alt={`Preview ${i}`}
                    className="w-full h-full border object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(i)}
                    className="absolute -top-1 -right-1 bg-black/60 hover:bg-black text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              </SwiperSlide>
            ))}

            {/* ✅ Plus Button — visible only if less than MAX_FILES */}
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
          {/* ✅ Unique Pagination Container */}
          <div
            className={`${paginationClass} custom-pagination mt-1 space-x-1 flex justify-center`}
          ></div>
        </div>
      )}

      {/* ✅ Audio Previews */}
      {previewType === "audio" && previews.length > 0 && (
        <div className="flex flex-col gap-2">
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

      {subtext || errorMessage ? (
        <div className="text-xs text-red-500 whitespace-pre-line">
          {errorMessage || subtext}
        </div>
      ) : null}
    </div>
  );
};

export default FileInput;
