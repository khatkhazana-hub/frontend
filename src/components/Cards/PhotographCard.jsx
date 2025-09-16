import React from "react";
import { Link, useNavigate } from "react-router-dom";

const PhotographCard = ({
  to = "#",
  overlayImg = "/images/sample.jpg", // overlay image prop
  title = "Want more Lorem Ipsums?", // heading prop
  description = "Join our archive mailing list and never miss an update.", // description prop
  watermarkText = "© Khat Khazana", // watermark text
  watermarkImg = "", // optional watermark image
}) => {
  const navigate = useNavigate();

  return (
    <Link to={to} className="mx-auto">
      <div
        onClick={() => navigate(to)}
        className="relative text-center overflow-hidden cursor-pointer w-[350px] h-[450px] rounded-[20px] p-[30px_10px] bg-[url('/images/Card.webp')] bg-cover bg-center"
      >
        {/* Frame */}
        <div className="absolute top-[30px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] z-30">
          <img
            src="/images/Vertical-Frame.webp"
            alt="Frame"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Overlay Image */}
        <div className="absolute z-20 top-[55px] left-[100px] w-[150px] h-[250px]">
          <img
            src={overlayImg}
            alt="Overlay"
            className="w-full h-full object-fill"
          />
        </div>

        <img
          src="/images/Vector.webp"
          alt="Watermark"
          className="
            absolute 
            top-14 left-[115px]
            w-[120px] h-[200px]   /* same size as overlay */
         /* adjust transparency */
            object-contain         /* cover full area */
            pointer-events-none select-none  z-40 opacity-20"
        />

        {/* Bottom Heading */}
        <div className="absolute z-30 text-left top-[345px] left-[23px] w-[290px]">
          <h2
            className="text-[24px] sm:text-base lg:text-xl font-semibold text-black mb-1 truncate w-full"
            style={{ fontFamily: "philosopher" }}
          >
            {title}
          </h2>
          <p
            className="font-ephesis text-[20px] leading-[100%] text-black line-clamp-2"
            style={{ fontFamily: "Ephesis" }}
          >
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PhotographCard;
