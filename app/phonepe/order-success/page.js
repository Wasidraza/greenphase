import Footer from "@/app/Components/footer";
import Navbar from "@/app/Components/Navbar";
import OrderSuccessClient from "@/app/Components/order-success";

import { Suspense } from "react";


export default function Page() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div>Loading order...</div>
        </div>
      }>
        <OrderSuccessClient />
      </Suspense>
      <Footer />
    </>
  );
}
