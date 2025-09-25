"use client";
import Link from "next/link";
import Navbar from "../Components/Navbar";
import Footer from "../Components/footer";

export default function OrderFailed({ params }) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-red-50">
        <div className="w-full max-w-md p-6 text-center bg-white shadow-md rounded-xl">
          <h1 className="mb-4 text-3xl font-bold text-red-600">
            Payment Failed!
          </h1>
          <p className="mb-6 text-gray-700">
            Oops! Something went wrong with your payment. Please try again.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/checkout"
              className="inline-block px-6 py-2 text-white transition bg-red-600 rounded hover:bg-red-700"
            >
              Retry Payment
            </Link>
            <Link
              href="/"
              className="inline-block px-6 py-2 text-white transition bg-gray-600 rounded hover:bg-gray-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
