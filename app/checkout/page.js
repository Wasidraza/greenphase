"use client";

import { Suspense } from "react";
import Checkout from "../Components/Checkout";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Checkout />
    </Suspense>
  );
}
