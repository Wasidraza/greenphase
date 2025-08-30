import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import aboutImg from "../../public/about.webp";

function Mission() {
  return (
    <>
      <section className="flex flex-col-reverse items-center justify-between gap-12 px-6 mx-auto mb-8 bg-white lg:mt-18 lg:px-20 lg:flex-row">
        
          {/* Left Side (Text) */}
          <div className="flex-1 lg:text-left">
            <h2 className="pb-3 text-2xl leading-tight">OUR MISSION</h2>
            <p className="mb-2 text-lg text-gray-600">
              At Green Phase, our vision is to redefine mobility through
              sustainability and innovation. We believe the future of
              transportation must be clean, reliable, and accessible for all. By
              providing advanced, eco-friendly EV charging solutions, we aim to
              empower individuals, businesses, and communities to embrace
              electric mobility with confidence. Our goal is to reduce carbon
              emissions, promote renewable energy integration, and build
              infrastructure that supports a greener planet. With every charger
              we install, we move closer to a world where sustainable mobility
              is not just a choice, but the foundation of progress and everyday
              life.
            </p>
          </div>

          <div className="flex justify-end flex-1 order-2">
            <Image
              src={aboutImg}
              alt="EV Car Charging"
              className="object-cover w-full max-w-lg"
              priority
            />
          </div>
      </section>
    </>
  );
}

export default Mission;
