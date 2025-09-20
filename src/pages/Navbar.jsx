// @ts-nocheck
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const linkBase =
  "text-black text-base tracking-[0.2px] hover:underline underline-offset-4 whitespace-nowrap";
const linkActive = "font-bold underline";

export default function Navbar() {
  const navClass = ({ isActive }) =>
    `${linkBase} ${isActive ? linkActive : ""}`;

  // Nav links
  const NAV_LINKS = [
    { to: "/about", label: "About" },
    { to: "/letters", label: "Letters" },
    { to: "/photographs", label: "Photographs" },
    { to: "/featured", label: "Featured letters & Photographs" },
    { to: "/submission", label: "Submission" },
    // { to: "/shop", label: "Shop" },
  ];

  // Mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-[999] bg-no-repeat bg-top"
      style={{
        fontFamily: "Philosopher, sans-serif",
        backgroundImage: "url('/images/navbar-bg.webp')",
        backgroundSize: "100% 100%",
      }}
    >
      <div className="mx-auto w-full px-5 xl:px-20 py-2 flex items-center justify-between z-50">
        {/* LEFT: Logo */}
        <Link
          to="/"
          className="flex items-center mt-[10px] min-w-0"
          aria-label="Home"
        >
          <img
            src="/images/logo.svg"
            alt="Logo"
            className="h-[60px] w-fit object-fill"
          />
        </Link>

        {/* CENTER: Desktop nav */}
        <nav
          className="hidden xl:flex items-center justify-center gap-x-6 flex-1"
          aria-label="Main"
        >
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT: Contact Us Button + Hamburger */}
        <div className="flex items-center gap-3">
          {/* Contact Us Button */}
          <Link
            to="/contact"
            className="hidden  bg-[#6E4A27] text-white font-bold px-7 leading-8 py-2 xl:flex justify-center items-center text-center rounded-full transition"
          >
            Contact Us
          </Link>

          {/* Hamburger (mobile right) */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
            className="xl:hidden relative w-8 h-8 flex items-center justify-center border-black/10 text-black"
          >
            <span
              className={`absolute block h-[2px] w-5 bg-current transition-transform duration-300 ${
                menuOpen ? "translate-y-0 rotate-45" : "-translate-y-2"
              }`}
            />
            <span
              className={`absolute block h-[2px] w-5 bg-current transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute block h-[2px] w-5 bg-current transition-transform duration-300 ${
                menuOpen ? "translate-y-0 -rotate-45" : "translate-y-2"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu (slide in from left) */}
      <div
        id="mobile-nav"
        className={`xl:hidden fixed top-0 left-0 h-full rounded-br-4xl rounded-tr-4xl w-[80%] bg-[#F7DBB9] shadow-2xl shadow-black/50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        {/* Logo Section */}
        <div className="flex justify-center items-center mt-6 mb-4">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img
              src="/images/logo.svg"
              alt="Logo"
              className="h-[60px] w-fit cursor-pointer"
            />
          </Link>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-500 mx-4 mb-4"></div>

        {/* Nav Links */}
        <div className="flex flex-col gap-2 p-4">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md ${linkBase} ${
                  isActive ? linkActive : ""
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          {/* Contact Us button in mobile menu */}
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-4 block text-center bg-[#6E4A27] text-white font-medium px-7 leading-8 py-1  rounded-full"
          >
            Contact Us
          </Link>
          <Link
            to="/contact"
            className="hidden  bg-[#6E4A27] text-white font-bold px-7 leading-8 py-2 xl:flex justify-center items-center text-center rounded-full transition"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
}
