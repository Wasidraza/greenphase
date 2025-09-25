"use client";

import dynamic from "next/dynamic";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/footer";

const PaymentStatusClient = dynamic(() => import("./PaymentStatus"), {
  ssr: false,
});

export default function PaymentReturn() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <PaymentStatusClient />
      </div>
      <Footer />
    </>
  );
}
