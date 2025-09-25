"use client";
import Link from "next/link";
import Navbar from "../Components/Navbar";
import Footer from "../Components/footer";

export default function OrderSuccess({ params }) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-green-50">
        <div className="w-full max-w-md p-6 text-center bg-white shadow-md rounded-xl">
          <h1 className="mb-4 text-3xl font-bold text-green-600">
            Payment Successful!
          </h1>
          <p className="mb-6 text-gray-700">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 text-white transition bg-green-600 rounded hover:bg-green-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
