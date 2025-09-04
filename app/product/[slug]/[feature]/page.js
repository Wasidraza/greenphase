"use client";
import { use } from "react";
import { useState } from "react";
import Image from "next/image";
import products from "@/app/data/product";
import { CircleCheckBig, ClipboardClock, Key } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

export default function FeaturePage({ params }) {
  const { slug, feature } = use(params);
  const product = products[slug];
  const [quantity, setQuantity] = useState(1);
  const [selectedKW, setSelectedKW] = useState("7.2 kW");
  const { addToCart } = useCart();
  const router = useRouter();

  if (!product) {
    return <div className="p-10 text-red-500">Product not found 🚨</div>;
  }

  const selectedCard = product.cards.find((card) => card.slug === feature);
  if (!selectedCard) {
    return <div className="p-10 text-red-500">Feature not found 🚨</div>;
  }
  const priceOptions = selectedCard.priceOptions || {};
  const isHomeCharger = selectedCard.title
    .toLowerCase()
    .includes("home charger");
  const isDCCharger = selectedCard.title
    .toLowerCase()
    .includes("dc fast charger");

  const handleBuyNow = () => {
    const user = localStorage.getItem("user");

    if (isDCCharger) {
      router.push("/contact");
      return;
    }

    const checkoutUrl = `/checkout?title=${encodeURIComponent(
      selectedCard.title
    )}&price=${priceOptions[selectedKW]}&power=${encodeURIComponent(
      selectedKW
    )}`;

    if (!user) {
      router.push(`/signup?redirect=${encodeURIComponent(checkoutUrl)}`);
      return;
    }

    if (isHomeCharger) {
      router.push(checkoutUrl);
    } else {
      alert("Unknown product type!");
    }
  };

  return (
    <div className="p-6 mt-16 space-y-16 lg:mt-14 md:p-12">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
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

        <div className="flex flex-col justify-center p-6 bg-white border shadow-md rounded-2xl">
          <h3 className="mb-2 text-2xl font-bold capitalize">
            {selectedCard.title} ({selectedCard.productColor})
          </h3>
          <p className="mb-4 text-gray-600">{selectedCard.dec}</p>

          <div className="flex gap-3 mb-6">
            {Object.keys(priceOptions).map((kw) => (
              <button
                key={kw}
                onClick={() => setSelectedKW(kw)}
                className={`px-5 py-2 rounded-lg border font-medium transition ${
                  selectedKW === kw
                    ? "bg-black text-white border-black shadow-md"
                    : "bg-gray-100 border-green-600 text-green-600 hover:bg-green-50"
                }`}
              >
                {kw}
              </button>
            ))}
          </div>

          {isHomeCharger && (
            <div className="mb-6 text-2xl font-extrabold tracking-wide text-black">
              ₹{priceOptions[selectedKW].toLocaleString()} (inc of taxes)
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleBuyNow}
              className="px-6 py-2 font-semibold text-green-600 transition border border-green-600 hover:text-white rounded-xl hover:bg-green-600"
            >
              {isDCCharger ? "Contact Us" : "Buy it now"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="p-6 bg-white border shadow rounded-2xl">
          <h3 className="flex items-center gap-2 mb-6 text-2xl font-bold text-green-700">
            Key Features
          </h3>
          <ul className="space-y-4">
            {product.keyFeatures.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 transition rounded-lg bg-gray-50 hover:shadow-md"
              >
                <span className="text-xl text-green-600">
                  <Key />
                </span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-6 bg-white border shadow rounded-2xl">
          <h3 className="flex items-center gap-2 mb-6 text-2xl font-bold text-green-700">
            Applications
          </h3>
          <ul className="space-y-4">
            {product.applications.map((app, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 transition rounded-lg bg-gray-50 hover:shadow-md"
              >
                <span className="text-xl text-green-600">
                  <ClipboardClock />
                </span>
                <span className="text-gray-700">{app}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <section className="p-6 bg-white border shadow rounded-2xl">
          <h3 className="flex items-center gap-2 mb-6 text-2xl font-bold text-[#31B345]">
            Technical Specifications
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full overflow-hidden border border-gray-200 rounded-lg">
              <tbody>
                {Object.entries(product.specifications).map(
                  ([key, value], idx) => (
                    <tr
                      key={idx}
                      className={`border-b ${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="w-1/3 p-4 font-medium text-gray-700">
                        {key}
                      </td>
                      <td className="p-4 text-gray-600">{value}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="p-6 bg-white border shadow rounded-2xl">
          <h3 className="flex items-center gap-2 mb-6 text-2xl font-bold text-[#31B345]">
            Warranty & Support
          </h3>
          <ul className="space-y-4">
            {product.warranty.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 transition rounded-lg bg-gray-50 hover:shadow-md"
              >
                <span className="text-xl text-green-600">
                  <CircleCheckBig />
                </span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="text-center">
        <h2 className="mb-6 text-3xl font-bold">Why Choose Us</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {product.whyChoose.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-xl"
            >
              <span className="text-4xl">{item.icon}</span>
              <h3 className="mt-2 font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
