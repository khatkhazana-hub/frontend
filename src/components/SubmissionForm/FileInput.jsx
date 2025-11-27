// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { X, Plus, File as FileIcon } from "lucide-react";
import ParchmentButton from "../InnerComponents/ParchmentButton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";

// pdf.js worker setup (v4+)
import * as pdfjsLib from "pdfjs-dist";
import PdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?worker";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerPort = new PdfWorker();
}

const FileInput = ({
  label,
  subtext,
  name,
  required = false,
  wrapperClassName = "",
  previewType = "image",
  fileCategory = "photograph",
  resetTrigger,
  onFilesChange,
  ...props
}) => {
  const fileInputRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [filesData, setFilesData] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isConvertingPdf, setIsConvertingPdf] = useState(false);

  const MAX_FILES = 20;
  const MIN_FILES = 1;

  // ✅ safe CSS class (letters/numbers only)
  const [paginationClass] = useState(
    () => `custom-pagination-${Math.random().toString(36).slice(2, 9)}`
  );

  const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/tiff"];
  const allowedLetterTypes = [...allowedImageTypes, "application/pdf"];

  const guidanceText =
    previewType === "image"
      ? fileCategory === "photograph"
        ? "Allowed formats: JPEG, PNG, WebP, TIFF"
        : "Letters: images or PDF"
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
      setErrorMessage("");
      onFilesChange?.([]);
    }
  }, [resetTrigger]);

  useEffect(() => {
    onFilesChange?.(filesData);
  }, [filesData, onFilesChange]);

  let acceptAttr = props.accept;
  if (!acceptAttr) {
    if (previewType === "image") {
      acceptAttr =
        fileCategory === "photograph"
          ? "image/jpeg,image/png,image/webp,image/tiff"
          : "image/jpeg,image/png,image/webp,image/tiff,application/pdf";
    }
    if (previewType === "audio") acceptAttr = "audio/*";
  }

  const handleButtonClick = () => fileInputRef.current?.click();

  const convertPdfToImageFiles = async (file, maxPages = 999) => {
    try {
      setIsConvertingPdf(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const totalPages = Math.min(pdf.numPages, maxPages);
      const images = [];
      const baseName = file.name.replace(/\.pdf$/i, "") || "page";

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;

        const blob = await new Promise((res) =>
          canvas.toBlob(res, "image/png", 0.92)
        );

        const imageFile = new File([blob], `${baseName}-page${i}.png`, {
          type: "image/png",
        });

        images.push(imageFile);
      }

      return images;
    } catch (err) {
      console.error("PDF → Image error:", err);
      throw err;
    } finally {
      setIsConvertingPdf(false);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    let newPreviews = [...previews];
    let newNames = [...fileNames];
    let newFiles = [...filesData];
    let invalid = [];

    setErrorMessage("");

    for (let file of files) {
      if (newPreviews.length >= MAX_FILES) {
        invalid.push(`${file.name} - File limit reached (${MAX_FILES})`);
        break;
      }

      if (previewType === "image" && fileCategory === "photograph") {
        if (!allowedImageTypes.includes(file.type)) {
          invalid.push(`${file.name} - Unsupported format.`);
          continue;
        }

        const url = URL.createObjectURL(file);
        newPreviews.push(url);
        newNames.push(file.name);
        newFiles.push(file);
        continue;
      }

      if (previewType === "image" && fileCategory === "letter") {
        if (!allowedLetterTypes.includes(file.type)) {
          invalid.push(`${file.name} - Unsupported format.`);
          continue;
        }

        if (file.type === "application/pdf") {
          try {
            const slots = MAX_FILES - newPreviews.length;
            const imageFiles = await convertPdfToImageFiles(file, slots);

            imageFiles.forEach((img) => {
              const url = URL.createObjectURL(img);
              newPreviews.push(url);
              newNames.push(img.name);
              newFiles.push(img);
            });
          } catch (err) {
            invalid.push(`${file.name} - Failed to convert PDF.`);
          }
          continue;
        }

        const url = URL.createObjectURL(file);
        newPreviews.push(url);
        newNames.push(file.name);
        newFiles.push(file);
        continue;
      }

      if (previewType === "audio") {
        if (!file.type.startsWith("audio/")) {
          invalid.push(`${file.name} - Not an audio file`);
          continue;
        }
        const url = URL.createObjectURL(file);
        newPreviews.push(url);
        newNames.push(file.name);
        newFiles.push(file);
        continue;
      }
    }

    setPreviews(newPreviews);
    setFileNames(newNames);
    setFilesData(newFiles);

    if (invalid.length) {
      setErrorMessage(
        invalid.map((msg, i) => `${i + 1}. ${msg}`).join("\n")
      );
    }
  };

  const handleRemoveFile = (i) => {
    const previewsCopy = [...previews];
    const namesCopy = [...fileNames];
    const filesCopy = [...filesData];

    if (previewsCopy[i]) URL.revokeObjectURL(previewsCopy[i]);

    previewsCopy.splice(i, 1);
    namesCopy.splice(i, 1);
    filesCopy.splice(i, 1);

    setPreviews(previewsCopy);
    setFileNames(namesCopy);
    setFilesData(filesCopy);

    if (previewsCopy.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getExt = (name = "") => {
    const p = name.split(".");
    return p.length > 1 ? p.pop().toUpperCase() : "FILE";
  };

  return (
    <div className={`flex flex-col w-full gap-3 ${wrapperClassName}`}>
      {label && (
        <label className="font-bold text-sm">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept={acceptAttr}
        multiple
        required={required && previews.length < MIN_FILES}
        {...props}
      />

      {previews.length === 0 && (
        <>
          <ParchmentButton
            className="w-fit !text-[14px] !py-2"
            type="button"
            onClick={handleButtonClick}
          >
            Choose Files
          </ParchmentButton>

          {guidanceText && (
            <p className="text-[11px] text-black">{guidanceText}</p>
          )}

          {isConvertingPdf && (
            <p className="text-xs text-gray-600">Converting PDF…</p>
          )}
        </>
      )}

      {previewType === "image" && previews.length > 0 && (
        <div className="relative w-full">
          <p className="text-[10px] text-gray-500 absolute -top-5 right-0">
            {previews.length} / {MAX_FILES} Files
          </p>

          <Swiper
            modules={[Navigation, Pagination]}
            pagination={{ clickable: true, el: `.${paginationClass}` }}
            slidesPerView={5}
            spaceBetween={6}
          >
            {previews.map((p, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-16 h-16">
                  <img
                    src={p}
                    className="w-full h-full object-cover rounded border"
                    alt={`Preview ${i}`}
                  />
                  <button
                    onClick={() => handleRemoveFile(i)}
                    className="absolute -top-1 -right-1 bg-black/60 text-white p-1 rounded-full"
                    type="button"
                  >
                    <X size={12} />
                  </button>
                </div>
              </SwiperSlide>
            ))}

            {previews.length < MAX_FILES && (
              <SwiperSlide>
                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="w-10 h-10 mt-2 flex items-center justify-center border-2 border-dashed rounded"
                >
                  <Plus size={14} className="text-gray-500" />
                </button>
              </SwiperSlide>
            )}
          </Swiper>

          <div
            className={`${paginationClass} custom-pagination mt-1 flex justify-center`}
          />

          {isConvertingPdf && (
            <p className="text-[11px] text-gray-600 mt-1">
              Converting PDF pages…
            </p>
          )}
        </div>
      )}

      {previewType === "audio" &&
        previews.map((p, i) => (
          <div key={i} className="relative flex items-center">
            <audio controls src={p} className="w-full"></audio>
            <button
              onClick={() => handleRemoveFile(i)}
              className="absolute -top-1 -right-1 bg-black/60 text-white p-1 rounded-full"
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        ))}

      {errorMessage && (
        <div className="text-xs text-red-500 whitespace-pre-line">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default FileInput;
