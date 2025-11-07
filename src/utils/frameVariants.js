// @ts-nocheck
const baseStaticUrl = () => {
  const raw = import.meta.env.VITE_FILE_BASE_URL || window.location.origin;
  return String(raw).replace(/\/+$/, "");
};

export const staticAsset = (name) => `${baseStaticUrl()}/public/StaticImages/${name}`;

export const computeOrientation = (width = 0, height = 0) => {
  if (!width || !height) return "portrait";
  const ratio = width / height;
  if (!Number.isFinite(ratio)) return "portrait";
  if (Math.abs(ratio - 1) <= 0.05) return "square";
  return ratio > 1 ? "landscape" : "portrait";
};

export const FRAME_VARIANTS = {
  photographCard: {
    landscape: {
      frameSrc: staticAsset("Horizantal-Frame.webp"),
      frameBoxClass: "w-[285px] h-[205px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[34px] w-[232px] h-[138px] overflow-hidden rounded-[10px]",
      wrapperClass:
        "absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center z-10",
      watermarkClass:
        "absolute top-[58px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] opacity-20 object-contain pointer-events-none select-none z-20",
    },
    portrait: {
      frameSrc: staticAsset("Vertical-Frame.webp"),
      frameBoxClass: "w-[280px] h-[280px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[30px] w-[180px] h-[240px] overflow-hidden rounded-[6px]",
      wrapperClass: "relative flex justify-center z-10 pt-[25px]",
      watermarkClass:
        "absolute top-[80px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] opacity-20 object-contain pointer-events-none select-none z-20",
    },
    square: {
     frameSrc: staticAsset("onebyone.png"),
      frameBoxClass: "w-[280px] h-[280px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[26px] w-[224px] h-[224px] overflow-hidden ",
      wrapperClass: "relative flex justify-center z-10 pt-[18px]",
      watermarkClass:
        "absolute top-[92px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] opacity-20 object-contain pointer-events-none select-none z-20",
    },
  },

  photographFeaturedCard: {
    landscape: {
      frameBoxClass: "w-[285px] h-[205px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[34px] w-[232px] h-[138px] overflow-hidden rounded-[10px]",
      watermarkClass:
        "absolute top-[58px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] opacity-20 object-contain pointer-events-none select-none z-20",
      frameSrc: staticAsset("Horizantal-Frame.webp"),
    },
    portrait: {
      frameBoxClass: "w-[280px] h-[280px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[30px] w-[180px] h-[240px] overflow-hidden rounded-[6px]",
      watermarkClass:
        "absolute top-[80px] left-1/2 -translate-x-1/2 w-[100px] h-[100px] opacity-20 object-contain pointer-events-none select-none z-20",
      frameSrc: staticAsset("Vertical-Frame.webp"),
    },
    square: {
      frameBoxClass: "w-[260px] h-[260px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[30px] w-[224px] h-[224px] overflow-hidden ",
      watermarkClass:
        "absolute top-[82px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] opacity-20 object-contain pointer-events-none select-none z-20",
     frameSrc: staticAsset("onebyone.png"),
    },
  },

  relatedSidebar: {
    landscape: {
      frameSrc: staticAsset("Horizantal-Frame.webp"),
      frameBoxClass: "w-[276px] h-[207px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[34px] w-[232px] h-[138px] overflow-hidden rounded-[10px]",
      watermarkClass:
        "absolute top-[58px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] opacity-20 object-contain pointer-events-none select-none z-20",
    },
    portrait: {
      frameSrc: staticAsset("Vertical-Frame.webp"),
      frameBoxClass: "w-[280px] h-[280px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[30px] w-[180px] h-[240px] overflow-hidden rounded-[6px]",
      watermarkClass:
        "absolute top-[80px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] opacity-20 object-contain pointer-events-none select-none z-20",
    },
    square: {
     frameSrc: staticAsset("onebyone.png"),
      frameBoxClass: "w-[260px] h-[260px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[30px] w-[212px] h-[212px] overflow-hidden ",
      watermarkClass:
        "absolute top-[82px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] opacity-20 object-contain pointer-events-none select-none z-20",
    },
  },

  featuredCarousel: {
    landscape: {
      frameSrc: staticAsset("Horizantal-Frame.webp"),
      frameBoxClass: "w-[276px] h-[207px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[34px] w-[232px] h-[138px] overflow-hidden rounded-[10px]",
      watermarkClass:
        "absolute top-[58px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] opacity-20 object-contain pointer-events-none select-none z-20",
    },
    portrait: {
      frameSrc: staticAsset("Vertical-Frame.webp"),
      frameBoxClass: "w-[280px] h-[280px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[30px] w-[180px] h-[240px] overflow-hidden rounded-[6px]",
      watermarkClass:
        "absolute top-[80px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] opacity-20 object-contain pointer-events-none select-none z-20",
    },
    square: {
     frameSrc: staticAsset("onebyone.png"),
      frameBoxClass: "w-[260px] h-[260px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[30px] w-[212px] h-[212px] overflow-hidden ",
      watermarkClass:
        "absolute top-[82px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] opacity-20 object-contain pointer-events-none select-none z-20",
    },
  },

  thumbnails: {
    landscape: {
      frameSrc: staticAsset("Horizantal-Frame.webp"),
      frameBoxClass: "absolute left-1/2 -translate-x-1/2 w-[300px] h-[230px] z-30 pointer-events-none",
      windowWrapperClass:
        "relative flex items-center justify-center w-[240px] h-[160px] rounded-[10px] overflow-hidden",
      imageClass: "w-full h-full object-contain",
      watermarkClass:
        "absolute top-14 left-1/2 -translate-x-1/2 w-[80px] h-[80px] opacity-20 object-contain pointer-events-none select-none",
    },
    portrait: {
      frameSrc: staticAsset("Vertical-Frame.webp"),
      frameBoxClass: "absolute left-1/2 -translate-x-1/2 w-[300px] h-[230px] z-30 pointer-events-none",
      windowWrapperClass:
        "relative flex items-center justify-center w-[130px] h-[190px] rounded-[6px] overflow-hidden",
      imageClass: "w-full h-full object-cover group-hover:drop-shadow-xl transition-all duration-300",
      watermarkClass:
        "absolute top-14 left-1/2 -translate-x-1/2 w-[80px] h-[80px] opacity-20 object-contain pointer-events-none select-none",
    },
    square: {
     frameSrc: staticAsset("onebyone.png"),
      frameBoxClass: "absolute left-1/2 -translate-x-1/2 w-[280px] h-[220px] z-30 pointer-events-none",
      windowWrapperClass:
        "relative flex items-center justify-center w-[200px] h-[200px]  overflow-hidden",
      imageClass: "w-full h-full object-contain",
      watermarkClass:
        "absolute top-14 left-1/2 -translate-x-1/2 w-[80px] h-[80px] opacity-20 object-contain pointer-events-none select-none",
    },
  },

  mainSlider: {
    landscape: {
      frameBoxClass: "w-[320px] lg:w-[420px] h-[260px] lg:h-[320px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[45px] lg:top-[55px] w-[270px] lg:w-[340px] h-[175px] lg:h-[215px] overflow-hidden ",
      watermarkClass:
        "absolute top-[75px] lg:top-[95px] left-1/2 -translate-x-1/2 w-[110px] lg:w-[150px] h-[110px] lg:h-[150px] opacity-20 object-contain pointer-events-none select-none z-10",
      frameSrc: staticAsset("Horizantal-Frame.webp"),
    },
    portrait: {
      frameBoxClass: "w-[320px] lg:w-[420px] h-[420px] lg:h-[520px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[45px] lg:top-[55px] w-[210px] lg:w-[270px] h-[360px] lg:h-[445px] overflow-hidden ",
      watermarkClass:
        "absolute top-[120px] lg:top-[150px] left-1/2 -translate-x-1/2 w-[110px] lg:w-[150px] h-[110px] lg:h-[150px] opacity-20 object-contain pointer-events-none select-none z-10",
      frameSrc: staticAsset("Vertical-Frame.webp"),
    },
    square: {
      frameBoxClass: "w-[320px] lg:w-[420px] h-[320px] lg:h-[420px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[48px] lg:top-[58px] w-[260px] lg:w-[340px] h-[260px] lg:h-[340px] overflow-hidden rounded-[14px]",
      watermarkClass:
        "absolute top-[110px] lg:top-[140px] left-1/2 -translate-x-1/2 w-[110px] lg:w-[150px] h-[110px] lg:h-[150px] opacity-20 object-contain pointer-events-none select-none z-10",
     frameSrc: staticAsset("onebyone.png"),
    },
  },

  featuredBundle: {
    landscape: {
      frameBoxClass: "w-[312px] h-[228px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[38px] w-[256px] h-[154px] overflow-hidden ",
      watermarkClass:
        "absolute top-[70px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] opacity-20 object-contain pointer-events-none select-none z-20",
      frameSrc: staticAsset("Horizantal-Frame.webp"),
      cardAspectClass: "aspect-[10/7]",
      cardPaddingClass: "p-5 sm:p-6",
      badgeOffsetClass: "right-3 top-3 sm:right-5 sm:top-5",
    },
    portrait: {
      frameBoxClass: "w-[280px] h-[280px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[30px] w-[180px] h-[240px] overflow-hidden rounded-[6px]",
      watermarkClass:
        "absolute top-[80px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] opacity-20 object-contain pointer-events-none select-none z-20",
      frameSrc: staticAsset("Vertical-Frame.webp"),
      cardAspectClass: "aspect-[7/8]",
      cardPaddingClass: "p-6 sm:p-8",
      badgeOffsetClass: "right-2 top-2 sm:right-4 sm:top-4",
    },
    square: {
      frameBoxClass: "w-[260px] h-[260px]",
      windowClass:
        "absolute left-1/2 -translate-x-1/2 top-[30px] w-[212px] h-[212px] overflow-hidden ",
      watermarkClass:
        "absolute top-[80px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] opacity-20 object-contain pointer-events-none select-none z-20",
     frameSrc: staticAsset("onebyone.png"),
      cardAspectClass: "aspect-square",
      cardPaddingClass: "p-6 sm:p-7",
      badgeOffsetClass: "right-3 top-3 sm:right-4 sm:top-4",
    },
  },
};
