// import Image from "next/image";
// import products from "@/app/data/product";

// export default async function FeaturePage({ params }) {
//   const { slug, feature } = await params;

//   const product = products[slug];

//   if (!product) {
//     return <div className="p-10 text-red-500">Product not found 🚨</div>;
//   }

//   const selectedCard = product.cards.find((card) => card.slug === feature);

//   if (!selectedCard) {
//     return <div className="p-10 text-red-500">Feature not found 🚨</div>;
//   }

//   return (
//     <div className="grid grid-cols-1 gap-10 p-6 mt-16 lg:mt-14 md:p-12 md:grid-cols-2">
//       {/* Left Side: Image Gallery */}
//       <div>
//         <div className="w-full h-[400px] relative rounded-xl overflow-hidden shadow-md">
//           <Image
//             src={selectedCard.img}
//             alt={selectedCard.title}
//             fill
//             className="object-cover"
//           />
//         </div>
//       </div>

//       {/* Right Side */}
//       <div className="flex flex-col justify-center">
//         <h3 className="mb-2 text-3xl font-bold text-green-600">
//           {selectedCard.title}
//         </h3>
//         <p className="mb-4 text-gray-600">{selectedCard.dec}</p>
//         <div className="flex gap-2 mb-5">
//           <p className="px-3 py-1 bg-gray-100 border border-green-600 rounded-xl">7.2 kW</p>
//           <p className="px-3 py-1 bg-gray-100 border border-green-600 rounded-xl">11 kW</p>
//           <p className="px-3 py-1 bg-gray-100 border border-green-600 rounded-xl">22 kW</p>
//         </div>
//         {/* Price */}
//         <div className="mb-6 text-3xl font-bold text-green-600">
//           {product.price?.toLocaleString() || "N/A"}
//         </div>

//         {/* Add to Cart */}
//         <div className="flex gap-4">
//           <button className="px-6 py-3 text-white bg-green-600 rounded-xl hover:bg-green-700">
//             Add to cart
//           </button>
//           <button className="px-6 py-3 text-green-600 border border-green-600 rounded-xl hover:bg-green-50">
//             Buy it now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { use } from "react";
import { useState } from "react";
import Image from "next/image";
import products from "@/app/data/product";

export default function FeaturePage({ params }) {
  // ✅ params unwrap karna hoga
  const { slug, feature } = use(params);

  const product = products[slug];

  if (!product) {
    return <div className="p-10 text-red-500">Product not found 🚨</div>;
  }

  const selectedCard = product.cards.find((card) => card.slug === feature);

  if (!selectedCard) {
    return <div className="p-10 text-red-500">Feature not found 🚨</div>;
  }

  // ✅ Price options
  const priceOptions = {
    "7.2 kW": 25000,
    "11 kW": 32000,
    "22 kW": 45000,
  };

  const [selectedKW, setSelectedKW] = useState("7.2 kW");

  return (
    <div className="grid grid-cols-1 gap-10 p-6 mt-16 lg:mt-14 md:p-12 md:grid-cols-2">
      {/* Left Side: Image */}
      <div>
        <div className="w-full h-[400px] relative rounded-xl overflow-hidden shadow-md">
          <Image
            src={selectedCard.img}
            alt={selectedCard.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col justify-center">
        <h3 className="mb-2 text-3xl font-bold text-green-600">
          {selectedCard.title}
        </h3>
        <p className="mb-4 text-gray-600">{selectedCard.dec}</p>

        {/* KW Options */}
        <div className="flex gap-2 mb-5">
          {Object.keys(priceOptions).map((kw) => (
            <button
              key={kw}
              onClick={() => setSelectedKW(kw)}
              className={`px-5 py-1 rounded-xl border ${
                selectedKW === kw
                  ? "bg-green-600 text-white border-green-600 cursor-pointer"
                  : "bg-gray-100 border-green-600 text-green-600 cursor-pointer"
              }`}
            >
              {kw}
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="mb-6 text-3xl font-bold text-green-600">
          ₹{priceOptions[selectedKW].toLocaleString()}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button className="px-6 py-3 text-white bg-green-600 rounded-xl hover:bg-green-700">
            Add to cart
          </button>
          <button className="px-6 py-3 text-green-600 border border-green-600 rounded-xl hover:bg-green-50">
            Buy it now
          </button>
        </div>
      </div>
    </div>
  );
}
