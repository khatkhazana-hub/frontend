// @ts-nocheck
import React from "react";
import { useNavigate } from "react-router-dom";
import Subcription from "@/components/InnerComponents/Subcription";

const buttonBgUrl = `${
  import.meta.env.VITE_FILE_BASE_URL
}/public/StaticImages/Card.webp`;

const Letters = () => {
  const navigate = useNavigate();

  const languages = [
    { title: "English" },
    { title: "Urdu" },
    { title: "Punjabi", subheading: "(Shahmukhi Script)" },
  ];

  const handleNavigate = (lang) => {
    const langKey = (lang || "").toLowerCase();
    navigate(`/letters/${langKey}`);
  };

  return (
    <main>
      <div
        className="flex items-center justify-center h-screen lg:-mt-5 bg-repeat bg-cover no-repeat bg-center"
        style={{
          backgroundImage: `url(${
            import.meta.env.VITE_FILE_BASE_URL
          }/public/StaticImages/bg-letter.webp)`,
        }}
      >
        <div className="flex flex-col items-center justify-center gap-8">
          <h2 className="text-5xl text-black mb-8 font-['Philosopher'] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            View letter
          </h2>

          <div className="flex flex-col lg:flex-row justify-center gap-4 sm:gap-6">
            {languages.map((lang) => (
              <button
                key={lang.title}
                onClick={() => handleNavigate(lang.title)}
                className="px-10 py-3 bg-cover bg-center flex flex-col items-center justify-center 
                         text-black text-3xl font-['Philosopher'] tracking-wider rounded-3xl shadow-lg 
                         transition-transform duration-300 cursor-pointer hover:scale-105"
                style={{ backgroundImage: `url(${buttonBgUrl})` }}
                aria-label={`View letters in ${lang.title}`}
              >
                <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  {lang.title}
                </span>
                {lang.subheading && (
                  <span className="text-base drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    {lang.subheading}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Letters;
