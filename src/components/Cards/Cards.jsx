import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import LetterCard from "./LetterCard";

const cards = [
  {
    img: "/images/Card.webp",
    overlay: "/images/image4.webp",
    title: "Want more Lorem Ipsums?",
    description: "Join our archive mailing list and never miss an update.",
  },
  {
    img: "/images/Card.webp",
    overlay: "/images/image3.webp",
    title: "Exclusive Archive",
    description: "Discover unique Lorem Ipsums curated for you.",
  },
  {
    img: "/images/Card.webp",
    overlay: "/images/image2.webp",
    title: "Stay Updated",
    description: "Be the first to receive our new letter collections.",
  },
  {
    img: "/images/Card.webp",
    overlay: "/images/image1.webp",
    title: "More Insights",
    description: "Explore the untold stories in our collection.",
  },
];

const RelatedCards = () => {
  return (
    <div className="mt-14 w-full flex justify-center">
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
              <LetterCard
                to={`/letters/english/${i}`}
                overlay={card.overlay}
                title={card.title}
                description={card.description}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default RelatedCards;
