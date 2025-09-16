// @ts-nocheck
import React, { useRef, useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause } from "lucide-react";

const AudioPlayer = () => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Wavesurfer init
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#d9d9d9",
      progressColor: "#6E4A27",
      cursorColor: "#6E4A27",
      height: 50,
      barWidth: 3,
      responsive: true,
      backend: "WebAudio", // 👈 force WebAudio backend

    });

    // Load audio
       wavesurfer.current.load("/audio/Demo-Audio.mp3");

    // Events
    wavesurfer.current.on("ready", () => {
      setDuration(wavesurfer.current.getDuration());
    });

    wavesurfer.current.on("audioprocess", () => {
      setCurrentTime(wavesurfer.current.getCurrentTime());
    });

    wavesurfer.current.on("finish", () => {
      setIsPlaying(false);
      setCurrentTime(duration);
    });

    // Cleanup
    return () => wavesurfer.current.destroy();
  }, []);

  const togglePlay = () => {
    wavesurfer.current.playPause();
    setIsPlaying(wavesurfer.current.isPlaying());
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-md py-1 px-4 mb-8 bg-white/80 w-full">
      <div className="flex items-center space-x-3 w-full">
        {/* Play / Pause Button */}
        <button
          onClick={togglePlay}
          style={{ backgroundColor: "#6E4A27" }}
          className="text-white rounded-full p-2 shadow-md hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Waveform */}
        <div ref={waveformRef} className="flex-1 h-[50px]" />

        {/* Time */}
        <div className="text-[11px] text-gray-700 ml-2 w-14 text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
