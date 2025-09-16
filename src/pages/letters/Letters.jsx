// @ts-nocheck
import React from "react";
import { useNavigate } from "react-router-dom";
import buttonBgUrl from "/images/Card.webp";

const Latters = () => {
  const navigate = useNavigate();

  // navigate function
  const handleNavigate = (lang) => {
    if (lang === "English") navigate("/letters/english");
    if (lang === "Urdu") navigate("/letters/urdu");
    if (lang === "Punjabi") navigate("/letters/punjabi");
  };

  // languages array with optional subheading
  const languages = [
    { title: "English" },
    { title: "Urdu" },
    { title: "Punjabi", subheading: "(Shahmukhi Script)" },
  ];

  return (
    <main className="flex items-center justify-center h-[90vh]">
      <div className="flex flex-col items-center justify-center gap-8">
        <h2 className="text-5xl text-black mb-8 font-['Philosopher'] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          View letter by
        </h2>
        <div className="flex flex-col lg:flex-row justify-center gap-4 sm:gap-6">
          {languages.map((lang) => (
            <button
              key={lang.title}
              onClick={() => handleNavigate(lang.title)}
              className=" px-10 py-3 bg-cover bg-center flex flex-col items-center justify-center 
             text-black text-3xl font-['Philosopher'] tracking-wider rounded-3xl cursor-pointer
             shadow-lg transform hover:scale-105 transition-transform duration-300"
              style={{ backgroundImage: `url(${buttonBgUrl})` }}
            >
              <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                {lang.title}
              </span>
              {lang.subheading && (
                <span className="text-base  drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  {lang.subheading}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Latters;
