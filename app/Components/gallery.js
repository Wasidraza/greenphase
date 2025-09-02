"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Gallery({ images }) {
  const [current, setCurrent] = useState(0);

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const nextSlide = () =>
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative max-w-4xl p-6 mx-auto">
      {/* Main Image */}
      <div className="relative h-[500px] w-full rounded-xl overflow-hidden shadow-lg">
        <Image
          src={images[current]}
          alt={`Gallery image ${current + 1}`}
          fill
          className="object-cover"
        />
      </div>

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute px-2 py-2 text-white -translate-y-1/2 bg-green-500 rounded-full left-4 top-5/12"
      >
    <ChevronLeft size={40}/>
      </button>
      <button
        onClick={nextSlide}
        className="absolute px-2 py-2 text-white -translate-y-1/2 bg-green-500 rounded-full right-4 top-5/12"
      >
      <ChevronRight size={40}/>
      </button>

      {/* Thumbnails */}
      <div className="flex justify-center gap-4 mt-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`relative h-20 w-28 rounded-md overflow-hidden cursor-pointer border-2 ${
              current === idx ? "border-green-600" : "border-transparent"
            }`}
          >
            <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
