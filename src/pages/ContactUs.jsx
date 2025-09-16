import React from "react";
import ContactDetail from "../components/InnerComponents/ContactDetail";
import EmailOrPhone from "../components/InnerComponents/EmailOrPhone";
import { FaFacebook, FaInstagramSquare, FaTwitter } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import HeadingDesc from "../components/InnerComponents/HeadingDesc";

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

      <section className="flex flex-col-reverse xl:flex-row w-full max-w-[1200px] rounded-[16px] p-5 lg:p-10 overflow-hidden shadow-2xl shadow-black/20 bg-[#FFE1B8]/50">
        {/* LEFT: How to Contact Us */}
        <div
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

            {/* Social Icons */}
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
        </div>

        {/* RIGHT: Form */}
        <form className="flex-1 p-6 xl:p-10 backdrop-blur-md text-left">
          {/* Top row */}
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Name" required />
            <Field label="Email" type="email" required />
          </div>

          {/* Row 2 */}
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <Field label="Country" />
            <Field label="Phone" type="tel" />
          </div>

          {/* Row 3 */}
          <div className="grid md:grid-cols-3 gap-3 mt-3">
            <Field label="City" required />
            <Field label="State" required />
            <Field label="Zip" />
          </div>

          {/* Address */}
          <div className="mt-3">
            <Field label="Address" required />
          </div>

          {/* Message */}
          <div className="mt-3">
            <label className="block text-[13px] font-medium text-black mb-1">
              Message
            </label>
            <textarea
              rows={5}
              className="w-full rounded-md bg-transparent border border-black/30 px-3 py-2 text-[13px] text-black placeholder-black/50 outline-none focus:ring-2 focus:ring-black/15 focus:border-black/50 shadow-sm"
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
            <button
              type="submit"
              className="w-full h-[50px] rounded-[10px] bg-[#5a3c1e] text-white text-[14px] px-[20px] py-[10px] shadow-md hover:bg-[#3f2b15] transition cursor-pointer"
            >
              Send Message
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

/** Reusable input field */
function Field({ label, required, type = "text" }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-black mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        type={type}
        required={required}
        className="w-full rounded-md bg-transparent border border-black/30 px-3 py-2 text-[13px] text-black placeholder-black/50 outline-none focus:ring-2 focus:ring-black/15 focus:border-black/50 shadow-sm"
      />
    </div>
  );
}
