// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import buttonBgUrl from "/images/Card.webp";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Latters = () => {
  const navigate = useNavigate();
  const [availableLangs, setAvailableLangs] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/submissions`)
      .then((res) => res.json())
      .then((docs) => {
        const langs = [
          ...new Set(
            docs
              .filter((d) => d.status === "approved")
              .map((d) => d.letterLanguage?.toLowerCase())
          ),
        ];
        setAvailableLangs(langs);
      })
      .catch((err) => console.error("Error fetching languages:", err));
  }, []);

  const handleNavigate = (lang) => {
    const langKey = lang.toLowerCase();
    if (availableLangs.includes(langKey)) {
      navigate(`/letters/${langKey}`);
    }
  };

  // Always show these 3
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
          {languages.map((lang) => {
            const hasData = availableLangs.includes(lang.title.toLowerCase());

            return (
              <button
                key={lang.title}
                onClick={() => hasData && handleNavigate(lang.title)}
                className={`px-10 py-3 bg-cover bg-center flex flex-col items-center justify-center 
                  text-black text-3xl font-['Philosopher'] tracking-wider rounded-3xl shadow-lg 
                  transition-transform duration-300 
                  ${hasData ? "cursor-pointer hover:scale-105" : "cursor-not-allowed opacity-60"}`}
                style={{ backgroundImage: `url(${buttonBgUrl})` }}
              >
                <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  {lang.title}
                </span>
                {lang.subheading && (
                  <span className="text-base drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    {lang.subheading}
                  </span>
                )}

                {/* Show No Data message if not available */}
                {!hasData && (
                  <span className="text-sm mt-2 text-red-600 font-semibold">
                    No data found
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Latters;
