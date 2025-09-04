import { Suspense } from "react";
import Checkout from "../Components/Checkout";


export const dynamic = "force-dynamic";

function CheckoutWrapper() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <Checkout />
    </Suspense>
  );
}

export default function CheckoutPage() {
  return <CheckoutWrapper />;
}
