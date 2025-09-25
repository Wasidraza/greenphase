import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import logo from "../../public/logo-2.png";
import Chat from "./Chat";

export default function Footer() {
  return (
    <>
      <footer className="w-full text-white bg-gray-900">
        <div className="flex flex-col justify-between px-4 py-10 mx-auto space-y-8 sm:px-6 lg:px-8 md:flex-row md:space-y-0">
          {/* Column 1 */}
          <div className="md:w-1/4">
            <h3 className="mb-4 text-xl font-bold">
              <Image src={logo} alt="Logo" width={50} height={50} />
            </h3>
            <p className="text-gray-400">
              At Green Phase, our vision is to redefine mobility through
              sustainability and innovation.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="mb-4 text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/product/smart-home-charger" className="hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold">Policy Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/privacy-policy" className="hover:text-white">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-2">
            <h3 className="mb-4 text-xl font-bold">Contact Us</h3>
            <p className="flex gap-2 text-gray-400">
              <MapPin /> kalindi Kunj, Okhla ,New Delhi -110025
            </p>
            <p className="flex gap-2 text-gray-400">
              <Phone /> +91 7827488393
            </p>
            <p className="flex gap-2 text-gray-400">
              <Mail /> sale@greenphase.in
            </p>
          </div>
        </div>

        <div className="py-4 text-center text-gray-500 border-t border-gray-700">
          © {new Date().getFullYear()} greenphase. All rights reserved.
        </div>
      </footer>
      <Chat />
    </>
  );
}
