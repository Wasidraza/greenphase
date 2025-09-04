"use client";

import { Suspense } from "react";
import Checkout from "../Components/Checkout";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Checkout />
    </Suspense>
  );
}
