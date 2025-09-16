import React, { useRef, useState } from "react";

const StaticAudioPlayer = ({ src, duration = "1:00" }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white rounded-full p-2 flex items-center shadow-md w-full max-w-xs">
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="bg-[#4A2C2A] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 focus:outline-none focus:ring-2 focus:ring-[#4A2C2A] flex-shrink-0"
        aria-label={isPlaying ? "Pause Audio" : "Play Audio"}
      >
        {isPlaying ? (
          // Pause icon
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" />
          </svg>
        ) : (
          // Play icon
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 16.5A1.5 1.5 0 0 1 4 15V5a1.5 1.5 0 0 1 2.25-1.3l8 5a1.5 1.5 0 0 1 0 2.6l-8 5A1.5 1.5 0 0 1 5.5 16.5z" />
          </svg>
        )}
      </button>

      {/* Audio Bars */}
      <div
        className="flex-grow flex items-center h-full gap-px px-2"
        aria-hidden="true"
      >
        {[
          4, 8, 6, 10, 7, 12, 8, 10, 6, 8, 5, 4, 3, 5, 6, 8, 10, 7, 5, 4, 8, 6,
          10, 7, 12, 8, 10, 7, 5, 3, 4, 6,
        ].map((h, i) => (
          <div
            key={i}
            className={`bg-gray-400 w-0.5 ${isPlaying ? "animate-pulse" : ""}`}
            style={{ height: `${h}px` }}
          ></div>
        ))}
      </div>

      {/* Duration */}
      <span className="text-sm text-[#4A2C2A] font-mono ml-3">{duration}</span>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={src} preload="auto" />
    </div>
  );
};

export default StaticAudioPlayer;
