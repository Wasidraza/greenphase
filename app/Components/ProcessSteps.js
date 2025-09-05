"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaTools, FaHeadset } from "react-icons/fa";
import {
  MdOutlineAssignment,
  MdOutlineElectricalServices,
} from "react-icons/md";
import { HiOutlineClipboardList } from "react-icons/hi";
import { RiUserSettingsLine } from "react-icons/ri";

const steps = [
  {
    icon: <MdOutlineAssignment size={32} />,
    title: "Free Site Assessment",
    desc: "We cover end-to-end site planning and branding to get your charging locations deployment-ready.",
    color: "from-green-400 to-green-600",
  },
  {
    icon: <HiOutlineClipboardList size={32} />,
    title: "Execution Plan & Pricing",
    desc: "From hardware recommendations & pricing, to a full installation plan, we've got you covered.",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: <MdOutlineElectricalServices size={32} />,
    title: "Charger Installation & Testing",
    desc: "Our certified technicians install the charger(s) and test them for safety and compliance.",
    color: "from-purple-400 to-purple-600",
  },
  {
    icon: <RiUserSettingsLine size={32} />,
    title: "Onboarding & Activation",
    desc: "We complete your KYC, onboard you to our platform, and activate your chargers with access to the CMS.",
    color: "from-pink-400 to-pink-600",
  },
  {
    icon: <FaTools size={32} />,
    title: "Service & Maintenance",
    desc: "We provide regular health checks, software updates, and fix issues proactively, no matter what comes up.",
    color: "from-orange-400 to-orange-600",
  },
  {
    icon: <FaHeadset size={32} />,
    title: "24/7 Customer Support",
    desc: "Our support team is available 24/7 to assist with technical queries or user concerns.",
    color: "from-teal-400 to-teal-600",
  },
];

export default function ProcessSteps() {
  return (
    <section className="lg:max-w-[90%] w-full mx-auto px-6 py-16 lg:mt-10">
      <h3 className="mb-12 text-[25px] lg:text-5xl text-center">
        End-to-End{" "}
        <span className="text-green-600">EV Charger Solution</span> Provider
      </h3>

      {/* Steps Wrapper */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            viewport={{ once: true }}
            className={`rounded-2xl shadow-lg p-6 text-center text-white bg-gradient-to-r ${step.color} hover:shadow-2xl`}
          >
            {/* Icon Circle */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-white/20">
              {step.icon}
            </div>

            {/* Title */}
            <h3 className="mb-2 text-2xl font-semibold">{step.title}</h3>

            {/* Desc */}
            <p className="text-sm opacity-90">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Button */}
      <div className="flex justify-center mt-12">
        <Link href="/contact" 
          className="py-3 text-lg font-semibold text-white bg-black rounded-full shadow-lg px-14 hover:shadow-xl"
        >
          Contact Us
        </Link >
      </div>
    </section>
  );
}

