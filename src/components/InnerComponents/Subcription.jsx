// @ts-nocheck
import React, { useState } from "react";
import ParchmentButton from "./ParchmentButton";

const Subcription = () => {
  // state to store email input
  const [email, setEmail] = useState("");

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault(); // stop page reload
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    // here you can add API call logic to actually send the email
    alert(`Your email (${email}) has been sent successfully!`);
    setEmail(""); // clear input field
  };

  return (
    <div className="flex justify-center items-end w-full relative mt-32 mb-20">
      <img src="/images/InkPot.webp" alt="Logo" className="absolute -left-20 lg:-left-32 w-fit h-fit opacity-50 lg:opacity-100" />

      <div className="flex flex-col justify-center items-center gap-10 ">
      
        <div className="max-w-5xl flex">
          <h2
            className={`text-2xl md:text-3xl font-bold text-black capitalize md:leading-14 z-50`}
            style={{ fontFamily: "philosopher" }}
          >
            Subscribe for a Monthly Glimpse Into the Past - One Treasured Letter
            and Photograph, Shared with You Each Month.
          </h2>
          <img
            src="/images/letterBox.webp"
            alt="Logo"
            className="absolute right-0 -top-5  w-fit h-50 opacity-50 lg:opacity-100"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center justify-center gap-10 z-50"
        >
          <img
            src="/images/LetterCard.webp"
            alt="Logo"
            className="w-fit h-40 "
          />

          <div className="flex flex-col  justify-center items-center gap-5 lg:mt-5">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
              px-4 py-3 w-[350px] lg:w-[400px] md:w-[250px]  rounded-lg
              text-stone-900 placeholder-stone-700
              bg-cover bg-center border-[#6E4A27] border-2
              font-philosopher
            "
              style={{ backgroundImage: "url('/images/Email bg.webp')" }}
            />

            <ParchmentButton type="submit">Submit</ParchmentButton>
          </div>

          <img
            src="/images/logo.svg"
            alt="Logo"
            width={100}
            height={60}
            className="w-fit h-40 "
          />
        </form>
      </div>
    </div>
  );
};

export default Subcription;
