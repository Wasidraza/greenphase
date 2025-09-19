"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import logo from "../../public/full-logo.jpeg";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, setUser, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

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
    <nav className="fixed top-0 left-0 right-0 z-50 text-lg bg-white shadow">
      <div className="max-w-full px-3 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <div className="relative w-32 h-16">
              <Image src={logo} alt="Logo" fill className="object-contain" />
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="items-center justify-center flex-1 hidden space-x-8 md:flex">
            <Link
              href="/"
              className={`pb-1 ${
                pathname === "/"
                  ? "border-b-2 border-green-600 text-green-600"
                  : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`pb-1 ${
                pathname === "/about"
                  ? "border-b-2 border-green-600 text-green-600"
                  : ""
              }`}
            >
              About
            </Link>

            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center pb-1 ${
                  pathname.startsWith("/product")
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
                <div
                  ref={dropdownRef}
                  className="absolute left-0 w-48 bg-white rounded-md shadow-lg top-10"
                >
                  <Link
                    href="/product/smart-home-charger"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-[15px] hover:bg-gray-100"
                  >
                    Smart Home Charger
                  </Link>
                  <Link
                    href="/product/smart-dc-charger"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-[15px] hover:bg-gray-100"
                  >
                    Smart DC Charger
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/blog"
              className={`pb-1 ${
                pathname === "/blog"
                  ? "border-b-2 border-green-600 text-green-600"
                  : ""
              }`}
            >
              Blog
            </Link>
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

          {/* ✅ User Section Desktop */}
          <div className="items-center hidden space-x-4 md:flex">
            {user ? (
              <>
                <Link
                  href="/product/smart-home-charger"
                  className="px-4 py-2 text-white bg-black rounded-lg"
                >
                  Shop
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-green-600 border border-green-600 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-white bg-black rounded-lg"
                >
                  Signup
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 text-green-600 border border-green-600 rounded-lg"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Mobile Links */}
      {menuOpen && (
        <div className="flex flex-col p-4 space-y-2 bg-white shadow-md md:hidden">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 rounded-md hover:bg-gray-100"
          >
            About
          </Link>

          {/* Dropdown Mobile */}
          <div className="relative w-full">
            <button
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              className="flex items-center justify-between w-full px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Products
              {mobileDropdownOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {mobileDropdownOpen && (
              <div className="flex flex-col mt-1 ml-4 space-y-1 bg-white rounded-md shadow">
                <Link
                  href="/product/smart-home-charger"
                  onClick={() => {
                    setMobileDropdownOpen(false);
                    setMenuOpen(false);
                  }}
                  className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                >
                  Smart Home Charger
                </Link>
                <Link
                  href="/product/smart-dc-charger"
                  onClick={() => {
                    setMobileDropdownOpen(false);
                    setMenuOpen(false);
                  }}
                  className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                >
                  Smart DC Charger
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Contact
          </Link>

          {/* ✅ User Section Mobile */}
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-white bg-black rounded-lg"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block px-4 py-2 text-green-600 border border-green-600 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-white bg-green-600 rounded-lg"
              >
                Signup
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-green-600 border border-green-600 rounded-lg"
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
