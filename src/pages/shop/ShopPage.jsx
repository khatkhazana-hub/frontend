import React from "react";

const ShopPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] text-black">
      {/* Animated Text */}
      <h1 className="text-4xl md:text-7xl font-bold mb-10 animate-bounce"  style={{ fontFamily: "philosopher" }}>
        🚧 Coming Soon 🚧
      </h1>

      {/* Sub Text */}
      <p className="text-xl md:text-2xl text-center max-w-md"  style={{ fontFamily: "philosopher" }}>
        We’re working hard to bring something amazing here. Stay tuned!
      </p>

      {/* Loader (spinning circle) */}
      <div className="mt-10 w-16 h-16 border-4 border-[#6E4A27] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default ShopPage;
