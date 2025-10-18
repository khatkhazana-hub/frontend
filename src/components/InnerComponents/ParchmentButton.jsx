// @ts-nocheck
import React from "react";

function ParchmentButton({
  children = "",
  onClick,
  className = "",
  disabled = "",
  type = "button",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center",
        "px-4 py-3",
        "min-w-[100px] md:min-w-[80px]",
        "text-center",
        "text-lg md:text-xl font-semibold",
        "text-stone-900 drop-shadow",
        "cursor-pointer",
        "bg-center bg-no-repeat bg-cover",
        "rounded-lg shadow-md",
        "transition-transform duration-200 ease-out",
        "hover:scale-[1.02]",
        "active:scale-[0.98]",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "font-philosopher",
        "cursor-pointer",
        className,
      ].join(" ")}
      style={{
        backgroundImage: `url(${import.meta.env.VITE_FILE_BASE_URL}/public/StaticImages/Card.webp)`,
      }}
    >
      {children}
    </button>
  );
}

export default ParchmentButton;
