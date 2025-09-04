"use client";

import { useSearchParams } from "next/navigation";
import Checkout from "../Components/Checkout";

export default function CheckoutClient() {
  const params = useSearchParams();

  const title = params.get("title") || "No product";
  const productColor = params.get("color") || "Standard";
  const price = params.get("price") || "0";
  const power = params.get("power") || "-";

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
