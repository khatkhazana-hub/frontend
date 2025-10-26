// @ts-nocheck
import React, { useEffect, useState, useCallback } from "react";
import ParchmentButton from "./ParchmentButton";
import PopupSubscritionModel from "@/pages/letters/PopupSubscritionModel";


const Subcription = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  // lock scroll + ESC to close when open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && closeModal();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeModal]);

  // form submit is just another trigger
  const handleSubmit = (e) => {
    e.preventDefault();
    openModal();
  };

  // when your popup succeeds, close the overlay
  const handleSubscribed = () => closeModal();

  return (
    <div
      className="flex justify-center items-center w-full relative bg-cover bg-center h-auto xl:py-8 py-16"
      style={{
        backgroundImage: `url(${import.meta.env.VITE_FILE_BASE_URL}/public/StaticImages/about-banner.webp)`,
      }}
    >
      <div className="flex flex-col justify-center items-center gap-5">
        <div className="lg:w-4xl max-w-5xl flex justify-center items-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-black capitalize md:leading-14 w-full z-50"
            style={{ fontFamily: "philosopher" }}
          >
            Subscribe for a Monthly Glimpse Into the Past - One Treasured Letter
            and Photograph, Shared with You Each Month.
          </h2>
          <img
            src="/images/letterBox.webp"
            alt="Logo"
            className="w-24 h-auto lg:-mt-10 lg:-mr-10 hidden lg:block"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center justify-center gap-10 z-50"
        >
          <img
            src="/images/LetterCard.webp"
            alt="Logo"
            className="w-fit h-40"
          />

          <div className="flex flex-col justify-center items-center gap-5 lg:mt-5">
            {/* make input the trigger */}
            <input
              type="email"
              placeholder="Your email address"
              readOnly
              onFocus={openModal}
              onClick={openModal}
              className="
                px-4 py-3 w-[350px] lg:w-[400px] md:w-[250px] rounded-lg
                text-stone-900 placeholder-stone-700
                bg-cover bg-center border-[#6E4A27] border-2
                cursor-pointer select-none
                font-philosopher
              "
              style={{
                backgroundImage: `url("${import.meta.env.VITE_FILE_BASE_URL}/public/StaticImages/Email.webp")`,
              }}
            />

            <ParchmentButton type="button" onClick={openModal}>
              Submit
            </ParchmentButton>
          </div>

          <img
            src="/images/logo.svg"
            alt="Logo"
            width={100}
            height={60}
            className="w-fit h-40 hidden md:block"
          />
        </form>
      </div>

      {/* inline overlay that wraps ONLY your PopupSubscritionModel */}
      {isOpen && (
        <div
          aria-modal="true"
          role="dialog"
          className="fixed inset-0 z-[999] flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
            aria-label="Close modal overlay"
          />
          <div className="relative z-10 w-[92%] max-w-md rounded-xl bg-[#FFE1B8] p-6 shadow-xl">
            <button
              onClick={closeModal}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-full px-3 py-1 text-sm text-stone-600 hover:bg-stone-100"
            >
              ✕
            </button>

            {/* your existing component, unchanged */}
            <PopupSubscritionModel onSubscribe={handleSubscribed} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Subcription;
