"use client";

import Checkout from "../Components/Checkout";

export default function CheckoutPage({ searchParams }) {
  const title = searchParams?.title || "No product";
  const productColor = searchParams?.color || "Standard";
  const price = searchParams?.price || "0";
  const power = searchParams?.power || "-";

  return (
    <Checkout
      initial={{
        title,
        productColor,
        price,
        power,
      }}
    />
  );
}
