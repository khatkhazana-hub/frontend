import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import EmailOrPhone from "../components/InnerComponents/EmailOrPhone";
import { Link } from "react-router-dom";

export default function Footer() {
  const QUICK_LINKS = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const SUBMISSION_LINKS = [
    { label: "Submit a Letter", href: "/submission" },
    { label: "Submit a Photograph", href: "/submission" },
    { label: "Featured Letters & Photographs", href: "/featured" },
  ];

  const SUPPORT_INFO = [
    {
      label: "Email:",
      value: "info@longlostletters.com",
      href: "mailto:info@longlostletters.com",
    },
    {
      label: "Location:",
      value: "Plano, TX , USA",
      href: "https://maps.google.com/?q=Plano,TX,USA",
    },
  ];

  const SOCIAL_LINKS = [
    { icon: <FaLinkedinIn />, href: "#", label: "LinkedIn" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
    { icon: <FaTwitter />, href: "#", label: "Twitter" },
    { icon: <FaFacebookF />, href: "#", label: "Facebook" },
  ];

  return (
    <footer
      className="
        relative text-black bg-center 
        w-full min-h-[560px] 
        py-[60px] px-6
        mx-auto flex flex-col items-center
        overflow-hidden Padding-container 
      "
      style={{
        backgroundImage: "url('/images/updated_bg.webp')",
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
        backgroundPosition: "bottom", // neeche align
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* 🔹 Top: Logo + Brand */}
      <div className="w-fit mx-auto ">
        <Link to="/" className="flex items-center justify-center gap-5">
          <img
            src="/images/logo.svg"
            alt="Khat Khazana"
            className="h-[130px] w-fit object-fill cursor-pointer"
          />
        </Link>
      </div>

      {/* 🔹 Middle: Links & Info */}
      <div className="w-full xl:px-[80px] mx-auto mt-[30px] max-w-[1920px]">
        <div
          className="
            grid grid-cols-2 lg:grid-cols-4 
             text-left
            xl:gap-10 gap-5 py-[30px]
          "
        >
          {/* Quick Links */}
          <div className=" ">
            <h3 className="font-['Philosopher'] font-bold text-lg md:text-2xl mb-5">
              Quick Links
            </h3>
            <ul className="space-y-1 font-['Philosopher'] text-lg md:text-lg font-medium">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Submission */}
          <div className="">
            <h3 className="font-['Philosopher'] font-bold text-lg md:text-2xl mb-5">
              Submission
            </h3>
            <ul className="space-y-1 font-['Philosopher'] text-lg md:text-lg font-medium">
              {SUBMISSION_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-['Philosopher'] font-bold text-lg md:text-2xl mb-5">
              Contact Us
            </h3>
            <ul className="space-y-1 font-['Philosopher'] text-lg md:text-lg font-medium">
              {SUPPORT_INFO.map((info, i) => (
                <li key={i}>
                  {info.label}{" "}
                  {info.href ? (
                    <a
                      href={info.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${
                        info.href.startsWith("mailto:") ||
                        info.href.includes("maps")
                          ? "hover:underline target:_blank"
                          : ""
                      }`}
                    >
                      {info.value}
                    </a>
                  ) : (
                    info.value
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="">
            <h3 className="font-['Philosopher'] font-bold text-lg md:text-2xl mb-7">
              Social Links
            </h3>
            <div className="flex justify-start gap-4 text-xl md:text-2xl">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="hover:opacity-80"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Bottom: Copyright */}
      <div className="absolute bottom-5 text-center">
        <p className="text-sm ">
          © {new Date().getFullYear()} Long Lost Letters. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
