"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import logo from "../../public/full-logo.jpeg";
import { usePathname } from "next/navigation";

import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Linkedin,
  Instagram,
} from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
    const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 text-lg bg-white shadow-lg lg:shadow-none">
      <div className="max-w-[90%] mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <Image src={logo} alt="Logo" width={100} height={50} />
          </Link>

          {/* Desktop Links */}
          <div className="items-center justify-center flex-1 hidden space-x-8 md:flex">
            <Link
              href="/"
              className={`pb-1 ${
                pathname === "/" ? "border-b-2 border-green-600 text-green-600" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`pb-1 ${
                pathname === "/about" ? "border-b-2 border-green-600 text-green-600" : ""
              }`}
            >
              About
            </Link>

            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center pb-1 ${
                  pathname.startsWith("/products")
                    ? "border-b-2 border-green-600 text-green-600"
                    : ""
                }`}
              >
                Products{" "}
                {dropdownOpen ? (
                  <ChevronUp size={16} className="ml-1" />
                ) : (
                  <ChevronDown size={16} className="ml-1" />
                )}
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 w-48 bg-white rounded-md shadow-lg top-10">
                  <Link
                    href="/product/smart-home-charger"
                    className="block px-4 py-2 text-[15px] hover:bg-gray-100"
                  >
                 Smart Home Charger
                  </Link>
                  <Link
                    href="/product/smart-dc-charger"
                    className="block px-4 py-2 text-[15px] hover:bg-gray-100"
                  >
                   Smart DC Charger
                  </Link>
                  {/* <Link
                    href="/product/smart-car"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Product 3
                  </Link> */}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className={`pb-1 ${
                pathname === "/contact"
                  ? "border-b-2 border-green-600 text-green-600"
                  : ""
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Social Icons */}
          <div className="hidden space-x-4 md:flex">
            <Linkedin className="text-green-600 hover:cursor-pointer" />
            <Instagram className="text-green-600 hover:cursor-pointer" />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="bg-white shadow-md md:hidden">
          <Link href="/" className="block px-4 py-2 hover:bg-gray-100">
            Home
          </Link>
          <Link href="/about" className="block px-4 py-2 hover:bg-gray-100">
            About
          </Link>

          {/* Dropdown for Mobile */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100"
          >
            Products{" "}
            {dropdownOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          {dropdownOpen && (
            <div className="pl-6">
              <Link
                href="/products/1"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Product 1
              </Link>
              <Link
                href="/products/2"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Product 2
              </Link>
              <Link
                href="/products/3"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Product 3
              </Link>
              <Link
                href="/products/4"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Product 4
              </Link>
            </div>
          )}

          <Link
            href="/contact"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Contact
          </Link>

          <div className="flex px-4 py-3 space-x-4 border-t">
            <Linkedin className="text-green-600 hover:cursor-pointer" />
            <Instagram className="text-green-600 hover:cursor-pointer" />
          </div>
        </div>
      )}
    </nav>
  );
}
