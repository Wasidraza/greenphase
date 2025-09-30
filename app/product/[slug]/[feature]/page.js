"use client";
import { use } from "react";
import { useState } from "react";
import Image from "next/image";
import products from "@/app/data/product";
import { CircleCheckBig, ClipboardClock, Key } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/footer";

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

    const selectedPriceData = priceOptions[selectedKW];

    const checkoutUrl = `/checkout?title=${encodeURIComponent(
      selectedCard.title
    )}&price=${selectedPriceData.price}&mrp=${
      selectedPriceData.mrp
    }&power=${encodeURIComponent(selectedKW)}&color=${encodeURIComponent(
      selectedCard.productColor
    )}`;

    if (!user) {
      router.push(`/signup?redirect=${encodeURIComponent(checkoutUrl)}`);
    } else {
      router.push(checkoutUrl);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 mt-16 space-y-12 lg:mt-14 md:p-12">
        {/* Product Image + Details */}
        <div className="grid grid-cols-1 gap-8 md:gap-10 md:grid-cols-2">
          {/* Image */}
          <div className="w-full">
            <div className="relative w-full h-64 sm:h-80 md:h-[400px] rounded-xl overflow-hidden shadow-md">
              <Image
                src={selectedCard.img}
                alt={selectedCard.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center p-4 bg-white border shadow-md sm:p-6 rounded-2xl">
            <h3 className="mb-2 text-xl font-bold capitalize sm:text-2xl">
              {selectedCard.title} ({selectedCard.productColor})
            </h3>
            <p className="mb-4 text-sm text-gray-600 sm:text-base">
              {selectedCard.dec}
            </p>

            {/* Power Options */}
            <div className="flex flex-wrap gap-2 mb-6 sm:gap-3">
              {Object.keys(priceOptions).map((kw) => (
                <button
                  key={kw}
                  onClick={() => setSelectedKW(kw)}
                  className={`px-3 py-1 sm:px-5 sm:py-2 text-sm sm:text-base rounded-lg border font-medium transition ${
                    selectedKW === kw
                      ? "bg-black text-white border-black shadow-md"
                      : "bg-gray-100 border-green-600 text-green-600 hover:bg-green-50"
                  }`}
                >
                  {kw}
                </button>
              ))}
            </div>

            {/* Price */}
            {/* {isHomeCharger && (
            <div className="mb-6 text-lg font-extrabold tracking-wide text-black sm:text-2xl">
              ₹{priceOptions[selectedKW].toLocaleString()} (inc of taxes)
            </div>
          )} */}

            {isHomeCharger && (
              <div className="mb-6">
                <div className="text-lg font-extrabold tracking-wide text-black sm:text-2xl">
                  ₹{priceOptions[selectedKW]?.price.toLocaleString("en-IN")}{" "}
                  <span className="text-sm font-normal">(inc of taxes)</span>
                </div>
                <div className="text-base text-gray-900 line-through sm:text-xl">
                  M.R.P. - ₹
                  {priceOptions[selectedKW]?.mrp.toLocaleString("en-IN")}
                </div>
              </div>
            )}

            {/* Buy Now / Contact */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={handleBuyNow}
                className="px-4 py-2 font-semibold text-green-600 transition border border-green-600 sm:px-6 hover:text-white rounded-xl hover:bg-green-600"
              >
                {isDCCharger ? "Contact Us" : "Buy it now"}
              </button>
            </div>
          </div>
        </div>

        {/* Features + Applications */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-2">
          <section className="p-4 bg-white border shadow sm:p-6 rounded-2xl">
            <h3 className="flex items-center gap-2 mb-4 text-xl font-bold text-green-700 sm:mb-6 sm:text-2xl">
              Key Features
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {product.keyFeatures.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 transition rounded-lg bg-gray-50 hover:shadow-md"
                >
                  <span className="text-lg text-green-600 sm:text-xl">
                    <Key />
                  </span>
                  <span className="text-sm text-gray-700 sm:text-base">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="p-4 bg-white border shadow sm:p-6 rounded-2xl">
            <h3 className="flex items-center gap-2 mb-4 text-xl font-bold text-green-700 sm:mb-6 sm:text-2xl">
              Applications
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {product.applications.map((app, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 transition rounded-lg bg-gray-50 hover:shadow-md"
                >
                  <span className="text-lg text-green-600 sm:text-xl">
                    <ClipboardClock />
                  </span>
                  <span className="text-sm text-gray-700 sm:text-base">
                    {app}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Specs + Warranty */}
        <div className="grid gap-6 md:gap-10 md:grid-cols-2">
          <section className="p-4 bg-white border shadow sm:p-6 rounded-2xl">
            <h3 className="flex items-center gap-2 mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-[#31B345]">
              Technical Specifications
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg sm:text-base">
                <tbody>
                  {Object.entries(product.specifications).map(
                    ([key, value], idx) => (
                      <tr
                        key={idx}
                        className={`border-b ${
                          idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="w-1/3 p-2 font-medium text-gray-700 sm:p-4">
                          {key}
                        </td>
                        <td className="p-2 text-gray-600 sm:p-4">{value}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="p-4 bg-white border shadow sm:p-6 rounded-2xl">
            <h3 className="flex items-center gap-2 mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-[#31B345]">
              Warranty & Support
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {product.warranty.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 transition rounded-lg bg-gray-50 hover:shadow-md"
                >
                  <span className="text-lg text-green-600 sm:text-xl">
                    <CircleCheckBig />
                  </span>
                  <span className="text-sm text-gray-700 sm:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Why Choose Us */}
        <div className="text-center">
          <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Why Choose Us</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {product.whyChoose.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-3 sm:p-4 bg-gray-50 rounded-xl"
              >
                <span className="text-3xl sm:text-4xl">{item.icon}</span>
                <h3 className="mt-2 text-sm font-semibold sm:text-base">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
