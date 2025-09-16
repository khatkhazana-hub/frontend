import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import FeaturedCard from "./FeaturedCard";

const cards = [
  {
    overlay: "/images/About-1.webp",
    title: "Lorem Ipsum 1",
    description:
      "A glimpse into the past with rare documents and timeless stories.",
  },
  {
    overlay: "/images/About-2.webp",
    title: "Lorem Ipsum 2",
    description:
      "Rare and valuable find showcasing memories of forgotten eras.",
  },
  {
    overlay: "/images/About-3.webp",
    title: "Lorem Ipsum 3",
    description:
      "Preserving history and stories through beautifully kept letters.",
  },
  {
    overlay: "/images/About-1.webp",
    title: "Lorem Ipsum 4",
    description: "Discover unseen letters that reveal unique life experiences.",
  },
  {
    overlay: "/images/About-2.webp",
    title: "Lorem Ipsum 5",
    description:
      "Historic archives providing insight into the past’s narratives.",
  },
  {
    overlay: "/images/About-3.webp",
    title: "Lorem Ipsum 6",
    description:
      "Beautifully preserved memories and letters of historical value.",
  },
  {
    overlay: "/images/About-1.webp",
    title: "Lorem Ipsum 7",
    description:
      "Timeless correspondence capturing the heart of old generations.",
  },
  {
    overlay: "/images/About-2.webp",
    title: "Lorem Ipsum 8",
    description: "Rare letters connecting us to the voices of a bygone age.",
  },
  {
    overlay: "/images/About-3.webp",
    title: "Lorem Ipsum 9",
    description: "Stories written in ink revealing untold journeys of life.",
  },
  {
    overlay: "/images/About-1.webp",
    title: "Lorem Ipsum 10",
    description:
      "Preserved messages reflecting emotions and memories of the past.",
  },
  {
    overlay: "/images/About-2.webp",
    title: "Lorem Ipsum 11",
    description:
      "Letters that document moments of love, struggle, and history.",
  },
  {
    overlay: "/images/About-3.webp",
    title: "Lorem Ipsum 12",
    description: "Unlock the past through these rare handwritten treasures.",
  },
];

const FeaturedCardSlider = () => {
  return (
    <div className="flex justify-start">
      <div className="w-full max-w-[1270px]">
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            320: { slidesPerView: 1 }, // mobile
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 2.3 },
            1440: { slidesPerView: 3.2 },
          }}
        >
          {cards.map((card, i) => (
            <SwiperSlide key={i} className="flex justify-start">
              <FeaturedCard
                key={i}
                to={`/letters/english/${i}`}
                overlay={card.overlay} // ✅ current card ka overlay
                title={card.title || "Default Title"} // ✅ dynamic title agar ho
                description={card.description || "Default description"} // ✅ dynamic desc agar ho
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default FeaturedCardSlider;
