"use client";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Smart Home Charger",
    desc: "Withstands extreme external conditions, ensuring durability",
    img: "/hc2.webp",
    size: "large",
    slug: "smart-home-charger", 
  },
  {
    title: "Smart DC Charger",
    desc: "Comes with concealed provisions and tug-proof mounting",
    img: "/dc.webp",
    size: "small",
    slug: "smart-dc-charger", 
  },
  // {
  //   title: "AC Charger",
  //   desc: "Perfect size & sleek design effortlessly blends into your life",
  //   img: "/h3.webp",
  //   size: "small",
  //   slug: "light-weight", 
  // },
];
export default function ProductCard() {
  return (
    <section className="px-4 py-1 mx-auto mt-10 max-w-7xl">
      <h2 className="pb-5 text-center">Our Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[200px] md:auto-rows-[350px]">
        {features.map((item, i) => (
          <div
            key={i}
            className={`relative rounded-2xl overflow-hidden shadow-lg group 
              ${item.size === "large" ? "md:row-span-" : ""}`}
          >
            <Image
              src={item.img}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
              <h4 className="mb-2 text-xl font-semibold lg:text-[2rem]">
                {item.title}
              </h4>
              <p className="mb-4 text-sm">{item.desc}</p>
              <Link
                href={`/product/${item.slug}`}
                className="flex items-center gap-2 px-8 py-2 text-lg font-medium text-white bg-green-500 rounded-lg lg:w-48"
              >
                Shop Now <ArrowUpRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
