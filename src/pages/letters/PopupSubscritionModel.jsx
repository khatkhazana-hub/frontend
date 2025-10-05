import ParchmentButton from "@/components/InnerComponents/ParchmentButton";
import React, { useState } from "react";

const PopupSubscritionModel = ({ onSubscribe }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }
    setLoading(true);

    try {
      // local storage flag
      localStorage.setItem("isSubscribed", "true");

      // callback if passed
      onSubscribe && onSubscribe();

      // ✅ success alert
      alert("Your email has been successfully submitted.");

      // optional: reset form
      setEmail("");
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-5 w-full"
    >
      <img
        src="/images/logo.svg"
        alt="Watermark"
        className="w-fit h-[200px] object-cover"
      />

      <h2 className="text-xl font-bold text-center text-[#6E4A27]">
        Subscribe to receive one featured Letter/Photograph delivered to your
        inbox every month.
      </h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="border border-[#6E4A27] w-full p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6E4A27]"
      />

      <ParchmentButton className="w-full" type="submit" disabled={loading}>
        {loading ? "Subscribing..." : "Subscribe"}
      </ParchmentButton>
    </form>
  );
};

export default PopupSubscritionModel;
