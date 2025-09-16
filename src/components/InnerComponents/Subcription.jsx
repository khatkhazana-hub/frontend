import React from "react";
import HeadingDesc from "./HeadingDesc";
import ParchmentButton from "./ParchmentButton";

const Subcription = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <HeadingDesc
        headingClassName="text-[40px]"
        heading="Treasures from History?"
        description="A handpicked Lorem Ipsum delivered to your inbox every month."
      />
      <div className="flex flex-col md:flex-row justify-center items-center gap-5">
        <input
          type="email"
          placeholder="Your email address"
          className="
              px-4 py-3 w-[300px] rounded-lg
              text-stone-900 placeholder-stone-700
              bg-cover bg-center border-[#6E4A27] border-2
              font-philosopher
            "
          style={{ backgroundImage: "url('/images/Email bg.webp')" }}
        />

        <ParchmentButton onClick={() => alert("Subscribed!")}>
          Submit
        </ParchmentButton>
      </div>
    </div>
  );
};

export default Subcription;
