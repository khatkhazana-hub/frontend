// @ts-nocheck
import React from "react";
import { useParams, Link } from "react-router-dom";

const cards = [
  { img: "/Card.jpg", overlay: "/Group 1000005552 (1).png", title: "Letter 1", description: "This is a historic English letter with details." },
  { img: "/Card.jpg", overlay: "/Group 1000005552 (2).png", title: "Letter 2", description: "This is a historic English letter with details." },
  { img: "/Card.jpg", overlay: "/Group 1000005552 (3).png", title: "Letter 3", description: "This is a historic English letter with details." },
  { img: "/Card.jpg", overlay: "/Group 1000005552 (4).png", title: "Letter 4", description: "This is a historic English letter with details." },
  { img: "/Card.jpg", overlay: "/Group 1000005552 (5).png", title: "Letter 5", description: "This is a historic English letter with details." },
  { img: "/Card.jpg", overlay: "/Group 1000005552 (6).png", title: "Letter 6", description: "This is a historic English letter with details." },
  { img: "/Card.jpg", overlay: "/Group 1000005552.png", title: "Letter 7", description: "This is a historic English letter with details." },
  { img: "/Card.jpg", overlay: "/image 5 (1).png", title: "Letter 8", description: "This is a historic English letter with details." },
  { img: "/Card.jpg", overlay: "/image 5.png", title: "Letter 9", description: "This is a historic English letter with details." },
];

function LetterDetail() {
  const { id } = useParams();
  const card = cards[id];

  if (!card) return <h2 className="text-center mt-20">Letter not found</h2>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-lg text-center">
        <img src={card.overlay} alt={card.title} className="w-full mb-4 rounded-lg" />
        <h1 className="text-2xl font-bold mb-2">{card.title}</h1>
        <p className="text-gray-600 italic">{card.description}</p>
        <Link
          to="/"
          className="mt-4 inline-block text-[#704214] font-semibold border border-[#704214] px-4 py-2 rounded-full hover:bg-[#704214] hover:text-white transition"
        >
          Back to Letters
        </Link>
      </div>
    </div>
  );
}

export default LetterDetail;
