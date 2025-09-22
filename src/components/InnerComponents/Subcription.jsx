// @ts-nocheck
import React, { useState } from "react";
import HeadingDesc from "./HeadingDesc";
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
    <div className="flex flex-col justify-center items-center gap-10 w-full  py-10">
      <HeadingDesc
        headingClassName="text-[40px]"
        heading="Subscribe for a Monthly Glimpse?"
        description="Into the Past - One Treasured Letter and Photograph, Shared with You Each Month."
      />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-center justify-center gap-10"
      >
        <img src="/images/S2.webp" alt="Logo" className="w-fit h-40 " />

        <div className="flex flex-col  justify-center items-center gap-5">
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
  );
};

export default Subcription;
