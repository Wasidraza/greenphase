"use client";
import React from "react";
import {
  HiLightningBolt,
  HiCog,
  HiClock,
  HiCurrencyRupee,
  HiSparkles,
} from "react-icons/hi";
import { motion } from "framer-motion";

export default function WeServe() {
  const items = [
    {
      title: "Reliable",
      desc: "We serve reliable EV charging solutions designed for long-lasting performance, ensuring every journey is powered with trust, stability, and confidence, making electric mobility truly dependable for individuals, businesses, and communities alike.",
      icon: <HiCog className="w-8 h-8" />,
      gradient: "from-yellow-200 to-yellow-400",
    },
    {
      title: "Smart",
      desc: "We serve smart EV chargers equipped with intelligent features, seamless connectivity, and future-ready technology, delivering convenience, efficiency, and innovation to empower sustainable mobility and enhance the charging experience everywhere.",
      icon: <HiLightningBolt className="w-8 h-8" />,
      gradient: "from-orange-200 to-orange-400",
    },
    {
      title: "Faster",
      desc: "We serve faster charging solutions engineered to save time, maximize efficiency, and keep vehicles ready for the road, ensuring customers experience speed without compromise in their transition to electric mobility.",
      icon: <HiClock className="w-8 h-8" />,
      gradient: "from-indigo-200 to-indigo-400",
    },
    {
      title: "Affordable",
      desc: "We serve affordable EV charging solutions that balance cost-effectiveness with advanced technology, making sustainable mobility accessible for everyone, while delivering uncompromised quality, reliability, and performance that fits every customer’s budget.",
      icon: <HiCurrencyRupee className="w-8 h-8" />,
      gradient: "from-green-200 to-green-400",
    },
    {
      title: "Made in India",
      desc: "We serve proudly Made in India EV chargers, built with indigenous technology, world-class quality, and innovative design, supporting self-reliance, strengthening local manufacturing, and driving India’s mission towards a cleaner, sustainable future.",
      icon: <HiSparkles className="w-8 h-8" />,
      gradient: "from-pink-200 to-pink-400",
    },
  ];

  return (
    <section className="px-6 py-5">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-green-600 sm:text-4xl">
            We Serve
          </h2>
          <p className="max-w-2xl mx-auto mt-2 text-gray-600">
            High-quality EV charging solutions designed to be reliable, smart,
            fast and affordable.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, idx) => (
            <motion.article
              key={it.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              viewport={{ once: true }}
              className={`relative p-6 rounded-2xl shadow-lg text-black bg-gradient-to-br ${it.gradient}`}
            >
              <div className="flex flex-col items-start gap-4 sm:flex-row">
                {/* Icon */}
                <div className="flex items-center justify-center flex-shrink-0 rounded-lg shadow w-14 h-14 bg-white/20">
                  {it.icon}
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-lg font-semibold">{it.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/90">
                    {it.desc}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
