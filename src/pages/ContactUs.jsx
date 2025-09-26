import React from "react";
import HeadingDesc from "../components/InnerComponents/HeadingDesc";
import ParchmentButton from "@/components/InnerComponents/ParchmentButton";

export default function ContactUs() {
  return (
    <main
      className="min-h-screen flex flex-col justify-center items-center py-20 px-5"
      style={{
        fontFamily: "Philosopher",
        textTransform: "capitalize",
      }}
    >
      <HeadingDesc
        headingClassName="md:text-[40px] text-center"
        heading="Contact Us"
        containerClassName="mb-14"
        description={undefined}
      />

      <section className="flex flex-col-reverse xl:flex-row w-full max-w-5xl p-5 lg:p-10 overflow-hidden rounded-2xl shadow-2xl border border-[#8B4513]/30">
        {/* LEFT: How to Contact Us */}
        {/* <div
          className="relative flex flex-col justify-center items-center lg:py-8 lg:bg-contain bg-no-repeat bg-center w-full h-[700px] object-cover  md:w-[500px] "
          style={{ backgroundImage: "url('/images/Union.webp')" }}
        >
          <div className="w-fit text-left px-3 lg:px-8">
            <div className="flex flex-col ">
              <ContactDetail
                title="Get in Touch"
                description="We are here to assist you anytime. Reach out via email or phone."
                descriptionClass="text-2xl"
              />

              <EmailOrPhone
                label="General Email:"
                value="khatkhazana25@heritage.com"
                type="email"
              />

              <EmailOrPhone
                label="Email Brian Wilson directly:"
                value="khatkhazana@bwilson.com"
                type="email"
              />

              <EmailOrPhone
                label="Phone:"
                value="+92 300 1234567"
                type="phone"
              />
            </div>

            <div>
              <div className="font-semibold text-xl mb-2 ">By Snailmail:</div>
              <div className="text-2xl" style={{ fontFamily: "Ephesis" }}>
                Khat Khazana, c/o Zip
                <br />
                P.O. Box 1877
                <br />
                Khat Khazana, TX 9000-1847 US
              </div>
            </div>

           
            <div className="flex gap-4  mt-10 text-3xl">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500"
              >
                <RiInstagramFill />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-500"
              >
                <FaTwitter />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                <FaFacebook />
              </a>
            </div>
          </div>
        </div> */}

        {/* RIGHT: Form */}
        <form className="flex-1 p-6 xl:p-10 backdrop-blur-md text-left">
          {/* Top row */}
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Name" required />
            <Field label="Email" type="email" required />
          </div>

          {/* Row 2 */}
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <Field label="Phone" type="tel" />
            <Field label="Address" />
          </div>

          {/* Row 3 */}
          <div className="grid md:grid-cols-4 gap-3 mt-3">
            <Field label="City " />
            <Field label="State" />
            <Field label="Country" />
            <Field label="Zip" />
          </div>

          {/* Address */}
          {/* <div className="mt-3">
            <Field label="Address (Optional)" />
          </div> */}

          {/* Message */}
          <div className="mt-3">
            <label className="font-bold text-sm text-black mb-2">Message</label>
            <textarea
              rows={5}
              className="border border-[#8B4513]/50 mt-1 text-[#4A2C2A] text-sm rounded-lg focus:ring-[#8B4513] focus:border-[#8B4513] w-full flex justify-start items-start p-2.5 text-start"
            />
          </div>

          {/* Checkbox */}
          <label className="mt-3 flex items-start gap-2 text-[12.5px] text-black">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-black/40 accent-[#5a3c1e]"
            />
            <span>
              Yes, please put me on your email list
              <br />
              <em className="text-neutral-700">
                (We will never share your email address with anyone.)
              </em>
            </span>
          </label>

          {/* Button */}
          <div className="mt-4">
            <ParchmentButton className="w-full" type="submit">
              Send Message
            </ParchmentButton>
          </div>
        </form>
      </section>
    </main>
  );
}

/** Reusable input field */
function Field({ label, name, required, type = "text" }) {
  // sirf digits allow karne ka handler
  const handleTelInput = (e) => {
    e.target.value = e.target.value.replace(/\D/g, ""); // \D = non-digits
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="font-bold text-sm mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        // yahan filter lag raha hai
        onInput={type === "tel" ? handleTelInput : undefined}
        inputMode={type === "tel" ? "numeric" : undefined} // mobile numeric keyboard
        pattern={type === "tel" ? "[0-9]*" : undefined}    // browser ko bhi hint
        className="border border-[#8B4513]/50 text-[#4A2C2A] text-sm rounded-lg focus:ring-[#8B4513] focus:border-[#8B4513] w-full flex justify-start items-start p-2.5 text-start"
      />
    </div>
  );
}