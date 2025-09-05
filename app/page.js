"use client";
import Image from "next/image";
import Link from "next/link";
import heroImg from "../public/hero.webp";
import { ArrowRight } from "lucide-react";
import ProcessSteps from "./Components/ProcessSteps";
import Mission from "./Components/Mission";
import { motion } from "framer-motion";
import Product from "./Components/Product";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-white">
        <div className="flex flex-col items-center justify-between gap-12 px-6 py-16 mx-auto mt-10 lg:px-20 lg:flex-row">
          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex-1 order-1 text-center lg:text-left"
          >
            <h1 className="text-2xl leading-tight">CHARGE SMART LIVE GREEN</h1>
            <p className="mb-6 text-lg text-gray-600">
              We are pioneering the e-mobility revolution by building high-speed
              public charging infrastructure across India.
            </p>
            <Link
              href="/product/smart-home-charger"
              className="flex gap-2 w-44 lg:mx-0 mx-auto hover:bg-green-700 px-6 py-3 font-semibold text-white transition rounded-full bg-[#000000]"
            >
              Order Now <ArrowRight />
            </Link>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex justify-center flex-1 order-2 lg:justify-end"
          >
            <Image
              src={heroImg}
              alt="EV Car Charging"
              className="object-cover w-full max-w-lg"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Product */}
      <Product />
      {/* Process Steps */}
      <ProcessSteps />
      {/* About Us Section */}
      <section className="bg-white">
        <div className="flex flex-col-reverse items-center justify-between gap-12 px-6 mx-auto mt-10 lg:px-20 lg:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="pb-4 text-2xl leading-tight text-center">
              ABOUT US
            </h2>
            <p className="mb-2 text-lg text-gray-600">
              At Green Phase, we believe the future of mobility is electric, and
              we are committed to powering that future with world-class EV
              charging solutions. Founded with a vision to make clean mobility
              accessible and reliable, Green Phase is a homegrown Indian company
              dedicated to designing, manufacturing, and delivering cutting-edge
              EV chargers that meet global standards.
            </p>
            <p className="mb-2 text-lg text-gray-600">
              Every Green Phase charger is proudly Made in India, ensuring not
              only superior quality control but also faster service and cost
              efficiency for our customers. Our chargers are built with advanced
              safety features, smart connectivity, and user-friendly designs
              that make EV charging simple, efficient, and reliable. From
              compact home charging solutions to high-capacity public and
              commercial charging stations, we offer a complete range of
              products to meet the diverse needs of EV users, businesses, and
              infrastructure developers.
            </p>
            <p className="mb-2 text-lg text-gray-600">
              What sets Green Phase apart is our blend of innovation, design,
              and sustainability. Inspired by futuristic technology and modern
              aesthetics, our chargers are not just functional equipment but
              also reflect the new era of clean mobility. By integrating
              intelligent software, seamless payment systems, and remote
              monitoring capabilities, we ensure that charging an EV is as easy
              as charging a phone.
            </p>
          </motion.div>
        </div>
      </section>
      <Mission />
    </>
  );
}
