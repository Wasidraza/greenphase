"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  MdOutlineAssignment,
  MdOutlineElectricalServices,
} from "react-icons/md";
import { HiOutlineClipboardList } from "react-icons/hi";
import { RiUserSettingsLine } from "react-icons/ri";
import { FaTools, FaHeadset } from "react-icons/fa";

const steps = [
  {
    icon: <MdOutlineAssignment size={60} />,
    title: "Free Site Assessment",
    desc: "We cover end-to-end site planning and branding to get your charging locations deployment-ready.",
  },
  {
    icon: <HiOutlineClipboardList size={60} />,
    title: "Execution Plan & Pricing",
    desc: "From hardware recommendations & pricing, to a full installation plan, we've got you covered.",
  },
  {
    icon: <MdOutlineElectricalServices size={60} />,
    title: "Charger Installation & Testing",
    desc: "Our certified technicians install the charger(s) and test them for safety and compliance.",
  },
  {
    icon: <RiUserSettingsLine size={60} />,
    title: "Onboarding & Activation",
    desc: "We complete your KYC, onboard you to our platform, and activate your chargers with access to the CMS.",
  },
  {
    icon: <FaTools size={60} />,
    title: "Service & Maintenance",
    desc: "We provide regular health checks, software updates, and fix issues proactively, no matter what comes up.",
  },
  {
    icon: <FaHeadset size={60} />,
    title: "24/7 Customer Support",
    desc: "Our support team is available 24/7 to assist with technical queries or user concerns.",
  },
];

export default function ScrollSteps() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [maxX, setMaxX] = useState(0);
  const [sectionH, setSectionH] = useState("200vh");

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current || !sectionRef.current) return;
      const trackWidth = trackRef.current.scrollWidth;
      const viewport = sectionRef.current.clientWidth;
      const needToMove = Math.max(0, trackWidth - viewport);
      setMaxX(needToMove);
      setSectionH(`calc(100vh + ${needToMove}px)`);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white"
      style={{ height: sectionH }}
    >
      {/* Heading */}
      <h2 className="sticky top-0 z-10 py-12 text-2xl font-bold text-center md:text-3xl">
        End-to-End <span className="text-green-600">EV Charger Solution</span>{" "}
        Provider
      </h2>

      {/* Cards */}
      <div className="sticky flex items-center overflow-hidden top-28">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-6 px-6 md:px-12"
        >
          {steps.map((s, i) => (
            <div
              key={i}
              className="min-w-[80%] sm:min-w-[300px] md:min-w-[320px] mt-10
                         max-w-sm h-[300px] md:h-[340px] p-6 rounded-2xl 
                         bg-white border border-green-500 shadow shadow-green-600"
            >
              <div className="mb-4 text-green-600">{s.icon}</div>
              <h3 className="mb-2 text-lg font-bold md:text-xl">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Button (separate, at the bottom of section) */}
      <div className="absolute left-0 flex justify-center w-full bottom-10">
        <button className="px-6 py-3 text-white transition bg-green-600 rounded-full hover:bg-green-700">
          Shop Now
        </button>
      </div>
    </section>
  );
}
